/**
 * Procedural Web Audio Sound Engine
 * Zero external mp3/audio files. Strictly opt-in (never autoplays).
 * Provides subtle analog harmonics, tactile micro-interaction clicks, and project chord drones.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isInitialized: boolean = false;

  private initContext() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch {
      // AudioContext not supported or blocked
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbientDrone();
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);
      this.playTick(520, 0.08);
    } else {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    }

    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.masterGain || this.ambientOsc1) return;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Warm sub-bass fundamental (55Hz / A1)
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Harmonic fifth (82.5Hz / E2) with slow phase detune
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'sine';
    this.ambientOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime);

    const oscGain1 = this.ctx.createGain();
    oscGain1.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.ambientOsc1.connect(oscGain1);
    oscGain1.connect(this.filter);

    const oscGain2 = this.ctx.createGain();
    oscGain2.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.ambientOsc2.connect(oscGain2);
    oscGain2.connect(this.filter);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
  }

  /**
   * Tactile click / tick for buttons, hover transitions, and ticket tabs
   */
  public playTick(freq: number = 440, duration: number = 0.04) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio play safe catch
    }
  }

  /**
   * Harmonic resonant chime when selecting a project
   */
  public playProjectChord(index: number = 0) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const baseFreqs = [220, 261.63, 293.66, 329.63, 392.0, 440.0];
      const root = baseFreqs[index % baseFreqs.length];
      const now = this.ctx.currentTime;

      [root, root * 1.5, root * 2.0].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.05 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i * 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch {
      // Audio play safe catch
    }
  }

  /**
   * Modulates ambient filter frequency slightly based on pointer speed
   */
  public modulateFilterBySpeed(speedNormalized: number) {
    if (this.isMuted || !this.ctx || !this.filter) return;
    try {
      const targetFreq = 220 + speedNormalized * 600;
      this.filter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    } catch {
      // Safe catch
    }
  }

  public dispose() {
    if (this.ambientOsc1) {
      try { this.ambientOsc1.stop(); } catch { /* noop */ }
    }
    if (this.ambientOsc2) {
      try { this.ambientOsc2.stop(); } catch { /* noop */ }
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.close(); } catch { /* noop */ }
    }
    this.isInitialized = false;
  }
}

export const soundEngine = new SoundEngine();
