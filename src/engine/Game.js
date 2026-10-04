import { AVATARS } from '../config/avatars.js';
import { HOUSES } from '../config/houses.js';
import { LEVELS } from '../config/levels.js';
import { storage } from './Storage.js';
import { soundManager } from '../audio/SoundManager.js';
import { InputManager } from './Input.js';
import { Renderer } from './Renderer.js';
import { Player } from '../entities/Player.js';
import { Resident, RESIDENT_STATE } from '../entities/Resident.js';
import { toggleFullscreen } from '../main.js';

export const GAME_SCREEN = {
  TITLE: 'TITLE',
  PLAYER_CREATION: 'PLAYER_CREATION',
  HOUSE_SELECT: 'HOUSE_SELECT',
  LEVEL_SELECT: 'LEVEL_SELECT',
  GAMEPLAY: 'GAMEPLAY'
};

export class Game {
  constructor(canvas, uiContainer) {
    this.canvas = canvas;
    this.ui = uiContainer;

    this.currentScreen = GAME_SCREEN.TITLE;
    this.activeHouse = HOUSES[0];
    this.activeLevel = LEVELS[0];

    // Profile
    const profile = storage.getPlayerProfile();
    this.player = new Player(profile.name, profile.avatarId);
    this.resident = null;

    // Level state
    this.levelTime = 0;
    this.levelScore = 0;
    this.timesCaught = 0;
    this.maxSuspicionReached = 0;
    this.activeObjects = [];
    this.activeHidingSpots = [];
    this.activePranks = [];
    this.activeItems = [];
    this.isPaused = false;
    this.levelFinished = false;

    // Renderer & Inputs
    this.renderer = null;
    this.input = null;

    this.lastTime = performance.now();
    this.init();
  }

  init() {
    this.setupScreen(GAME_SCREEN.TITLE);
    this.startLoop();
  }

  setupScreen(screen) {
    this.currentScreen = screen;
    this.ui.innerHTML = '';

    switch (screen) {
      case GAME_SCREEN.TITLE:
        this.renderTitleScreen();
        break;
      case GAME_SCREEN.PLAYER_CREATION:
        this.renderPlayerCreationScreen();
        break;
      case GAME_SCREEN.HOUSE_SELECT:
        this.renderHouseSelectScreen();
        break;
      case GAME_SCREEN.LEVEL_SELECT:
        this.renderLevelSelectScreen();
        break;
      case GAME_SCREEN.GAMEPLAY:
        this.startLevel(this.activeLevel.id);
        break;
    }
  }

  // =========================================================
  // SCREEN 1: TITLE SCREEN
  // =========================================================
  renderTitleScreen() {
    const profile = storage.getPlayerProfile();
    const avatar = AVATARS.find(a => a.id === profile.avatarId) || AVATARS[0];

    const div = document.createElement('div');
    div.className = 'title-screen-container';
    div.innerHTML = `
      <div class="title-backdrop-art"></div>

      <div class="title-header">
        <div class="title-sub-badge">🔥 SLAPSTICK COMEDY PUZZLE 🔥</div>
        <h1 class="title-main-text">NEIGHBOURS FROM HELL</h1>
        <h2 class="title-sub-text">FAMILY EDITION</h2>
      </div>

      <div class="title-center-scene">
        <div class="title-hero-preview">
          <div class="hero-avatar-bubble">
            ${avatar.svg}
          </div>
          <div class="hero-info-text">
            <div class="welcome-lbl">Welcome Back,</div>
            <div class="player-name-lbl">${profile.name}</div>
            <button class="btn-change-player" id="btn-change-player">Change Player 👤</button>
          </div>
        </div>
      </div>

      <div class="title-actions">
        <button class="btn-comic btn-yellow title-btn-play" id="btn-play">
          ▶ PLAY
        </button>
        <button class="btn-comic btn-blue" id="btn-how-to-play">
          ❓ HOW TO PLAY
        </button>
      </div>

      <div class="title-footer">
        <span>Landscape Mobile Edition • Harmless Family Pranks</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn-icon-round" id="btn-fullscreen-toggle" title="Toggle Fullscreen">⛶</button>
          <button class="btn-icon-round" id="btn-mute-toggle" title="Toggle Sound">
            ${soundManager.isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    `;

    this.ui.appendChild(div);

    div.querySelector('#btn-fullscreen-toggle').addEventListener('click', () => {
      soundManager.playClick();
      toggleFullscreen();
    });

    div.querySelector('#btn-play').addEventListener('click', () => {
      soundManager.playClick();
      soundManager.startBGM();
      if (!storage.hasCreatedPlayer()) {
        this.setupScreen(GAME_SCREEN.PLAYER_CREATION);
      } else {
        this.setupScreen(GAME_SCREEN.HOUSE_SELECT);
      }
    });

    div.querySelector('#btn-how-to-play').addEventListener('click', () => {
      soundManager.playClick();
      this.showHowToPlayModal();
    });

    div.querySelector('#btn-change-player').addEventListener('click', () => {
      soundManager.playClick();
      this.setupScreen(GAME_SCREEN.PLAYER_CREATION);
    });

    div.querySelector('#btn-mute-toggle').addEventListener('click', (e) => {
      const muted = soundManager.toggleMute();
      e.currentTarget.textContent = muted ? '🔇' : '🔊';
    });
  }

  showHowToPlayModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">HOW TO PLAY 📜</h2>
        <div class="modal-content">
          <p><strong>1. Explore & Observe:</strong> Watch the family resident's routine using the live TV Monitor in the corner.</p><br/>
          <p><strong>2. Pick Up Objects:</strong> Search rooms for prank items like salt, glue, chili powder, and whoopee cushions.</p><br/>
          <p><strong>3. Tamper & Trap:</strong> Sneak over to tea kettles, slippers, face creams, or phones and rig them!</p><br/>
          <p><strong>4. Don't Get Caught!</strong> Hide in wardrobes, behind curtains, or under tables if the resident approaches.</p><br/>
          <p><strong>5. Enjoy the Slapstick:</strong> Watch their hilarious reactions and earn stars!</p>
        </div>
        <div class="modal-actions">
          <button class="btn-comic btn-yellow" id="btn-close-how">GOT IT! 👍</button>
        </div>
      </div>
    `;
    this.ui.appendChild(modal);

    modal.querySelector('#btn-close-how').addEventListener('click', () => {
      soundManager.playClick();
      modal.remove();
    });
  }

  // =========================================================
  // SCREEN 2: PLAYER CREATION & AVATAR PICKER
  // =========================================================
  renderPlayerCreationScreen() {
    const profile = storage.getPlayerProfile();
    let currentName = profile.name || 'Chintu';
    let currentAvatarId = profile.avatarId || 'chintu';

    const div = document.createElement('div');
    div.className = 'creation-screen';
    div.innerHTML = `
      <div class="creation-header">
        <h1>WHO ARE YOU?</h1>
        <p>Pick your mischievous avatar and enter your name</p>
      </div>

      <div class="creation-body">
        <div class="name-input-panel">
          <div class="name-input-label">ENTER YOUR NAME:</div>
          <input type="text" id="player-name-input" class="name-input-box" maxlength="14" value="${currentName}" />
          <div class="selected-avatar-big-preview" id="selected-avatar-preview"></div>
          <div class="selected-avatar-title" id="selected-avatar-title"></div>
          <div class="selected-avatar-tagline" id="selected-avatar-tagline"></div>
        </div>

        <div class="avatars-grid-container">
          <div class="avatars-grid" id="avatars-grid"></div>
        </div>
      </div>

      <div class="creation-footer">
        <button class="btn-comic btn-blue" id="btn-back-title">◀ BACK</button>
        <button class="btn-comic btn-yellow" id="btn-confirm-player">CONTINUE ▶</button>
      </div>
    `;

    this.ui.appendChild(div);

    const grid = div.querySelector('#avatars-grid');
    const preview = div.querySelector('#selected-avatar-preview');
    const title = div.querySelector('#selected-avatar-title');
    const tagline = div.querySelector('#selected-avatar-tagline');
    const nameInput = div.querySelector('#player-name-input');

    const updateSelectedAvatar = (avId) => {
      currentAvatarId = avId;
      const av = AVATARS.find(a => a.id === avId) || AVATARS[0];
      preview.innerHTML = av.svg;
      title.textContent = `${av.name} — ${av.title}`;
      tagline.textContent = av.tagline;

      div.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.toggle('active', card.dataset.id === avId);
      });
    };

    AVATARS.forEach(av => {
      const card = document.createElement('div');
      card.className = `avatar-card ${av.id === currentAvatarId ? 'active' : ''}`;
      card.dataset.id = av.id;
      card.innerHTML = `
        <div class="avatar-card-icon">${av.svg}</div>
        <div class="avatar-card-name">${av.name}</div>
        <div class="avatar-card-trait">${av.title}</div>
      `;
      card.addEventListener('click', () => {
        soundManager.playClick();
        updateSelectedAvatar(av.id);
      });
      grid.appendChild(card);
    });

    updateSelectedAvatar(currentAvatarId);

    div.querySelector('#btn-back-title').addEventListener('click', () => {
      soundManager.playClick();
      this.setupScreen(GAME_SCREEN.TITLE);
    });

    div.querySelector('#btn-confirm-player').addEventListener('click', () => {
      soundManager.playClick();
      const enteredName = nameInput.value.trim() || 'Chintu';
      storage.savePlayerProfile(enteredName, currentAvatarId);
      this.player.name = enteredName;
      this.player.setAvatar(currentAvatarId);
      this.setupScreen(GAME_SCREEN.HOUSE_SELECT);
    });
  }

  // =========================================================
  // SCREEN 3: HOUSE SELECTION (5 HOUSES)
  // =========================================================
  renderHouseSelectScreen() {
    const div = document.createElement('div');
    div.className = 'house-select-screen';
    div.innerHTML = `
      <div class="house-select-header">
        <div class="house-select-title-group">
          <h1>WHOSE HOUSE ARE YOU INVADING?</h1>
          <p>Choose an unlocked family member to prank</p>
        </div>
        <button class="btn-comic btn-blue" id="btn-back-home">🏠 MENU</button>
      </div>

