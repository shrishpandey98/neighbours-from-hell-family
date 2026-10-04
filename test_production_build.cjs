const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runProductionBuildTest() {
  console.log('🚀 Testing Production Build Served from http://localhost:4173/ ...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Load production build
  await page.setViewport({ width: 1280, height: 720, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await sleep(600);

  // 2. Check title screen
  const title = await page.$eval('.title-main-text', el => el.textContent.trim());
  console.log('✓ Production Title:', title);

  // 3. Click Play -> If Player Creation screen, continue; otherwise House Select
  await page.click('#btn-play');
  await sleep(400);

  const isCreationScreen = await page.$('.creation-screen');
  if (isCreationScreen) {
    console.log('✓ Player Creation Screen loaded on first run');
    await page.click('#btn-confirm-player');
    await sleep(400);
  }

  const houseHeader = await page.$eval('.house-select-title-group h1', el => el.textContent.trim());
  console.log('✓ House Selection Screen loaded:', houseHeader);

  // 4. Click House 1
  const houseCards = await page.$$('.house-card');
  await houseCards[0].click();
  await sleep(400);

  // 5. Click Level 1
  const levelCards = await page.$$('.level-card');
  await levelCards[0].click();
  await sleep(600);

  // 6. Verify Gameplay HUD & Canvas
  const objective = await page.$eval('#hud-objective-desc', el => el.textContent.trim());
  console.log('✓ In-Game Objective:', objective);

  const canvasWidth = await page.$eval('#game-canvas', el => el.width);
  const canvasHeight = await page.$eval('#game-canvas', el => el.height);
  console.log(`✓ Game Canvas size: ${canvasWidth}x${canvasHeight}`);

  // 7. Check Console Errors
  if (consoleErrors.length > 0) {
    console.error('❌ Console errors detected in production build:', consoleErrors);
    process.exit(1);
  } else {
    console.log('✓ Zero console errors in production build!');
  }

  console.log('\n🎉 PRODUCTION BUILD VALIDATION PASSED SUCCESSFULLY! 🎉\n');
  await browser.close();
}

runProductionBuildTest().catch(err => {
  console.error('Production build test failed:', err);
  process.exit(1);
});
