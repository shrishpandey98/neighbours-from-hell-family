// Application Entry Point: Orientation Guard, Audio Unlock, and Game Init

import { Game } from './engine/Game.js';
import { soundManager } from './audio/SoundManager.js';

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
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

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

  const canvas = document.getElementById('game-canvas');
  const uiLayer = document.getElementById('ui-layer');

  // Initialize Game Engine
  window.game = new Game(canvas, uiLayer);
});
