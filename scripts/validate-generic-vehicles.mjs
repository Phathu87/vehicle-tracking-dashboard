import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const formats = { 5121: [1, 'getUint8'], 5123: [2, 'getUint16'], 5125: [4, 'getUint32'], 5126: [4, 'getFloat32'] };

export function validate(type) {
  const file = `public/assets/vehicles/models/${type.toLowerCase()}-generic.glb`;
  const bytes = fs.readFileSync(path.join(root, file));
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  assert(bytes.length <= 1024 * 1024);
  const chunks = [];
  for (let offset = 12; offset < bytes.length;) {
    const size = bytes.readUInt32LE(offset), kind = bytes.readUInt32LE(offset + 4);
    assert.equal(size % 4, 0); assert(offset + 8 + size <= bytes.length);
    chunks.push({ kind, data: bytes.subarray(offset + 8, offset + 8 + size) }); offset += 8 + size;
  }
  assert.equal(chunks.length, 2); assert.equal(chunks[0].kind, 0x4e4f534a); assert.equal(chunks[1].kind, 0x004e4942);
  const json = JSON.parse(chunks[0].data.toString('utf8')), bin = chunks[1].data;
  assert.equal(json.asset.version, '2.0'); assert(json.scenes[json.scene ?? 0].nodes.length);
  assert.equal(json.buffers.length, 1); assert(!json.buffers[0].uri); assert(json.buffers[0].byteLength <= bin.length);
  assert(!json.extensionsRequired?.length); assert(!json.images?.length); assert(!json.textures?.length);
  assert(!json.animations?.length); assert(!json.skins?.length);
  for (const v of json.bufferViews) {
    assert.equal(v.buffer, 0); assert((v.byteOffset ?? 0) + v.byteLength <= json.buffers[0].byteLength);
  }
  function accessor(id) {
    const a = json.accessors[id]; assert(a); assert(!a.sparse);
    const v = json.bufferViews[a.bufferView], [size, method] = formats[a.componentType] ?? [];
    assert(v && size); const n = components[a.type]; assert(n && a.count > 0);
    const stride = v.byteStride ?? n * size, start = (v.byteOffset ?? 0) + (a.byteOffset ?? 0);
    assert.equal(start % size, 0); assert(stride >= n * size);
    assert((a.byteOffset ?? 0) + (a.count - 1) * stride + n * size <= v.byteLength);
    const view = new DataView(bin.buffer, bin.byteOffset, bin.byteLength), values = [];
    for (let i = 0; i < a.count; i++) {
      const row = [];
      for (let k = 0; k < n; k++) { const x = view[method](start + i * stride + k * size, true); assert(Number.isFinite(x)); row.push(x); }
      values.push(row);
    }
    return values;
  }
  for (let i = 0; i < json.accessors.length; i++) accessor(i);
  for (const scene of json.scenes) assert(scene.nodes.every((id) => json.nodes[id]));
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  let triangles = 0, primitives = 0;
  for (const mesh of json.meshes) for (const p of mesh.primitives) {
    assert.equal(p.mode ?? 4, 4); assert(json.materials[p.material]); primitives++;
    const positions = accessor(p.attributes.POSITION), normals = accessor(p.attributes.NORMAL);
    assert.equal(normals.length, positions.length);
    for (const n of normals) { const len = Math.hypot(...n); assert(len > 0.9 && len < 1.1); }
    const indices = p.indices === undefined ? positions.map((_, i) => i) : accessor(p.indices).flat();
    assert.equal(indices.length % 3, 0); triangles += indices.length / 3;
    assert(indices.every((i) => Number.isInteger(i) && i >= 0 && i < positions.length));
    for (const pos of positions) pos.forEach((v, i) => { min[i] = Math.min(min[i], v); max[i] = Math.max(max[i], v); });
    const pa = json.accessors[p.attributes.POSITION];
    for (let i = 0; i < 3; i++) {
      const actualMin = Math.min(...positions.map((p) => p[i])), actualMax = Math.max(...positions.map((p) => p[i]));
      assert(Math.abs(pa.min[i] - actualMin) < 1e-5 && Math.abs(pa.max[i] - actualMax) < 1e-5);
    }
  }
  for (const node of json.nodes) {
    assert(!node.children || node.children.every((id) => json.nodes[id]));
    assert(!node.matrix); assert(!node.rotation || node.rotation.every((x, i) => Math.abs(x - (i === 3 ? 1 : 0)) < 1e-6));
    assert(!node.translation || node.translation.every((x) => Math.abs(x) < 1e-6));
    assert(!node.scale || node.scale.every((x) => Math.abs(x - 1) < 1e-6));
    assert(node.mesh === undefined || json.meshes[node.mesh]);
  }
  const dimensions = max.map((v, i) => v - min[i]);
  assert(dimensions[0] > 1.6 && dimensions[0] < 2.4);
  assert(dimensions[1] > 1.3 && dimensions[1] < 1.7);
  assert(dimensions[2] > 3.8 && dimensions[2] < 4.9);
  assert(Math.abs(min[1]) <= 0.01);
  assert(Math.abs(max[0] + min[0]) < 0.01 && Math.abs(max[2] + min[2]) < 0.04);
  assert(primitives <= 4 && json.materials.length <= 4 && triangles <= 15000);
  assert(json.materials.every((m) => (m.alphaMode ?? 'OPAQUE') === 'OPAQUE'));
  const convention = json.nodes.find((n) => n.extras?.exactness)?.extras;
  assert.equal(convention.exactness, 'VEHICLE_TYPE'); assert.equal(convention.forward, '+Z'); assert.equal(convention.up, '+Y');
  return { vehicleType: type, file, dimensionsMetres: { width: dimensions[0], height: dimensions[1], length: dimensions[2] },
    bounds: { min, max }, triangleCount: triangles, meshCount: json.meshes.length, materialCount: json.materials.length,
    primitiveCount: primitives, fileSize: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    structuralValidation: 'PASS', validator: 'LOCAL_STRUCTURAL_CHECKS_NOT_KHRONOS_VALIDATOR' };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(['SEDAN', 'HATCHBACK'].map(validate), null, 2));
}
