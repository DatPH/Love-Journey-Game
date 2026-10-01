// High-fidelity procedural Web Audio Background Music & Soundtrack Engine
// Designed specifically for couple games: Romance, Intimacy, Playfulness & Excitement

export interface TrackMetadata {
  id: string;
  title: string;
  vibe: 'Lãng Mạn' | 'Hài Hước' | 'Sôi Động' | 'Hồi Hộp' | 'Gắn Kết' | 'Vinh Danh';
  color: string;
  description: string;
  tempo: number; // BPM
}

export const TRACK_INFO_MAP: Record<string, TrackMetadata> = {
  global: {
    id: 'global',
    title: 'Hẹn Hò Chiều Mưa (Lo-Fi Romance)',
    vibe: 'Lãng Mạn',
    color: 'from-pink-400 to-rose-400',
    description: 'Giai điệu piano điện ấm áp, nhẹ nhàng và ngọt ngào.',
    tempo: 78,
  },
  'level-1': {
    id: 'level-1',
    title: 'Vũ Điệu Món Ngon (Bistro Waltz)',
    vibe: 'Hài Hước',
    color: 'from-amber-400 to-orange-400',
    description: 'Nhịp valse vui nhộn, tươi tắn cho vòng quay ăn uống.',
    tempo: 108,
  },
  'level-2': {
    id: 'level-2',
    title: 'Đường Đua Thời Trang (Runway Groove)',
    vibe: 'Sôi Động',
    color: 'from-rose-500 to-pink-600',
    description: 'Nhịp điệu dồn dập, sôi nổi cho cuộc đua lên đồ.',
    tempo: 126,
  },
  'level-3': {
    id: 'level-3',
    title: 'Vận Mệnh Đôi Ta (Starlight Mystery)',
    vibe: 'Lãng Mạn',
    color: 'from-purple-400 to-indigo-500',
    description: 'Chuông gió lung linh gợi mở những bất ngờ tình yêu.',
    tempo: 80,
  },
  'level-4': {
    id: 'level-4',
    title: 'Góc Phố Bossa Nova (Photo Stroll)',
    vibe: 'Lãng Mạn',
    color: 'from-teal-400 to-emerald-500',
    description: 'Nhịp bossa nova thư thả, tự nhiên như dạo phố chụp ảnh.',
    tempo: 96,
  },
  'level-5': {
    id: 'level-5',
    title: 'Đại Chiến Đấu Trường (Retro Arcade)',
    vibe: 'Hồi Hộp',
    color: 'from-rose-500 to-purple-600',
    description: 'Bass synth nảy lửa và dồn dập cho trận đấu phản xạ Bo3.',
    tempo: 128,
  },
  'level-6': {
    id: 'level-6',
    title: 'Khúc Hát Nối Dây (Acoustic Pop Jam)',
    vibe: 'Hài Hước',
    color: 'from-blue-400 to-indigo-500',
    description: 'Giai điệu acoustic mộc mạc, bắt tai cho thử thách hát nối.',
    tempo: 104,
  },
  'level-7': {
    id: 'level-7',
    title: 'Gương Cười Hài Hước (Cartoon Polka)',
    vibe: 'Hài Hước',
    color: 'from-violet-400 to-fuchsia-500',
    description: 'Tiếng đàn marimba ngộ nghĩnh, chọc cười không ngớt.',
    tempo: 116,
  },
  'level-8': {
    id: 'level-8',
    title: 'Thám Tử Tật Xấu (Sneaky Pizzicato)',
    vibe: 'Hồi Hộp',
    color: 'from-amber-400 to-orange-500',
    description: 'Nhịp bước rón rén bí ẩn cho màn kịch câm 45 giây.',
    tempo: 92,
  },
  'level-9': {
    id: 'level-9',
    title: 'Hai Trái Tim Một Nhịp (Zen Heartbeat)',
    vibe: 'Gắn Kết',
    color: 'from-emerald-400 to-teal-500',
    description: 'Nhịp đập sâu lắng, êm đềm thử thách thần giao cách cảm.',
    tempo: 68,
  },
  'level-10': {
    id: 'level-10',
    title: 'Cột Mốc Vinh Quang (Triumphant Waltz)',
    vibe: 'Vinh Danh',
    color: 'from-amber-500 to-rose-500',
    description: 'Hợp âm khải hoàn rực rỡ chào mừng Checkpoint 2.',
    tempo: 110,
  },
  'level-11': {
    id: 'level-11',
    title: 'Giải Mã Cơn Dỗi (Playful Detective)',
    vibe: 'Hài Hước',
    color: 'from-pink-500 to-rose-600',
    description: 'Tiếng chuông điện tử dí dỏm cùng những hàm ý bất ngờ.',
    tempo: 106,
  },
  'level-12': {
    id: 'level-12',
    title: 'Thám Tử Soi Chi Tiết (Sneak & Seek)',
    vibe: 'Hồi Hộp',
    color: 'from-teal-500 to-emerald-600',
    description: 'Giai điệu rón rén, hồi hộp trong 20 giây đếm ngược.',
    tempo: 114,
  },
  'level-13': {
    id: 'level-13',
    title: 'Tòa Xưng Tội Lầy Lội (Sacred & Sassy Organ)',
    vibe: 'Hài Hước',
    color: 'from-indigo-500 to-purple-600',
    description: 'Hợp âm phong cách thánh đường pha trộn nhịp điệu hài hước.',
    tempo: 96,
  },
  'level-14': {
    id: 'level-14',
    title: 'Hợp Nhất Đa Cực (Bipolar Fusion Groove)',
    vibe: 'Sôi Động',
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Nhịp funk sôi động, ngẫu hứng cho sự kết hợp Vibe & Giới hạn.',
    tempo: 120,
  },
  'level-15': {
    id: 'level-15',
    title: 'Chuyến Tàu Đồng Sóng (Cosmic Co-op Anthem)',
    vibe: 'Gắn Kết',
    color: 'from-amber-400 via-rose-500 to-purple-600',
    description: 'Giai điệu cao trào hào hùng cho đại thử thách thần giao cách cảm.',
    tempo: 124,
  },
  'level-16': {
    id: 'level-16',
    title: 'Song Hành Vô Định (Blind Step Harmony)',
    vibe: 'Gắn Kết',
    color: 'from-sky-500 to-indigo-600',
    description: 'Tiếng bước chân êm đềm và chuông đếm nhịp dịu ngọt.',
    tempo: 92,
  },
  'level-17': {
    id: 'level-17',
    title: 'Đại Chiến Plank (Power Couple Workout Groove)',
    vibe: 'Sôi Động',
    color: 'from-orange-500 to-amber-600',
    description: 'Nhịp beat sôi động tiếp lửa cho màn đọ sức bền Plank giữa hai bạn.',
    tempo: 120,
  },
  'level-18': {
    id: 'level-18',
    title: 'Con Lắc Đồng Điệu (Gyro Pendulum Orbit)',
    vibe: 'Hồi Hộp',
    color: 'from-amber-500 to-emerald-600',
    description: 'Giai điệu sóng hồi chuyển huyền ảo, phiêu lãng theo chuyển động.',
    tempo: 104,
  },
  'level-19': {
    id: 'level-19',
    title: 'Nhịp Đập Đồng Sóng (Pulse Resonance Beat)',
    vibe: 'Sôi Động',
    color: 'from-rose-500 to-pink-600',
    description: 'Nhịp tim dồn dập, căng tràn năng lượng đồng thời.',
    tempo: 128,
  },
  'level-20': {
    id: 'level-20',
    title: 'Đỉnh Vinh Quang: Tâm Linh Tương Thông (Eternal Symphony)',
    vibe: 'Vinh Danh',
    color: 'from-yellow-400 via-rose-500 to-purple-600',
    description: 'Bản giao hưởng khải hoàn vĩ đại chào đón cặp đôi huyền thoại.',
    tempo: 116,
  },
};

