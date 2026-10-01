import React from 'react';
import { Volume2, VolumeX, Sparkles, User, History, Crown } from 'lucide-react';
import { CoupleProfile } from '../types';
import { getLoveTier, getNextLoveTier } from '../data/levelsData';
import { soundFx } from '../utils/sound';

interface HeaderProps {
  profile: CoupleProfile;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onToggleSound: () => void;
  onOpenStats?: () => void;
  onBackToMap?: () => void;
  currentLevelActive?: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenHistory,
  onToggleSound,
  onOpenStats,
}) => {
  const currentTier = getLoveTier(profile.lpScore);
  const nextTier = getNextLoveTier(profile.lpScore);

  // Calculate progress toward next tier
  const currentMin = currentTier.minLp;
  const nextMin = nextTier ? nextTier.minLp : currentMin + 500;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((profile.lpScore - currentMin) / (nextMin - currentMin)) * 100)));

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-2.5">
        {/* Top single row: Wordmark/Names + Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Wordmark & Couple Badges */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
            aria-label="Thông tin cặp đôi"
          >
            <div className="relative flex items-center -space-x-1.5">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs">
                {profile.name1.charAt(0).toUpperCase()}
              </span>
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs">
                {profile.name2.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors">
                  {profile.name1} & {profile.name2}
                </span>
                <span className="text-xs text-rose-500 animate-pulse">❤️</span>
              </div>
              <p className="text-[11px] font-medium text-rose-500/90 truncate max-w-[150px]">
                {currentTier.title}
              </p>
            </div>
          </button>

          {/* Action icons: Sound, History, Profile */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFx.playPop();
                onToggleSound();
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all relative ${
                profile.soundEnabled
                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              aria-label={profile.soundEnabled ? 'Tắt âm nhạc & âm thanh' : 'Bật âm nhạc & âm thanh'}
              title={profile.soundEnabled ? 'Đang bật nhạc nền & hiệu ứng (Chạm để tắt)' : 'Đang tắt âm thanh (Chạm để bật)'}
            >
              {profile.soundEnabled ? (
                <div className="relative flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {onOpenStats && (
              <button
                onClick={() => {
                  soundFx.playPop();
                  onOpenStats();
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all relative ${
                  profile.completedLevels.length >= 20
                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 shadow-xs ring-1 ring-amber-300 animate-pulse'
                    : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                }`}
                aria-label="Bảng Vàng Thống Kê & Huy Hiệu"
                title="Bảng Vàng Thống Kê & Huy Hiệu"
              >
                <Crown className="w-4 h-4 fill-amber-400/30" />
                {profile.completedLevels.length >= 20 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                )}
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playPop();
                onOpenHistory();
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors relative"
              aria-label="Lịch sử thử thách"
              title="Lịch sử thử thách"
            >
              <History className="w-4 h-4" />
              {profile.history.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playPop();
                onOpenProfile();
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Cài đặt cặp đôi"
              title="Cài đặt cặp đôi"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Love Power (LP) Progression Tracker Bar */}
        <div className="mt-2 pt-1 border-t border-rose-50">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1.5 font-semibold text-rose-600">
              <Sparkles className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
              <span>Love Power (LP)</span>
            </div>
            <div className="text-slate-600 font-mono font-medium text-[11px]">
              <strong className="text-rose-600 font-bold text-xs">{profile.lpScore}</strong>
              <span className="text-slate-400"> / {nextMin} LP</span>
            </div>
          </div>

          {/* Progress track */}
          <div className="relative w-full h-2.5 bg-rose-100/70 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-xs relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
