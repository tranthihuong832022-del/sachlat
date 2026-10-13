/**
 * Web Speech API Engine for Ebook Page Narration & Text-To-Speech (TTS)
 * Works 100% in modern browsers (Chrome, Edge, Safari, Firefox), 
 * completely client-side without any API key or external server.
 */

export interface SpeechSettings {
  autoReadOnFlip: boolean;
  rate: number; // 0.75 - 2.0
  pitch: number; // 0.8 - 1.2
  volume: number; // 0 - 1.0
  voiceUri: string | null;
}

export type SpeechState = 'idle' | 'speaking' | 'paused';

class PageSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private state: SpeechState = 'idle';
  private stateListeners: Set<(state: SpeechState, currentText?: string) => void> = new Set();
  private currentSpokenText: string = '';

  private settings: SpeechSettings = {
    autoReadOnFlip: false,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voiceUri: null,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadSettings();
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadSettings() {
    try {
      const autoFlip = localStorage.getItem('ebook_speech_auto_flip');
      if (autoFlip !== null) {
        this.settings.autoReadOnFlip = autoFlip === 'true';
      }
      const savedRate = localStorage.getItem('ebook_speech_rate');
      if (savedRate !== null) {
        this.settings.rate = parseFloat(savedRate) || 1.0;
      }
      const savedPitch = localStorage.getItem('ebook_speech_pitch');
      if (savedPitch !== null) {
        this.settings.pitch = parseFloat(savedPitch) || 1.0;
      }
      const savedVol = localStorage.getItem('ebook_speech_vol');
      if (savedVol !== null) {
        this.settings.volume = parseFloat(savedVol) || 1.0;
      }
      const savedVoice = localStorage.getItem('ebook_speech_voice');
      if (savedVoice) {
        this.settings.voiceUri = savedVoice;
      }
    } catch {
      // Ignore localStorage issues
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('ebook_speech_auto_flip', String(this.settings.autoReadOnFlip));
      localStorage.setItem('ebook_speech_rate', String(this.settings.rate));
      localStorage.setItem('ebook_speech_pitch', String(this.settings.pitch));
      localStorage.setItem('ebook_speech_vol', String(this.settings.volume));
      if (this.settings.voiceUri) {
        localStorage.setItem('ebook_speech_voice', this.settings.voiceUri);
      }
    } catch {
      // Ignore
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public getVietnameseVoice(): SpeechSynthesisVoice | null {
    const list = this.getVoices();
    // 1. Look for explicit Vietnamese voice
    const viVoice = list.find(
      (v) =>
        v.lang.toLowerCase().startsWith('vi') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt')
    );
    if (viVoice) return viVoice;

    // 2. Look for preferred saved voice
    if (this.settings.voiceUri) {
      const saved = list.find((v) => v.voiceURI === this.settings.voiceUri);
      if (saved) return saved;
    }

    // 3. Fallback to default browser voice
    return list.find((v) => v.default) || list[0] || null;
  }

  public getSettings(): SpeechSettings {
    return { ...this.settings };
  }

  public setAutoReadOnFlip(val: boolean) {
    this.settings.autoReadOnFlip = val;
    this.saveSettings();
  }

  public setRate(rate: number) {
    this.settings.rate = Math.max(0.5, Math.min(2.0, rate));
    this.saveSettings();
  }

  public setPitch(pitch: number) {
    this.settings.pitch = Math.max(0.5, Math.min(1.5, pitch));
    this.saveSettings();
  }

  public setVolume(vol: number) {
    this.settings.volume = Math.max(0, Math.min(1.0, vol));
    this.saveSettings();
  }

  public setVoice(voiceUri: string) {
    this.settings.voiceUri = voiceUri;
    this.saveSettings();
  }

  public getState(): SpeechState {
    return this.state;
  }

  public getCurrentText(): string {
    return this.currentSpokenText;
  }

  public subscribeState(listener: (state: SpeechState, text?: string) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state, this.currentSpokenText);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: SpeechState, text?: string) {
    this.state = state;
    if (text !== undefined) this.currentSpokenText = text;
    this.stateListeners.forEach((l) => l(state, this.currentSpokenText));
  }

  /**
   * Speak the content of a page
   */
  public speak(
    rawText: string,
    options?: {
      pageNumber?: number;
      bookTitle?: string;
      onEnd?: () => void;
    }
  ) {
    if (!this.synth) return;

    // Stop ongoing speech
    this.stop();

    let textToSpeak = rawText ? rawText.trim() : '';

    // If no text detected on page, give a helpful audio cue
    if (!textToSpeak) {
      const pageNum = options?.pageNumber;
      const title = options?.bookTitle;
      if (pageNum) {
        textToSpeak = `Trang ${pageNum}. ${title ? `Sách ${title}.` : ''} Trang này chủ yếu là hình ảnh hoặc biểu đồ.`;
      } else {
        textToSpeak = 'Trang sách này không chứa đoạn văn bản có thể nhận dạng.';
      }
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Select voice
      let selectedVoice: SpeechSynthesisVoice | null = null;
      if (this.settings.voiceUri) {
        selectedVoice = this.getVoices().find((v) => v.voiceURI === this.settings.voiceUri) || null;
      }
      if (!selectedVoice) {
        selectedVoice = this.getVietnameseVoice();
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || 'vi-VN';
      } else {
        utterance.lang = 'vi-VN';
      }

      utterance.onstart = () => {
        this.setState('speaking', textToSpeak);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.setState('idle', '');
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        // Canceled or interrupted is normal when flipping to another page
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('SpeechSynthesis error:', e);
        }
        this.currentUtterance = null;
        this.setState('idle', '');
      };

      this.currentUtterance = utterance;

      // Resume synthesis if suspended
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis execution error:', err);
      this.setState('idle', '');
    }
  }

  public pause() {
    if (!this.synth) return;
    if (this.state === 'speaking') {
      this.synth.pause();
      this.setState('paused');
    }
  }

  public resume() {
    if (!this.synth) return;
    if (this.state === 'paused') {
      this.synth.resume();
      this.setState('speaking');
    }
  }

  public stop() {
    if (!this.synth) return;
    try {
      this.synth.cancel();
    } catch {}
    this.currentUtterance = null;
    this.setState('idle', '');
  }

  public togglePlay(
    text: string,
    options?: { pageNumber?: number; bookTitle?: string; onEnd?: () => void }
  ) {
    if (this.state === 'speaking') {
      this.pause();
    } else if (this.state === 'paused') {
      this.resume();
    } else {
      this.speak(text, options);
    }
  }
}

export const speechEngine = new PageSpeechEngine();
