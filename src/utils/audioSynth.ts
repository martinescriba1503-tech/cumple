/**
 * Web Audio API synthesizer that generates a gentle, romantic piano/music box melody.
 * Zero external audio files required, zero CORS errors, 100% reliable across browsers.
 * Also supports loading an external audio file if placed in public/music.mp3.
 */

class RomanticAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private isPlayingAudio = false;
  private timerId: number | null = null;
  private externalAudio: HTMLAudioElement | null = null;
  private useExternal = false;
  private onStateChangeCallbacks: Array<(playing: boolean) => void> = [];

  constructor() {
    // Try to preload optional external audio if present
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio('/music.mp3');
        audio.loop = true;
        audio.preload = 'none';
        this.externalAudio = audio;
      } catch {
        // Fallback to synth
      }
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((c) => c !== cb);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isPlayingAudio));
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlayingAudio) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  public async start(): Promise<void> {
    if (this.isPlayingAudio) return;

    // Check if external audio exists and works
    if (this.externalAudio && !this.useExternal) {
      try {
        await this.externalAudio.play();
        this.useExternal = true;
        this.isPlayingAudio = true;
        this.notify();
        return;
      } catch {
        // External audio not available or blocked, fall through to Web Audio synth
        this.useExternal = false;
      }
    }

    // Initialize Web Audio API
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.isPlayingAudio = true;
      this.notify();
      this.playSynthMelody();
    } catch (e) {
      console.warn('Audio playback not supported or interaction required:', e);
    }
  }

  public stop(): void {
    this.isPlayingAudio = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.externalAudio && this.useExternal) {
      this.externalAudio.pause();
      this.externalAudio.currentTime = 0;
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend().catch(() => {});
    }
    this.notify();
  }

  /**
   * Generates a warm, romantic piano / music-box note using multiple harmonics,
   * gentle low-pass filter, and soft exponential envelope release.
   */
  private playNote(freq: number, duration: number, gainValue = 0.12): void {
    if (!this.audioCtx || this.audioCtx.state !== 'running' || !this.isPlayingAudio) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Master envelope gain for the note
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    // Soft attack
    gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.04);
    // Exponential decay & release
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Warm Low-pass filter to sound like an acoustic felt piano
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.2, now);

    // Fundamental oscillator (sine with warm triangle tone)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Sub-harmonic warm tone (sine)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 0.5, now);

    // Overtone sparkle (music box shimmer)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.3, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.15, now);

    osc1.connect(filter);
    osc2.connect(subGain);
    subGain.connect(filter);
    osc3.connect(overtoneGain);
    overtoneGain.connect(filter);

    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  }

  /**
   * Romantic arpeggio sequence in F Major / D Minor (sweet, warm, emotive melody)
   * Pattern: F - C - A - E - G - A - F ...
   */
  private playSynthMelody(): void {
    if (!this.isPlayingAudio) return;

    // Frequencies (Hz)
    const C4 = 261.63;
    const D4 = 293.66;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const Bb4 = 466.16;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;

    // Romantic ballad phrase (melody notes + bass harmony)
    const sequence: Array<{ note: number; bass?: number; dur: number; delay: number }> = [
      // Measure 1: F Major
      { note: C5, bass: F4, dur: 2.2, delay: 0 },
      { note: A4, dur: 1.4, delay: 650 },
      { note: F4, dur: 1.4, delay: 1300 },
      { note: C5, dur: 1.8, delay: 1950 },
      { note: E5, dur: 2.2, delay: 2600 },
      { note: D5, dur: 1.8, delay: 3400 },

      // Measure 2: D minor / Bb
      { note: C5, bass: D4, dur: 2.0, delay: 4200 },
      { note: A4, dur: 1.5, delay: 4850 },
      { note: Bb4, dur: 1.6, delay: 5500 },
      { note: C5, dur: 2.2, delay: 6150 },
      { note: D5, bass: Bb4, dur: 2.5, delay: 6900 },
      { note: F5, dur: 2.8, delay: 7700 },

      // Measure 3: C Major resolution
      { note: E5, bass: C4, dur: 2.4, delay: 8600 },
      { note: C5, dur: 1.6, delay: 9350 },
      { note: G4, dur: 1.6, delay: 10000 },
      { note: A4, dur: 1.8, delay: 10650 },
      { note: Bb4, dur: 1.8, delay: 11300 },
      { note: A4, bass: F4, dur: 3.5, delay: 12100 },
      { note: F4, dur: 2.5, delay: 13000 },
    ];

    sequence.forEach(({ note, bass, dur, delay }) => {
      window.setTimeout(() => {
        if (!this.isPlayingAudio) return;
        this.playNote(note, dur, 0.12);
        if (bass) {
          this.playNote(bass * 0.5, dur * 1.2, 0.08); // warm soft bass
        }
      }, delay);
    });

    // Repeat loop every 14.5 seconds
    this.timerId = window.setTimeout(() => {
      if (this.isPlayingAudio) {
        this.playSynthMelody();
      }
    }, 14500);
  }
}

export const romanticAudio = new RomanticAudioPlayer();

/**
 * Plays a realistic camera shutter click and chime using Web Audio API.
 * Zero external files needed, 100% offline and cross-browser.
 */
export const playCameraClickSound = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    const now = ctx.currentTime;

    // 1. Shutter blade opening click (snappy burst)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(820, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.045);
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // 2. Shutter blade closing click at +0.08s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(980, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(160, now + 0.14);
    gain2.gain.setValueAtTime(0.22, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.145);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.15);

    // 3. Gentle harmonic chime at +0.20s (flash/confirmation sparkle)
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(1760, now + 0.2); // A6
    chime.frequency.exponentialRampToValueAtTime(2200, now + 0.38);
    chimeGain.gain.setValueAtTime(0.08, now + 0.2);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.2);
    chime.stop(now + 0.46);

    // Automatically close context after sound finishes
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Ignore audio errors gracefully
  }
};

