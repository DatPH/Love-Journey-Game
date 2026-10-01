import confetti from 'canvas-confetti';
import { CoupleProfile } from '../types';

const STORAGE_KEY = 'couple_quest_profile_v1';

export const DEFAULT_PROFILE: CoupleProfile = {
  name1: 'Anh',
  name2: 'Em',
  avatar1: 'bear',
  avatar2: 'bunny',
  anniversaryDate: '2024-02-14',
  lpScore: 0, // Starts at 0 LP since no levels are completed yet
  currentStreak: 1,
  completedLevels: [], // No completed levels by default
  soundEnabled: true,
  history: [], // Empty history by default
};

export function loadProfile(): CoupleProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    const profile: CoupleProfile = {
      ...DEFAULT_PROFILE,
      ...parsed,
    };

    // If no levels have been completed yet, ensure LP score is 0 and clear any demo history
    if (!profile.completedLevels || profile.completedLevels.length === 0) {
      profile.lpScore = 0;
      profile.history = (profile.history || []).filter((h) => h.id !== 'demo-1');
    }

    return profile;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: CoupleProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fb7185', '#fda4af', '#fcd34d'],
    });
  } catch (e) {
    console.warn('Confetti failed to trigger', e);
  }
}
