const puppeteer = require('puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  // Exact phone resolution with address bar
  await page.setViewport({ width: 850, height: 340, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await sleep(400);

  // Click Play
  await page.click('#btn-play');
  await sleep(400);

  const isCreation = await page.$('.creation-screen');
  if (isCreation) {
    await page.click('#btn-confirm-player');
    await sleep(400);
  }

  const houseCards = await page.$$('.house-card');
  if (houseCards.length > 0) {
    await houseCards[0].click();
    await sleep(400);
  }

  const levelCards = await page.$$('.level-card');
  if (levelCards.length > 0) {
    await levelCards[0].click();
    await sleep(600);
  }

  await page.screenshot({ path: 'test_screenshots/mobile_landscape_gameplay_fixed.png' });
  await browser.close();
  console.log('Mobile landscape gameplay screenshot captured!');
})();
