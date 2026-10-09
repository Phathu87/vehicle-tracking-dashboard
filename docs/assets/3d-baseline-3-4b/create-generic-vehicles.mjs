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
      const smooth = u * u * (3 - 2 * u);
      return av + (bv - av) * smooth;
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
    new T.MeshStandardMaterial({ name: 'Neutral silver body', color: '#b9c2ca', metalness: 0.52, roughness: 0.32 }),
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
  const rings = [];
  for (let k = 0; k <= 80; k++) {
    const z = -length / 2 + k * length / 80, y = sample(bodyTop, z), w = widthAt(z), b = archBottom(z);
    rings.push([[0, y, z], [w * 0.7, y - 0.015, z], [w * 0.94, y - 0.06, z],
      [w, y - 0.12, z], [w * 0.98, b, z], [w * 0.65, 0.3, z], [0, 0.29, z],
      [-w * 0.65, 0.3, z], [-w * 0.98, b, z], [-w, y - 0.12, z], [-w * 0.94, y - 0.06, z], [-w * 0.7, y - 0.015, z]]);
  }
  add(loft(rings));
  const cabMin = cabin[0][0], cabMax = cabin.at(-1)[0];
  const roofWidth = (z) => halfWidth * 0.79;
  const cabBase = (z) => sample(bodyTop, z) + 0.005;
  const roofY = (z) => sample(cabin, z);
  const sideX = (z, y) => {
    const u = Math.max(0, Math.min(1, (y - cabBase(z)) / Math.max(0.02, roofY(z) - cabBase(z))));
    return halfWidth * 0.94 * (1 - u) + roofWidth(z) * u;
  };
  const cabRings = [];
  for (let k = 0; k <= 32; k++) {
    const z = cabMin + k * (cabMax - cabMin) / 32, top = roofY(z), base = cabBase(z), w = roofWidth(z);
    cabRings.push([[0, top + 0.012, z], [w * 0.9, top, z], [w, top - 0.035, z],
      [halfWidth * 0.94, base, z], [0, base, z], [-halfWidth * 0.94, base, z],
      [-w, top - 0.035, z], [-w * 0.9, top, z]]);
  }
  add(loft(cabRings));
  // Opaque geometry patches follow the cabin slope; references are never textures.
  for (const side of [-1, 1]) {
    const ranges = sedan ? [[-1.18, -0.34], [-0.26, 0.78]] : [[-1.6, -0.36], [-0.28, 0.7]];
    for (const [a, b] of ranges) {
      const windowRings = [];
      for (let k = 0; k <= 16; k++) {
        const z = a + k * (b - a) / 16, lower = cabBase(z) + 0.058;
        const upper = Math.max(lower + 0.015, roofY(z) - 0.085);
        windowRings.push([[side * (sideX(z, lower) + 0.009), lower, z],
          [side * (sideX(z, upper) + 0.009), upper, z]]);
      }
      // A thin two-sided ribbon avoids a degenerate closed loft.
      const pos = [], idx = [];
      windowRings.forEach((r) => r.forEach((p) => pos.push(...p)));
      for (let k = 0; k < 16; k++) {
        const a = k * 2;
        if (side > 0) idx.push(a, a + 1, a + 3, a, a + 3, a + 2);
        else idx.push(a, a + 3, a + 1, a, a + 2, a + 3);
      }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); add(g, 1);
    }
    // Panel shut lines and discrete handles, with four-door proportions.
    for (const z of [-0.3, sedan ? -1.22 : -1.57, sedan ? 0.95 : 0.84]) {
      line([[side * halfWidth * 0.99, 0.41, z], [side * halfWidth * 1.002, 0.66, z],
        [side * halfWidth * 0.95, 0.91, z]], 0.004);
    }
    for (const z of [-0.93, 0.14]) box([0.02, 0.025, 0.13], [side * halfWidth * 1.005, 0.84, z], 3, '#7c858e');
    line([[side * halfWidth * 0.99, 0.33, -0.78], [side * halfWidth * 0.99, 0.33, 0.81]], 0.016);
    // Small rounded mirror housings and glass, not disconnected floating objects.
    box([0.11, 0.045, 0.055], [side * 0.89, 1.03, 0.68], 3);
    add(new T.SphereGeometry(1, 12, 8).scale(0.105, 0.06, 0.1), 0, undefined, [side * 0.95, 1.065, 0.68]);
    box([0.13, 0.065, 0.014], [side * 0.95, 1.065, 0.592], 1);
  }
  function slopeGlass(a, b) {
    const glassRings = [];
    for (let k = 0; k <= 20; k++) {
      const z = a + k * (b - a) / 20, y = roofY(z) + 0.022, w = roofWidth(z) * 0.88;
      glassRings.push([[-w, y, z], [w, y, z]]);
    }
    const pos = [], idx = [];
    glassRings.forEach((r) => r.forEach((p) => pos.push(...p)));
    for (let k = 0; k < 20; k++) { const a = k * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx); g.computeVertexNormals(); add(g, 1);
  }
  slopeGlass(0.4, sedan ? 0.92 : 0.84);
  slopeGlass(sedan ? -1.34 : -1.85, sedan ? -0.79 : -1.27);
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
  box([0.95, 0.19, 0.026], [0, 0.53, nose - 0.012]);
  for (let i = -3; i <= 3; i++) box([0.94, 0.006, 0.008], [0, 0.53 + i * 0.024, nose + 0.004], 3, '#56616b');
  for (const side of [-1, 1]) {
    box([0.33, 0.075, 0.045], [side * 0.58, 0.71, nose - 0.035], 3, '#e9f0ec', [0, side * -0.15, 0]);
    box([0.3, 0.047, 0.03], [side * 0.6, sedan ? 0.79 : 0.87, tail + 0.018], 3, '#ad202c');
    box([0.2, 0.025, 0.035], [side * 0.6, 0.36, tail + 0.01], 3, '#751822');
  }
  line([[-0.69, 0.35, nose - 0.05], [0, 0.33, nose + 0.015], [0.69, 0.35, nose - 0.05]], 0.025);
  line([[-0.7, 0.33, tail + 0.08], [0, 0.32, tail - 0.006], [0.7, 0.33, tail + 0.08]], 0.025);
  // Real hatch outline versus a separate sedan boot lid.
  if (sedan) {
    line([[-0.64, 0.885, -1.5], [0, 0.897, -1.48], [0.64, 0.885, -1.5]], 0.004);
  } else {
    line([[-0.69, 0.93, -1.94], [-0.58, 1.39, -1.69], [0, 1.48, -1.27],
      [0.58, 1.39, -1.69], [0.69, 0.93, -1.94]], 0.004);
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
