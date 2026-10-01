export type AvatarType = 'heart' | 'bear' | 'cat' | 'bunny' | 'fox' | 'panda';

export interface ChallengeLog {
  id: string;
  levelNumber: number;
  levelTitle: string;
  completedAt: string;
  earnedLp: number;
  winner?: string;
  notes?: string;
}

export interface CoupleProfile {
  name1: string; // e.g. "Anh" or "Hoàng Minh"
  name2: string; // e.g. "Em" or "Khánh Linh"
  avatar1: AvatarType;
  avatar2: AvatarType;
  anniversaryDate: string;
  lpScore: number;
  currentStreak: number;
  completedLevels: number[];
  soundEnabled: boolean;
  history: ChallengeLog[];
  retryCount?: number;
  totalPlayTimeSeconds?: number;
  startTimeStamp?: number;
  peakFunnyLevel?: number;
}

export interface LevelDef {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  lpReward: number;
  icon: string;
  color: string;
  isUnlocked: boolean;
  isComingSoon: boolean;
  estimatedMinutes: number;
}
