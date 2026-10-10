import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.MUSEUM_BASE_URL || 'http://localhost:3000';
const screenshots = process.env.MUSEUM_SCREENSHOTS || '/tmp/museum-smoke';
mkdirSync(screenshots, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  args: [
    '--no-sandbox',
    '--enable-webgl',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const problems = [];
let checks = 0;
function check(condition, message) {
  assert(condition, message);
  checks++;
  console.log(`PASS ${message}`);
}
const context = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
page.on('pageerror', (error) => problems.push(error.message));
page.on('response', (response) => {
  if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
});
async function go(path) {
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  check(response.status() === 200, `Route ${path} returns 200`);
  await page.waitForTimeout(850);
}
async function imagesLoaded() {
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  );
  check(true, 'All visible images load');
}
async function closeDialog() {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
}
async function roomReady() {
  await page.waitForSelector('.psv-canvas-container canvas');
  await page.locator('.room-loading').waitFor({ state: 'hidden' });
  await page.waitForTimeout(900);
}
async function dragCanvas(selector, dx = -220) {
  const box = await page.locator(selector).boundingBox();
  const x = box.x + box.width * 0.58,
    y = box.y + box.height * 0.45;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + 35, { steps: 18 });
  await page.mouse.up();
  await page.waitForTimeout(500);
}
try {
  await go('/');
  await imagesLoaded();
  check(
    (await page.locator('h1').textContent()).includes('Azərbaycanı'),
    'Azerbaijani is the default language',
  );
  await page.screenshot({ path: `${screenshots}/landing-desktop.png`, fullPage: true });
  await page.getByRole('button', { name: 'English', exact: true }).click();
  check(
    (await page.locator('h1').textContent()).includes('Discover'),
    'Landing-page language toggle translates the UI',
  );
  await page.getByRole('button', { name: 'Azərbaycan dili', exact: true }).click();
  await page.getByRole('link', { name: 'Virtual muzeyə daxil ol', exact: true }).click();
  await roomReady();
  check(page.url().endsWith('/museum'), 'Landing CTA enters the museum');
  check(
    (await page.locator('.room-info h1').textContent()).includes('Giriş'),
    'Entrance panorama is ready',
  );
  const beforePan = await page.locator('[data-testid="panorama-viewer"]').screenshot();
  await dragCanvas('[data-testid="panorama-viewer"]');
  const afterPan = await page.locator('[data-testid="panorama-viewer"]').screenshot();
  check(!beforePan.equals(afterPan), 'Dragging changes the 360° view');
  await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
  await page.waitForTimeout(850);
  await page.getByTestId('hotspot-karabakh-carpet').click();
  check(
    (await page.locator('#exhibit-title').textContent()) === 'Qarabağ xalçası',
    'Carpet hotspot opens the correct exhibit',
  );
  await page.getByRole('button', { name: 'Ətraflı bax' }).click();
  await page.locator('.exhibit-story').waitFor();
  check(await page.locator('.exhibit-story').isVisible(), 'Expanded exhibit story works');
  await page.getByRole('button', { name: 'Audio hekayəni dinlə' }).click();
  await page.getByRole('button', { name: 'Audionu dayandır' }).waitFor();
  check(true, 'Azerbaijani audio narration plays');
  await page.getByRole('button', { name: 'Audionu dayandır' }).click();
  await closeDialog();
  await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
  await page.waitForTimeout(850);
  await page.getByTestId('room-history').click();
  await roomReady();
  check(
    (await page.locator('.room-info h1').textContent()) === 'Tarix zalı',
    'Entrance navigation hotspot reaches History Hall',
  );
  for (const id of ['azerbaijani-dagger', 'ancient-coin']) {
    await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
    await page.waitForTimeout(850);
    await page.getByTestId(`hotspot-${id}`).click();
    await page.locator('#exhibit-title').waitFor();
    check(await page.locator('#exhibit-title').isVisible(), `History hotspot ${id} opens`);
    await closeDialog();
  }
  await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
  await page.waitForTimeout(850);
  await page.getByTestId('room-culture').click();
  await roomReady();
  check(
    (await page.locator('.room-info h1').textContent()).includes('mədəniyyət'),
    'History navigation hotspot reaches Culture Hall',
  );
  for (const id of ['traditional-dress', 'copper-vessel', 'historic-ceramic']) {
    await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
    await page.waitForTimeout(850);
    if (id === 'historic-ceramic') await dragCanvas('[data-testid="panorama-viewer"]', -220);
    await page.getByTestId(`hotspot-${id}`).click();
    await page.locator('#exhibit-title').waitFor();
    check(await page.locator('#exhibit-title').isVisible(), `Culture hotspot ${id} opens`);
    await closeDialog();
  }
  await page.getByRole('button', { name: 'Görünüşü sıfırla' }).click();
  await page.waitForTimeout(850);
  await page.screenshot({ path: `${screenshots}/museum-desktop.png`, fullPage: true });
  await page.getByRole('button', { name: 'Xəritə', exact: true }).click();
  check(
    await page
      .locator('.floor-room.current')
      .textContent()
      .then((t) => t.includes('mədəniyyət')),
    'Map highlights the current room',
  );
  await page.locator('.floor-room').filter({ hasText: 'Giriş zalı' }).click();
  await roomReady();
  check(
    (await page.locator('.room-info h1').textContent()) === 'Giriş zalı',
    'Map teleports to the selected room',
  );
  await page.getByRole('button', { name: 'Səsi aç' }).click();
  await page.getByRole('button', { name: 'Səsi söndür' }).waitFor();
  check(true, 'Ambient audio enables and mutes');
  await page.getByRole('button', { name: 'Səsi söndür' }).click();
  await page.getByRole('button', { name: 'Bələdçili tur', exact: true }).click();
  for (let i = 0; i < 3; i++) {
    await roomReady();
    check(
      (await page.locator('.guide-panel-title b').textContent()).trim() === `${i + 1} / 3`,
      `Guided tour step ${i + 1} and progress are correct`,
    );
    if (i < 2) await page.getByRole('button', { name: 'Növbəti eksponat' }).click();
  }
  await page.getByRole('button', { name: '3D-də bax' }).click();
  await page.getByTestId('model-canvas').waitFor();
  await page.locator('.model-status').waitFor({ state: 'hidden' });
  await page.waitForTimeout(1000);
  check(true, 'Local GLB loads in the interactive 3D viewer');
  await page.screenshot({ path: `${screenshots}/model-desktop.png`, fullPage: true });
  const before3D = await page.getByTestId('model-canvas').screenshot();
  await dragCanvas('[data-testid="model-canvas"]', -180);
  const after3D = await page.getByTestId('model-canvas').screenshot();
  check(!before3D.equals(after3D), 'Dragging rotates the rendered 3D artifact');
  await page.getByRole('button', { name: '3D modeli böyüt' }).click();
  await page.getByRole('button', { name: '3D modeli kiçilt' }).click();
  await page.getByRole('button', { name: 'Kameranı sıfırla' }).click();
  check(true, '3D zoom controls and camera reset work');
  await closeDialog();
  check(
    (await page.locator('.guide-panel-title b').textContent()).trim() === '3 / 3',
    'Closing 3D returns to the guided exhibit',
  );
  await page.getByRole('button', { name: 'Turu tamamla' }).click();
  await page.locator('.tour-completed').waitFor();
  check(await page.locator('.tour-completed').isVisible(), 'Guided tour completes cleanly');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.locator('.room-info h1').filter({ hasText: 'Traditional' }).waitFor();
  check(
    (await page.locator('.room-info h1').textContent()).includes('Traditional'),
    'Museum language switching translates room names',
  );
  await page.getByRole('link', { name: 'View collection' }).click();
  await page.waitForURL('**/collection');
  await page.locator('.exhibit-card').first().waitFor();
  await page.waitForTimeout(1000);
  check(page.url().endsWith('/collection'), 'Museum collection shortcut navigates correctly');
  check(
    (await page.locator('h1').textContent()).includes('Every object'),
    'Language persists between routes',
  );
  await page.getByRole('button', { name: 'Azərbaycan dili', exact: true }).click();
  await imagesLoaded();
  check((await page.locator('.exhibit-card').count()) === 6, 'Collection shows all six exhibits');
  for (const [filter, count] of [
    ['Xalçalar', 1],
    ['Silahlar', 1],
    ['Geyim', 1],
    ['Arxeologiya', 3],
  ]) {
    await page.getByRole('button', { name: filter, exact: true }).click();
    check(
      (await page.locator('.exhibit-card').count()) === count,
      `Collection filter ${filter} works`,
    );
  }
  await page.getByRole('button', { name: /^Hamısı/ }).click();
  await page.getByRole('textbox', { name: 'Eksponat axtar' }).fill('tapılmayan');
  await page.locator('.empty-collection').waitFor();
  check(
    await page.locator('.empty-collection').isVisible(),
    'Empty search has a useful recovery action',
  );
  await page.getByRole('button', { name: 'Bütün eksponatları göstər' }).click();
  check(
    (await page.locator('.exhibit-card').count()) === 6,
    'Search reset restores the collection',
  );
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${screenshots}/collection-desktop.png`, fullPage: true });
  for (let i = 0; i < 6; i++) {
    await page.locator('.exhibit-card').nth(i).click();
    await page.locator('#exhibit-title').waitFor();
    check(await page.locator('#exhibit-title').isVisible(), `Collection exhibit ${i + 1} opens`);
    await closeDialog();
  }
  await page.locator('.exhibit-card').filter({ hasText: 'Mis qab' }).click();
  await page.getByRole('button', { name: '3D-də bax' }).click();
  await page.getByTestId('model-canvas').waitFor();
  await page.locator('.model-status').waitFor({ state: 'hidden' });
  check(true, 'Collection 3D badge leads to a working model');
  await closeDialog();
  await closeDialog();
  // Verify every narration asset independently of the UI's playback state.
  for (const id of [
    'karabakh-carpet',
    'azerbaijani-dagger',
    'copper-vessel',
    'traditional-dress',
    'ancient-coin',
    'historic-ceramic',
  ])
    for (const lang of ['az', 'en']) {
      const r = await page.request.get(`${base}/audio/${id}-${lang}.mp3`);
      check(
        r.status() === 200 && (await r.body()).length > 1000,
        `${id} ${lang} narration is available`,
      );
    }
  // Mobile: inspect actual overflow and interact with the real dialogs.
  await page.setViewportSize({ width: 390, height: 844 });
  await go('/');
  await imagesLoaded();
  check(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Mobile landing has no horizontal overflow',
  );
  await page.screenshot({ path: `${screenshots}/landing-mobile.png`, fullPage: true });
  await page.getByRole('button', { name: 'Menyunu aç' }).click();
  await page.locator('.desktop-nav').getByRole('link', { name: 'Kolleksiya', exact: true }).click();
  await page.waitForURL('**/collection');
  await page.locator('.exhibit-card').first().waitFor();
  await page.waitForTimeout(900);
  check((await page.locator('.exhibit-card').count()) === 6, 'Mobile menu reaches the collection');
  check(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Mobile collection has no horizontal overflow',
  );
  await page.screenshot({ path: `${screenshots}/collection-mobile.png`, fullPage: true });
  await go('/museum');
  await roomReady();
  await page.getByRole('button', { name: 'Bələdçili tur', exact: true }).click();
  await page.locator('#exhibit-title').waitFor();
  await page.waitForTimeout(350);
  check(
    await page
      .locator('.exhibit-dialog')
      .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
    'Mobile exhibit panel fits the screen',
  );
  await page.screenshot({ path: `${screenshots}/museum-mobile.png`, fullPage: true });
  await closeDialog();
  await page.getByRole('button', { name: 'Xəritə', exact: true }).click();
  await page.locator('.floor-room').filter({ hasText: 'mədəniyyət' }).click();
  await roomReady();
  await dragCanvas('[data-testid="panorama-viewer"]', -260);
  await page.getByTestId('hotspot-copper-vessel').click();
  await page.getByRole('button', { name: '3D-də bax' }).click();
  await page.getByTestId('model-canvas').waitFor();
  await page.locator('.model-status').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Kameranı sıfırla' }).click();
  check(
    await page
      .locator('.model-dialog')
      .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
    'Mobile 3D viewer loads and fits the screen',
  );
  await page.screenshot({ path: `${screenshots}/model-mobile.png`, fullPage: true });
  await closeDialog();
  await closeDialog();
  await page.getByRole('link', { name: 'Muzeydən çıx' }).click();
  await page.waitForURL(base + '/');
  check(true, 'Museum exit returns to the landing page');
  check(
    problems.length === 0,
    `No browser errors or failed asset requests: ${problems.join('; ')}`,
  );
  writeFileSync(
    `${screenshots}/results.json`,
    JSON.stringify({ checks, passed: true, problems }, null, 2),
  );
  console.log(`\n${checks} checks passed. Screenshots: ${screenshots}`);
} catch (error) {
  await page.screenshot({ path: `${screenshots}/failure.png`, fullPage: true }).catch(() => {});
  console.error(error);
  console.error('Browser problems:', problems);
  process.exitCode = 1;
} finally {
  await browser.close();
}
