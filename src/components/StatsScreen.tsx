import React, { useEffect } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Clock, 
  Award, 
  Flame, 
  Heart, 
  RotateCcw, 
  BookOpen, 
  Share2, 
  Smile, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { CoupleProfile } from '../types';
import { triggerConfetti } from '../utils/storage';
import { soundFx } from '../utils/sound';

interface StatsScreenProps {
  profile: CoupleProfile;
  onClose: () => void;
  onOpenHistory: () => void;
  onResetJourney: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  profile,
  onClose,
  onOpenHistory,
  onResetJourney,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Trigger grand confetti bursts on mounting
  useEffect(() => {
    soundFx.playFanfare();
    triggerConfetti();
    const timer1 = setTimeout(() => triggerConfetti(), 400);
    const timer2 = setTimeout(() => triggerConfetti(), 900);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Calculate stats
  const totalCompleted = profile.completedLevels.length;
  const totalLp = profile.lpScore;

  // Approximate shared playtime (sum of estimated minutes or dynamic calculation)
  const totalMinutes = Math.max(38, totalCompleted * 6);
  const totalSeconds = (totalMinutes * 60) % 60;

  // Patience index (Kiên nhẫn vượt qua thử thách)
  const patienceScore = Math.min(99, Math.max(88, 95 + (totalCompleted - (profile.retryCount || 0)) * 0.5));

  // Peak funny level
  const peakFunnyTitle = 'Màn 13 · Tòa Xưng Tội Lầy Lội';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#FAF7F5] rounded-3xl border border-amber-300 shadow-2xl p-6 relative text-left my-8 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Grand Certificate Crest */}
        <div className="text-center pt-2 space-y-2">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-amber-500/30 text-white animate-pulse">
              <Crown className="w-10 h-10 fill-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-stone-950 border-2 border-amber-300 flex items-center justify-center text-amber-300 text-[10px] font-black">
              ★
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-black text-amber-800 tracking-widest block">
              DANH HIỆU TỐI THƯỢNG · DIGITAL BADGE
            </span>
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Cặp Đôi Vô Song - Tâm Linh Tương Thông 100%
            </h1>
            <p className="text-xs text-rose-600 font-bold mt-0.5">
              Huyền Thoại Tình Yêu Vượt Qua 20 Thử Thách 🌌
            </p>
          </div>
        </div>

        {/* Monogram Seal & Names */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <span className="w-9 h-9 rounded-full bg-rose-950 border-2 border-rose-300 text-rose-200 font-black text-xs flex items-center justify-center shadow-xs">
                {p1.charAt(0).toUpperCase()}
              </span>
              <span className="w-9 h-9 rounded-full bg-stone-900 border-2 border-amber-300 text-amber-200 font-black text-xs flex items-center justify-center shadow-xs">
                {p2.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">
                {p1} & {p2}
              </p>
              <p className="text-[10px] text-stone-500 font-medium">
                Chinh phục 20/20 Trạm Thử Thách
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-stone-400 font-bold uppercase block">Tổng điểm LP</span>
            <span className="text-xs font-black text-amber-800 font-mono flex items-center gap-0.5 justify-end">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              {totalLp} LP
            </span>
          </div>
        </div>

        {/* CALCULATED FUN METRICS GRID */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* Playtime: Total shared time [X mins Y secs] */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-500" />
              Tổng Thời Gian Đồng Hành
            </span>
            <p className="text-sm font-black text-slate-800 font-mono">
              [{totalMinutes} mins {totalSeconds} secs]
            </p>
            <p className="text-[10px] text-stone-500">
              {totalMinutes} phút {totalSeconds > 0 ? `${totalSeconds} giây` : ''} trọn vẹn
            </p>
          </div>

          {/* Patience Index & Total retry count */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Chỉ Số Kiên Nhẫn
            </span>
            <p className="text-sm font-black text-emerald-600 font-mono">
              {patienceScore.toFixed(0)}%
            </p>
            <p className="text-[10px] text-stone-500 font-medium">
              Thử lại: <strong className="text-slate-700">{profile.retryCount || 0}</strong> lần
            </p>
          </div>

          {/* Peak Funny Level */}
          <div className="col-span-2 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <Smile className="w-3 h-3 text-amber-500" />
              Màn Chơi Lầy Lội & Cười Nhiều Nhất
            </span>
            <p className="text-xs font-black text-purple-900">
              {peakFunnyTitle}
            </p>
            <p className="text-[10px] text-stone-500">
              Cùng nhau thú tội và ban phát hình phạt hài hước đỉnh cao!
            </p>
          </div>
        </div>

        {/* Digital Badge Keepsake Quote */}
        <div className="p-4 rounded-2xl bg-[#2A1820] text-rose-100 text-xs text-center space-y-1.5 border border-rose-900/60 shadow-md">
          <p className="text-amber-200 font-bold italic font-serif">
            "Không có hành trình nào hoàn hảo, chỉ có hai trái tim cùng muốn đi chung một con đường."
          </p>
          <span className="text-[10px] text-rose-300 font-medium block">
            Hành Trình Gắn Kết · Phiên Bản Hoàn Hảo 2026
          </span>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onOpenHistory}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-stone-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Xem Lại Nhật Ký 20 Màn Chơi</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFx.playPop();
                triggerConfetti();
              }}
              className="py-3 px-3 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bắn Pháo Hoa!</span>
            </button>

            <button
              onClick={onResetJourney}
              className="py-3 px-3 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Khởi Động Lại</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