      <div class="houses-carousel" id="houses-carousel"></div>

      <div class="creation-footer">
        <button class="btn-comic btn-purple" id="btn-view-levels">ALL LEVELS (1 - 10) 🗺️</button>
        <span style="font-size: 13px; color: #94a3b8;">Select a house to view its missions</span>
      </div>
    `;

    this.ui.appendChild(div);

    const carousel = div.querySelector('#houses-carousel');

    HOUSES.forEach((house, index) => {
      // Mama's house (index 0) unlocked, others unlock with level progression
      const houseLevels = LEVELS.filter(l => l.houseId === house.id);
      const isUnlocked = index === 0 || houseLevels.some(l => storage.isLevelUnlocked(l.id));

      const card = document.createElement('div');
      card.className = `house-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="house-card-badge">HOUSE ${index + 1}</div>
        <div class="house-card-img-frame">${house.svgPreview}</div>
        <div class="house-card-name">${house.fullName}</div>
        <div class="house-card-gender">${house.gender} • ${house.title}</div>
        <div class="house-card-desc">${house.tagline}</div>
        <div class="house-card-levels-summary">
          <span>Levels: ${houseLevels[0].id} & ${houseLevels[1].id}</span>
          <span>${house.rooms.length} Rooms</span>
        </div>
        <button class="btn-comic ${isUnlocked ? 'btn-yellow' : 'btn-blue'} house-card-btn">
          ${isUnlocked ? 'ENTER HOUSE 🚪' : 'LOCKED 🔒'}
        </button>
        ${!isUnlocked ? `
          <div class="lock-overlay">
            <span>🔒</span>
            <p>Complete earlier levels to unlock!</p>
          </div>
        ` : ''}
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          soundManager.playClick();
          this.activeHouse = house;
          this.setupScreen(GAME_SCREEN.LEVEL_SELECT);
        });
      }

      carousel.appendChild(card);
    });

    div.querySelector('#btn-back-home').addEventListener('click', () => {
      soundManager.playClick();
      this.setupScreen(GAME_SCREEN.TITLE);
    });

    div.querySelector('#btn-view-levels').addEventListener('click', () => {
      soundManager.playClick();
      this.setupScreen(GAME_SCREEN.LEVEL_SELECT);
    });
  }

  // =========================================================
  // SCREEN 4: LEVEL SELECTION (10 LEVELS)
  // =========================================================
  renderLevelSelectScreen() {
    const div = document.createElement('div');
    div.className = 'level-select-screen';
    div.innerHTML = `
      <div class="level-select-header">
        <div class="house-select-title-group">
          <h1>SELECT A PRANK MISSION</h1>
          <p>10 fully playable family levels • Unlock stars & trophies</p>
        </div>
        <button class="btn-comic btn-blue" id="btn-back-houses">◀ HOUSES</button>
      </div>

      <div class="levels-grid" id="levels-grid"></div>

      <div class="creation-footer">
        <span style="font-size: 13px; color: #94a3b8;">★ = Complete with High Stealth & Speed</span>
        <button class="btn-comic btn-red" id="btn-settings-opt">⚙️ SETTINGS</button>
      </div>
    `;

    this.ui.appendChild(div);

    const grid = div.querySelector('#levels-grid');

    LEVELS.forEach(lvl => {
      const isUnlocked = storage.isLevelUnlocked(lvl.id);
      const stars = storage.getLevelStars(lvl.id);
      const score = storage.getLevelScore(lvl.id);
      const house = HOUSES.find(h => h.id === lvl.houseId);

      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="level-num-badge">${isUnlocked ? lvl.id : '🔒'}</div>
        <div class="level-card-title">${lvl.title}</div>
        <div class="level-card-house">${house.name}</div>
        <div class="level-card-stars">
          ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}
        </div>
        <div class="level-card-score">Score: ${score}</div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          soundManager.playClick();
          this.activeLevel = lvl;
          this.activeHouse = house;
          this.setupScreen(GAME_SCREEN.GAMEPLAY);
        });
      }

      grid.appendChild(card);
    });

    div.querySelector('#btn-back-houses').addEventListener('click', () => {
      soundManager.playClick();
      this.setupScreen(GAME_SCREEN.HOUSE_SELECT);
    });

    div.querySelector('#btn-settings-opt').addEventListener('click', () => {
      soundManager.playClick();
      this.showSettingsModal();
    });
  }

  showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">GAME SETTINGS ⚙️</h2>
        <div class="modal-content">
          <div class="settings-row">
            <span>Sound Effects & Music:</span>
            <button class="btn-comic btn-yellow" id="modal-mute-btn" style="padding: 6px 14px; font-size: 13px;">
              ${soundManager.isMuted ? 'UNMUTE 🔊' : 'MUTE 🔇'}
            </button>
          </div>
          <div class="settings-row">
            <span>Current Player:</span>
            <span style="color: #38bdf8;">${this.player.name} (${this.player.avatarConfig.name})</span>
          </div>
          <div class="settings-row">
            <span>Reset All Progress:</span>
            <button class="btn-comic btn-red" id="btn-reset-data" style="padding: 6px 14px; font-size: 13px;">
              RESET ⚠️
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-comic btn-blue" id="btn-close-settings">CLOSE</button>
        </div>
      </div>
    `;

    this.ui.appendChild(modal);

    modal.querySelector('#modal-mute-btn').addEventListener('click', (e) => {
      const muted = soundManager.toggleMute();
      e.currentTarget.textContent = muted ? 'UNMUTE 🔊' : 'MUTE 🔇';
    });

    modal.querySelector('#btn-reset-data').addEventListener('click', () => {
      if (confirm("Are you sure you want to reset all unlocked levels and high scores?")) {
        storage.resetProgress();
        soundManager.playClick();
        modal.remove();
        this.setupScreen(GAME_SCREEN.TITLE);
      }
    });

    modal.querySelector('#btn-close-settings').addEventListener('click', () => {
      soundManager.playClick();
      modal.remove();
    });
  }

  // =========================================================
  // SCREEN 5: GAMEPLAY ENGINE & HUD
  // =========================================================
  startLevel(levelId) {
    const lvl = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    this.activeLevel = lvl;
    this.activeHouse = HOUSES.find(h => h.id === lvl.houseId) || HOUSES[0];

    // Clone interactive objects & pranks so we don't mutate original config
    this.activeObjects = JSON.parse(JSON.stringify(lvl.interactiveObjects));
    this.activeHidingSpots = JSON.parse(JSON.stringify(lvl.hidingSpots));
    this.activePranks = JSON.parse(JSON.stringify(lvl.prankObjectives));
    this.activeItems = JSON.parse(JSON.stringify(lvl.items));

    this.levelTime = 0;
    this.levelScore = 0;
    this.timesCaught = 0;
    this.maxSuspicionReached = 0;
    this.isPaused = false;
    this.levelFinished = false;

    // Reset Player
    const startRoom = this.activeHouse.rooms[0];
    this.player.resetPosition(startRoom.x + 80, startRoom.y + startRoom.height - 20, startRoom);
    this.player.say("Time to cause some harmless mischief! 😈", 3);

    // Initialize Resident
    this.resident = new Resident(this.activeHouse.resident, this.activeHouse, lvl.residentRoutine);
    this.resident.reset();

    // Callbacks
    this.resident.onCaughtCallback = () => {
      this.handlePlayerCaught();
    };

    this.resident.onPrankTriggeredCallback = (prankId) => {
      return this.handlePrankTrigger(prankId);
    };

    // Render HUD
    this.renderGameplayHUD();
  }

  renderGameplayHUD() {
    this.ui.innerHTML = `
      <div class="gameplay-hud">
        <!-- Top HUD Bar -->
        <div class="hud-top-bar">
          <div class="hud-left-group">
            <div class="hud-level-badge">
              <div class="level-name-txt">Lv.${this.activeLevel.id}: ${this.activeLevel.title}</div>
              <div class="house-name-txt">${this.activeHouse.fullName}'s House</div>
            </div>
            
            <div class="hud-detection-meter">
              <span class="suspicion-icon" id="suspicion-icon">🟢</span>
              <div class="suspicion-bar-bg">
                <div class="suspicion-bar-fill" id="suspicion-bar"></div>
              </div>
              <span class="suspicion-text" id="suspicion-text">SAFE</span>
            </div>
          </div>

          <div class="hud-objective-panel">
            <div class="objective-header">MISSION OBJECTIVE</div>
            <div class="objective-text" id="hud-objective-desc">
              ${this.getCurrentObjectiveString()}
            </div>
            <div class="objective-steps" id="hud-objective-steps">
              Pranks: 0 / ${this.activePranks.length}
            </div>
          </div>

          <div class="hud-right-group">
            <div class="hud-score-card">
              <div class="hud-score-lbl">SCORE</div>
              <div class="hud-score-num" id="hud-score-val">0</div>
            </div>

            <!-- Resident Live CRT PiP Monitor -->
            <div class="resident-pip-monitor">
              <div class="pip-header">
                <span class="pip-live-indicator">LIVE</span>
                <span class="pip-room-name" id="pip-room-name">Living Room</span>
              </div>
              <div class="pip-screen">
                <canvas class="pip-canvas" id="pip-canvas" width="140" height="65"></canvas>
                <div class="pip-scanlines"></div>
              </div>
            </div>

            <button class="btn-icon-round" id="btn-pause-game">⏸️</button>
          </div>
        </div>

        <!-- Bottom HUD Bar: Joystick + Inventory + Actions -->
        <div class="hud-bottom-bar">
          <!-- Virtual Joystick Zone -->
          <div class="virtual-joystick-zone" id="joystick-zone">
            <div class="joystick-knob" id="joystick-knob"></div>
            <div class="joystick-hint">TOUCH TO MOVE</div>
          </div>

          <!-- Inventory Hotbar Tray -->
          <div class="hud-inventory-tray" id="inventory-tray">
            ${[0, 1, 2, 3].map(i => `
              <div class="inv-slot" data-index="${i}" id="inv-slot-${i}">
                <span class="inv-slot-icon"></span>
                <span class="inv-slot-name"></span>
              </div>
            `).join('')}
          </div>

          <!-- Contextual Action Buttons -->
          <div class="hud-action-buttons">
            <button class="btn-action-big btn-action-interact" id="btn-action-interact">
              <span>👉</span> INTERACT
            </button>
            <button class="btn-action-big btn-action-hide" id="btn-action-hide">
              <span>🤫</span> HIDE
            </button>
          </div>
        </div>
      </div>
    `;

    // Initialize Renderer with Canvas + PiP Canvas
    const pipCanvas = document.getElementById('pip-canvas');
    this.renderer = new Renderer(this.canvas, pipCanvas);

    // Initialize Hybrid Input Controller
    const joystickZone = document.getElementById('joystick-zone');
    const joystickKnob = document.getElementById('joystick-knob');
    this.input = new InputManager(this.canvas, joystickZone, joystickKnob);

    // Tap on Canvas -> Tap to move or tap to interact
    this.input.onTapWorld = (x, y) => {
      this.handleWorldTap(x, y);
    };

    this.input.onActionCallback = (type) => {
      if (type === 'interact') this.performInteractAction();
      if (type === 'hide') this.performHideAction();
    };

    // Action button listeners
    document.getElementById('btn-action-interact').addEventListener('click', () => {
      this.performInteractAction();
    });

    document.getElementById('btn-action-hide').addEventListener('click', () => {
      this.performHideAction();
    });

    // Inventory slot selection
    document.querySelectorAll('.inv-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        soundManager.playClick();
        const idx = parseInt(slot.dataset.index, 10);
        this.player.selectedItemIndex = idx;
        this.updateInventoryUI();
      });
    });

    // Pause button
    document.getElementById('btn-pause-game').addEventListener('click', () => {
      soundManager.playClick();
      this.showPauseModal();
    });
  }

  getCurrentObjectiveString() {
    const remaining = this.activePranks.find(p => !p.isCompleted);
    if (remaining) {
      return `Target: ${remaining.title}`;
    }
    return 'All pranks executed! Escape to the exit door!';
  }

  handleWorldTap(worldX, worldY) {
    // 1. Check if user tapped directly on an interactive item/object
    for (const item of this.activeItems) {
      if (!item.pickedUp && Math.hypot(item.x - worldX, item.y - worldY) < 40) {
        this.input.setTargetPosition(item.x, item.y);
        return;
      }
    }
    for (const obj of this.activeObjects) {
      if (Math.hypot(obj.x - worldX, obj.y - worldY) < 45) {
        this.input.setTargetPosition(obj.x, obj.y);
        return;
      }
    }
    // 2. Check if user tapped on hiding spot
    for (const spot of this.activeHidingSpots) {
      const cx = spot.x + spot.width / 2;
      const cy = spot.y + spot.height / 2;
      if (Math.hypot(cx - worldX, cy - worldY) < 45) {
        this.input.setTargetPosition(cx, spot.y + spot.height - 10);
        return;
      }
    }
    // 3. Otherwise normal walk destination
    this.input.setTargetPosition(worldX, worldY);
  }

  performInteractAction() {
    // 1. Pick up nearby item if available
    const nearbyItem = this.activeItems.find(i => !i.pickedUp && Math.hypot(i.x - this.player.x, i.y - this.player.y) < 65);
    if (nearbyItem) {
      const added = this.player.addItem(nearbyItem);
      if (added) {
        nearbyItem.pickedUp = true;
        this.renderer.addParticle(nearbyItem.x, nearbyItem.y, 'star');
        this.updateInventoryUI();
        this.updateHUDObjectives();
      }
      return;
    }

    // 2. Tamper with nearby interactive object
    if (this.player.nearbyObject) {
      const obj = this.player.nearbyObject;
      if (obj.isTampered) {
        this.player.say(`Already tampered with ${obj.name}! 😈`, 2);
        return;
      }

      // Check if player holds the required item
      if (this.player.hasItem(obj.requiredItem)) {
        obj.isTampered = true;
        this.player.removeItem(obj.requiredItem);
        soundManager.playTamper();
        this.renderer.addParticle(obj.x, obj.y, 'laugh');
        this.player.say(`Rigged the ${obj.name}! Now hide! 🤫`, 2.5);
        this.updateInventoryUI();
        this.updateHUDObjectives();
      } else {
        const itemNeeded = this.activeItems.find(i => i.id === obj.requiredItem);
        const nameNeeded = itemNeeded ? itemNeeded.name : 'required item';
        this.player.say(`I need the ${nameNeeded} to prank this!`, 2.5);
      }
      return;
    }

    // 3. Door interaction
    if (this.player.nearbyDoor) {
      const door = this.player.nearbyDoor;
      if (door.toX !== undefined && door.toY !== undefined) {
        this.player.x = door.toX;
        this.player.y = door.toY;
        soundManager.playFootstep();
      }
    }
  }

  performHideAction() {
    if (this.player.isHidden) {
      this.player.exitHiding();
    } else if (this.player.nearbyHidingSpot) {
      this.player.enterHiding(this.player.nearbyHidingSpot);
    } else {
      this.player.say("No hiding spot nearby!", 1.5);
    }
    this.updateHUDObjectives();
  }

  handlePrankTrigger(prankId) {
    const prank = this.activePranks.find(p => p.id === prankId);
    if (!prank || prank.isCompleted) return false;

    // Check if target object was tampered
    const targetObj = this.activeObjects.find(o => o.id === prank.targetObject);
    if (targetObj && targetObj.isTampered) {
      prank.isCompleted = true;
      this.resident.triggerPrankReaction(prank);

      // Score points!
      this.levelScore += prank.points;
      for (let i = 0; i < 8; i++) {
        this.renderer.addParticle(this.resident.x, this.resident.y - 40, 'star');
      }

      this.updateHUDObjectives();

      // Check if all pranks completed
      const allDone = this.activePranks.every(p => p.isCompleted);
      if (allDone) {
        setTimeout(() => {
          this.handleLevelVictory();
        }, 3500);
      }
      return true;
    }
    return false;
  }

  handlePlayerCaught() {
    this.timesCaught++;
    this.levelScore = Math.max(0, this.levelScore - 300);

    const caughtModal = document.createElement('div');
    caughtModal.className = 'modal-backdrop';
    caughtModal.innerHTML = `
      <div class="modal-card">
        <div class="caught-icon-anim">🚨</div>
        <h2 class="modal-title" style="color: #ef4444;">CAUGHT RED-HANDED!</h2>
        <div class="caught-dialogue-bubble">
          ${this.activeHouse.resident.gender === 'male' ? "“AYE! TUM YAHAAN KYA KAR RAHE HO?!”" : "“PAKDE GAYE! 😂 HATO YAHAAN SE!”"}
        </div>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          ${this.activeHouse.fullName} spotted you sneaking around!
        </p>
        <div class="modal-actions">
          <button class="btn-comic btn-yellow" id="btn-retry-level">TRY AGAIN 🔄</button>
          <button class="btn-comic btn-blue" id="btn-exit-level">EXIT LEVEL 🚪</button>
        </div>
      </div>
    `;

    this.ui.appendChild(caughtModal);

    caughtModal.querySelector('#btn-retry-level').addEventListener('click', () => {
      soundManager.playClick();
      caughtModal.remove();
      this.startLevel(this.activeLevel.id);
    });

    caughtModal.querySelector('#btn-exit-level').addEventListener('click', () => {
      soundManager.playClick();
      caughtModal.remove();
      this.setupScreen(GAME_SCREEN.LEVEL_SELECT);
    });
  }

  handleLevelVictory() {
    if (this.levelFinished) return;
    this.levelFinished = true;

    soundManager.playLevelComplete();

    // Calculate bonuses
    let timeBonus = 0;
    if (this.levelTime < this.activeLevel.timeBonusThreshold) {
      timeBonus = 300;
    }
    let stealthBonus = 0;
    if (this.timesCaught === 0 && this.maxSuspicionReached < 50) {
      stealthBonus = 400;
    }

    const finalScore = this.levelScore + timeBonus + stealthBonus;

    // Stars calculation
    let stars = 1;
    if (finalScore >= this.activeLevel.targetScore) stars = 2;
    if (finalScore >= this.activeLevel.targetScore + 300 && this.timesCaught === 0) stars = 3;

    // Rank title
    let rank = 'AMATEUR PRANKSTER';
    if (stars === 2) rank = 'FAMILY MENACE';
    if (stars === 3 && finalScore >= 2500) rank = 'LEGENDARY NEIGHBOUR';
    else if (stars === 3) rank = 'MASTER OF MISCHIEF';

    // Save progression
    storage.saveLevelProgress(this.activeLevel.id, finalScore, stars);

    const victoryModal = document.createElement('div');
    victoryModal.className = 'modal-backdrop';
    victoryModal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">PRANK SUCCESS! 🎉</h2>
        <div class="victory-stars-row">
          ${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}
        </div>
        <div class="victory-rank-badge">${rank}</div>

        <div class="score-stats-grid">
          <div class="stat-item">
            <span class="stat-lbl">FINAL SCORE</span>
            <span class="stat-val" style="color: #facc15;">${finalScore}</span>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">COMPLETION TIME</span>
            <span class="stat-val">${Math.floor(this.levelTime)}s</span>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">TIMES CAUGHT</span>
            <span class="stat-val">${this.timesCaught}</span>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">PRANKS EXECUTED</span>
            <span class="stat-val">${this.activePranks.length} / ${this.activePranks.length}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-comic btn-blue" id="btn-replay-level">REPLAY 🔄</button>
          ${this.activeLevel.id < 10 ? `
            <button class="btn-comic btn-yellow" id="btn-next-level">NEXT LEVEL ▶</button>
          ` : `
            <button class="btn-comic btn-green" id="btn-all-done">ALL LEVELS BEATEN! 🏆</button>
          `}
        </div>
      </div>
    `;

    this.ui.appendChild(victoryModal);

    victoryModal.querySelector('#btn-replay-level').addEventListener('click', () => {
      soundManager.playClick();
      victoryModal.remove();
      this.startLevel(this.activeLevel.id);
    });

    const nextBtn = victoryModal.querySelector('#btn-next-level');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        soundManager.playClick();
        victoryModal.remove();
        this.startLevel(this.activeLevel.id + 1);
      });
    }

    const allDoneBtn = victoryModal.querySelector('#btn-all-done');
    if (allDoneBtn) {
      allDoneBtn.addEventListener('click', () => {
        soundManager.playClick();
        victoryModal.remove();
        this.setupScreen(GAME_SCREEN.LEVEL_SELECT);
      });
    }
  }

  showPauseModal() {
    this.isPaused = true;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">GAME PAUSED ⏸️</h2>
        <div class="modal-content">
          <p><strong>Mission:</strong> ${this.activeLevel.title}</p>
          <p><strong>House:</strong> ${this.activeHouse.fullName}</p>
          <p><strong>Time Elapsed:</strong> ${Math.floor(this.levelTime)}s</p>
          <div class="settings-row" style="margin-top: 14px;">
            <span>Sound Mute:</span>
            <button class="btn-comic btn-yellow" id="pause-mute-btn" style="padding: 6px 14px; font-size: 13px;">
              ${soundManager.isMuted ? 'UNMUTE 🔊' : 'MUTE 🔇'}
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-comic btn-yellow" id="btn-resume-game">RESUME ▶</button>
          <button class="btn-comic btn-blue" id="btn-exit-to-levels">EXIT LEVEL 🚪</button>
        </div>
      </div>
    `;

    this.ui.appendChild(modal);

    modal.querySelector('#pause-mute-btn').addEventListener('click', (e) => {
      const muted = soundManager.toggleMute();
      e.currentTarget.textContent = muted ? 'UNMUTE 🔊' : 'MUTE 🔇';
    });

    modal.querySelector('#btn-resume-game').addEventListener('click', () => {
      soundManager.playClick();
      modal.remove();
      this.isPaused = false;
    });

    modal.querySelector('#btn-exit-to-levels').addEventListener('click', () => {
      soundManager.playClick();
      modal.remove();
      this.setupScreen(GAME_SCREEN.LEVEL_SELECT);
    });
  }

  updateInventoryUI() {
    const slots = document.querySelectorAll('.inv-slot');
    slots.forEach((slot, idx) => {
      const item = this.player.inventory[idx];
      const iconEl = slot.querySelector('.inv-slot-icon');
      const nameEl = slot.querySelector('.inv-slot-name');

      if (item) {
        slot.classList.add('occupied');
        iconEl.textContent = item.icon;
        nameEl.textContent = item.name;
      } else {
        slot.classList.remove('occupied');
        iconEl.textContent = '';
        nameEl.textContent = '';
      }

      slot.classList.toggle('selected', this.player.selectedItemIndex === idx);
    });
  }

  updateHUDObjectives() {
    const descEl = document.getElementById('hud-objective-desc');
    const stepsEl = document.getElementById('hud-objective-steps');
    const scoreEl = document.getElementById('hud-score-val');
    const hideBtn = document.getElementById('btn-action-hide');

    if (descEl) descEl.textContent = this.getCurrentObjectiveString();
    if (stepsEl) {
      const doneCount = this.activePranks.filter(p => p.isCompleted).length;
      stepsEl.textContent = `Pranks: ${doneCount} / ${this.activePranks.length}`;
    }
    if (scoreEl) scoreEl.textContent = this.levelScore;

    if (hideBtn) {
      if (this.player.isHidden) {
        hideBtn.innerHTML = `<span>🚪</span> STEP OUT`;
      } else {
        hideBtn.innerHTML = `<span>🤫</span> HIDE`;
      }
    }
  }

  updateSuspicionUI() {
    if (!this.resident) return;
    const susp = this.resident.suspicion;
    const bar = document.getElementById('suspicion-bar');
    const icon = document.getElementById('suspicion-icon');
    const txt = document.getElementById('suspicion-text');

    if (susp > this.maxSuspicionReached) {
      this.maxSuspicionReached = susp;
    }

    if (bar) bar.style.width = `${susp}%`;
    if (icon && txt) {
      if (this.player.isHidden) {
        icon.textContent = '🟢';
        txt.textContent = 'HIDDEN';
        txt.style.color = '#4ade80';
      } else if (susp > 70) {
        icon.textContent = '🔴';
        txt.textContent = 'DETECTED!';
        txt.style.color = '#ef4444';
      } else if (susp > 30) {
        icon.textContent = '🟡';
        txt.textContent = 'SUSPICIOUS';
        txt.style.color = '#facc15';
      } else {
        icon.textContent = '🟢';
        txt.textContent = 'SAFE';
        txt.style.color = '#4ade80';
      }
    }

    // Update PiP Room Name
    const pipRoom = document.getElementById('pip-room-name');
    if (pipRoom && this.resident.currentRoom) {
      pipRoom.textContent = this.resident.currentRoom.name;
    }
  }

  // =========================================================
  // MAIN GAME LOOP (60 FPS)
  // =========================================================
  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      if (this.currentScreen === GAME_SCREEN.GAMEPLAY && !this.isPaused && !this.levelFinished) {
        this.levelTime += dt;

        // Update Player Movement & Bounds
        this.player.update(
          dt,
          this.input,
          this.activeHouse.rooms,
          this.activeHouse.doors,
          this.activeObjects,
          this.activeHidingSpots
        );

        // Update Resident AI & Vision
        this.resident.update(
          dt,
          this.player,
          this.activeHouse.rooms,
          this.activeHouse.doors,
          this.activeObjects
        );

        // Update UI Meters
        this.updateSuspicionUI();

        // Render Canvas
        if (this.renderer) {
          this.renderer.render(
            this.activeHouse,
            this.activeLevel,
            this.player,
            this.resident,
            this.activeObjects,
            this.activeHidingSpots,
            dt
          );
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
