// Synthesized sound & voice engine using Web Audio API + Web Speech API (Spanish TTS)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private activeTimers: number[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private pickSpanishMaleVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices =
      this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const esVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
    if (esVoices.length === 0) return voices[0];

    // Prefer known male Spanish voices (Windows/Edge/Chrome/macOS)
    const maleKeywords = ['alvaro', 'álvaro', 'pablo', 'jorge', 'raul', 'raúl', 'dario', 'darío', 'tomas', 'tomás', 'male', 'hombre', 'carlos', 'diego', 'juan'];
    const esESMale = esVoices.find(
      (v) =>
        v.lang.toLowerCase().includes('es-es') &&
        maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (esESMale) return esESMale;

    const anyEsMale = esVoices.find((v) =>
      maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (anyEsMale) return anyEsMale;

    const esES = esVoices.find((v) => v.lang.toLowerCase().includes('es-es'));
    return esES || esVoices[0];
  }

  public stopAll(): void {
    this.activeTimers.forEach((id) => window.clearTimeout(id));
    this.activeTimers = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (this.currentUtterance) {
          this.currentUtterance.onend = null;
          this.currentUtterance.onerror = null;
          this.currentUtterance = null;
        }
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
  }

  /** Mechanical cassette button click */
  public playCassetteClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.045);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /** Subtle paper flip / folder tab change */
  public playPaperFlip(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.07);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  /** Rubber stamp slam sound */
  public playStampSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.14);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  private startBackgroundTapeHiss(maxSeconds: number): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferLen = Math.floor(ctx.sampleRate * maxSeconds);
    const hissBuffer = ctx.createBuffer(1, bufferLen, ctx.sampleRate);
    const hissData = hissBuffer.getChannelData(0);
    for (let i = 0; i < bufferLen; i++) {
      hissData[i] = (Math.random() * 2 - 1) * 0.018;
    }
    const hissSource = ctx.createBufferSource();
    hissSource.buffer = hissBuffer;
    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = 'bandpass';
    hissFilter.frequency.value = 1900;
    hissSource.connect(hissFilter);
    hissFilter.connect(ctx.destination);
    hissSource.start(now);
    this.activeNodes.push(hissSource);

    // Subtle short police tape timestamp beep at start of segment
    const beep = ctx.createOscillator();
    const beepGain = ctx.createGain();
    beep.type = 'sine';
    beep.frequency.setValueAtTime(980, now);
    beepGain.gain.setValueAtTime(0.04, now);
    beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    beep.connect(beepGain);
    beepGain.connect(ctx.destination);
    beep.start(now);
    beep.stop(now + 0.065);
    this.activeNodes.push(beep);
  }

  private playRadioVoiceFallback(
    sfxType: 'voice_paco' | 'voice_whisper',
    durationMs: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const durationSec = durationMs / 1000;
    const baseFreq = sfxType === 'voice_whisper' ? 145 : 185;
    const steps = Math.floor(durationSec * 7);
    for (let i = 0; i < steps; i++) {
      if (Math.random() < 0.2) continue;
      const stepStart = now + i * 0.13;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      const pitch = baseFreq + Math.sin(i * 1.7) * 35 + (Math.random() * 20 - 10);
      osc.frequency.setValueAtTime(pitch, stepStart);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, stepStart);
      filter.Q.setValueAtTime(2.5, stepStart);

      const vol = sfxType === 'voice_whisper' ? 0.055 : 0.085;
      gain.gain.setValueAtTime(0.001, stepStart);
      gain.gain.linearRampToValueAtTime(vol, stepStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, stepStart + 0.11);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(stepStart);
      osc.stop(stepStart + 0.12);
      this.activeNodes.push(osc);
    }
  }

  /**
   * Play a segment of the Black Box tape:
   * - For 'voice_paco' and 'voice_whisper', speaks the Spanish dialogue out loud via SpeechSynthesis
   *   over analog tape hiss, and invokes onComplete() when the line finishes.
   * - For 'shredder' and 'explosion', synthesizes realistic mechanical/explosion sound effects.
   */
  public playSegmentSfx(
    sfxType: 'voice_paco' | 'shredder' | 'explosion' | 'voice_whisper',
    durationMs: number,
    spokenText?: string,
    onComplete?: () => void
  ): void {
    const ctx = this.getContext();
    this.stopAll();

    if (sfxType === 'voice_paco' || sfxType === 'voice_whisper') {
      const cleanText = (spokenText || '')
        .replace(/[«»""]/g, '')
        .trim();

      // Start subtle analog tape hiss in background (up to 14s max)
      this.startBackgroundTapeHiss(14);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window && cleanText.length > 0) {
        let finished = false;
        let speechStarted = false;
        const finishOnce = () => {
          if (finished) return;
          finished = true;
          this.currentUtterance = null;
          if (onComplete) onComplete();
        };

        // Delay speak() by 60ms after stopAll()'s cancel() to avoid Chromium cancel race condition
        const startTimer = window.setTimeout(() => {
          try {
            window.speechSynthesis.resume();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            this.currentUtterance = utterance;

            const chosenVoice = this.pickSpanishMaleVoice();
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
            utterance.lang = 'es-ES';
            utterance.pitch = sfxType === 'voice_whisper' ? 0.72 : 0.8;
            utterance.rate = sfxType === 'voice_whisper' ? 1.08 : 1.02;
            utterance.volume = 1.0;

            utterance.onstart = () => {
              speechStarted = true;
            };

            utterance.onend = () => {
              const t = window.setTimeout(finishOnce, 250);
              this.activeTimers.push(t);
            };

            utterance.onerror = () => {
              if (!speechStarted) {
                this.playRadioVoiceFallback(sfxType, durationMs);
                const t = window.setTimeout(finishOnce, durationMs);
                this.activeTimers.push(t);
              } else {
                const t = window.setTimeout(finishOnce, 250);
                this.activeTimers.push(t);
              }
            };

            window.speechSynthesis.speak(utterance);

            // Check after 450ms if speech actually started; if blocked/unavailable, play radio voice fallback
            const checkTimer = window.setTimeout(() => {
              if (!speechStarted && !window.speechSynthesis.speaking) {
                this.playRadioVoiceFallback(sfxType, durationMs);
                const t = window.setTimeout(finishOnce, durationMs);
                this.activeTimers.push(t);
              }
            }, 450);
            this.activeTimers.push(checkTimer);

            const safetyMs = Math.max(durationMs + 2500, cleanText.length * 90 + 1800);
            const safetyTimer = window.setTimeout(finishOnce, safetyMs);
            this.activeTimers.push(safetyTimer);
          } catch {
            this.playRadioVoiceFallback(sfxType, durationMs);
            const t = window.setTimeout(finishOnce, durationMs);
            this.activeTimers.push(t);
          }
        }, 60);
        this.activeTimers.push(startTimer);
        return;
      }

      // Fallback if SpeechSynthesis is not supported
      this.playRadioVoiceFallback(sfxType, durationMs);
      const fallbackTimer = window.setTimeout(() => {
        if (onComplete) onComplete();
      }, durationMs);
      this.activeTimers.push(fallbackTimer);
      return;
    }

    // Non-voice segments: Shredder & Microwave Explosion
    if (!ctx) {
      if (onComplete) {
        const t = window.setTimeout(onComplete, durationMs);
        this.activeTimers.push(t);
      }
      return;
    }

    const now = ctx.currentTime;
    const durationSec = durationMs / 1000;
    this.startBackgroundTapeHiss(durationSec);

    if (sfxType === 'shredder') {
      // 1. Industrial motor hum + grinding blades
      const motorOsc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const motorGain = ctx.createGain();

      motorOsc.type = 'sawtooth';
      motorOsc.frequency.setValueAtTime(88, now);

      lfo.type = 'square';
      lfo.frequency.setValueAtTime(22, now);
      lfoGain.gain.setValueAtTime(26, now);

      lfo.connect(lfoGain);
      lfoGain.connect(motorOsc.frequency);

      motorGain.gain.setValueAtTime(0.11, now);
      motorGain.gain.exponentialRampToValueAtTime(0.02, now + durationSec);

      motorOsc.connect(motorGain);
      motorGain.connect(ctx.destination);

      motorOsc.start(now);
      lfo.start(now);
      motorOsc.stop(now + durationSec);
      lfo.stop(now + durationSec);
      this.activeNodes.push(motorOsc, lfo);

      // 2. Crunchy paper-tearing noise bursts
      const tearBuffer = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * durationSec),
        ctx.sampleRate
      );
      const tearData = tearBuffer.getChannelData(0);
      for (let i = 0; i < tearData.length; i++) {
        const mod = 0.5 + 0.5 * Math.sin((i / ctx.sampleRate) * Math.PI * 2 * 16);
        tearData[i] = (Math.random() * 2 - 1) * mod * 0.22;
      }
      const tearNoise = ctx.createBufferSource();
      tearNoise.buffer = tearBuffer;
      const tearFilter = ctx.createBiquadFilter();
      tearFilter.type = 'bandpass';
      tearFilter.frequency.setValueAtTime(1350, now);
      tearFilter.Q.setValueAtTime(1.2, now);
      tearNoise.connect(tearFilter);
      tearFilter.connect(ctx.destination);
      tearNoise.start(now);
      this.activeNodes.push(tearNoise);
    } else if (sfxType === 'explosion') {
      // 1. Initial electrical spark crackle (0.0s - 0.35s) + Loud metallic blast (0.35s)
      const blastBuffer = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * durationSec),
        ctx.sampleRate
      );
      const blastData = blastBuffer.getChannelData(0);
      for (let i = 0; i < blastData.length; i++) {
        const t = i / ctx.sampleRate;
        if (t < 0.3) {
          // Foil electrical sparks in microwave
          blastData[i] = (Math.random() > 0.7 ? Math.random() * 2 - 1 : 0) * 0.35;
        } else {
          // Explosion boom decay
          const env = Math.exp(-(t - 0.3) * 3.2);
          blastData[i] = (Math.random() * 2 - 1) * env * 0.55;
        }
      }
      const blastSource = ctx.createBufferSource();
      blastSource.buffer = blastBuffer;
      const blastFilter = ctx.createBiquadFilter();
      blastFilter.type = 'lowpass';
      blastFilter.frequency.setValueAtTime(1800, now);
      blastFilter.frequency.exponentialRampToValueAtTime(140, now + durationSec);
      blastSource.connect(blastFilter);
      blastFilter.connect(ctx.destination);
      blastSource.start(now);
      this.activeNodes.push(blastSource);

      // 2. Power-down blackout whine (480Hz dropping to 28Hz)
      const powerDownOsc = ctx.createOscillator();
      const powerGain = ctx.createGain();
      powerDownOsc.type = 'sawtooth';
      powerDownOsc.frequency.setValueAtTime(480, now + 0.3);
      powerDownOsc.frequency.exponentialRampToValueAtTime(28, now + durationSec * 0.95);

      powerGain.gain.setValueAtTime(0.001, now);
      powerGain.gain.setValueAtTime(0.18, now + 0.3);
      powerGain.gain.exponentialRampToValueAtTime(0.002, now + durationSec * 0.98);

      powerDownOsc.connect(powerGain);
      powerGain.connect(ctx.destination);
      powerDownOsc.start(now);
      powerDownOsc.stop(now + durationSec);
      this.activeNodes.push(powerDownOsc);
    }

    const doneTimer = window.setTimeout(() => {
      if (onComplete) onComplete();
    }, durationMs);
    this.activeTimers.push(doneTimer);
  }
}

export const soundEngine = new SoundEngine();
