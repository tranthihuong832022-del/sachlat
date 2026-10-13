/**
 * Web Audio API based Realistic Page Flip Sound Synthesizer
 * Zero external audio files required, zero latency, works offline, WCAG compliant.
 */

class PageFlipAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4; // 0.0 - 1.0
  private soundStyle: 'crisp' | 'classic' | 'thick' = 'classic';

  constructor() {
    // Volume & mute state will be loaded from localStorage if available
    try {
      const savedMuted = localStorage.getItem('ebook_audio_muted');
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }
      const savedVol = localStorage.getItem('ebook_audio_vol');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
      const savedStyle = localStorage.getItem('ebook_audio_style');
      if (savedStyle && ['crisp', 'classic', 'thick'].includes(savedStyle)) {
        this.soundStyle = savedStyle as any;
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (err) {
        console.warn('AudioContext not supported:', err);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('ebook_audio_muted', String(muted));
    } catch {}
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('ebook_audio_vol', String(this.volume));
    } catch {}
  }

  public getVolume(): number {
    return this.volume;
  }

  public setSoundStyle(style: 'crisp' | 'classic' | 'thick') {
    this.soundStyle = style;
    try {
      localStorage.setItem('ebook_audio_style', style);
    } catch {}
  }

  public getSoundStyle(): 'crisp' | 'classic' | 'thick' {
    return this.soundStyle;
  }

  /**
   * Synthesize a gentle, multi-layer physical paper flip sound
   */
  public playFlip(): boolean {
    if (this.isMuted || this.volume <= 0.01) {
      return false;
    }

    const ctx = this.initContext();
    if (!ctx) return false;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      // 1. Paper sweep noise buffer (white noise tailored to page motion)
      const bufferSize = Math.floor(ctx.sampleRate * 0.22); // 220ms duration
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown/pink-ish filtered noise for organic paper friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.04 * white) / 1.04;
        lastOut = output[i];
        output[i] *= 2.8; // boost level
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Filter properties based on sound style
      let filterFreq = 1400;
      let filterQ = 1.8;
      if (this.soundStyle === 'crisp') {
        filterFreq = 2200;
        filterQ = 2.2;
      } else if (this.soundStyle === 'thick') {
        filterFreq = 850;
        filterQ = 1.2;
      }

      // Bandpass filter for paper sweep resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreq, now);
      filter.frequency.exponentialRampToValueAtTime(filterFreq * 0.6, now + 0.18);
      filter.Q.setValueAtTime(filterQ, now);

      // Envelope: gentle rise, subtle flutter, clean release
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.45, now + 0.025); // fast attack
      noiseGain.gain.exponentialRampToValueAtTime(0.3, now + 0.09); // sustain flutter
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.21); // decay

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      // 2. Paper settle 'tap/flutter' (soft low frequency body)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.14);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.setValueAtTime(0.001, now + 0.04);
      oscGain.gain.linearRampToValueAtTime(0.09, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      // Start and schedule clean stop
      noiseSource.start(now);
      osc.start(now + 0.04);
      osc.stop(now + 0.18);
      noiseSource.stop(now + 0.22);

      return true;
    } catch (err) {
      console.warn('Could not synthesize flip sound:', err);
      return false;
    }
  }
}

export const audioEngine = new PageFlipAudioEngine();
