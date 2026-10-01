import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Activity, 
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level9SyncHeartbeatsProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

type Phase = 'INTRO' | 'PULSING_ARENA' | 'ROUND_SUCCESS' | 'ROUND_FAILED' | 'MATCH_VICTORY';

export const Level9SyncHeartbeats: React.FC<Level9SyncHeartbeatsProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  
  // Player taps in current attempt
  const [p1Tapped, setP1Tapped] = useState<boolean>(false);
  const [p2Tapped, setP2Tapped] = useState<boolean>(false);
  const p1TimeRef = useRef<number | null>(null);
  const p2TimeRef = useRef<number | null>(null);
  const [deltaMs, setDeltaMs] = useState<number | null>(null);

  // Failure / timeout window
  const windowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pulse animation state
  const [pulseScale, setPulseScale] = useState<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Maximum allowed ms tolerance for each streak level
  // Round 1: 240ms, Round 2: 190ms, Round 3: 150ms
  const getTolerance = (streak: number) => {
    if (streak === 0) return 240;
    if (streak === 1) return 190;
    return 150;
  };

  useEffect(() => {
    return () => {
      if (windowTimeoutRef.current) clearTimeout(windowTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Heartbeat pulsing loop
  useEffect(() => {
    if (phase === 'PULSING_ARENA') {
      startTimeRef.current = performance.now();
      const loop = (now: number) => {
        const elapsed = (now - startTimeRef.current) / 1000;
        // Periodic heartbeat expansion (cycle ~ 1.6s)
        const scale = 1 + 0.35 * Math.sin(elapsed * 3.8);
        setPulseScale(scale);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  // Start / Reset arena
  const handleStartArena = () => {
    soundFx.playPop();
    resetAttempt();
    setPhase('PULSING_ARENA');
  };

  const resetAttempt = () => {
    if (windowTimeoutRef.current) clearTimeout(windowTimeoutRef.current);
    p1TimeRef.current = null;
    p2TimeRef.current = null;
    setP1Tapped(false);
    setP2Tapped(false);
    setDeltaMs(null);
  };

  // Handle tap from player 1 or 2
  const handleTap = (player: 'p1' | 'p2') => {
    if (phase !== 'PULSING_ARENA') return;
    const now = performance.now();
    soundFx.playPop();

    if (player === 'p1') {
      if (p1TimeRef.current !== null) return;
      p1TimeRef.current = now;
      setP1Tapped(true);
    } else {
      if (p2TimeRef.current !== null) return;
      p2TimeRef.current = now;
      setP2Tapped(true);
    }

    // If both have tapped
    if (p1TimeRef.current !== null && p2TimeRef.current !== null) {
      if (windowTimeoutRef.current) clearTimeout(windowTimeoutRef.current);
      const diff = Math.round(Math.abs(p1TimeRef.current - p2TimeRef.current));
      setDeltaMs(diff);

      const tolerance = getTolerance(consecutiveWins);

      if (diff <= tolerance) {
        // SYNC SUCCESS!
        const nextWins = consecutiveWins + 1;
        setConsecutiveWins(nextWins);

        if (nextWins >= 3) {
          // Reached 3 consecutive perfect syncs!
          soundFx.playFanfare();
          triggerConfetti();
          setPhase('MATCH_VICTORY');
        } else {
          soundFx.playFanfare();
          setPhase('ROUND_SUCCESS');
        }
      } else {
        // FAILED TOLERANCE
        soundFx.playBeep(false);
        setConsecutiveWins(0); // Reset consecutive streak
        setPhase('ROUND_FAILED');
      }
    } else {
      // First player tapped; if other player doesn't tap within 600ms, mark fail!
      if (windowTimeoutRef.current) clearTimeout(windowTimeoutRef.current);
      windowTimeoutRef.current = setTimeout(() => {
        soundFx.playBeep(false);
        setDeltaMs(600);
        setConsecutiveWins(0);
        setPhase('ROUND_FAILED');
      }, 600);
    }
  };

  const handleNextRound = () => {
    soundFx.playPop();
    resetAttempt();
    setPhase('PULSING_ARENA');
  };

  const handleFinishLevel = () => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(
      280,
      `Nhịp Đập Đồng Điệu: Hai bạn đã xuất sắc vượt qua 3 vòng đồng bộ với độ lệch kỷ lục ${deltaMs || 45}ms mà không cần lời nói!`
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => {
            soundFx.playPop();
            if (windowTimeoutRef.current) clearTimeout(windowTimeoutRef.current);
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bản đồ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Màn 9 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Nhịp Đập Đồng Điệu</span>
        </div>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'INTRO' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Đồng Bộ Trực Giác Cặp Đôi</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Nhịp Đập Đồng Điệu
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Vòng tròn trái tim đập theo nhịp. Hai bạn phải chạm vào màn hình cùng một phần nghìn giây mà không được giao tiếp bằng lời!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Luật Chơi Thần Giao Cách Cảm
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <span>Đặt điện thoại ở giữa hai người, mỗi người đặt một ngón tay lên vùng chạm của mình.</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-emerald-900">Nghiêm cấm nói chuyện hoặc đếm nhịp:</strong>
                  <span className="block text-[11px] text-emerald-800 mt-0.5">
                    Chỉ quan sát nhịp co giãn của trái tim và cảm nhận khoảnh khắc chạm cùng nhau!
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-emerald-900">3 Lần Đồng Bộ Liên Tiếp:</strong>
                  <span className="block text-[11px] text-emerald-800 mt-0.5">
                    Độ lệch thời gian đo bằng mili-giây (ms). Chạm lệch quá giới hạn sẽ phải làm lại từ đầu!
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartArena}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Activity className="w-5 h-5" />
            <span>BẮT ĐẦU ĐỒNG BỘ TRÁI TIM</span>
          </button>
        </div>
      )}

      {/* PHASE 2: ACTIVE PULSING ARENA */}
      {phase === 'PULSING_ARENA' && (
        <div className="space-y-3 animate-in fade-in">
          {/* Top Streak Indicator */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-emerald-200 text-xs">
            <span className="text-slate-600 font-semibold">Chuỗi đồng bộ liên tiếp:</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full">
              <Flame className="w-4 h-4 fill-emerald-500" />
              <span>{consecutiveWins} / 3 Lần</span>
            </div>
          </div>

          {/* Interactive Split Touch Arena */}
          <div className="h-[430px] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl flex flex-col relative select-none">
            {/* Top Half: Player 2 (Em) */}
            <div
              onClick={() => handleTap('p2')}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-150 ${
                p2Tapped
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-950 text-indigo-200 active:bg-indigo-900'
              }`}
            >
              <div className="rotate-180 text-center px-4">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  VÙNG CHẠM CỦA {profile.name2.toUpperCase()}
                </span>
                <span className="text-sm font-black block mt-1">
                  {p2Tapped ? '✓ ĐÃ CHẠM!' : 'CHẠM VÀO ĐÂY'}
                </span>
              </div>
            </div>

            {/* Center Pulsing Heart Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center z-10">
              {/* Outer sweet-spot reference guide */}
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-300/60 flex items-center justify-center">
                {/* Glowing Heart pulsing in rhythm */}
                <div
                  style={{ transform: `scale(${pulseScale})` }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-rose-500/50 flex items-center justify-center transition-transform duration-75"
                >
                  <Heart className="w-12 h-12 text-white fill-white drop-shadow-md" />
                </div>
              </div>

              <div className="mt-2 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                Im lặng & Cảm nhận nhịp
              </div>
            </div>

            {/* Bottom Half: Player 1 (Anh) */}
            <div
              onClick={() => handleTap('p1')}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-150 ${
                p1Tapped
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-rose-200 active:bg-slate-800'
              }`}
            >
              <div className="text-center px-4">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  VÙNG CHẠM CỦA {profile.name1.toUpperCase()}
                </span>
                <span className="text-sm font-black block mt-1">
                  {p1Tapped ? '✓ ĐÃ CHẠM!' : 'CHẠM VÀO ĐÂY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: ROUND SUCCESS (Streak +1) */}
      {phase === 'ROUND_SUCCESS' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-5 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Đồng Bộ Thành Công!
            </span>

            <h2 className="text-xl font-black text-slate-900">
              Độ lệch chỉ: <span className="font-mono text-emerald-600">{deltaMs} ms</span>
            </h2>

            <p className="text-xs text-slate-600">
              Hai bạn đã đạt chuỗi: <strong>{consecutiveWins} / 3 lần liên tiếp</strong>
            </p>

            <button
              onClick={handleNextRound}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              <span>TIẾP TỤC NHỊP {consecutiveWins + 1} / 3</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: ROUND FAILED (Desynced) */}
      {phase === 'ROUND_FAILED' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Activity className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Lệch Nhịp Phản Xạ!
            </span>

            <h2 className="text-lg font-black text-slate-900">
              Độ lệch: <span className="font-mono text-rose-500">{deltaMs ? `${deltaMs} ms` : '> 600 ms'}</span>
            </h2>

            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Hai người cần chạm gần như đồng thời (chênh nhau dưới 200 mili-giây). Hãy cùng hít thở sâu và cảm nhận nhịp nhé!
            </p>

            <button
              onClick={handleNextRound}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              <span>THỬ LẠI TỪ ĐẦU (0/3)</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5: MATCH VICTORY (3 STREAK ACHIEVED!) */}
      {phase === 'MATCH_VICTORY' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Thần Giao Cách Cảm Đỉnh Cao!
            </span>

            <h2 className="text-2xl font-black text-slate-900">
              3 Lần Đồng Bộ Hoàn Hảo!
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Không cần một lời nói, hai trái tim đã đập chung một nhịp. Thử thách đồng điệu khó nhất đã bị hai bạn chinh phục!
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              🎉 Nhận ngay +280 LP và sẵn sàng cho Checkpoint 2!
            </div>

            <button
              onClick={handleFinishLevel}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Hoàn Thành Màn 9 (+280 LP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
