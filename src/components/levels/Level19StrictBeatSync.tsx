import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Heart, 
  Award, 
  Flame, 
  ShieldAlert, 
  Zap
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level19Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

export const Level19StrictBeatSync: React.FC<Level19Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Flow: 'prep' -> 'playing' -> 'success'
  const [gameState, setGameState] = useState<'prep' | 'playing' | 'success'>('prep');

  // Touch states
  const [p1Touching, setP1Touching] = useState<boolean>(false);
  const [p2Touching, setP2Touching] = useState<boolean>(false);
  const p1TouchRef = useRef<boolean>(false);
  const p2TouchRef = useRef<boolean>(false);

  // Consecutive synchronized beats (0 to 5)
  const [syncStreak, setSyncStreak] = useState<number>(0);
  const [beatPhase, setBeatPhase] = useState<number>(0); // 0 to 100% pulse cycle
  const [isBeatActive, setIsBeatActive] = useState<boolean>(false); // Exact beat window
  const [warningMessage, setWarningMessage] = useState<string>('');

  const metronomeRef = useRef<number | null>(null);

  // Synchronize ref with state
  const handleP1Start = (e: React.PointerEvent) => {
    e.preventDefault();
    setP1Touching(true);
    p1TouchRef.current = true;
    soundFx.playTap();
  };

  const handleP1End = (e: React.PointerEvent) => {
    e.preventDefault();
    setP1Touching(false);
    p1TouchRef.current = false;
  };

  const handleP2Start = (e: React.PointerEvent) => {
    e.preventDefault();
    setP2Touching(true);
    p2TouchRef.current = true;
    soundFx.playTap();
  };

  const handleP2End = (e: React.PointerEvent) => {
    e.preventDefault();
    setP2Touching(false);
    p2TouchRef.current = false;
  };

  const startPlaying = () => {
    soundFx.playBell();
    setSyncStreak(0);
    setWarningMessage('');
    setGameState('playing');
  };

  // Metronome Loop: Pulse cycle every 1600ms
  useEffect(() => {
    if (gameState !== 'playing') return;

    let cycleStart = Date.now();
    const cycleDuration = 1600; // ms

    metronomeRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - cycleStart) % cycleDuration;
      const progress = elapsed / cycleDuration;
      setBeatPhase(progress);

      // Beat hit point occurs at progress between 0.85 and 0.98 (~200ms window)
      if (progress >= 0.85 && progress <= 0.98) {
        if (!isBeatActive) {
          setIsBeatActive(true);
          soundFx.playBell();

          // Check if BOTH are holding
          const bothHolding = p1TouchRef.current && p2TouchRef.current;
          if (bothHolding) {
            setSyncStreak((prev) => {
              const next = prev + 1;
              soundFx.playSuccess();
              if (next >= 5) {
                if (metronomeRef.current) clearInterval(metronomeRef.current);
                soundFx.playFanfare();
                setGameState('success');
                return 5;
              }
              return next;
            });
            setWarningMessage('');
          } else {
            // Missed! Reset back to Beat 1
            soundFx.playAlert();
            setSyncStreak(0);
            if (!p1TouchRef.current && !p2TouchRef.current) {
              setWarningMessage('Lệch nhịp rồi! Cả hai chưa chạm vào vòng tròn đúng nhịp đập. Đã reset về Nhịp 1!');
            } else if (!p1TouchRef.current) {
              setWarningMessage(`Lệch nhịp rồi! ${p1} nhấc tay hoặc chạm trễ nhịp. Đã reset về Nhịp 1!`);
            } else {
              setWarningMessage(`Lệch nhịp rồi! ${p2} nhấc tay hoặc chạm trễ nhịp. Đã reset về Nhịp 1!`);
            }
          }
        }
      } else {
        setIsBeatActive(false);
      }
    }, 40);

    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, [gameState, isBeatActive, p1, p2]);

  const handleRestart = () => {
    soundFx.playPop();
    if (metronomeRef.current) clearInterval(metronomeRef.current);
    setSyncStreak(0);
    setWarningMessage('');
    setGameState('prep');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-rose-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
          Màn 19 · Nhịp Đập Đồng Sóng
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* PHASE 1: PREP & GUIDE */}
      {gameState === 'prep' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B141E] via-[#1F0D15] to-[#12060C] text-white shadow-xl space-y-4 border border-rose-900/60 text-left">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-lg">
              <Activity className="w-8 h-8 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black block">
                THỬ THÁCH PHẢN XẠ ĐỒNG THỜI NGHIÊM NGẶT
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Nhịp Đập Đồng Sóng
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {p1} và {p2} cùng chạm và giữ 2 vòng tròn cảm ứng đồng thời, duy trì liên tiếp <strong>5 nhịp đập trái tim</strong> chuẩn xác không lệch tích tắc!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-rose-200 space-y-2">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-white">
                <Zap className="w-4 h-4 text-rose-400" />
                Luật Chơi Khắt Khe:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-300 list-disc pl-4 leading-relaxed font-normal">
                <li>Vòng tròn nhịp tim ở giữa sẽ co giãn và phát ra tiếng gõ nhịp.</li>
                <li>Cả hai phải cùng <strong>chạm và giữ</strong> đúng khoảnh khắc vòng tròn nở to nhất!</li>
                <li>Nếu 1 người nhấc tay hoặc lệch nhịp $\to$ Chuỗi nhịp đập sẽ <strong>reset về 0</strong>!</li>
                <li>Đạt đủ <strong>5/5 nhịp liên tiếp</strong> để phá đảo màn chơi!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={startPlaying}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Activity className="w-4 h-4" />
            <span>Sẵn Sàng Chạm & Vào Nhịp Ngay!</span>
          </button>
        </div>
      )}

      {/* PHASE 2: STRICT CO-OP TOUCH ARENA */}
      {gameState === 'playing' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          {/* Streak indicator */}
          <div className="p-4 rounded-3xl bg-slate-950 text-white shadow-md flex items-center justify-between border border-rose-900/50">
            <div className="text-left">
              <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">
                CHUỖI ĐỒNG SÓNG
              </span>
              <span className="text-2xl font-black font-mono text-rose-400">
                {syncStreak} <span className="text-xs text-stone-500 font-normal">/ 5 nhịp</span>
              </span>
            </div>

            {/* Streak dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    i <= syncStreak
                      ? 'bg-rose-500 shadow-md shadow-rose-500/50 scale-110'
                      : 'bg-stone-800 border border-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Warning state if reset */}
          {warningMessage && (
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-shake">
              ⚠️ {warningMessage}
            </div>
          )}

          {/* CENTRAL PULSE VISUALIZER */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            {/* Pulsing ring */}
            <div
              style={{
                transform: `scale(${0.7 + beatPhase * 0.6})`,
                opacity: 0.3 + (1 - beatPhase) * 0.7,
              }}
              className={`absolute inset-0 rounded-full border-4 transition-transform duration-75 ${
                isBeatActive ? 'border-amber-300 bg-amber-400/20' : 'border-rose-500/40'
              }`}
            />

            <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all ${
              isBeatActive
                ? 'bg-amber-400 text-stone-950 scale-110 shadow-amber-400/50'
                : 'bg-gradient-to-tr from-rose-600 to-pink-600 text-white'
            }`}>
              <Heart className={`w-10 h-10 ${isBeatActive ? 'fill-stone-950 animate-bounce' : 'fill-white'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                {isBeatActive ? 'ĐẬP! 🔥' : 'HÒA NHỊP'}
              </span>
            </div>
          </div>

          {/* DUAL TOUCH PADS (Bottom side-by-side) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* P1 PAD */}
            <div
              onPointerDown={handleP1Start}
              onPointerUp={handleP1End}
              onPointerLeave={handleP1End}
              className={`h-40 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer touch-none select-none ${
                p1Touching
                  ? 'bg-rose-500 text-white border-rose-400 shadow-xl scale-95 ring-4 ring-rose-300/40'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-rose-500/50'
              }`}
            >
              <span className="text-3xl mb-1">{p1Touching ? '💖' : '👆'}</span>
              <span className="font-extrabold text-sm">{p1}</span>
              <span className="text-[10px] opacity-80 mt-0.5">
                {p1Touching ? 'ĐANG CHẠM GIỮ' : 'CHẠM & GIỮ VÀO ĐÂY'}
              </span>
            </div>

            {/* P2 PAD */}
            <div
              onPointerDown={handleP2Start}
              onPointerUp={handleP2End}
              onPointerLeave={handleP2End}
              className={`h-40 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer touch-none select-none ${
                p2Touching
                  ? 'bg-rose-500 text-white border-rose-400 shadow-xl scale-95 ring-4 ring-rose-300/40'
                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-rose-500/50'
              }`}
            >
              <span className="text-3xl mb-1">{p2Touching ? '💖' : '👆'}</span>
              <span className="font-extrabold text-sm">{p2}</span>
              <span className="text-[10px] opacity-80 mt-0.5">
                {p2Touching ? 'ĐANG CHẠM GIỮ' : 'CHẠM & GIỮ VÀO ĐÂY'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Cùng giữ tay trên 2 ô khi trái tim ở giữa đập nhịp lớn nhất!
          </p>
        </div>
      )}

      {/* PHASE 3: SUCCESS */}
      {gameState === 'success' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50 border border-rose-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white text-rose-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-rose-500" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              5 NHỊP TIM ĐỒNG SÓNG TUYỆT ĐỐI! 💓
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Không lệch một phần nghìn giây! Nhịp đập của {p1} & {p2} đã đồng điệu như một cơ thể duy nhất. Sẵn sàng tiến tới Màn 20 Vinh Quang!
            </p>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-rose-700 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+700 Love Power Đồng Sóng</span>
            </div>
          </div>

          <button
            onClick={() => onComplete(700, `Chạm giữ đồng điệu 5/5 nhịp đập nghiêm ngặt (${p1} & ${p2}).`)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn Thành Màn 19 & Nhận 700 LP</span>
          </button>
        </div>
      )}
    </div>
  );
};
