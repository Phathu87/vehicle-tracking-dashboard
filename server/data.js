import fs from "node:fs";

export const CANONICAL_FLEET = JSON.parse(
  fs.readFileSync(new URL("./data/fleet.json", import.meta.url), "utf8"),
);

export const CITIES = [
  { name: "Johannesburg", code: "JO", lat: -26.2041, lng: 28.0473, province: "Gauteng" },
  { name: "Cape Town", code: "CA", lat: -33.9249, lng: 18.4241, province: "Western Cape" },
  { name: "Durban", code: "DU", lat: -29.8587, lng: 31.0218, province: "KwaZulu-Natal" },
  { name: "Pretoria", code: "PR", lat: -25.7479, lng: 28.2293, province: "Gauteng" },
  { name: "Thohoyandou", code: "TH", lat: -22.9513, lng: 30.4856, province: "Limpopo" },
  { name: "Polokwane", code: "PO", lat: -23.8981, lng: 29.45, province: "Limpopo" },
  { name: "Gqeberha", code: "GQ", lat: -33.9137, lng: 25.5827, province: "Eastern Cape" },
  { name: "Bloemfontein", code: "BL", lat: -29.1129, lng: 26.2149, province: "Free State" },
  { name: "Phalaborwa", code: "PH", lat: -23.9386, lng: 31.144, province: "Limpopo" },
  { name: "Mahikeng", code: "MA", lat: -25.857, lng: 25.6393, province: "North West" },
  // The historical MF fleet block is retained, but its city label is canonicalised.
  { name: "Mahikeng", code: "MF", lat: -25.857, lng: 25.6393, province: "North West" },
  { name: "Louis Trichardt", code: "LO", lat: -23.0955, lng: 29.9, province: "Limpopo" },
  { name: "Rustenburg", code: "RU", lat: -25.667, lng: 27.242, province: "North West" },
  { name: "Kimberley", code: "KI", lat: -28.7294, lng: 24.7706, province: "Northern Cape" },
];

export const DRIVER_ROSTER = [
  "Ayanda Dlamini", "Siyabonga Naidoo", "Thandi Mokoena", "Lerato Nkosi", "Amahle Khumalo",
  "Riyaad Ahmed", "Jenna Smith", "Zanele Daniels", "Kavish Patel", "Nandi Ndlovu",
  "Fhulufhelo Makhale", "Palesa Mthembu", "Charlene van der Merwe", "Lwazi van Wyk", "Tshifhiwa Netshanda",
  "Sipho Sithole", "Refilwe Mokoena", "Unarine Netswera", "Dineo Naidoo", "Mia Botha",
  "Gugu Mabena", "Hlumelo Radebe", "Imani Mthembu", "Jared Jacobs", "Karabo Petersen",
].map((name, index) => ({ id: `DRV-${String(index + 1).padStart(3, "0")}`, name }));

export const VEHICLES = {
  Volvo: ["XC90", "S60", "XC60"],
  "Mercedes-Benz": ["C-Class", "E-Class", "Sprinter"],
  Isuzu: ["D-Max", "KB"],
  Hyundai: ["H1", "Tucson", "Elantra"],
  Scania: ["R-Series", "S-Series"],
  Toyota: ["Hilux", "Corolla", "Fortuner"],
  Ford: ["Ranger", "EcoSport", "Focus"],
  Nissan: ["NP200", "Navara", "X-Trail"],
  BMW: ["X5", "320i", "X3"],
  Audi: ["Q7", "A4", "A6"],
  Kia: ["Seltos", "Sportage"],
  Mazda: ["CX-5", "3", "6"],
  Chevrolet: ["Trailblazer", "Spark", "Cruze"],
  Honda: ["CR-V", "Civic", "Jazz"],
  Volkswagen: ["Polo", "Golf", "Passat"],
};

export const PROVINCES = {
  Gauteng: "GP", "Western Cape": "WC", "KwaZulu-Natal": "KZN",
  "Eastern Cape": "EC", "Free State": "FS", Mpumalanga: "MP", Limpopo: "LP",
  "North West": "NW", "Northern Cape": "NC",
};

