import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Footprints, 
  EyeOff, 
  Award, 
  Flame, 
  Volume2, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level16Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

export const Level16BlindSteps: React.FC<Level16Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Flow: 'prep' -> 'countdown_ready' (3s) -> 'stepping' (10 steps) -> 'verify' -> 'success' | 'failed'
  const [gameState, setGameState] = useState<'prep' | 'countdown_ready' | 'stepping' | 'verify' | 'success' | 'failed'>('prep');
  
  const [readyCountdown, setReadyCountdown] = useState<number>(3);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [penaltyText, setPenaltyText] = useState<string>('');

  const stepTimerRef = useRef<number | null>(null);

  // Ready Countdown (3-2-1)
  useEffect(() => {
    let interval: number;
    if (gameState === 'countdown_ready') {
      interval = window.setInterval(() => {
        setReadyCountdown((c) => {
          if (c <= 1) {
            soundFx.playBeep(true);
            setGameState('stepping');
            return 0;
          }
          soundFx.playBeep(false);
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Stepping rhythm loop (10 steps spaced by 1.4s)
  useEffect(() => {
    if (gameState === 'stepping') {
      setCurrentStep(1);
      soundFx.playBell();

      let step = 1;
      stepTimerRef.current = window.setInterval(() => {
        step += 1;
        if (step > 10) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          soundFx.playFanfare();
          setGameState('verify');
        } else {
          setCurrentStep(step);
          soundFx.playBell();
        }
      }, 1400);
    }

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [gameState]);

  const handleStartReady = () => {
    soundFx.playPop();
    setReadyCountdown(3);
    setGameState('countdown_ready');
  };

  const handleConfirmResult = (isMatched: boolean) => {
    if (isMatched) {
      soundFx.playSuccess();
      setGameState('success');
    } else {
      soundFx.playAlert();
      const PENALTIES = [
        'Cõng người ấy 5 bước chân thật nhẹ nhàng và nịnh một câu.',
        'Cùng nhau nắm tay nhảy lò cò 10 nhịp đồng thanh.',
        'Mỗi người bóp vai cho đối phương 1 phút để "bù đắp sai số".',
        'Uống chung một cốc nước ấm và nói "Lần sau chân mình sẽ bước đều hơn!".',
      ];
      setPenaltyText(PENALTIES[Math.floor(Math.random() * PENALTIES.length)]);
      setGameState('failed');
    }
  };

  const handleRestart = () => {
    soundFx.playPop();
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    setCurrentStep(0);
    setReadyCountdown(3);
    setPenaltyText('');
    setGameState('prep');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-sky-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          Màn 16 · Song Hành Vô Định
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* PHASE 1: PREPARATION & RULES */}
      {gameState === 'prep' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182335] via-[#101926] to-[#0A101A] text-white shadow-xl space-y-4 border border-sky-900/60 text-left">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-lg">
              <Footprints className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-sky-400 uppercase tracking-widest font-black block">
                THỬ THÁCH ĐỒNG BỘ BƯỚC CHÂN
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Song Hành Vô Định
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {p1} và {p2} đứng kề vai sát cánh, nhắm chặt mắt và bước đi đúng 10 bước chân theo nhịp chuông của app!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-sky-200 space-y-2">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-white">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Quy Tắc Thử Thách:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-300 list-disc pl-4 leading-relaxed font-normal">
                <li>Đứng ngang hàng, mũi chân bằng nhau ở vạch xuất phát.</li>
                <li>Cả hai nhắm chặt mắt, không nói chuyện và không mở hé mắt.</li>
                <li>Mỗi tiếng chuông ngân vang, bước về phía trước 1 bước.</li>
                <li>Hết 10 bước: Mở mắt và kiểm tra vị trí dừng chân!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartReady}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <EyeOff className="w-4 h-4" />
            <span>Đã Đứng Sẵn Sàng & Nhắm Mắt</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 3-2-1 COUNTDOWN */}
      {gameState === 'countdown_ready' && (
        <div className="py-12 px-4 text-center space-y-6 bg-slate-950 text-white rounded-3xl shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-24 h-24 mx-auto rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-4xl font-black font-mono text-sky-300 animate-pulse">
            {readyCountdown}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">
              Cả hai nhắm chặt mắt lại nào... 🙈
            </h3>
            <p className="text-xs text-stone-400">
              Chuẩn bị bước đi khi nghe tiếng chuông ngân!
            </p>
          </div>
        </div>
      )}

      {/* PHASE 3: 10 STEPS RHYTHMIC PROGRESS */}
      {gameState === 'stepping' && (
        <div className="py-8 px-4 text-center space-y-6 bg-slate-950 text-white rounded-3xl shadow-xl animate-in fade-in duration-150">
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* Outer animated ring */}
            <div className="absolute inset-0 rounded-full border-4 border-sky-500/30 animate-ping" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-sky-500/30">
              <span className="text-[10px] uppercase font-black text-sky-200 tracking-widest">BƯỚC</span>
              <span className="text-4xl font-black font-mono text-white mt-0.5">{currentStep}</span>
              <span className="text-[10px] font-bold text-sky-300">/ 10</span>
            </div>
          </div>

          {/* Stepping dots */}
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx < currentStep
                    ? 'w-4 bg-sky-400'
                    : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
              <Volume2 className="w-4 h-4 text-sky-400 animate-bounce" />
              <span>Tiếp tục bước chân đều theo nhịp...</span>
            </h3>
            <p className="text-xs text-stone-400">
              Cảm nhận nhịp thở và bước chân của người bên cạnh!
            </p>
          </div>
        </div>
      )}

      {/* PHASE 4: VERIFICATION INSPECTION */}
      {gameState === 'verify' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
              <Footprints className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                10 Bước Đã Hoàn Thành! 🏁
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                Bây giờ, hãy mở mắt và nhìn xuống vị trí bàn chân của cả hai người.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-slate-700 text-left space-y-1">
              <span className="font-extrabold text-sky-800 text-[11px] block">
                ⚖️ Đánh Giá Độ Đồng Điệu:
              </span>
              <p className="text-slate-600 leading-relaxed">
                Nếu hai bạn dừng lại ngang hàng nhau (mũi chân chênh lệch <strong>dưới nửa bước chân</strong>) $\to$ <strong>Đồng Điệu Hoàn Hảo!</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleConfirmResult(true)}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ngang Hàng (Thành Công)</span>
              </button>

              <button
                onClick={() => handleConfirmResult(false)}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <XCircle className="w-4 h-4" />
                <span>Lệch Quá Nửa Bước</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 5: SUCCESS */}
      {gameState === 'success' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white text-emerald-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-emerald-500" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              BƯỚC CHÂN TÂM ĐẦU Ý HỢP! 👣
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Dù nhắm mắt, hai bạn vẫn có cùng một sải chân và nhịp độ. Sự thấu hiểu cơ thể của nhau thật đáng kinh ngạc!
            </p>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-emerald-700 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+550 Love Power Đồng Điệu</span>
            </div>
          </div>

          <button
            onClick={() => onComplete(550, `Đồng bộ hoàn hảo 10 bước chân bịt mắt (${p1} & ${p2}).`)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn Thành Màn 16 & Nhận 550 LP</span>
          </button>
        </div>
      )}

      {/* PHASE 6: FAILED / PENALTY */}
      {gameState === 'failed' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-50 to-orange-50 border border-rose-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white text-rose-500 flex items-center justify-center shadow-md">
              <Flame className="w-8 h-8 text-rose-500" />
            </div>

            <h2 className="text-lg font-black text-slate-900">
              LỆCH SẢI CHÂN CHÚT RỒI! 😅
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Một người bước quá dài hoặc một người đi quá vội rồi! Hãy cùng nhau chấp nhận hình phạt vui nhộn hoặc thử thách lại nhé:
            </p>

            {penaltyText && (
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 text-xs font-semibold text-rose-900 leading-relaxed shadow-2xs">
                "{penaltyText}"
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleRestart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử Thách Lại Từ Đầu</span>
            </button>

            <button
              onClick={() => onComplete(250, `Đã chấp nhận hình phạt đồng điệu: "${penaltyText}"`)}
              className="w-full py-3 rounded-2xl bg-white border border-stone-300 text-slate-600 font-bold text-xs hover:bg-stone-50 transition-colors"
            >
              <span>Chấp Nhận Chịu Phạt & Qua Màn (+250 LP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
