// Isolated QA renderer. Serves only asset/tooling files and stops its server on exit.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { validate } from './validate-generic-vehicles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PLAYWRIGHT_PACKAGE_ROOT || root] }));
const qaDirectory = '3d-qa-3-4b-r';
const output = path.join(root, 'docs/assets', qaDirectory);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:100%;height:100%;background:#07111a;overflow:hidden}canvas{display:block}
</style><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body>
<script type="module">
import * as T from 'three'; import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;document.body.appendChild(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#07111a');
scene.add(new T.HemisphereLight(0xd9ecff,0x66707a,2.4));
for(const [pos,power] of [[[3,6,5],4],[[-4,3,-4],3]]){const l=new T.DirectionalLight(0xffffff,power);l.position.set(...pos);scene.add(l);}
let model=null;const cache=new Map();
window.renderModel=async(type,view)=>{
 if(model)scene.remove(model);if(!cache.has(type))cache.set(type,await new GLTFLoader().loadAsync('/models/'+type+'-generic.glb'));
 model=cache.get(type).scene;scene.add(model);model.updateMatrixWorld(true);
 const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3());
 const vectors={front:[-6,3,8],side:[-8,1.1,0],rear:[-6,3,-8],top:[0,10,0]};
 const camera=new T.OrthographicCamera(-4.5*innerWidth/innerHeight,4.5*innerWidth/innerHeight,4.5,-4.5,0.1,80);
 camera.position.copy(center).add(new T.Vector3(...vectors[view]));if(view==='top')camera.up.set(0,0,-1);camera.lookAt(center);
 camera.updateMatrixWorld();camera.updateProjectionMatrix();
 const corners=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])corners.push(new T.Vector3(x,y,z).project(camera));
 const extent=Math.max(...corners.flatMap(p=>[Math.abs(p.x),Math.abs(p.y)]));camera.zoom=0.86/extent;camera.updateProjectionMatrix();
 renderer.render(scene,camera);await new Promise(requestAnimationFrame);
 const c=document.createElement('canvas');c.width=innerWidth;c.height=innerHeight;const ctx=c.getContext('2d');ctx.drawImage(renderer.domElement,0,0);
 const data=ctx.getImageData(0,0,c.width,c.height).data;let count=0,minX=c.width,minY=c.height,maxX=0,maxY=0;
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4;
 if(Math.abs(data[i]-7)+Math.abs(data[i+1]-17)+Math.abs(data[i+2]-26)>35){count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
 return {type,view,nonBackgroundPixels:count,pixelBounds:{minX,minY,maxX,maxY},drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
 bounds:{min:box.min.toArray(),max:box.max.toArray()},width:innerWidth,height:innerHeight};
};window.qaReady=true;
</script></body></html>`;
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  if (pathname === '/') { res.setHeader('Content-Type', 'text/html'); res.end(html); return; }
  const base = pathname.startsWith('/three/') ? path.join(root, 'node_modules/three') : pathname.startsWith('/models/') ? path.join(root, 'public/assets/vehicles/models') : null;
  if (!base) { res.writeHead(404).end(); return; }
  const relative = pathname.slice(pathname.startsWith('/three/') ? 7 : 8);
  const file = path.resolve(base, relative);
  if (!file.startsWith(base + path.sep) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'model/gltf-binary');fs.createReadStream(file).pipe(res);
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.qaReady);
  fs.mkdirSync(output, { recursive: true });
  const results = [];
  for (const type of ['sedan', 'hatchback']) {
    const technical = validate(type.toUpperCase());
    for (const view of ['front', 'side', 'rear', 'top']) {
      const result = await page.evaluate(([t, v]) => window.renderModel(t, v), [type, view]);
      assert(result.nonBackgroundPixels > 15000 && result.nonBackgroundPixels < 850000);
      assert(result.pixelBounds.minX > 10 && result.pixelBounds.minY > 10 && result.pixelBounds.maxX < 1190 && result.pixelBounds.maxY < 790);
      assert.equal(result.drawCalls, 4); assert.equal(result.triangles, technical.triangleCount);
      const filename = `${type}-${view}.png`;
      await page.locator('canvas').screenshot({ path: path.join(output, filename) });
      results.push({ ...result, file: `docs/assets/${qaDirectory}/${filename}`, pixelCheck: 'PASS' });
    }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'render-evidence.json'), JSON.stringify({ renderer: 'Three.js r171 / headless Microsoft Edge',
    scope: 'ISOLATED_ASSET_QA_NOT_MAP_INTEGRATION', errors, results }, null, 2) + '\n');
  console.log(JSON.stringify({ views: results.length, errors, status: 'PASS', output: `docs/assets/${qaDirectory}` }));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
