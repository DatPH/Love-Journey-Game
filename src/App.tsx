import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LevelMap } from './components/LevelMap';
import { Level1Spinner } from './components/levels/Level1Spinner';
import { Level2DressingRace } from './components/levels/Level2DressingRace';
import { Level3SecretCards } from './components/levels/Level3SecretCards';
import { Level4Photographer } from './components/levels/Level4Photographer';
import { Level5ReactionBattle } from './components/levels/Level5ReactionBattle';
import { Level6SingingChain } from './components/levels/Level6SingingChain';
import { Level7MirrorSymmetry } from './components/levels/Level7MirrorSymmetry';
import { Level8FlawCharades } from './components/levels/Level8FlawCharades';
import { Level9SyncHeartbeats } from './components/levels/Level9SyncHeartbeats';
import { Level10Checkpoint2 } from './components/levels/Level10Checkpoint2';
import { Level11MoodDecoder } from './components/levels/Level11MoodDecoder';
import { Level12DetectiveLook } from './components/levels/Level12DetectiveLook';
import { Level13ConfessionCourt } from './components/levels/Level13ConfessionCourt';
import { Level14BipolarFusion } from './components/levels/Level14BipolarFusion';
import { Level15SyncTrain } from './components/levels/Level15SyncTrain';
import { Level16BlindSteps } from './components/levels/Level16BlindSteps';
import { Level17PlankChallenge } from './components/levels/Level17PlankChallenge';
import { Level18PendulumGyro } from './components/levels/Level18PendulumGyro';
import { Level19StrictBeatSync } from './components/levels/Level19StrictBeatSync';
import { Level20ResonanceReflection } from './components/levels/Level20ResonanceReflection';
import { StatsScreen } from './components/StatsScreen';
import { LevelCompletedModal } from './components/LevelCompletedModal';
import { CoupleProfileModal } from './components/CoupleProfileModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ALL_LEVELS } from './data/levelsData';
import { CoupleProfile, ChallengeLog } from './types';
import { loadProfile, saveProfile, DEFAULT_PROFILE } from './utils/storage';
import { soundFx } from './utils/sound';
import { bgmEngine } from './utils/bgmEngine';

