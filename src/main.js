// Application Entry Point: Dynamic Viewport Scaling, Orientation Guard, Audio Unlock, and Game Init

import { Game } from './engine/Game.js';
import { soundManager } from './audio/SoundManager.js';

// Responsive 16:9 Viewport Stage Scaler with visualViewport support
export function resizeGameStage() {
  const container = document.getElementById('game-container');
  if (!container) return;

  // Use visualViewport if available for true visible viewport dimensions on mobile
  const vw = (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : window.innerWidth;
  const vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
  const targetAspect = 16 / 9;

  let stageW, stageH;
  if (vw / vh > targetAspect) {
    // Window is wider than 16:9 -> fit to height
    stageH = vh;
    stageW = vh * targetAspect;
  } else {
    // Window is taller than 16:9 -> fit to width
    stageW = vw;
    stageH = vw / targetAspect;
  }

  container.style.width = `${Math.floor(stageW)}px`;
  container.style.height = `${Math.floor(stageH)}px`;
  container.style.maxWidth = `${Math.floor(vw)}px`;
  container.style.maxHeight = `${Math.floor(vh)}px`;
}

// Orientation Detector for Mobile Landscape Only
export function checkOrientation() {
  const overlay = document.getElementById('portrait-lock');
  if (!overlay) return;

  // If user explicitly dismissed or forced landscape, don't block
  if (overlay.dataset.dismissed === 'true') {
    overlay.classList.add('hidden');
    resizeGameStage();
    return;
  }

  const vw = (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : window.innerWidth;
  const vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
  const isPortrait = vh > vw;

  if (isPortrait) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }

  resizeGameStage();
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
  setTimeout(checkOrientation, 150);
});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resizeGameStage);
  window.visualViewport.addEventListener('scroll', resizeGameStage);
}

// Fullscreen API Helper with orientation locking
export function toggleFullscreen() {
  const docEl = document.documentElement;
  const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

  if (!isFs) {
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (req) {
      req.call(docEl).catch(() => {});
    }
    // Attempt landscape screen lock when entering fullscreen if supported
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (exit) {
      exit.call(document).catch(() => {});
    }
  }

  setTimeout(resizeGameStage, 100);
  setTimeout(resizeGameStage, 300);
}

// Audio Context unlock on initial user touch/click
function unlockAudio() {
  soundManager.ensureContext();
  window.removeEventListener('pointerdown', unlockAudio);
  window.removeEventListener('keydown', unlockAudio);
}

window.addEventListener('pointerdown', unlockAudio, { passive: true });
window.addEventListener('keydown', unlockAudio, { passive: true });

// Prevent pull-to-refresh & double-tap zoom on iOS
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

window.addEventListener('DOMContentLoaded', () => {
  checkOrientation();
  resizeGameStage();

  // Wire up force landscape button on orientation blocker
  const forceBtn = document.getElementById('btn-force-landscape');
  if (forceBtn) {
    forceBtn.addEventListener('click', () => {
      const overlay = document.getElementById('portrait-lock');
      if (overlay) {
        overlay.dataset.dismissed = 'true';
        overlay.classList.add('hidden');
      }
      toggleFullscreen();
      resizeGameStage();
    });
  }

  const canvas = document.getElementById('game-canvas');
  const uiLayer = document.getElementById('ui-layer');

  // Initialize Game Engine
  window.game = new Game(canvas, uiLayer);
});