// Notes frequency mapping in Hz
const N = {
  C2: 65.41,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  F6: 1396.91,
  G6: 1567.98,
  REST: 0,
};

interface StepEvent {
  bass?: number;
  chord?: number[];
  lead?: number;
}

class BgmSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.28; // Pleasant background volume
  private currentTrackId: string = 'global';
  private timerId: number | null = null;
  private stepIndex: number = 0;
  private isPlaying: boolean = false;

  private subscribers: ((track: TrackMetadata, isPlaying: boolean) => void)[] = [];

  constructor() {
    // Initialized lazily on first user touch/click
  }

  private initContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output with subtle lowpass warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4200;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);

      this.masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      return this.ctx;
    } catch (err) {
      console.warn('AudioContext initialization failed:', err);
      return null;
    }
  }

  // Subscribe to track changes for UI indicators
  public subscribe(cb: (track: TrackMetadata, isPlaying: boolean) => void) {
    this.subscribers.push(cb);
    cb(this.getCurrentTrackMetadata(), this.isPlaying && !this.isMuted);
    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== cb);
    };
  }

  private notify() {
    const meta = this.getCurrentTrackMetadata();
    this.subscribers.forEach((fn) => fn(meta, this.isPlaying && !this.isMuted));
  }

  public getCurrentTrackMetadata(): TrackMetadata {
    return TRACK_INFO_MAP[this.currentTrackId] || TRACK_INFO_MAP.global;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isMuted;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  // Start or resume music
  public startMusic(trackId?: string) {
    const ctx = this.initContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (trackId && trackId !== this.currentTrackId) {
      this.currentTrackId = trackId;
      this.stepIndex = 0;
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startScheduler();
    }

    this.notify();
  }

  // Change track with crossfade
  public changeTrack(trackKey: string) {
    if (!TRACK_INFO_MAP[trackKey]) {
      trackKey = 'global';
    }
    if (this.currentTrackId === trackKey && this.isPlaying) return;

    this.currentTrackId = trackKey;
    this.stepIndex = 0;

    if (this.isPlaying) {
      // Re-trigger scheduler with new track's BPM
      this.stopScheduler();
      this.startScheduler();
    } else {
      this.startMusic(trackKey);
    }
    this.notify();
  }

  // Pause music
  public pauseMusic() {
    this.isPlaying = false;
    this.stopScheduler();
    this.notify();
  }

  // Toggle mute
  public toggleMute() {
    this.setMuted(!this.isMuted);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.currentVolume, now + 0.15);
    }

    if (!muted && !this.isPlaying) {
      this.startMusic();
    }
    this.notify();
  }

  // Set volume (0.0 to 1.0)
  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 0.1);
    }
    this.notify();
  }

  // Tone generation helpers
  private playNote(freq: number, startTime: number, duration: number, type: OscillatorType, gainAmt: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(gainAmt, startTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private startScheduler() {
    this.stopScheduler();
    const track = this.getCurrentTrackMetadata();
    // 16th-note or 8th-note tick interval based on BPM
    const stepDurationMs = Math.round((60000 / track.tempo) / 4);

    this.timerId = window.setInterval(() => {
      this.tick();
    }, stepDurationMs);
  }

  private stopScheduler() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Main musical pattern step
  private tick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const track = this.getCurrentTrackMetadata();
    const pattern = this.getPatternForTrack(this.currentTrackId);
    const stepCount = pattern.length;
    const currentStep: StepEvent = pattern[this.stepIndex % stepCount];

    const now = this.ctx.currentTime + 0.05;
    const stepTime = 60 / track.tempo / 4;

    // 1. Bass note
    if (currentStep.bass && currentStep.bass > 0) {
      this.playNote(currentStep.bass, now, stepTime * 3.5, 'triangle', 0.28);
    }

    // 2. Chords pad
    if (currentStep.chord && currentStep.chord.length > 0) {
      currentStep.chord.forEach((noteFreq) => {
        this.playNote(noteFreq, now, stepTime * 3.2, 'sine', 0.12);
      });
    }

    // 3. Melodic lead note
    if (currentStep.lead && currentStep.lead > 0) {
      this.playNote(currentStep.lead, now, stepTime * 2.2, 'sine', 0.18);
    }

    this.stepIndex++;
  }

  // Musical patterns specifically composed for each vibe
  private getPatternForTrack(trackId: string): StepEvent[] {
    switch (trackId) {
      // LEVEL 1: Playful Bistro Waltz (3/4 time feel, bouncy food exploration)
      case 'level-1':
        return [
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.D5 },
          { bass: N.REST, chord: [N.B3, N.D4] },
          { bass: N.REST, chord: [N.B3, N.D4], lead: N.B4 },
          { bass: N.C3, chord: [N.C4, N.E4, N.G4], lead: N.C5 },
          { bass: N.REST, chord: [N.C4, N.E4] },
          { bass: N.REST, chord: [N.C4, N.E4], lead: N.E5 },
          { bass: N.D3, chord: [N.A3, N.C4, N.F4], lead: N.D5 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.G2, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.REST },
          { bass: N.REST, lead: N.A4 },
          { bass: N.D3, chord: [N.B3, N.D4, N.G4], lead: N.B4 },
        ];

      // LEVEL 2: Runway Dressing Groove (Upbeat, energetic, syncopated)
      case 'level-2':
        return [
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.E4 },
          { bass: N.REST },
          { bass: N.E2, lead: N.G4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
          { bass: N.A2, chord: [N.A3, N.C4, N.E4], lead: N.A4 },
          { bass: N.REST },
          { bass: N.B2, lead: N.B4 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.C3, chord: [N.C4, N.E4, N.G4], lead: N.C5 },
          { bass: N.REST, lead: N.B4 },
          { bass: N.D3, lead: N.A4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.G4 },
          { bass: N.REST },
          { bass: N.REST, lead: N.E4 },
          { bass: N.REST },
        ];

      // LEVEL 3: Starlight Romance (Dreamy, celestial bells)
      case 'level-3':
        return [
          { bass: N.F2, chord: [N.A3, N.C4, N.E4], lead: N.C5 },
          { bass: N.REST },
          { bass: N.REST, lead: N.A4 },
          { bass: N.REST, lead: N.E4 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.D5 },
          { bass: N.REST },
          { bass: N.REST, lead: N.B4 },
          { bass: N.REST, lead: N.G4 },
          { bass: N.A2, chord: [N.C4, N.E4, N.A4], lead: N.E5 },
          { bass: N.REST },
          { bass: N.REST, lead: N.C5 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.B4 },
          { bass: N.REST },
          { bass: N.REST, lead: N.G4 },
          { bass: N.REST },
        ];

      // LEVEL 4: Photo Stroll Bossa Nova (Warm, sunny, relaxed)
      case 'level-4':
        return [
          { bass: N.C3, chord: [N.E3, N.G3, N.B3, N.D4], lead: N.G4 },
          { bass: N.REST },
          { bass: N.G2, chord: [N.E3, N.G3, N.B3] },
          { bass: N.REST, lead: N.A4 },
          { bass: N.A2, chord: [N.C4, N.E4, N.G4], lead: N.C5 },
          { bass: N.REST },
          { bass: N.E2, chord: [N.C4, N.E4] },
          { bass: N.REST, lead: N.B4 },
          { bass: N.D3, chord: [N.F3, N.A3, N.C4], lead: N.A4 },
          { bass: N.REST },
          { bass: N.A2, chord: [N.F3, N.A3] },
          { bass: N.REST, lead: N.G4 },
          { bass: N.G2, chord: [N.F3, N.B3, N.D4], lead: N.F4 },
          { bass: N.REST },
          { bass: N.D3, chord: [N.F3, N.B3] },
          { bass: N.REST, lead: N.E4 },
        ];

      // LEVEL 5: Retro Arcade Duel (Pumping bass, suspense, tension)
      case 'level-5':
        return [
          { bass: N.A2, chord: [N.A3, N.C4, N.E4], lead: N.E4 },
          { bass: N.A2, lead: N.A4 },
          { bass: N.A2, chord: [N.A3, N.C4] },
          { bass: N.A2, lead: N.C5 },
          { bass: N.F2, chord: [N.A3, N.C4, N.F4], lead: N.D5 },
          { bass: N.F2, lead: N.C5 },
          { bass: N.F2, chord: [N.A3, N.C4] },
          { bass: N.F2, lead: N.B4 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.B4 },
          { bass: N.G2, lead: N.C5 },
          { bass: N.G2, chord: [N.B3, N.D4] },
          { bass: N.G2, lead: N.D5 },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.E5 },
          { bass: N.E2 },
          { bass: N.E2, lead: N.D5 },
          { bass: N.E2, lead: N.B4 },
        ];

      // LEVEL 6: Acoustic Pop Jam (Sweet sing-along chords)
      case 'level-6':
        return [
          { bass: N.D3, chord: [N.F3, N.A3, N.D4], lead: N.A4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.A2, lead: N.B4 },
          { bass: N.REST, chord: [N.F3, N.A3], lead: N.D5 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.B4 },
          { bass: N.REST, chord: [N.B3, N.D4] },
          { bass: N.D3, lead: N.A4 },
          { bass: N.REST, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.A2, chord: [N.C4, N.E4, N.A4], lead: N.E4 },
          { bass: N.REST, chord: [N.C4, N.E4] },
          { bass: N.E2, lead: N.F4 },
          { bass: N.REST, chord: [N.C4, N.E4], lead: N.G4 },
          { bass: N.D3, chord: [N.F3, N.A3, N.D4], lead: N.F4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.A2, lead: N.E4 },
          { bass: N.REST, chord: [N.F3, N.A3], lead: N.D4 },
        ];

      // LEVEL 7: Cartoon Polka (Bouncy, comical, slapstick marimba)
      case 'level-7':
        return [
          { bass: N.C3, lead: N.C5 },
          { bass: N.REST, chord: [N.E4, N.G4] },
          { bass: N.G2, lead: N.E5 },
          { bass: N.REST, chord: [N.E4, N.G4] },
          { bass: N.C3, lead: N.G5 },
          { bass: N.REST, chord: [N.E4, N.G4] },
          { bass: N.G2, lead: N.E5 },
          { bass: N.REST, chord: [N.E4, N.G4] },
          { bass: N.D3, lead: N.D5 },
          { bass: N.REST, chord: [N.F4, N.A4] },
          { bass: N.A2, lead: N.F5 },
          { bass: N.REST, chord: [N.F4, N.A4] },
          { bass: N.G2, lead: N.G4 },
          { bass: N.REST, chord: [N.F4, N.B4] },
          { bass: N.B2, lead: N.B4 },
          { bass: N.REST, chord: [N.F4, N.B4] },
        ];

      // LEVEL 8: Sneaky Pizzicato (Tiptoeing walking bass, comic mystery)
      case 'level-8':
        return [
          { bass: N.F2, lead: N.F4 },
          { bass: N.REST },
          { bass: N.A2, lead: N.G4 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.C3, lead: N.A4 },
          { bass: N.REST },
          { bass: N.D3, lead: N.C5 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.E2, lead: N.B4 },
          { bass: N.REST },
          { bass: N.G2, lead: N.A4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
          { bass: N.B2, lead: N.G4 },
          { bass: N.REST },
          { bass: N.C3, lead: N.E4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
        ];

      // LEVEL 9: Zen Heartbeat Pulse (Ambient, warm, intimate, deep connection)
      case 'level-9':
        return [
          { bass: N.F2, chord: [N.A3, N.C4, N.E4], lead: N.C4 },
          { bass: N.F2 }, // Double heartbeat thud
          { bass: N.REST, lead: N.E4 },
          { bass: N.REST },
          { bass: N.C3, chord: [N.E3, N.G3, N.B3], lead: N.G4 },
          { bass: N.C3 },
          { bass: N.REST, lead: N.B4 },
          { bass: N.REST },
          { bass: N.D3, chord: [N.F3, N.A3, N.C4], lead: N.A4 },
          { bass: N.D3 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.REST },
          { bass: N.A2, chord: [N.C4, N.E4, N.A4], lead: N.E5 },
          { bass: N.A2 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.REST },
        ];

      // LEVEL 10: Triumphant Milestone Anthem (Majestic, celebratory, royal)
      case 'level-10':
        return [
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.C5 },
          { bass: N.REST, lead: N.E5 },
          { bass: N.G2, chord: [N.G3, N.C4], lead: N.G5 },
          { bass: N.REST, lead: N.C6 },
          { bass: N.F2, chord: [N.A3, N.C4, N.F4], lead: N.A5 },
          { bass: N.REST, lead: N.G5 },
          { bass: N.A2, chord: [N.A3, N.C4], lead: N.F5 },
          { bass: N.REST, lead: N.E5 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.D5 },
          { bass: N.REST, lead: N.G5 },
          { bass: N.B2, chord: [N.B3, N.D4], lead: N.B5 },
          { bass: N.REST, lead: N.D6 },
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.C6 },
          { bass: N.REST, chord: [N.G3, N.C4] },
          { bass: N.REST },
          { bass: N.REST },
        ];

      // LEVEL 11: Playful Detective (Cute mood decoder, staccato bounces)
      case 'level-11':
        return [
          { bass: N.F2, chord: [N.A3, N.C4], lead: N.F4 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.C3, lead: N.C5 },
          { bass: N.REST, chord: [N.A3, N.C4], lead: N.D5 },
          { bass: N.D3, chord: [N.F3, N.A3], lead: N.C5 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.A2, lead: N.F4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.G2, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.REST, lead: N.B4 },
          { bass: N.D3, lead: N.D5 },
          { bass: N.REST, chord: [N.B3, N.D4], lead: N.E5 },
          { bass: N.C3, chord: [N.E3, N.G3, N.C4], lead: N.C5 },
          { bass: N.REST },
          { bass: N.G2, lead: N.B4 },
          { bass: N.REST, chord: [N.E3, N.G3] },
        ];

      // LEVEL 12: Sneak & Seek (Suspense, 20s physical inspection)
      case 'level-12':
        return [
          { bass: N.D3, lead: N.D4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.D3, lead: N.E4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.D3, lead: N.F4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.A2, lead: N.G4 },
          { bass: N.REST, chord: [N.F3, N.A3], lead: N.F4 },
          { bass: N.Bb2, lead: N.D4 },
          { bass: N.REST, chord: [N.D3, N.F3] },
          { bass: N.Bb2, lead: N.F4 },
          { bass: N.REST, chord: [N.D3, N.F3], lead: N.A4 },
          { bass: N.C3, lead: N.E4 },
          { bass: N.REST, chord: [N.E3, N.G3] },
          { bass: N.C3, lead: N.G4 },
          { bass: N.REST, chord: [N.E3, N.G3], lead: N.E4 },
        ];

      // LEVEL 13: Sacred & Sassy Confession Court (Church organ + comedic twist)
      case 'level-13':
        return [
          { bass: N.A2, chord: [N.C4, N.E4, N.A4], lead: N.E5 },
          { bass: N.REST, chord: [N.C4, N.E4] },
          { bass: N.A2, lead: N.D5 },
          { bass: N.REST, chord: [N.C4, N.E4], lead: N.C5 },
          { bass: N.F2, chord: [N.A3, N.C4, N.F4], lead: N.A4 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.F2, lead: N.C5 },
          { bass: N.REST, chord: [N.A3, N.C4], lead: N.F5 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.D5 },
          { bass: N.REST, chord: [N.B3, N.D4] },
          { bass: N.G2, lead: N.B4 },
          { bass: N.REST, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.B4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
          { bass: N.E2, lead: N.G4 },
          { bass: N.REST, chord: [N.G3, N.B3], lead: N.E4 },
        ];

      // LEVEL 14: Bipolar Fusion Groove (Syncopated upbeat funk)
      case 'level-14':
        return [
          { bass: N.E2, chord: [N.G3, N.D4], lead: N.E4 },
          { bass: N.E2 },
          { bass: N.REST, chord: [N.G3, N.D4], lead: N.G4 },
          { bass: N.G2, lead: N.A4 },
          { bass: N.A2, chord: [N.A3, N.C4, N.E4], lead: N.B4 },
          { bass: N.REST },
          { bass: N.A2, lead: N.A4 },
          { bass: N.REST, chord: [N.C4, N.E4] },
          { bass: N.D3, chord: [N.F3, N.A3, N.C4], lead: N.D5 },
          { bass: N.D3 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.F2, lead: N.A4 },
          { bass: N.B2, chord: [N.D4, N.F4, N.A4], lead: N.B4 },
          { bass: N.REST },
          { bass: N.E2, lead: N.E5 },
          { bass: N.REST },
        ];

      // LEVEL 15: Cosmic Co-op Anthem (Epic synchrony finale)
      case 'level-15':
        return [
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.G5 },
          { bass: N.C3, lead: N.E5 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.G2, chord: [N.G3, N.B3, N.D4], lead: N.D5 },
          { bass: N.G2, lead: N.G5 },
          { bass: N.REST, lead: N.B5 },
          { bass: N.A2, chord: [N.A3, N.C4, N.E4], lead: N.A5 },
          { bass: N.A2, lead: N.E5 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.F2, chord: [N.A3, N.C4, N.F4], lead: N.F5 },
          { bass: N.F2, lead: N.A5 },
          { bass: N.REST, lead: N.C6 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.B5 },
          { bass: N.G2, lead: N.D6 },
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.C6 },
          { bass: N.REST },
        ];

      // LEVEL 16: Blind Step Harmony (Slow gentle stepping chime)
      case 'level-16':
        return [
          { bass: N.F2, chord: [N.A3, N.C4], lead: N.F4 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.C3, lead: N.C5 },
          { bass: N.REST, lead: N.F5 },
          { bass: N.G2, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.REST, lead: N.B4 },
          { bass: N.D3, lead: N.D5 },
          { bass: N.REST, lead: N.G5 },
          { bass: N.A2, chord: [N.C4, N.E4], lead: N.A4 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.E3, lead: N.E5 },
          { bass: N.REST, lead: N.A5 },
          { bass: N.Bb2, chord: [N.D3, N.F3], lead: N.D5 },
          { bass: N.REST, lead: N.F5 },
          { bass: N.C3, chord: [N.E3, N.G3, N.C4], lead: N.C5 },
          { bass: N.REST },
        ];

      // LEVEL 17: Zen Bridge Balance (Soft, meditative, focused acoustic warmth)
      case 'level-17':
        return [
          { bass: N.D2, chord: [N.F3, N.A3], lead: N.D4 },
          { bass: N.REST },
          { bass: N.A2, chord: [N.F3, N.A3], lead: N.F4 },
          { bass: N.REST },
          { bass: N.G2, chord: [N.B3, N.D4], lead: N.G4 },
          { bass: N.REST },
          { bass: N.D3, chord: [N.B3, N.D4], lead: N.B4 },
          { bass: N.REST },
          { bass: N.E2, chord: [N.G3, N.B3], lead: N.E4 },
          { bass: N.REST },
          { bass: N.B2, chord: [N.G3, N.B3], lead: N.G4 },
          { bass: N.REST },
          { bass: N.A2, chord: [N.C4, N.E4], lead: N.A4 },
          { bass: N.REST },
          { bass: N.D2, chord: [N.F3, N.A3, N.D4], lead: N.D5 },
          { bass: N.REST },
        ];

      // LEVEL 18: Gyro Pendulum Orbit (Atmospheric floating waves, balance tension)
      case 'level-18':
        return [
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.E5 },
          { bass: N.E2, lead: N.B4 },
          { bass: N.REST, lead: N.G4 },
          { bass: N.B2, chord: [N.G3, N.B3], lead: N.E4 },
          { bass: N.C3, chord: [N.E3, N.G3, N.C4], lead: N.G4 },
          { bass: N.REST, lead: N.C5 },
          { bass: N.G2, chord: [N.E3, N.G3], lead: N.E5 },
          { bass: N.REST, lead: N.G5 },
          { bass: N.D3, chord: [N.F3, N.A3, N.D4], lead: N.F5 },
          { bass: N.D3, lead: N.D5 },
          { bass: N.REST, lead: N.A4 },
          { bass: N.A2, chord: [N.F3, N.A3], lead: N.F4 },
          { bass: N.B2, chord: [N.D3, N.F3, N.B3], lead: N.D5 },
          { bass: N.REST, lead: N.F5 },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.E5 },
          { bass: N.REST },
        ];

      // LEVEL 19: Pulse Resonance Beat (Strict intense rhythmic pulse, ticking sync)
      case 'level-19':
        return [
          { bass: N.A2, chord: [N.C4, N.E4], lead: N.A5 },
          { bass: N.A2, chord: [N.C4, N.E4] },
          { bass: N.F2, chord: [N.A3, N.C4], lead: N.F5 },
          { bass: N.F2, chord: [N.A3, N.C4] },
          { bass: N.D3, chord: [N.F3, N.A3], lead: N.D5 },
          { bass: N.D3, chord: [N.F3, N.A3] },
          { bass: N.E2, chord: [N.G3, N.B3], lead: N.E5 },
          { bass: N.E2, chord: [N.G3, N.B3] },
          { bass: N.A2, chord: [N.C4, N.E4], lead: N.C6 },
          { bass: N.A2, chord: [N.C4, N.E4] },
          { bass: N.G2, chord: [N.B3, N.D4], lead: N.B5 },
          { bass: N.G2, chord: [N.B3, N.D4] },
          { bass: N.F2, chord: [N.A3, N.C4], lead: N.A5 },
          { bass: N.E2, chord: [N.G3, N.B3], lead: N.G5 },
          { bass: N.A2, chord: [N.C4, N.E4, N.A4], lead: N.A5 },
          { bass: N.REST },
        ];

      // LEVEL 20: Eternal Symphony (Grand romantic victory waltz, orchestral fireworks)
      case 'level-20':
        return [
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.C5 },
          { bass: N.REST, lead: N.E5 },
          { bass: N.G2, chord: [N.G3, N.C4], lead: N.G5 },
          { bass: N.REST, lead: N.C6 },
          { bass: N.E3, chord: [N.G3, N.C4, N.E4], lead: N.E6 },
          { bass: N.REST, lead: N.D6 },
          { bass: N.F2, chord: [N.A3, N.C4, N.F4], lead: N.C6 },
          { bass: N.REST, lead: N.A5 },
          { bass: N.G2, chord: [N.B3, N.D4, N.G4], lead: N.G5 },
          { bass: N.REST, lead: N.B5 },
          { bass: N.B2, chord: [N.B3, N.D4], lead: N.D6 },
          { bass: N.REST, lead: N.F6 },
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.E6 },
          { bass: N.REST, lead: N.D6 },
          { bass: N.C3, chord: [N.G3, N.C4, N.E4], lead: N.C6 },
          { bass: N.REST },
        ];

      // DEFAULT / GLOBAL: Lo-Fi Romance Cafe (Warm Rhodes, nostalgic sweet love)
      default:
        return [
          { bass: N.F2, chord: [N.A3, N.C4, N.E4], lead: N.C5 },
          { bass: N.REST, chord: [N.A3, N.C4] },
          { bass: N.C3, lead: N.A4 },
          { bass: N.REST, chord: [N.A3, N.C4], lead: N.G4 },
          { bass: N.E2, chord: [N.G3, N.B3, N.E4], lead: N.B4 },
          { bass: N.REST, chord: [N.G3, N.B3] },
          { bass: N.B2, lead: N.G4 },
          { bass: N.REST, chord: [N.G3, N.B3], lead: N.E4 },
          { bass: N.D2, chord: [N.F3, N.A3, N.C4], lead: N.A4 },
          { bass: N.REST, chord: [N.F3, N.A3] },
          { bass: N.A2, lead: N.F4 },
          { bass: N.REST, chord: [N.F3, N.A3], lead: N.D4 },
          { bass: N.C2, chord: [N.E3, N.G3, N.B3], lead: N.G4 },
          { bass: N.REST, chord: [N.E3, N.G3] },
          { bass: N.G2, lead: N.E4 },
          { bass: N.REST, chord: [N.E3, N.G3], lead: N.C4 },
        ];
    }
  }
}

export const bgmEngine = new BgmSoundEngine();