export default function App() {
  const [profile, setProfile] = useState<CoupleProfile>(() => loadProfile());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [completedModalData, setCompletedModalData] = useState<{
    isOpen: boolean;
    levelNumber: number;
    levelTitle: string;
    earnedLp: number;
    notes: string;
  } | null>(null);

  // Sync sound setting
  useEffect(() => {
    soundFx.setEnabled(profile.soundEnabled);
    bgmEngine.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Auto-start music on first user interaction if enabled
  useEffect(() => {
    const handleFirstGesture = () => {
      if (profile.soundEnabled) {
        bgmEngine.startMusic(currentLevel ? `level-${currentLevel}` : 'global');
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [profile.soundEnabled, currentLevel]);

  // Dynamically switch BGM track based on current screen/level
  useEffect(() => {
    if (profile.soundEnabled) {
      bgmEngine.changeTrack(currentLevel ? `level-${currentLevel}` : 'global');
    }
  }, [currentLevel, profile.soundEnabled]);

  // Handle saving profile changes
  const handleUpdateProfile = (updated: Partial<CoupleProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      saveProfile(next);
      return next;
    });
  };

  const handleToggleSound = () => {
    setProfile((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      saveProfile(next);
      soundFx.setEnabled(next.soundEnabled);
      bgmEngine.setMuted(!next.soundEnabled);
      return next;
    });
  };

  const handleResetProgress = () => {
    const reset = {
      ...DEFAULT_PROFILE,
      name1: profile.name1,
      name2: profile.name2,
      anniversaryDate: profile.anniversaryDate,
      lpScore: 0,
      completedLevels: [],
      history: [],
    };
    setProfile(reset);
    saveProfile(reset);
    setCurrentLevel(null);
  };

  // When a level is finished
  const handleLevelCompleted = (levelNumber: number, earnedLp: number, notes: string = '') => {
    const levelDef = ALL_LEVELS.find((l) => l.number === levelNumber);
    const levelTitle = levelDef ? levelDef.title : `Màn ${levelNumber}`;

    const newLog: ChallengeLog = {
      id: `log-${Date.now()}`,
      levelNumber,
      levelTitle,
      completedAt: new Date().toISOString(),
      earnedLp,
      notes,
    };

    setProfile((prev) => {
      const isAlready = prev.completedLevels.includes(levelNumber);
      const newCompleted = isAlready ? prev.completedLevels : [...prev.completedLevels, levelNumber];
      const next = {
        ...prev,
        lpScore: prev.lpScore + earnedLp,
        completedLevels: newCompleted,
        history: [newLog, ...prev.history],
      };
      saveProfile(next);
      return next;
    });

    setCompletedModalData({
      isOpen: true,
      levelNumber,
      levelTitle,
      earnedLp,
      notes,
    });

    if (levelNumber === 20) {
      setTimeout(() => {
        setIsStatsOpen(true);
      }, 1200);
    }
  };

  const handleNextLevel = () => {
    if (!completedModalData) return;
    const nextNum = completedModalData.levelNumber + 1;
    setCompletedModalData(null);
    if (nextNum <= 20) {
      setCurrentLevel(nextNum);
    } else {
      setCurrentLevel(null);
      setIsStatsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-800 flex flex-col font-sans selection:bg-pink-200">
      {/* Sticky App Header */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onToggleSound={handleToggleSound}
        onBackToMap={() => setCurrentLevel(null)}
        currentLevelActive={currentLevel}
      />

      {/* Main Screen Views */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {currentLevel === null && (
          <LevelMap
            profile={profile}
            onSelectLevel={(lvl) => setCurrentLevel(lvl)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
          />
        )}

        {currentLevel === 1 && (
          <Level1Spinner
            onComplete={(lp, notes) => handleLevelCompleted(1, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(1)}
          />
        )}

        {currentLevel === 2 && (
          <Level2DressingRace
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(2, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(2)}
          />
        )}

        {currentLevel === 3 && (
          <Level3SecretCards
            onComplete={(lp, notes) => handleLevelCompleted(3, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(3)}
          />
        )}

        {currentLevel === 4 && (
          <Level4Photographer
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(4, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(4)}
          />
        )}

        {currentLevel === 5 && (
          <Level5ReactionBattle
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(5, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(5)}
          />
        )}

        {currentLevel === 6 && (
          <Level6SingingChain
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(6, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(6)}
          />
        )}

        {currentLevel === 7 && (
          <Level7MirrorSymmetry
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(7, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(7)}
          />
        )}

        {currentLevel === 8 && (
          <Level8FlawCharades
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(8, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(8)}
          />
        )}

        {currentLevel === 9 && (
          <Level9SyncHeartbeats
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(9, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(9)}
          />
        )}

        {currentLevel === 10 && (
          <Level10Checkpoint2
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(10, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(10)}
          />
        )}

        {currentLevel === 11 && (
          <Level11MoodDecoder
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(11, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(11)}
          />
        )}

        {currentLevel === 12 && (
          <Level12DetectiveLook
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(12, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(12)}
          />
        )}

        {currentLevel === 13 && (
          <Level13ConfessionCourt
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(13, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(13)}
          />
        )}

        {currentLevel === 14 && (
          <Level14BipolarFusion
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(14, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(14)}
          />
        )}

        {currentLevel === 15 && (
          <Level15SyncTrain
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(15, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(15)}
          />
        )}

        {currentLevel === 16 && (
          <Level16BlindSteps
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(16, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(16)}
          />
        )}

        {currentLevel === 17 && (
          <Level17PlankChallenge
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(17, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(17)}
          />
        )}

        {currentLevel === 18 && (
          <Level18PendulumGyro
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(18, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(18)}
          />
        )}

        {currentLevel === 19 && (
          <Level19StrictBeatSync
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(19, lp, notes)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(19)}
          />
        )}

        {currentLevel === 20 && (
          <Level20ResonanceReflection
            profile={profile}
            onComplete={(lp, notes) => handleLevelCompleted(20, lp, notes)}
            onOpenStats={() => setIsStatsOpen(true)}
            onBack={() => setCurrentLevel(null)}
            isAlreadyCompleted={profile.completedLevels.includes(20)}
          />
        )}
      </main>

      {/* Grand Summary & Fun Statistics Screen */}
      {isStatsOpen && (
        <StatsScreen
          profile={profile}
          onClose={() => setIsStatsOpen(false)}
          onOpenHistory={() => {
            setIsStatsOpen(false);
            setIsHistoryOpen(true);
          }}
          onResetJourney={() => {
            setIsStatsOpen(false);
            handleResetProgress();
          }}
        />
      )}

      {/* Level Completed Celebration Modal */}
      {completedModalData && (
        <LevelCompletedModal
          isOpen={completedModalData.isOpen}
          levelNumber={completedModalData.levelNumber}
          levelTitle={completedModalData.levelTitle}
          earnedLp={completedModalData.earnedLp}
          notes={completedModalData.notes}
          onNextLevel={handleNextLevel}
          onClose={() => {
            setCompletedModalData(null);
            setCurrentLevel(null);
          }}
        />
      )}

      {/* Profile & Nickname Customization Modal */}
      <CoupleProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onSave={handleUpdateProfile}
        onResetProgress={handleResetProgress}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Challenge History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={profile.history}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
