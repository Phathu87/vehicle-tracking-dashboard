// Offline asset authoring only. No application, database or simulator imports.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/assets/vehicles/models');
// GLTFExporter uses the browser Blob/FileReader interface for its binary chunk.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value;
      this.onloadend?.({ target: this });
    }).catch((error) => this.onerror?.(error));
  }
};

function sample(points, z) {
  if (z <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (z <= points[i][0]) {
      const [a, av] = points[i - 1], [b, bv] = points[i];
      const u = (z - a) / (b - a);
      const prior = points[Math.max(0, i - 2)], next = points[Math.min(points.length - 1, i + 1)];
      const slopeA = (bv - prior[1]) / (b - prior[0]);
      const slopeB = (next[1] - av) / (next[0] - a);
      return (2 * u ** 3 - 3 * u ** 2 + 1) * av + (u ** 3 - 2 * u ** 2 + u) * (b - a) * slopeA
        + (-2 * u ** 3 + 3 * u ** 2) * bv + (u ** 3 - u ** 2) * (b - a) * slopeB;
    }
  }
  return points.at(-1)[1];
}

function loft(rings) {
  const positions = [], indices = [], n = rings[0].length;
  rings.forEach((r) => r.forEach((p) => positions.push(...p)));
  for (let k = 0; k < rings.length - 1; k++) {
    for (let j = 0; j < n; j++) {
      const a = k * n + j, b = k * n + (j + 1) % n;
      indices.push(a, b, b + n, a, b + n, a + n);
    }
  }
  for (let j = 1; j < n - 1; j++) {
    indices.push(0, j + 1, j);
    const end = (rings.length - 1) * n;
    indices.push(end, end + j, end + j + 1);
  }
  // Rings run clockwise when viewed from +Z: reverse faces for outward normals.
  for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function create(type) {
  const sedan = type === 'SEDAN';
  const length = sedan ? 4.6 : 4.1;
  const halfWidth = sedan ? 0.9 : 0.875;
  const wheelZ = sedan ? [-1.42, 1.43] : [-1.24, 1.28];
  const tyreRadius = 0.335;
  const bodyTop = sedan
    ? [[-2.3, 0.76], [-2.12, 0.87], [-1.48, 0.9], [-0.55, 0.92], [0.68, 0.91], [1.3, 0.89], [2.08, 0.79], [2.3, 0.71]]
    : [[-2.05, 0.79], [-1.82, 0.96], [-0.9, 0.95], [0.5, 0.93], [1.2, 0.88], [1.87, 0.77], [2.05, 0.7]];
  const cabin = sedan
    ? [[-1.43, 0.91], [-1.23, 1.06], [-0.73, 1.44], [-0.2, 1.46], [0.35, 1.43], [0.99, 0.93]]
    : [[-1.93, 0.98], [-1.72, 1.4], [-1.2, 1.5], [-0.3, 1.5], [0.26, 1.47], [0.9, 0.95]];
  const buckets = [[], [], [], []];
  const materials = [
    new T.MeshStandardMaterial({ name: 'Neutral silver body', color: '#b9c2ca', metalness: 0.42, roughness: 0.4 }),
    new T.MeshStandardMaterial({ name: 'Opaque smoked glazing', color: '#182934', metalness: 0.18, roughness: 0.23 }),
    new T.MeshStandardMaterial({ name: 'Tyres and wheel wells', color: '#191c20', roughness: 0.88 }),
    new T.MeshStandardMaterial({ name: 'Trim wheels and lamps', vertexColors: true, metalness: 0.32, roughness: 0.38 }),
  ];
  function add(g, material = 0, colour = '#c1c6ce', position = [0, 0, 0], rotation = [0, 0, 0]) {
    const m = new T.Matrix4().compose(new T.Vector3(...position),
      new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1));
    g.applyMatrix4(m);
    if (g.index) g = g.toNonIndexed();
    if (g.getAttribute('uv')) g.deleteAttribute('uv');
    if (material === 3) {
      const c = new T.Color(colour), data = [];
      for (let i = 0; i < g.getAttribute('position').count; i++) data.push(c.r, c.g, c.b);
      g.setAttribute('color', new T.Float32BufferAttribute(data, 3));
    }
    buckets[material].push(g);
  }
  function box(size, pos, mat = 3, col = '#252a31', rot = [0, 0, 0]) {
    add(new T.BoxGeometry(...size), mat, col, pos, rot);
  }
  function line(points, radius = 0.006, mat = 3, col = '#353d45') {
    add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
      Math.max(4, points.length * 2), radius, 5, false), mat, col);
  }
  const widthAt = (z) => halfWidth * sample([[-length / 2, 0.89], [-length / 2 + 0.28, 1],
    [length / 2 - 0.4, 1], [length / 2, 0.88]], z);
  const archBottom = (z) => {
    let bottom = 0.3;
    for (const wz of wheelZ) {
      const delta = z - wz;
      if (Math.abs(delta) < 0.385) bottom = Math.max(bottom, tyreRadius + Math.sqrt(0.385 ** 2 - delta ** 2));
    }
    return bottom;
  };
  function bodyRing(z) {
    const y = sample(bodyTop, z), w = widthAt(z), b = archBottom(z);
    const right = [[w * 0.45, y, z], [w * 0.8, y - 0.022, z], [w * 0.96, y - 0.068, z],
      [w, y - 0.12, z], [w * 0.99, b + (y - 0.12 - b) * 0.52, z], [w * 0.965, b, z], [w * 0.65, 0.3, z]];
    return [[0, y + 0.012, z], ...right, [0, 0.29, z], ...right.toReversed().map(([x, y, z]) => [-x, y, z])];
  }
  const rings = [];
  for (let k = 0; k <= 60; k++) rings.push(bodyRing(-length / 2 + k * length / 60));
  add(loft(rings));
  const cabMin = cabin[0][0], cabMax = cabin.at(-1)[0];
  const roofWidth = (z) => halfWidth * 0.79;
  const cabBase = (z) => sample(bodyTop, z) - 0.067;
  const roofY = (z) => sample(cabin, z);
  const sideX = (z, y) => halfWidth * 0.94 + (roofWidth(z) - halfWidth * 0.94)
    * Math.max(0, Math.min(1, (y - cabBase(z)) / Math.max(0.02, roofY(z) - cabBase(z))));
  const cabRings = [];
  const sections = new Set(Array.from({ length: 33 }, (_, k) => cabMin + k * (cabMax - cabMin) / 32));
  const rearGlass = sedan ? [-1.3, -0.78] : [-1.84, -1.28];
  const frontGlass = [0.4, sedan ? 0.92 : 0.84];
  const sideRanges = sedan ? [[-1.18, -0.34], [-0.26, 0.78]] : [[-1.6, -0.36], [-0.28, 0.7]];
  [...rearGlass, ...frontGlass, ...sideRanges.flat()].forEach((z) => sections.add(z));
  const sectionZ = [...sections].sort((a, b) => a - b);
  for (const z of sectionZ) {
    const top = roofY(z), base = cabBase(z), w = roofWidth(z), h = top - base;
    const right = [[w * 0.5, top + 0.005, z], [w * 0.93, top - 0.027, z], [w, top - h * 0.11, z],
      [sideX(z, base + h * 0.84), base + h * 0.84, z],
      [sideX(z, base + h * 0.12), base + h * 0.12, z], [halfWidth * 0.94, base, z]];
    cabRings.push([[0, top + 0.017, z], ...right, [0, base, z], ...right.toReversed().map(([x, y, z]) => [-x, y, z])]);
  }
  // Glazing and paint partition the SAME topology, eliminating floating overlay panes.
  const cabinGeometry = loft(cabRings);
  const paintedIndices = [], glassIndices = [], index = cabinGeometry.index.array, n = cabRings[0].length;
  const skinTriangles = (cabRings.length - 1) * n * 2;
  for (let triangle = 0; triangle < index.length / 3; triangle++) {
    let glass = false;
    if (triangle < skinTriangles) {
      const ring = Math.floor(triangle / (n * 2)), face = Math.floor(triangle / 2) % n;
      const z = (sectionZ[ring] + sectionZ[ring + 1]) / 2;
      const slopeWindow = [rearGlass, frontGlass].some(([a, b]) => z > a && z < b);
      const sideWindow = sideRanges.some(([a, b]) => z > a && z < b);
      glass = (slopeWindow && [0, 1, n - 2, n - 1].includes(face)) || (sideWindow && [4, 9].includes(face));
    }
    (glass ? glassIndices : paintedIndices).push(...index.slice(triangle * 3, triangle * 3 + 3));
  }
  for (const [indices, material] of [[paintedIndices, 0], [glassIndices, 1]]) {
    const g = cabinGeometry.clone(); g.setIndex(indices); add(g, material);
  }
  function panelX(z, y) {
    const points = bodyRing(z).slice(1, 8);
    for (let k = 0; k < points.length - 1; k++) {
      const [x1, y1] = points[k], [x2, y2] = points[k + 1];
      if (y <= y1 && y >= y2) return x1 + (x2 - x1) * (y1 - y) / Math.max(0.001, y1 - y2);
    }
    return widthAt(z) * 0.96;
  }
  for (const side of [-1, 1]) {
    // Panel shut lines and discrete handles, with four-door proportions.
    for (const z of [-0.3, sedan ? -1.22 : -1.57, sedan ? 0.95 : 0.84]) {
      const lower = Math.max(0.4, archBottom(z) + 0.035);
      line([lower, (lower + 0.85) / 2, 0.85].map((y) => [side * (panelX(z, y) + 0.002), y, z]), 0.0025);
    }
    for (const z of [-0.93, 0.14]) box([0.01, 0.02, 0.12], [side * panelX(z, 0.84), 0.84, z], 3, '#7c858e');
    line([[-0.78, 0.36], [0, 0.36], [0.81, 0.36]].map(([z, y]) => [side * panelX(z, y), y, z]), 0.009);
    // Small rounded mirror housings and glass, not disconnected floating objects.
    line([[side * sideX(0.68, 1.02), 1.02, 0.68], [side * 0.95, 1.065, 0.68]], 0.025);
    add(new T.SphereGeometry(1, 12, 8).scale(0.105, 0.06, 0.1), 0, undefined, [side * 0.95, 1.065, 0.68]);
    box([0.13, 0.065, 0.014], [side * 0.95, 1.065, 0.592], 1);
  }
  // Four tyre/rim assemblies, all ground contacts at exactly Y=0.
  for (const side of [-1, 1]) for (const z of wheelZ) {
    const x = side * (halfWidth - 0.095);
    const profile = [[0.22, -0.09], [0.29, -0.09], [0.324, -0.066], [tyreRadius, -0.025],
      [tyreRadius, 0.025], [0.324, 0.066], [0.29, 0.09], [0.22, 0.09], [0.22, -0.09]];
    add(new T.LatheGeometry(profile.map(([r, y]) => new T.Vector2(r, y)), 24), 2, undefined,
      [x, tyreRadius, z], [0, 0, Math.PI / 2]);
    add(new T.CylinderGeometry(0.222, 0.222, 0.16, 24), 3, '#323943', [x, tyreRadius, z], [0, 0, Math.PI / 2]);
    const outer = x + side * 0.091;
    add(new T.TorusGeometry(0.225, 0.016, 5, 24), 3, '#c5cdd5', [outer, tyreRadius, z], [0, Math.PI / 2, 0]);
    add(new T.CylinderGeometry(0.069, 0.069, 0.02, 16), 3, '#aab5bf', [outer, tyreRadius, z], [0, 0, Math.PI / 2]);
    for (let j = 0; j < 5; j++) {
      const a = j * Math.PI * 2 / 5;
      box([0.018, 0.16, 0.037], [outer, tyreRadius + Math.cos(a) * 0.135, z + Math.sin(a) * 0.135],
        3, '#b5bec7', [a, 0, 0]);
    }
  }
  const nose = length / 2, tail = -length / 2;
  function capDetail(points, z, colour, rear = false) {
    const shape = new T.Shape(points.map(([x, y]) => new T.Vector2(x, y)));
    const g = new T.ShapeGeometry(shape);
    if (rear) { const idx = g.index.array; for (let k = 0; k < idx.length; k += 3) [idx[k + 1], idx[k + 2]] = [idx[k + 2], idx[k + 1]]; g.computeVertexNormals(); }
    add(g, 3, colour, [0, 0, z]);
  }
  capDetail([[-0.4, 0.45], [-0.34, 0.59], [0.34, 0.59], [0.4, 0.45], [0.3, 0.42], [-0.3, 0.42]], nose + 0.001, '#202931');
  for (let i = 0; i < 4; i++) capDetail([[-0.31, 0.45 + i * 0.032], [0.31, 0.45 + i * 0.032], [0.31, 0.454 + i * 0.032], [-0.31, 0.454 + i * 0.032]], nose + 0.002, '#65727d');
  for (const side of [-1, 1]) {
    capDetail([[0.4, 0.62], [0.69, 0.6], [0.65, 0.67], [0.43, 0.675]].map(([x, y]) => [x * side, y]), nose + 0.002, '#dce4e8');
    capDetail([[0.36, 0.66], [0.69, 0.63], [0.68, 0.70], [0.39, 0.73]].map(([x, y]) => [x * side, y]), tail - 0.002, '#8f1829', true);
    capDetail([[0.45, 0.36], [0.65, 0.36], [0.65, 0.38], [0.45, 0.38]].map(([x, y]) => [x * side, y]), tail - 0.002, '#751822', true);
  }
  capDetail([[-0.63, 0.34], [-0.55, 0.38], [0.55, 0.38], [0.63, 0.34]], nose + 0.001, '#30373d');
  capDetail([[-0.6, 0.32], [-0.56, 0.37], [0.56, 0.37], [0.6, 0.32]], tail - 0.001, '#30373d', true);
  // Real hatch outline versus a separate sedan boot lid.
  if (sedan) {
    line([[-0.6, sample(bodyTop, -1.5) - 0.005, -1.5], [0, sample(bodyTop, -1.5) + 0.014, -1.5],
      [0.6, sample(bodyTop, -1.5) - 0.005, -1.5]], 0.002);
  } else {
    // The rear-glass face partition forms the hatch outline without an overlay tube.
  }
  const group = new T.Group(); group.name = `${type.toLowerCase()}-generic`;
  group.userData = { exactness: 'VEHICLE_TYPE', units: 'metres', forward: '+Z', up: '+Y' };
  for (let i = 0; i < buckets.length; i++) {
    const geometry = mergeGeometries(buckets[i], false);
    const mesh = new T.Mesh(geometry, materials[i]); mesh.name = ['body', 'glazing', 'tyres', 'trim-and-lamps'][i];
    group.add(mesh);
  }
  const bounds = new T.Box3().setFromObject(group);
  const zCentre = (bounds.min.z + bounds.max.z) / 2;
  for (const mesh of group.children) mesh.geometry.translate(0, 0, -zCentre);
  return group;
}

fs.mkdirSync(output, { recursive: true });
for (const type of ['SEDAN', 'HATCHBACK']) {
  const model = create(type);
  const binary = await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true });
  const target = path.join(output, `${type.toLowerCase()}-generic.glb`);
  fs.writeFileSync(target, Buffer.from(binary));
  console.log(JSON.stringify({ type, file: path.relative(root, target), bytes: binary.byteLength }));
}
