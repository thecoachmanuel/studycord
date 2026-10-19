import { SOUNDS } from './constants';

class SoundManager {
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private audioBuffers: Record<string, AudioBuffer> = {};
  private audioCache: Record<string, HTMLAudioElement> = {};
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSound = localStorage.getItem('sound_enabled');
      this.soundEnabled = storedSound !== null ? storedSound === 'true' : true;

      const storedVib = localStorage.getItem('vibration_enabled');
      this.vibrationEnabled = storedVib !== null ? storedVib === 'true' : true;

      // Unlock AudioContext on first user interaction
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('click', unlock);
      };

      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Preload sound buffers
    this.preloadSound(SOUNDS.click);
    this.preloadSound(SOUNDS.right);
    this.preloadSound(SOUNDS.wrong);
  }

  private async preloadSound(url: string) {
    const ctx = this.getAudioContext();
    if (!ctx || this.audioBuffers[url]) return;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        this.audioBuffers[url] = decoded;
      }
    } catch {
      // Audio preloading failed, fallback will be used
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_enabled', enabled ? 'true' : 'false');
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibration_enabled', enabled ? 'true' : 'false');
    }
  }

  public isVibrationEnabled(): boolean {
    return this.vibrationEnabled;
  }

  private playSound(src: string, fallbackType: 'click' | 'right' | 'wrong' = 'click') {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    const ctx = this.getAudioContext();

    // 1. Primary: Web Audio API Buffer playback (instant 0ms latency, zero collision)
    if (ctx && this.audioBuffers[src]) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.audioBuffers[src];
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.8;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fallback below
      }
    }

    // 2. Secondary: Preload buffer if not loaded yet
    if (ctx && !this.audioBuffers[src]) {
      this.preloadSound(src);
    }

    // 3. HTML5 Audio fallback
    try {
      const audio = new Audio(src);
      audio.volume = 0.8;
      audio.play().catch(() => {
        // If HTML5 Audio fails, use Web Audio synthetic fallback
        this.synthesizeSound(fallbackType);
      });
    } catch {
      this.synthesizeSound(fallbackType);
    }
  }

  private synthesizeSound(type: 'click' | 'right' | 'wrong') {
    const ctx = this.getAudioContext();
    if (!ctx || !this.soundEnabled) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'right') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Ignore synth errors
    }
  }

  public playClick() {
    this.playSound(SOUNDS.click, 'click');
  }

  public playCorrect() {
    this.playSound(SOUNDS.right, 'right');
  }

  public playWrong() {
    this.playSound(SOUNDS.wrong, 'wrong');
  }

  /**
   * Rich Web Audio synthesizer for Audio Questions:
   * Produces acoustic guitar strums, bell chimes, grand piano chords, cello bowing,
   * tuning pitches, bird calls, and sawtooth synthesizers with zero latency and no 404s.
   */
  public playAudioSample(sampleKey?: string) {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const key = (sampleKey || '').toLowerCase();

      // 1. Acoustic Guitar Flamenco Strum (aud1, guitar)
      if (key.includes('guitar') || key.includes('flamenco') || key.includes('aud1') || key.includes('aud-1')) {
        const guitarFrets = [164.81, 220.0, 293.66, 392.0, 493.88, 659.25]; // E3, A3, D4, G4, B4, E5
        guitarFrets.forEach((freq, idx) => {
          const strumDelay = idx * 0.038;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + strumDelay);

          gain.gain.setValueAtTime(0, now + strumDelay);
          gain.gain.linearRampToValueAtTime(0.2, now + strumDelay + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, now + strumDelay + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + strumDelay);
          osc.stop(now + strumDelay + 1.2);
        });
        return;
      }

      // 2. Resonant Bell Chime / Major Third Interval (aud2, chime, bell, interval)
      if (key.includes('interval') || key.includes('chime') || key.includes('aud2') || key.includes('aud-2')) {
        const chimeNotes = [523.25, 659.25]; // C5 to E5 (Major Third)
        chimeNotes.forEach((freq, idx) => {
          const noteDelay = idx * 0.28;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + noteDelay);

          // Harmonic overtone
          const harm = ctx.createOscillator();
          const harmGain = ctx.createGain();
          harm.type = 'sine';
          harm.frequency.setValueAtTime(freq * 2.756, now + noteDelay);

          gain.gain.setValueAtTime(0.28, now + noteDelay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 2.0);

          harmGain.gain.setValueAtTime(0.08, now + noteDelay);
          harmGain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 1.2);

          osc.connect(gain);
          harm.connect(harmGain);
          gain.connect(ctx.destination);
          harmGain.connect(ctx.destination);

          osc.start(now + noteDelay);
          harm.start(now + noteDelay);
          osc.stop(now + noteDelay + 2.0);
          harm.stop(now + noteDelay + 1.2);
        });
        return;
      }

      // 3. Sawtooth Waveform Buzzer / Modulation (aud3, sawtooth, buzzer)
      if (key.includes('sawtooth') || key.includes('buzzer') || key.includes('waveform') || key.includes('aud3') || key.includes('aud-3')) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.8);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
        return;
      }

      // 4. Nightingale Melodic Bird Song Warble (aud4, bird, nightingale)
      if (key.includes('bird') || key.includes('nightingale') || key.includes('song') || key.includes('aud4') || key.includes('aud-4')) {
        const chirps = [1046.5, 1318.5, 1567.98, 2093.0, 1567.98, 1760.0];
        chirps.forEach((freq, idx) => {
          const chirpStart = now + idx * 0.12;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, chirpStart);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.15, chirpStart + 0.08);

          gain.gain.setValueAtTime(0.18, chirpStart);
          gain.gain.exponentialRampToValueAtTime(0.001, chirpStart + 0.1);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(chirpStart);
          osc.stop(chirpStart + 0.1);
        });
        return;
      }

      // 5. Standard Concert Tuning Pitch 440 Hz (aud-5, pitch, 440)
      if (key.includes('440') || key.includes('pitch') || key.includes('aud-5')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // Concert A4
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
        return;
      }

      // 6. Classical Grand Piano Chord (aud-6, piano)
      if (key.includes('piano') || key.includes('aud-6')) {
        const pianoChord = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
        pianoChord.forEach((freq, i) => {
          const delay = i * 0.02;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + delay);

          gain.gain.setValueAtTime(0.22, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 2.2);
        });
        return;
      }

      // 7. Concert Cello Bowing (aud-7, cello)
      if (key.includes('cello') || key.includes('aud-7')) {
        const celloTones = [65.41, 98.0, 146.83]; // C2, G2, D3
        celloTones.forEach((freq) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(380, now);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
          gain.gain.linearRampToValueAtTime(0.12, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.0);
        });
        return;
      }

      // 8. Acoustic Echo (aud-8, echo)
      if (key.includes('echo') || key.includes('aud-8')) {
        [0, 0.35, 0.7, 1.05].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const vol = 0.28 / (idx + 1);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now + delay); // D5

          gain.gain.setValueAtTime(vol, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.25);
        });
        return;
      }

      // 9. Soprano High Singing Tone with Vibrato (aud-9, aud-10, soprano)
      if (key.includes('soprano') || key.includes('voice') || key.includes('aud-9') || key.includes('aud-10')) {
        const osc = ctx.createOscillator();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now); // C6

        vibrato.type = 'sine';
        vibrato.frequency.setValueAtTime(5.5, now); // 5.5Hz vibrato
        vibratoGain.gain.setValueAtTime(14, now);

        vibrato.connect(osc.frequency);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        vibrato.start(now);
        osc.start(now);
        vibrato.stop(now + 2.2);
        osc.stop(now + 2.2);
        return;
      }

      // Generic Fallback: Melodic triad
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const delay = idx * 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 1.0);
      });
    } catch {
      // Fallback to basic right sound
      this.playCorrect();
    }
  }

  /**
   * Haptic feedback working seamlessly on mobile (vibration motor)
   * and desktop (Taptic acoustic pulse + custom event for micro-vibration animation)
   */
  public vibrate(duration: number = 50) {
    if (!this.vibrationEnabled || typeof window === 'undefined') return;

    // 1. Mobile Physical Vibration if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(duration);
      } catch {
        // Safe ignore
      }
    }

    // 2. Dispatch custom event for visual micro-haptic or components reacting to vibration
    try {
      window.dispatchEvent(new CustomEvent('app-haptic', { detail: { duration } }));
    } catch {
      // Safe ignore
    }

    // 3. Desktop / Earphone Taptic Impulse Click:
    // Produces a very subtle, low-frequency 65Hz tactile impulse (18ms)
    // giving an authentic physical sensation of a button press or haptic tick
    const ctx = this.getAudioContext();
    if (ctx && ctx.state !== 'suspended') {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Low tactile frequency like a mechanical tap
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.02);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
      } catch {
        // Safe ignore
      }
    }
  }
}

export const soundManager = new SoundManager();

