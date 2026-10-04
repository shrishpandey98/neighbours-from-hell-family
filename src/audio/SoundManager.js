// Web Audio API Synthesizer Sound System
// Provides playful mischievous slapstick BGM and reactive SFX without external dependencies

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.step = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Read mute setting
      const savedMute = localStorage.getItem('nfh_muted');
      if (savedMute === 'true') {
        this.setMuted(true);
      }
    } catch (e) {
      console.warn('Web Audio init failed:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    localStorage.setItem('nfh_muted', muted ? 'true' : 'false');
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- Sound Effects ---

  playClick() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playFootstep() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.04);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playPickup() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.13);
    });
  }

  playTamper() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    // Rattle / wrench sound
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.08;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320 + i * 90, start);
      osc.frequency.exponentialRampToValueAtTime(150, start + 0.07);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.08);
    }
  }

  playPrankSuccess() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    // Slapstick cartoon boing + triumph chords
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.2);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.26);

    // Fanfare chimes
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C major chord
    chord.forEach((freq, i) => {
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const start = t + 0.18 + i * 0.07;
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, start);
      gain2.gain.setValueAtTime(0.3, start);
      gain2.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(start);
      osc2.stop(start + 0.45);
    });
  }

  playDetectionWarning() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.12);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playCaught() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    // Comedic sad trombone: F, E, Eb, D (wah-wah-wah-waaah)
    const freqs = [349.23, 329.63, 311.13, 277.18];
    const times = [0, 0.2, 0.4, 0.65];
    const durs = [0.18, 0.18, 0.2, 0.6];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + times[idx];
      const dur = durs[idx];
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, start);
      if (idx === 3) {
        // wobble on the last note
        osc.frequency.linearRampToValueAtTime(f - 15, start + dur);
      }
      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  }

  playLevelComplete() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    // Grand cheerful victory arpeggio: C4, E4, G4, C5, E5, G5, C6!
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === notes.length - 1 ? 0.8 : 0.25));
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.9);
    });
  }

  // --- Background Mischievous Music Groove ---

  startBGM() {
    if (this.bgmPlaying) return;
    this.ensureContext();
    this.bgmPlaying = true;
    this.step = 0;
    this.scheduleBGMStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  scheduleBGMStep() {
    if (!this.bgmPlaying || !this.ctx) return;
    const bpm = 124;
    const stepDuration = 60 / bpm / 2; // 8th note duration (~0.24s)

    const t = this.ctx.currentTime;

    // Bassline pattern (C sneaky jazz walk: C2 -> Eb2 -> E2 -> G2 -> A2 -> Bb2 -> B2 -> C3)
    const bassNotes = [65.41, 77.78, 82.41, 98.00, 110.00, 116.54, 123.47, 130.81];
    const bassFreq = bassNotes[this.step % bassNotes.length];

    if (!this.isMuted) {
      // Bass synth
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, t);
      bassGain.gain.setValueAtTime(0.18, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + stepDuration * 0.9);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(t);
      bassOsc.stop(t + stepDuration);

      // Playful syncopated chord stabs on steps 2, 5, 6
      if (this.step % 8 === 2 || this.step % 8 === 5) {
        const chord = [261.63, 311.13, 392.00]; // Cm
        chord.forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f * 1.5, t);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          osc.connect(gain);
          gain.connect(this.bgmGain);
          osc.start(t);
          osc.stop(t + 0.13);
        });
      }

      // Sneaky hi-hat tick every step
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(this.step % 2 === 0 ? 1200 : 900, t);
      hatGain.gain.setValueAtTime(0.02, t);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      hatOsc.connect(hatGain);
      hatGain.connect(this.bgmGain);
      hatOsc.start(t);
      hatOsc.stop(t + 0.04);
    }

    this.step++;
    this.bgmTimer = setTimeout(() => {
      this.scheduleBGMStep();
    }, stepDuration * 1000);
  }
}

export const soundManager = new SoundManager();
