// Application Entry Point: Dynamic Viewport Scaling, Orientation Guard, Audio Unlock, and Game Init

import { Game } from './engine/Game.js';
import { soundManager } from './audio/SoundManager.js';

// Responsive 16:9 Viewport Stage Scaler
function resizeGameStage() {
  const container = document.getElementById('game-container');
  if (!container) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
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
}

// Orientation Detector for Mobile Landscape Only
function checkOrientation() {
  const overlay = document.getElementById('portrait-lock');
  if (!overlay) return;

  const isPortrait = window.innerHeight > window.innerWidth;
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

// Fullscreen API Helper
export function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
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

  const canvas = document.getElementById('game-canvas');
  const uiLayer = document.getElementById('ui-layer');

  // Initialize Game Engine
  window.game = new Game(canvas, uiLayer);
});
