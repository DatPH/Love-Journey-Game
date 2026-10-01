import React from 'react';
import { Sparkles, Trophy, ArrowRight, MapPin, Heart } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface LevelCompletedModalProps {
  isOpen: boolean;
  levelNumber: number;
  levelTitle: string;
  earnedLp: number;
  notes: string;
  onNextLevel?: () => void;
  onClose: () => void;
}

export const LevelCompletedModal: React.FC<LevelCompletedModalProps> = ({
  isOpen,
  levelNumber,
  levelTitle,
  earnedLp,
  notes,
  onNextLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  const trophyImage = '/src/assets/images/couple_heart_trophy_1790627937644.jpg';
  const hasNextPlayable = levelNumber < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border-2 border-rose-200 animate-in zoom-in-95 duration-300">
        {/* Top Trophy Asset */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <img
            src={trophyImage}
            alt="Cúp Tình Yêu"
            className="w-full h-full object-contain drop-shadow-lg animate-bounce"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Small Tag */}
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-0.5 rounded-full mb-1">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
          <span>Vượt Qua Thử Thách!</span>
        </div>

        <h2 className="text-xl font-black text-slate-900 mt-1">
          Màn {levelNumber}: {levelTitle}
        </h2>

        {/* LP Earned Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white font-black text-sm my-3 shadow-md shadow-rose-500/20">
          <Sparkles className="w-4 h-4 fill-white" />
          <span>+{earnedLp} LOVE POWER (LP)</span>
        </div>

        {/* Recap Note */}
        {notes && (
          <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-950 font-medium mb-4 leading-relaxed text-left">
            <span className="block text-[10px] uppercase font-bold text-rose-500 mb-0.5">
              Ghi Chú Kỷ Niệm:
            </span>
            {notes}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {hasNextPlayable && onNextLevel && (
            <button
              onClick={() => {
                soundFx.playPop();
                onNextLevel();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <span>Chơi Tiếp Màn {levelNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Trở Về Bản Đồ Hành Trình</span>
          </button>
        </div>
      </div>
    </div>
  );
};
