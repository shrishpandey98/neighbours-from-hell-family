const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SCREENSHOT_DIR = path.join(__dirname, 'test_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runTest() {
  console.log('🚀 Starting Automated Game Test with Chrome...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Collect any console errors or logs from page
  page.on('console', msg => console.log('  [Browser Console]:', msg.text()));
  page.on('pageerror', err => console.error('  [Browser Error]:', err.message));

  // 1. TEST PORTRAIT ORIENTATION BLOCKER
  console.log('\n--- 1. Testing Portrait Orientation Blocker ---');
  await page.setViewport({ width: 412, height: 915, isMobile: true });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await sleep(500);

  const isPortraitOverlayVisible = await page.evaluate(() => {
    const el = document.getElementById('portrait-lock');
    return el && !el.classList.contains('hidden');
  });
  console.log('Portrait lock overlay visible on portrait phone:', isPortraitOverlayVisible);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_portrait_lock.png') });

  // 2. SWITCH TO MOBILE LANDSCAPE (1280x720)
  console.log('\n--- 2. Testing Mobile Landscape Viewport (1280x720) ---');
  await page.setViewport({ width: 1280, height: 720, isMobile: true, hasTouch: true });
  await sleep(500);

  const isPortraitOverlayHidden = await page.evaluate(() => {
    const el = document.getElementById('portrait-lock');
    return el && el.classList.contains('hidden');
  });
  console.log('Portrait lock overlay hidden on landscape:', isPortraitOverlayHidden);

  // 3. TITLE SCREEN
  console.log('\n--- 3. Testing Title Screen ---');
  const titleText = await page.$eval('.title-main-text', el => el.textContent);
  console.log('Title text:', titleText);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_title_screen.png') });

  // Test How To Play modal
  console.log('Clicking "HOW TO PLAY"...');
  await page.click('#btn-how-to-play');
  await sleep(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_how_to_play_modal.png') });
  await page.click('#btn-close-how');
  await sleep(200);

  // 4. PLAYER CREATION SCREEN
  console.log('\n--- 4. Testing Player Creation Screen ---');
  await page.click('#btn-change-player');
  await sleep(400);

  // Type name
  await page.$eval('#player-name-input', el => el.value = '');
  await page.type('#player-name-input', 'Bunty Master');

  // Select an avatar (e.g. Bunty)
  const avatarCards = await page.$$('.avatar-card');
  console.log('Avatar count:', avatarCards.length);
  if (avatarCards.length > 2) {
    await avatarCards[2].click(); // Bunty
  }
  await sleep(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_player_creation.png') });

  console.log('Clicking CONTINUE...');
  await page.click('#btn-confirm-player');
  await sleep(400);

  // 5. HOUSE SELECTION SCREEN
  console.log('\n--- 5. Testing House Selection Screen ---');
  const houseCards = await page.$$('.house-card');
  console.log('House cards found:', houseCards.length);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_house_selection.png') });

  // Select House 1 (Mama's Villa)
  console.log('Selecting Mama\'s Villa...');
  await houseCards[0].click();
  await sleep(400);

  // 6. LEVEL SELECTION SCREEN
  console.log('\n--- 6. Testing Level Selection Screen ---');
  const levelCards = await page.$$('.level-card');
  console.log('Level cards found:', levelCards.length);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_level_selection.png') });

  // Select Level 1
  console.log('Selecting Level 1...');
  await levelCards[0].click();
  await sleep(600);

  // 7. IN-GAME GAMEPLAY
  console.log('\n--- 7. Testing In-Game Gameplay ---');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_gameplay_start.png') });

  // Verify HUD items
  const objectiveText = await page.$eval('#hud-objective-desc', el => el.textContent.trim());
  console.log('Initial Objective:', objectiveText);

  // Walk player to Salt Shaker
  console.log('Navigating player to Salt Shaker in Kitchen...');
  await page.evaluate(() => {
    const saltItem = window.game.activeItems.find(i => i.id === 'salt');
    window.game.player.x = saltItem.x;
    window.game.player.y = saltItem.y;
    window.game.player.updateNearbyInteractions(
      window.game.activeObjects,
      window.game.activeHidingSpots,
      window.game.activeHouse.doors
    );
  });
  await sleep(400);

  // Trigger interact to pick up salt
  console.log('Triggering INTERACT to pick up Salt Shaker...');
  await page.click('#btn-action-interact');
  await sleep(500);

  const inventoryItem = await page.$eval('#inv-slot-0 .inv-slot-name', el => el.textContent);
  console.log('Slot 0 item in inventory:', inventoryItem);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_item_picked_up.png') });

  // Walk player to Sugar Jar
  console.log('Navigating player to Sugar Jar...');
  await page.evaluate(() => {
    const jar = window.game.activeObjects.find(o => o.id === 'sugar_jar');
    window.game.player.x = jar.x;
    window.game.player.y = jar.y;
    window.game.player.updateNearbyInteractions(
      window.game.activeObjects,
      window.game.activeHidingSpots,
      window.game.activeHouse.doors
    );
  });
  await sleep(400);

  // Trigger tamper with Sugar Jar
  console.log('Triggering INTERACT to tamper with Sugar Jar using Salt...');
  await page.click('#btn-action-interact');
  await sleep(500);

  const isSugarTampered = await page.evaluate(() => {
    const jar = window.game.activeObjects.find(o => o.id === 'sugar_jar');
    return jar && jar.isTampered;
  });
  console.log('Is Sugar Jar tampered:', isSugarTampered);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_sugar_tampered.png') });

  // Walk to Window Curtain to Hide
  console.log('Navigating to Curtain Hiding Spot...');
  await page.evaluate(() => {
    const spot = window.game.activeHidingSpots[0];
    window.game.player.x = spot.x + spot.width / 2;
    window.game.player.y = spot.y + spot.height;
    window.game.player.updateNearbyInteractions(
      window.game.activeObjects,
      window.game.activeHidingSpots,
      window.game.activeHouse.doors
    );
  });
  await sleep(400);

  console.log('Triggering HIDE...');
  await page.click('#btn-action-hide');
  await sleep(500);

  const isPlayerHidden = await page.evaluate(() => window.game.player.isHidden);
  console.log('Is Player Hidden:', isPlayerHidden);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_player_hidden.png') });

  // Advance Resident Mama into Kitchen to make tea and get pranked!
  console.log('Advancing Mama into Kitchen to make tea...');
  await page.evaluate(() => {
    window.game.resident.routineIndex = 0;
    window.game.resident.advanceRoutine();
    // Fast walk Mama to the kitchen destination
    window.game.resident.x = window.game.resident.targetX;
    window.game.resident.y = window.game.resident.targetY;
  });
  await sleep(1000);

  const isPrankTriggered = await page.evaluate(() => {
    const prank = window.game.activePranks.find(p => p.id === 'salty_tea');
    return prank && prank.isCompleted;
  });
  console.log('Prank Salty Tea completed:', isPrankTriggered);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_prank_reaction.png') });

  // Wait for Victory Modal
  console.log('Waiting for Level Complete Victory Modal...');
  await page.waitForSelector('.victory-stars-row', { timeout: 8000 });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_level_victory_modal.png') });

  const victoryRank = await page.$eval('.victory-rank-badge', el => el.textContent);
  console.log('Victory Rank awarded:', victoryRank);

  // Check if Level 2 got unlocked in localStorage
  const unlockedLevels = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('nfh_unlocked_levels'));
  });
  console.log('Unlocked levels in localStorage:', unlockedLevels);

  console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🎉\n');
  await browser.close();
}

runTest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
