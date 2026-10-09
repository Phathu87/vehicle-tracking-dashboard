const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

async function main() {
  const packageRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
  const { chromium } = require(require.resolve('playwright', { paths: [packageRoot || process.cwd()] }));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const output = path.resolve(__dirname, '../docs/assets/portrait-qa-3-2e');
  fs.mkdirSync(output, { recursive: true });
  const results = [];
  try {
    const response = await fetch('http://127.0.0.1:3211/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `portrait-qa-${randomUUID()}`, password: randomUUID(), name: 'Portrait QA' }),
    });
    assert.equal(response.status, 201);
    const session = await response.json();
    const context = await browser.newContext();
    await context.addInitScript((token) => {
      sessionStorage.setItem('fleet-drive:token', token);
    }, session.token);
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(60_000);
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const width of [375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/app/drivers', ...['DRV-016', 'DRV-017', 'DRV-019', 'DRV-024'].map((id) => `/app/drivers/${id}`)]) {
        const portraitId = route === '/app/drivers' ? 'DRV-016' : route.split('/').pop();
        await page.goto(`http://127.0.0.1:5181${route}`, { waitUntil: 'domcontentloaded' });
        await page.locator(`img[src="/assets/drivers/${portraitId}.webp"]`).waitFor().catch(async (error) => {
          await page.screenshot({ path: path.join(output, 'failure.png') });
          console.error(JSON.stringify({ url: page.url(), text: (await page.locator('body').innerText()).slice(0, 1400), errors }));
          throw error;
        });
        await page.waitForFunction(() => [...document.querySelectorAll('img[src^="/assets/drivers/"]')]
          .every((image) => image.complete && image.naturalWidth === 512));
        const inspection = await page.evaluate(() => {
          const images = [...document.querySelectorAll('img[src^="/assets/drivers/"]')];
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            portraits: images.length,
            clippedCards: [...document.querySelectorAll('a[href^="/app/drivers/DRV-"]')]
              .filter((card) => { const rect = card.getBoundingClientRect(); return rect.left < 0 || rect.right > innerWidth; }).length,
            images: images.map((image) => {
              const rect = image.getBoundingClientRect();
              return { path: image.getAttribute('src'), width: rect.width, height: rect.height,
                objectFit: getComputedStyle(image).objectFit, alt: image.alt };
            }),
          };
        });
        assert.equal(inspection.overflow, false, `${route} overflow at ${width}`);
        assert.equal(inspection.clippedCards, 0, `${route} card clipping at ${width}`);
        if (route === '/app/drivers') {
          assert.equal(inspection.portraits, 19);
          for (const id of ['DRV-016', 'DRV-017', 'DRV-019', 'DRV-024']) {
            assert.ok(inspection.images.some((image) => image.path === `/assets/drivers/${id}.webp`));
          }
        }
        for (const image of inspection.images) {
          assert.equal(image.width, image.height);
          assert.equal(image.objectFit, 'cover');
          assert.equal(image.alt, '');
        }
        const view = route === '/app/drivers' ? 'list' : `detail-${portraitId}`;
        await page.screenshot({ path: path.join(output, `${view}-${width}.png`) });
        results.push({ route, width, ...inspection, status: 'PASS' });
      }
    }
    // Priority B still has genuinely unsupplied portraits.
    await page.goto('http://127.0.0.1:5181/app/drivers/DRV-018', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Unarine Netswera', exact: true }).waitFor();
    assert.equal(await page.locator('img[src^="/assets/drivers/"]').count(), 0);
    assert.ok(await page.locator('[aria-hidden="true"]').filter({ hasText: /^UN$/ }).count());
    results.push({ scenario: 'unsupplied portrait initials', status: 'PASS' });
    await page.route('**/assets/drivers/DRV-016.webp', (route) => route.abort());
    await page.goto('http://127.0.0.1:5181/app/drivers/DRV-016', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Sipho Sithole', exact: true }).waitFor();
    await page.locator('[aria-hidden="true"]').filter({ hasText: /^SS$/ }).waitFor();
    assert.equal(await page.locator('img[src="/assets/drivers/DRV-016.webp"]').count(), 0);
    results.push({ scenario: 'broken portrait initials and accessible adjacent name', status: 'PASS' });
    await page.unroute('**/assets/drivers/DRV-016.webp');
    for (const width of [375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:5181/app/dashboard', { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: 'Top Drivers' }).waitFor();
      await page.locator('img[src^="/assets/drivers/"]').first().waitFor();
      await page.waitForFunction(() => [...document.querySelectorAll('img[src^="/assets/drivers/"]')]
        .every((image) => image.complete && image.naturalWidth === 512));
      const valid = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth
        && [...document.querySelectorAll('img[src^="/assets/drivers/"]')].every((image) => {
          const rect = image.getBoundingClientRect();
          return rect.width === rect.height && getComputedStyle(image).objectFit === 'cover'
            && rect.left >= 0 && rect.right <= innerWidth && image.alt === '';
        }));
      assert.ok(valid, `Dashboard portrait layout at ${width}`);
      await page.getByRole('heading', { name: 'Top Drivers' }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `dashboard-${width}.png`) });
      results.push({ scenario: 'dashboard shared avatar', width, status: 'PASS' });
    }
    assert.deepEqual(errors, [], 'Browser runtime errors');
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2) + '\n');
    console.log(`PASS: ${results.length} responsive, fallback and dashboard scenarios; no browser runtime errors.`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