const VEHICLE_TYPES = {
  "Volvo|XC90": "SUV", "Volvo|S60": "SEDAN", "Volvo|XC60": "SUV",
  "Mercedes-Benz|C-Class": "SEDAN", "Mercedes-Benz|E-Class": "SEDAN", "Mercedes-Benz|Sprinter": "VAN",
  "Isuzu|D-Max": "PICKUP", "Isuzu|KB": "PICKUP",
  "Hyundai|H1": "MINIBUS", "Hyundai|Tucson": "SUV", "Hyundai|Elantra": "SEDAN",
  "Scania|R-Series": "TRUCK", "Scania|S-Series": "TRUCK",
  "Toyota|Hilux": "PICKUP", "Toyota|Corolla": "SEDAN", "Toyota|Fortuner": "SUV",
  "Ford|Ranger": "PICKUP", "Ford|EcoSport": "CROSSOVER", "Ford|Focus": "HATCHBACK",
  "Nissan|NP200": "PICKUP", "Nissan|Navara": "PICKUP", "Nissan|X-Trail": "SUV",
  "BMW|X5": "SUV", "BMW|320i": "SEDAN", "BMW|X3": "SUV",
  "Audi|Q7": "SUV", "Audi|A4": "SEDAN", "Audi|A6": "SEDAN",
  "Kia|Seltos": "CROSSOVER", "Kia|Sportage": "SUV",
  "Mazda|CX-5": "SUV", "Mazda|3": "HATCHBACK", "Mazda|6": "SEDAN",
  "Chevrolet|Trailblazer": "SUV", "Chevrolet|Spark": "HATCHBACK", "Chevrolet|Cruze": "SEDAN",
  "Honda|CR-V": "SUV", "Honda|Civic": "SEDAN", "Honda|Jazz": "HATCHBACK",
  "Volkswagen|Polo": "HATCHBACK", "Volkswagen|Golf": "HATCHBACK", "Volkswagen|Passat": "SEDAN",
};

export function canonicalMake(value) {
  return value === "Mercedes Benz" ? "Mercedes-Benz" : value;
}

export function canonicalCity(value) {
  return value === "Mafikeng" ? "Mahikeng" : value;
}

export function vehicleTypeFor(make, model) {
  return VEHICLE_TYPES[`${canonicalMake(make)}|${model}`] || "UNKNOWN";
}

export function visualKeyFor({ year, make, model, variant = null }) {
  return [year, canonicalMake(make), model, variant]
    .filter((value) => value !== null && value !== undefined && String(value).trim())
    .map((value) => String(value).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .join("-");
}

export function generatePlate(province, fleetIndex = 0) {
  const prefix = PROVINCES[province] || "GP";
  const first = String.fromCharCode(65 + Math.floor(fleetIndex / 26) % 26);
  const second = String.fromCharCode(65 + fleetIndex % 26);
  return `${prefix} ${String(1000 + fleetIndex).padStart(4, "0")} ${first}${second}`;
}

export function getDeterministicVehicle(index = 0) {
  const offset = Math.trunc(Number(index) || 0);
  const vehicle = CANONICAL_FLEET.vehicles[((offset % CANONICAL_FLEET.vehicles.length)
    + CANONICAL_FLEET.vehicles.length) % CANONICAL_FLEET.vehicles.length];
  return { make: vehicle.make, model: vehicle.model };
}

// Compatibility alias for older imports; selection is deterministic.
export const getRandomVehicle = getDeterministicVehicle;

// Preserve city-block ordering for the existing telemetry/maintenance seed.
export const vehicles = CITIES.flatMap((city, cityIndex) => CANONICAL_FLEET.vehicles
  .filter((vehicle) => vehicle.id.startsWith(`VH-${city.code}-`)).map((identity, itemIndex) => {
  const fleetIndex = cityIndex * 25 + itemIndex;
  const latOffset = ((itemIndex % 5) - 2) * 0.0017;
  const lngOffset = (Math.floor(itemIndex / 5) - 2) * 0.0019;
  const lat = Number((city.lat + latOffset).toFixed(6));
  const lng = Number((city.lng + lngOffset).toFixed(6));
  return {
    ...identity,
    driver: null,
    road: [[{ lat, lng }]],
    roadIndex: 0,
    lat,
    lng,
    speed: 20 + fleetIndex * 17 % 60,
    status: "Online",
    lastSeen: 0,
    history: [],
    progress: 0,
  };
}));
