import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { selectSimulationVehicles } from "../server/services/demoFleetSimulator.js";

const APPROVED_TYPES = ["CROSSOVER", "HATCHBACK", "MINIBUS", "PICKUP", "SEDAN", "SUV", "TRUCK", "VAN"];
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const databaseArgument = process.argv.indexOf("--database");
const databasePath = databaseArgument >= 0
  ? path.resolve(process.cwd(), process.argv[databaseArgument + 1])
  : path.join(repositoryRoot, "server", "data", "fleet-drive-demo.sqlite");
const checkOnly = process.argv.includes("--check");

if (!fs.existsSync(databasePath)) throw new Error(`Fleet database not found: ${databasePath}`);

const db = new DatabaseSync(databasePath, { readOnly: true });

function slug(value) {
  return String(value ?? "unknown")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "unknown";
}

function expectedVisualKey(vehicle) {
  return [vehicle.year, vehicle.make, vehicle.model].map(slug).join("-");
}

function hashRows(rows) {
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

function markdown(value) {
  return String(value ?? "NONE").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function provenance(plannedExactness, plannedPath) {
  return {
    status: "MISSING",
    assetPath: null,
    plannedPath,
    sourceType: "UNKNOWN",
    sourceReference: null,
    license: null,
    attributionRequired: null,
    attribution: null,
    exactness: "NONE",
    plannedExactness,
  };
}

function unique(values) {
  return [...new Set(values)].sort((left, right) => String(left).localeCompare(String(right)));
}

function priorityRank(priority) {
  return { A: 0, B: 1, C: 2 }[priority];
}

const rawVehicles = db.prepare(`
  SELECT v.id, v.plate, v.year, v.make, v.model, v.variant,
    v.vehicle_type, v.visual_key, v.city, v.province, v.lat, v.lng,
    c.driver_id AS current_driver_id, d.name AS current_driver_name
  FROM vehicles v
  LEFT JOIN driver_current_vehicles c ON c.vehicle_id = v.id
  LEFT JOIN drivers d ON d.id = c.driver_id
  ORDER BY v.id
`).all();

const vehicles = rawVehicles.map((vehicle) => ({
  ...vehicle,
  currentDriver: vehicle.current_driver_id
    ? { id: vehicle.current_driver_id, name: vehicle.current_driver_name }
    : null,
}));
const drivers = db.prepare(`
  SELECT id, name FROM drivers ORDER BY id
`).all();
const assignments = db.prepare(`
  SELECT driver_id, vehicle_id, assigned_at
  FROM driver_vehicle_assignments
  WHERE is_active_assignment = 1
  ORDER BY driver_id, vehicle_id
`).all();
const currentOperations = db.prepare(`
  SELECT driver_id, vehicle_id, started_at, updated_at
  FROM driver_current_vehicles
  ORDER BY driver_id
`).all();
const telemetryCount = Number(db.prepare("SELECT COUNT(*) AS count FROM telemetry").get().count);

const simulatorVehicles = selectSimulationVehicles(vehicles, 15, "NORMAL_FLEET");
const simulatorIds = new Set(simulatorVehicles.map((vehicle) => vehicle.id));
const currentIds = new Set(currentOperations.map((operation) => operation.vehicle_id));
const operationByDriver = new Map(currentOperations.map((operation) => [operation.driver_id, operation]));
const assignmentsByDriver = new Map();
for (const assignment of assignments) {
  if (!assignmentsByDriver.has(assignment.driver_id)) assignmentsByDriver.set(assignment.driver_id, []);
  assignmentsByDriver.get(assignment.driver_id).push(assignment.vehicle_id);
}

for (const vehicle of vehicles) {
  const expected = expectedVisualKey(vehicle);
  if (vehicle.visual_key !== expected) {
    throw new Error(`Visual key mismatch for ${vehicle.id}: expected ${expected}, found ${vehicle.visual_key}`);
  }
  if (vehicle.variant !== null) throw new Error(`Invented/non-null variant found for ${vehicle.id}`);
  if (!APPROVED_TYPES.includes(vehicle.vehicle_type)) {
    throw new Error(`Non-canonical vehicle type for ${vehicle.id}: ${vehicle.vehicle_type}`);
  }
}

const specifications = new Map();
const families = new Map();
const types = new Map(APPROVED_TYPES.map((vehicleType) => [vehicleType, {
  vehicleType, fleetCount: 0, familyKeys: new Set(), currentOperationCount: 0, simulatorParticipantCount: 0,
}]));

for (const vehicle of vehicles) {
  const visualKey = vehicle.visual_key;
  const familyKey = `${slug(vehicle.make)}-${slug(vehicle.model)}`;
  if (!specifications.has(visualKey)) {
    specifications.set(visualKey, {
      visualKey,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      variant: null,
      vehicleType: vehicle.vehicle_type,
      vehicleIds: [],
      plates: [],
      cities: [],
      currentOperationCount: 0,
      simulatorParticipantCount: 0,
    });
  }
  const specification = specifications.get(visualKey);
  if (specification.vehicleType !== vehicle.vehicle_type) {
    throw new Error(`Vehicle type collision for visual key ${visualKey}`);
  }
  specification.vehicleIds.push(vehicle.id);
  specification.plates.push(vehicle.plate);
  specification.cities.push(vehicle.city);
  specification.currentOperationCount += currentIds.has(vehicle.id) ? 1 : 0;
  specification.simulatorParticipantCount += simulatorIds.has(vehicle.id) ? 1 : 0;

  if (!families.has(familyKey)) {
    families.set(familyKey, {
      familyKey, make: vehicle.make, model: vehicle.model, vehicleType: vehicle.vehicle_type,
      yearsPresent: new Set(), vehicleIds: [], exactKeys: new Set(), currentOperationCount: 0,
      simulatorParticipantCount: 0,
    });
  }
  const family = families.get(familyKey);
  if (family.vehicleType !== vehicle.vehicle_type) throw new Error(`Vehicle type collision for family ${familyKey}`);
  family.yearsPresent.add(vehicle.year);
  family.vehicleIds.push(vehicle.id);
  family.exactKeys.add(visualKey);
  family.currentOperationCount += currentIds.has(vehicle.id) ? 1 : 0;
  family.simulatorParticipantCount += simulatorIds.has(vehicle.id) ? 1 : 0;

  const type = types.get(vehicle.vehicle_type);
  type.fleetCount += 1;
  type.familyKeys.add(familyKey);
  type.currentOperationCount += currentIds.has(vehicle.id) ? 1 : 0;
  type.simulatorParticipantCount += simulatorIds.has(vehicle.id) ? 1 : 0;
}

const exactSpecifications = [...specifications.values()].map((specification) => {
  const priority = specification.simulatorParticipantCount > 0
    ? "A"
    : specification.currentOperationCount > 0 ? "B" : "C";
  return {
    ...specification,
    fleetCount: specification.vehicleIds.length,
    cities: unique(specification.cities),
    priority,
    imageStrategy: "EXACT YEAR/MODEL IMAGE PREFERRED",
    model3dStrategy: "GENERIC VEHICLE-TYPE FALLBACK",
    assets: {
      image: provenance("EXACT", `public/assets/vehicles/images/${specification.visualKey}.webp`),
      model3d: provenance("VEHICLE_TYPE", `public/assets/vehicles/models/${slug(specification.vehicleType)}-generic.glb`),
    },
  };
}).sort((left, right) => priorityRank(left.priority) - priorityRank(right.priority)
  || left.visualKey.localeCompare(right.visualKey));

const makeModelFamilies = [...families.values()].map((family) => ({
  familyKey: family.familyKey,
  make: family.make,
  model: family.model,
  vehicleType: family.vehicleType,
  yearsPresent: [...family.yearsPresent].sort((left, right) => left - right),
  fleetCount: family.vehicleIds.length,
  exactSpecificationCount: family.exactKeys.size,
  currentOperationCount: family.currentOperationCount,
  simulatorParticipantCount: family.simulatorParticipantCount,
})).sort((left, right) => left.familyKey.localeCompare(right.familyKey));

const vehicleTypeFallbacks = [...types.values()].map((type) => ({
  vehicleType: type.vehicleType,
  fleetCount: type.fleetCount,
  makeModelFamilies: type.familyKeys.size,
  currentOperationCount: type.currentOperationCount,
  simulatorParticipantCount: type.simulatorParticipantCount,
  model3d: provenance("VEHICLE_TYPE", `public/assets/vehicles/models/${slug(type.vehicleType)}-generic.glb`),
}));

function vehiclePair(vehicle) {
  return {
    vehicleId: vehicle.id,
    registration: vehicle.plate,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    vehicleType: vehicle.vehicle_type,
    currentDriverId: vehicle.currentDriver?.id ?? null,
    currentDriverName: vehicle.currentDriver?.name ?? null,
    city: vehicle.city,
    province: vehicle.province,
    visualKey: vehicle.visual_key,
    imageStatus: "MISSING",
    model3dStatus: "MISSING",
  };
}

const priorityA = simulatorVehicles.map(vehiclePair);
const priorityB = vehicles.filter((vehicle) => currentIds.has(vehicle.id) && !simulatorIds.has(vehicle.id)).map(vehiclePair);
const currentVehicles = vehicles.filter((vehicle) => currentIds.has(vehicle.id));

function coverage(selectedVehicles) {
  return {
    exactSpecifications: new Set(selectedVehicles.map((vehicle) => vehicle.visual_key)).size,
    makeModelFamilies: new Set(selectedVehicles.map((vehicle) => `${vehicle.make}\u0000${vehicle.model}`)).size,
    vehicleTypes: new Set(selectedVehicles.map((vehicle) => vehicle.vehicle_type)).size,
  };
}

const simulatorCoverage = coverage(simulatorVehicles);
const currentOperationCoverage = coverage(currentVehicles);
const sourceIntegrity = {
  vehicleIdentitySha256: hashRows(rawVehicles.map((vehicle) => [
    vehicle.id, vehicle.plate, vehicle.year, vehicle.make, vehicle.model, vehicle.variant,
    vehicle.vehicle_type, vehicle.visual_key, vehicle.city, vehicle.province,
  ])),
  driverIdentitySha256: hashRows(drivers),
  activeAssignmentsSha256: hashRows(assignments),
  currentOperationsSha256: hashRows(currentOperations),
  telemetryRowCount: telemetryCount,
};

const vehicleManifest = {
  schemaVersion: "1.1",
  generatedFrom: {
    database: path.relative(repositoryRoot, databasePath).replaceAll("\\", "/"),
    tables: ["vehicles", "driver_vehicle_assignments", "driver_current_vehicles", "telemetry"],
    simulatorSelection: { scenario: "NORMAL_FLEET", participantLimit: 15 },
    readOnly: true,
    sourceIntegrity,
  },
  assetPathConvention: {
    images: "public/assets/vehicles/images/<visualKey>.webp",
    exactOrFamilyModels: "public/assets/vehicles/models/<model-family>.glb",
    vehicleTypeModels: "public/assets/vehicles/models/<vehicle-type>-generic.glb",
  },
  exactSpecifications,
  makeModelFamilies,
  vehicleTypeFallbacks,
};

const portraitProvenancePath = path.join(repositoryRoot, 'docs/assets/driver-portrait-provenance.json');
const portraitProvenance = fs.existsSync(portraitProvenancePath)
  ? JSON.parse(fs.readFileSync(portraitProvenancePath, 'utf8')) : [];
const portraitByDriver = new Map(portraitProvenance.map((record) => [record.driverId, record]));
if (portraitByDriver.size !== portraitProvenance.length) throw new Error('Duplicate portrait provenance');
for (const record of portraitProvenance) {
  if (!drivers.some((driver) => driver.id === record.driverId && driver.name === record.driverName)) {
    throw new Error(`Portrait identity does not match database: ${record.driverId}`);
  }
  if (record.file !== `/assets/drivers/${record.driverId}.webp`
    || !fs.existsSync(path.join(repositoryRoot, 'public', record.file))) {
    throw new Error(`Portrait path missing or invalid: ${record.driverId}`);
  }
}

const driverRecords = drivers.map((driver) => {
  const operation = operationByDriver.get(driver.id);
  const vehicle = operation ? vehicles.find((candidate) => candidate.id === operation.vehicle_id) : null;
  const simulatorParticipant = Boolean(vehicle && simulatorIds.has(vehicle.id));
  const priority = simulatorParticipant ? "A" : vehicle ? "B" : "C";
  const portrait = portraitByDriver.get(driver.id);
  return {
    driverId: driver.id,
    name: driver.name,
    assignedVehicleIds: assignmentsByDriver.get(driver.id) ?? [],
    currentVehicleId: vehicle?.id ?? null,
    currentVehicleVisualKey: vehicle?.visual_key ?? null,
    simulatorParticipant,
    currentOperation: Boolean(vehicle),
    priority,
    photo: portrait ? {
      ...provenance('NONE', `public/assets/drivers/${driver.id}.webp`),
      status: 'AVAILABLE', assetPath: portrait.file, sourceType: portrait.sourceType,
      sourceReference: portrait.sourceReference, license: portrait.license,
      attributionRequired: portrait.attributionRequired, exactness: portrait.exactness,
    } : provenance("NONE", `public/assets/drivers/${driver.id}.webp`),
  };
}).sort((left, right) => priorityRank(left.priority) - priorityRank(right.priority)
  || left.driverId.localeCompare(right.driverId));

const driverManifest = {
  schemaVersion: "1.1",
  generatedFrom: {
    database: path.relative(repositoryRoot, databasePath).replaceAll("\\", "/"),
    tables: ["drivers", "driver_vehicle_assignments", "driver_current_vehicles"],
    readOnly: true,
    sourceIntegrity,
  },
  assetPathConvention: "public/assets/drivers/<driverId>.webp",
  drivers: driverRecords,
};

const priorityCounts = Object.fromEntries(["A", "B", "C"].map((priority) => [
  priority, exactSpecifications.filter((item) => item.priority === priority).length,
]));
const portraitCounts = Object.fromEntries(["A", "B", "C"].map((priority) => [
  priority, driverRecords.filter((driver) => driver.priority === priority).length,
]));

const summary = {
  fleetVehicles: vehicles.length,
  drivers: drivers.length,
  activeAssignments: assignments.length,
  currentOperationVehicles: currentOperations.length,
  simulatorParticipants: simulatorVehicles.length,
  exactVehicleSpecifications: exactSpecifications.length,
  makeModelFamilies: makeModelFamilies.length,
  vehicleTypes: vehicleTypeFallbacks.filter((type) => type.fleetCount > 0).length,
  priorityAExactSpecifications: simulatorCoverage.exactSpecifications,
  priorityAMakeModelFamilies: simulatorCoverage.makeModelFamilies,
  priorityAVehicleTypes: simulatorCoverage.vehicleTypes,
  priorityBAdditionalExactSpecifications: priorityCounts.B,
  priorityCExactSpecifications: priorityCounts.C,
  priorityADriverPortraits: portraitCounts.A,
  priorityBDriverPortraits: portraitCounts.B,
  priorityCDriverPortraits: portraitCounts.C,
  currentOperationCoverage,
  simulatorCoverage,
  minimumGeneric3dPack: vehicleTypeFallbacks.filter((type) => type.fleetCount > 0).length,
};

function pairTable(pairs) {
  return [
    "| Vehicle | Registration | Specification | Type | Driver | Location | Visual key | 2D | 3D |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...pairs.map((pair) => `| ${[
      pair.vehicleId, pair.registration, `${pair.year} ${pair.make} ${pair.model}`, pair.vehicleType,
      `${pair.currentDriverId} - ${pair.currentDriverName}`, `${pair.city}, ${pair.province}`,
      pair.visualKey, pair.imageStatus, pair.model3dStatus,
    ].map(markdown).join(" | ")} |`),
  ];
}

const vehicleManifestMarkdown = [
  "# Vehicle Visual Asset Manifest", "",
  "Generated read-only from the canonical fleet database. No assets were searched, downloaded or generated.", "",
  `- Fleet vehicles: ${summary.fleetVehicles}`,
  `- Exact year/make/model specifications: ${summary.exactVehicleSpecifications}`,
  `- Make/model families: ${summary.makeModelFamilies}`,
  `- Vehicle-type fallbacks: ${summary.vehicleTypes}`, "",
  "## Exact Specifications", "",
  "| Priority | Visual key | Year | Make | Model | Type | Fleet | Current | Simulator | Image | 3D |",
  "| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |",
  ...exactSpecifications.map((item) => `| ${[
    item.priority, item.visualKey, item.year, item.make, item.model, item.vehicleType, item.fleetCount,
    item.currentOperationCount, item.simulatorParticipantCount, item.assets.image.status, item.assets.model3d.status,
  ].map(markdown).join(" | ")} |`), "",
  "## Make/Model Families", "",
  "Families are sourcing groups only; different model years are not claimed to look identical.", "",
  "| Make | Model | Type | Years | Fleet | Exact specs | Current | Simulator |",
  "| --- | --- | --- | --- | ---: | ---: | ---: | ---: |",
  ...makeModelFamilies.map((item) => `| ${[
    item.make, item.model, item.vehicleType, item.yearsPresent.join(", "), item.fleetCount,
    item.exactSpecificationCount, item.currentOperationCount, item.simulatorParticipantCount,
  ].map(markdown).join(" | ")} |`), "",
  "## Vehicle-Type Fallbacks", "",
  "| Type | Fleet | Families | Current | Simulator | Generic 3D path |",
  "| --- | ---: | ---: | ---: | ---: | --- |",
  ...vehicleTypeFallbacks.map((item) => `| ${[
    item.vehicleType, item.fleetCount, item.makeModelFamilies, item.currentOperationCount,
    item.simulatorParticipantCount, item.model3d.plannedPath,
  ].map(markdown).join(" | ")} |`), "",
].join("\n");

const driverManifestMarkdown = [
  "# Driver Visual Asset Manifest", "",
  `${portraitProvenance.length} owner-supplied fictional portraits are AVAILABLE; ${drivers.length - portraitProvenance.length} retain initials fallbacks. See driver-portrait-provenance.json and V1_1_PHASE_3_2_PORTRAIT_INTEGRATION.md.`, "",
  "| Priority | Driver | Name | Current vehicle | Current visual key | Simulator | Current operation | Photo | Planned path |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...driverRecords.map((driver) => `| ${[
    driver.priority, driver.driverId, driver.name, driver.currentVehicleId, driver.currentVehicleVisualKey,
    driver.simulatorParticipant ? "YES" : "NO", driver.currentOperation ? "YES" : "NO",
    driver.photo.status, driver.photo.plannedPath,
  ].map(markdown).join(" | ")} |`), "",
].join("\n");

const priorityPackMarkdown = [
  "# Fleet Drive AI v1.1 Priority Asset Pack", "",
  `Vehicle 2D and 3D assets remain missing. ${portraitProvenance.length} driver portraits are integrated; consult the driver manifest for AVAILABLE paths and remaining gaps.`, "",
  "## PRIORITY A - LIVE SIMULATOR", "",
  `The ${priorityA.length} normal-scenario simulator participants are the first visual sourcing target.`, "",
  ...pairTable(priorityA), "",
  "## PRIORITY B - CURRENT OPERATION", "",
  `${priorityB.length} current-operation pairs are not in the normal 15-vehicle simulator selection.`, "",
  ...pairTable(priorityB), "",
  "## PRIORITY C - FLEET CATALOGUE", "",
  `${priorityCounts.C} exact specifications are used only by non-current fleet vehicles. Exact 3D coverage is not required before the live map can ship.`, "",
].join("\n");

const summaryMarkdown = [
  "# Fleet Drive AI v1.1 Asset Requirement Summary", "",
  `- Fleet vehicles: ${summary.fleetVehicles}`,
  `- Drivers: ${summary.drivers}`,
  `- Current-operation vehicles: ${summary.currentOperationVehicles}`,
  `- Simulator participants: ${summary.simulatorParticipants}`,
  `- Exact vehicle specifications: ${summary.exactVehicleSpecifications}`,
  `- Make/model families: ${summary.makeModelFamilies}`,
  `- Vehicle types: ${summary.vehicleTypes}`,
  `- Priority A exact specifications: ${summary.priorityAExactSpecifications}`,
  `- Priority A make/model families: ${summary.priorityAMakeModelFamilies}`,
  `- Priority A vehicle types: ${summary.priorityAVehicleTypes}`,
  `- Priority B additional exact specifications: ${summary.priorityBAdditionalExactSpecifications}`,
  `- Priority C exact specifications: ${summary.priorityCExactSpecifications}`,
  `- Driver portraits Priority A: ${summary.priorityADriverPortraits}`,
  `- Driver portraits Priority B: ${summary.priorityBDriverPortraits}`,
  `- Driver portraits Priority C: ${summary.priorityCDriverPortraits}`,
  `- Minimum generic 3D vehicle-type pack: ${summary.minimumGeneric3dPack}`, "",
  "## Coverage", "",
  `The ${summary.currentOperationVehicles} current-operation vehicles require ${currentOperationCoverage.exactSpecifications} exact specifications, ${currentOperationCoverage.makeModelFamilies} make/model families and ${currentOperationCoverage.vehicleTypes} vehicle types.`, "",
  `The 15 normal simulator participants require ${simulatorCoverage.exactSpecifications} exact specifications, ${simulatorCoverage.makeModelFamilies} make/model families and ${simulatorCoverage.vehicleTypes} vehicle types.`, "",
].join("\n");

const readinessMarkdown = [
  "# Phase 2.7 Asset Manifest Regeneration and Sourcing Readiness", "",
  "## 1. Authoritative Data Inputs", "",
  "The manifests use the canonical `vehicles`, `drivers`, `driver_vehicle_assignments`, `driver_current_vehicles` and telemetry data. Current operation is never inferred from the legacy `vehicles.driver_id` columns. The normal 15-vehicle participant set is selected through the production simulator selector without starting the simulator.", "",
  "## 2. Exact Specification Count", "",
  `${summary.exactVehicleSpecifications} unique year/make/model visual specifications cover all ${summary.fleetVehicles} vehicles. Every key is deterministic, path safe and excludes variant, registration, vehicle ID and driver.`, "",
  "## 3. Make/Model Family Count", "",
  `${summary.makeModelFamilies} make/model families are available as sourcing groups. This grouping does not claim that different model years are visually identical.`, "",
  "## 4. Vehicle-Type Count", "",
  `${summary.vehicleTypes} canonical vehicle types are present: ${APPROVED_TYPES.join(", ")}.`, "",
  "## 5. Priority A", "",
  `${priorityA.length} live simulator driver/vehicle pairs cover ${simulatorCoverage.exactSpecifications} exact specifications, ${simulatorCoverage.makeModelFamilies} families and ${simulatorCoverage.vehicleTypes} vehicle types.`, "",
  "## 6. Priority B", "",
  `${priorityB.length} additional current-operation pairs cover ${priorityCounts.B} additional exact specifications not already represented in Priority A.`, "",
  "## 7. Priority C", "",
  `${priorityCounts.C} exact specifications are fleet-catalogue priorities only.`, "",
  "## 8. Driver Portrait Requirements", "",
  `${summary.drivers} fictional portraits are required: ${portraitCounts.A} Priority A, ${portraitCounts.B} Priority B and ${portraitCounts.C} Priority C. ${portraitProvenance.length} are AVAILABLE; initials remain the fallback for the rest.`, "",
  "## 9. 2D Strategy", "",
  "Prefer an exact licensed year/model image, then a clearly classified model-family image, then a generated or generic vehicle-type representation. 2D imagery should generally be more specific than 3D. No licensing availability is claimed.", "",
  "## 10. 3D Strategy", "",
  `A practical baseline of ${summary.minimumGeneric3dPack} generic body-type GLBs can represent the complete fleet. Exact or model-family GLBs may replace them selectively where suitable rights and quality justify the work.`, "",
  "## 11. Exactness Model", "",
  "Manifest exactness values are `EXACT`, `MODEL_FAMILY`, `VEHICLE_TYPE`, `GENERIC` and `NONE`. Missing assets use actual exactness `NONE`; `plannedExactness` records the sourcing target. A generic body-type GLB is a `REPRESENTATIVE VEHICLE-TYPE ASSET`, never an exact digital twin.", "",
  "## 12. Licensing Metadata", "",
  "Each future asset records status, local path, source type, source reference, licence, attribution requirement, attribution text and exactness. Google Images is not an asset licence. Search-result availability does not grant redistribution rights, and publicly accessible manufacturer media or 3D models must not be used without suitable rights.", "",
  "Future source preference: 2D uses approved/licensed manufacturer media where redistribution is permitted, licensed external imagery, generated representation, then generic fallback. 3D uses licensed exact/family GLB, custom/generated work, then licensed generic type models. Drivers use generated fictional portraits, licensed stock fictional representations, then generic avatars.", "",
  "## 13. Asset Path Convention", "",
  "Driver portraits use `public/assets/drivers/<driverId>.webp`; exact images use `public/assets/vehicles/images/<visualKey>.webp`; model-family GLBs use `public/assets/vehicles/models/<family>.glb`; generic GLBs use `public/assets/vehicles/models/<vehicle-type>-generic.glb`. Missing directories/files are not created by this phase.", "",
  "## 14. Runtime-Data Preservation", "",
  `The generator opens SQLite read-only and records identity hashes plus telemetry row count (${telemetryCount}) for before/after comparison.`, "",
  "## 15. Stage 3 Readiness", "",
  "The manifests and priority pack are ready to drive a separately approved sourcing phase. No search, download, image generation, portrait generation or 3D generation occurred.", "",
  "## 16. Remaining Gaps", "",
  `${portraitProvenance.length} owner-supplied portraits have recorded provenance. ${drivers.length - portraitProvenance.length} driver portraits and all vehicle-specific visual assets remain absent.`, "",
].join("\n");

const outputs = new Map([
  ["docs/assets/vehicle-asset-manifest.json", `${JSON.stringify(vehicleManifest, null, 2)}\n`],
  ["docs/assets/VEHICLE_VISUAL_ASSET_MANIFEST.md", vehicleManifestMarkdown],
  ["docs/assets/driver-asset-manifest.json", `${JSON.stringify(driverManifest, null, 2)}\n`],
  ["docs/assets/DRIVER_VISUAL_ASSET_MANIFEST.md", driverManifestMarkdown],
  ["docs/assets/V1_1_PRIORITY_ASSET_PACK.md", priorityPackMarkdown],
  ["docs/assets/V1_1_ASSET_REQUIREMENT_SUMMARY.md", summaryMarkdown],
  ["docs/assets/V1_1_PHASE_2_7_ASSET_READINESS.md", readinessMarkdown],
]);

function validate() {
  if (vehicles.length !== 350) throw new Error(`Expected 350 vehicles, found ${vehicles.length}`);
  if (drivers.length !== 25) throw new Error(`Expected 25 drivers, found ${drivers.length}`);
  if (assignments.length !== 349) throw new Error(`Expected 349 active assignments, found ${assignments.length}`);
  if (currentOperations.length !== 21) throw new Error(`Expected 21 current operations, found ${currentOperations.length}`);
  if (simulatorVehicles.length !== 15) throw new Error(`Expected 15 simulator participants, found ${simulatorVehicles.length}`);
  if (simulatorVehicles.some((vehicle) => !vehicle.currentDriver?.id)) throw new Error("Priority A contains a vehicle without a current driver");
  if (driverRecords.filter((driver) => driver.priority === "A").some((driver) => !driver.currentVehicleId)) {
    throw new Error("Priority A contains a driver without a current vehicle");
  }
  if (new Set(exactSpecifications.map((item) => item.visualKey)).size !== exactSpecifications.length) {
    throw new Error("Duplicate visual keys found");
  }
  if (exactSpecifications.reduce((total, item) => total + item.fleetCount, 0) !== 350) {
    throw new Error("Vehicle specification counts do not reconcile to 350");
  }
  const serialized = JSON.stringify({ vehicleManifest, driverManifest });
  if (/https?:\/\//i.test(serialized)) throw new Error("External asset URL introduced");
}

validate();

for (const [relativePath, contents] of outputs) {
  const outputPath = path.join(repositoryRoot, relativePath);
  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== contents) {
      throw new Error(`Generated asset artifact is out of date: ${relativePath}`);
    }
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, contents, "utf8");
  }
}

console.log(JSON.stringify({
  database: path.relative(repositoryRoot, databasePath).replaceAll("\\", "/"),
  mode: checkOnly ? "check" : "write",
  summary,
  sourceIntegrity,
  outputs: [...outputs.keys()],
}, null, 2));

db.close();
