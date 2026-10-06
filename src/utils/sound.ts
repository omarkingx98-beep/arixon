/**
 * Arixon Precision Audio Feedback Engine
 * Synthesizes subtle, luxury tactile feedback using Web Audio API
 * Zero external audio assets, zero latency, works offline
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arixon_sound_fx');
        // Default enabled for world-class interactive experience
        this.isEnabled = saved !== 'false';
      } catch (_) {
        this.isEnabled = true;
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public get enabled(): boolean {
    return this.isEnabled;
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    try {
      localStorage.setItem('arixon_sound_fx', this.isEnabled ? 'true' : 'false');
    } catch (_) {}
    if (this.isEnabled) {
      this.playChime();
    }
    return this.isEnabled;
  }

  /**
   * Tactile micro-click (like Apple / Leica dial)
   */
  public playClick(freq = 950, duration = 0.015) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (_) {}
  }

  /**
   * Smooth toggle sound
   */
  public playSwitch(isUp = true) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startFreq = isUp ? 420 : 680;
      const endFreq = isUp ? 840 : 360;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.04);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  /**
   * Luxury harmonic chime (like Apple Mac startup or Nike Studio save)
   */
  public playChime() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major triad chord

      chords.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.025, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.35 + idx * 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 0.4 + idx * 0.04);
      });
    } catch (_) {}
  }
}

export const sound = new SoundEngine();
