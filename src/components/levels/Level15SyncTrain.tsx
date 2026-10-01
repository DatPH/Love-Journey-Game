import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Zap, 
  Timer, 
  Heart, 
  Flame, 
  Award, 
  Lock, 
  Unlock, 
  Smartphone,
  ChevronRight,
  Crown
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level15Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

interface QuestionDef {
  id: number;
  question: string;
  topic: string;
  options: {
    label: string;
    icon: string;
  }[];
}

export const Level15SyncTrain: React.FC<Level15Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  const QUESTIONS: QuestionDef[] = [
    {
      id: 1,
      topic: 'Kế Hoạch Du Lịch Sắp Tới',
      question: 'Kỳ nghỉ hè tới nếu cùng nhau đi trốn, hai đứa sẽ chọn điểm đến nào?',
      options: [
        { label: 'Đi Biển, Tắm Nắng & Ăn Hải Sản', icon: '🌊' },
        { label: 'Lên Núi, Săn Mây & Uống Cà Phê Chill', icon: '🏔️' },
      ],
    },
    {
      id: 2,
      topic: 'Bữa Tối Cuối Tuần Này',
      question: 'Tối thứ Bảy này nếu chỉ được chọn duy nhất 1 món, hai đứa sẽ ăn gì?',
      options: [
        { label: 'Buffet Thịt Nướng Xì Xèo', icon: '🥩' },
        { label: 'Nồi Lẩu Nóng Hổi Đậm Đà', icon: '🍲' },
      ],
    },
    {
      id: 3,
      topic: 'Thành Viên Bốn Chân Tương Lai',
      question: 'Khi về chung một nhà, hai đứa muốn đón người bạn nhỏ nào trước?',
      options: [
        { label: 'Một bé Cún ngoan ngoãn & trung thành', icon: '🐶' },
        { label: 'Một "Hoàng Thượng" Mèo sang chảnh & quấn người', icon: '🐱' },
      ],
    },
  ];

  // Game state:
  // 'intro' -> 'round_p1' (5s countdown) -> 'round_hand_off' -> 'round_p2' (5s countdown) -> 'round_reveal' -> 'final'
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [state, setState] = useState<'intro' | 'round_p1' | 'round_hand_off' | 'round_p2' | 'round_reveal' | 'final'>('intro');

  const [p1Pick, setP1Pick] = useState<number | null>(null);
  const [p2Pick, setP2Pick] = useState<number | null>(null);

  // 5s silent timer
  const [countdown, setCountdown] = useState<number>(5);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const [results, setResults] = useState<{ round: number; isMatch: boolean; qText: string }[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [penaltyText, setPenaltyText] = useState<string>('');

  const currentQ = QUESTIONS[currentRound] || QUESTIONS[0];

  // 5-second countdown timer
  useEffect(() => {
    let interval: number;
    if (isTimerActive && (state === 'round_p1' || state === 'round_p2')) {
      interval = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            soundFx.playBell();
            setIsTimerActive(false);
            // Auto advance if time runs out
            if (state === 'round_p1') {
              setState('round_hand_off');
            } else if (state === 'round_p2') {
              handleEvaluateRound();
            }
            return 0;
          }
          if (c <= 3) soundFx.playTap();
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, state, p1Pick, p2Pick]);

  const handleStartGame = () => {
    soundFx.playPop();
    setCurrentRound(0);
    setResults([]);
    setMatchedCount(0);
    startP1Turn();
  };

  const startP1Turn = () => {
    setP1Pick(null);
    setP2Pick(null);
    setCountdown(5);
    setIsTimerActive(true);
    setState('round_p1');
  };

  const handleP1Select = (idx: number) => {
    soundFx.playPop();
    setP1Pick(idx);
    setIsTimerActive(false);
    setState('round_hand_off');
  };

  const handleUnlockP2 = () => {
    soundFx.playPop();
    setCountdown(5);
    setIsTimerActive(true);
    setState('round_p2');
  };

  const handleP2Select = (idx: number) => {
    soundFx.playPop();
    setP2Pick(idx);
    setIsTimerActive(false);
    evaluateRoundWithP2(idx);
  };

  const evaluateRoundWithP2 = (p2Choice: number) => {
    const isMatch = p1Pick === p2Choice;
    if (isMatch) {
      soundFx.playSuccess();
      setMatchedCount((m) => m + 1);
    } else {
      soundFx.playTap();
    }

    setResults((prev) => [
      ...prev,
      { round: currentRound + 1, isMatch, qText: currentQ.question },
    ]);
    setState('round_reveal');
  };

  const handleEvaluateRound = () => {
    const isMatch = p1Pick !== null && p2Pick !== null && p1Pick === p2Pick;
    if (isMatch) {
      soundFx.playSuccess();
      setMatchedCount((m) => m + 1);
    }
    setResults((prev) => [
      ...prev,
      { round: currentRound + 1, isMatch, qText: currentQ.question },
    ]);
    setState('round_reveal');
  };

  const handleNextRound = () => {
    soundFx.playPop();
    if (currentRound < QUESTIONS.length - 1) {
      setCurrentRound((r) => r + 1);
      startP1Turn();
    } else {
      // Completed all 3 questions
      setState('final');
      if (matchedCount < 2) {
        const PENALTIES = [
          'Cùng nhau nắm tay nhìn thẳng vào mắt đối phương trong 60 giây không được chớp mắt.',
          'Cả hai cùng nhau đứng lên làm 10 cái squat đồng điệu.',
          'Mỗi người nói 3 điều mình thích nhất ở ngoại hình của người kia.',
          'Cùng nhau dọn dẹp phòng ngủ và gấp chăn ga thật ngay ngắn.',
        ];
        setPenaltyText(PENALTIES[Math.floor(Math.random() * PENALTIES.length)]);
      }
    }
  };

  const handleRestart = () => {
    soundFx.playPop();
    setCurrentRound(0);
    setP1Pick(null);
    setP2Pick(null);
    setResults([]);
    setMatchedCount(0);
    setPenaltyText('');
    setState('intro');
  };

  const isPassed = matchedCount >= 2;

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-amber-200 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>Checkpoint 3 · Màn 15</span>
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* INTRO SCREEN */}
      {state === 'intro' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B1B15] via-[#1D1210] to-[#120B0A] text-white shadow-xl space-y-4 border border-amber-900/60">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
              <Zap className="w-8 h-8 fill-amber-400" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black block">
                ĐẠI THỬ THÁCH CHECKPOINT GIAI ĐOẠN 3
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Chuyến Tàu Đồng Sóng
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed px-2 font-light">
                3 câu hỏi nhanh về tương lai chung. Mỗi người chỉ có đúng <strong>5 giây</strong> để bí mật chọn đáp án trong im lặng tuyệt đối!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-amber-200 text-left space-y-1">
              <span className="font-extrabold flex items-center gap-1 text-[11px]">
                🏆 Điều kiện chiến thắng:
              </span>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Khớp từ <strong>2 / 3 câu hỏi</strong> để kích hoạt pháo hoa chiến thắng và nhận ngay <strong>+500 Love Power</strong>!
              </p>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Bắt Đầu Câu Số 1 (5s Đếm Ngược)</span>
          </button>
        </div>
      )}

      {/* P1 TURN */}
      {state === 'round_p1' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Header timer */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-white text-rose-600 font-black text-xs flex items-center justify-center">
                {p1.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-[10px] text-rose-200 uppercase font-black tracking-widest">
                  Lượt {p1} · Im lặng tuyệt đối!
                </p>
                <p className="text-xs font-bold text-white">Câu {currentRound + 1}/3</p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="w-10 h-10 rounded-full bg-black/25 flex items-center justify-center text-lg font-black font-mono text-amber-300 animate-pulse">
              {countdown}s
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
              {currentQ.topic}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* 2 Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleP1Select(idx)}
                className={`w-full p-4 rounded-2xl text-left border shadow-sm transition-all active:scale-95 ${
                  p1Pick === idx
                    ? 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-200'
                    : 'bg-white text-slate-800 border-stone-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-extrabold text-xs leading-snug">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HAND OFF CURTAIN */}
      {state === 'round_hand_off' && (
        <div className="py-8 px-4 text-center space-y-6 bg-slate-950 text-white rounded-3xl shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black">
              ĐÃ KHÓA ĐÁP ÁN CỦA {p1} 🔒
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Chuyền máy ngay cho {p2}!
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              {p2} sẽ có đúng 5 giây đếm ngược để chọn đáp án tương ứng.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleUnlockP2}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Unlock className="w-4 h-4" />
              <span>Tôi Là {p2} - Bắt Đầu 5s Chọn Nhanh</span>
            </button>
          </div>
        </div>
      )}

      {/* P2 TURN */}
      {state === 'round_p2' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Header timer */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-white text-amber-600 font-black text-xs flex items-center justify-center">
                {p2.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-[10px] text-amber-200 uppercase font-black tracking-widest">
                  Lượt {p2} · Im lặng tuyệt đối!
                </p>
                <p className="text-xs font-bold text-white">Câu {currentRound + 1}/3</p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="w-10 h-10 rounded-full bg-black/25 flex items-center justify-center text-lg font-black font-mono text-white animate-pulse">
              {countdown}s
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
              {currentQ.topic}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* 2 Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleP2Select(idx)}
                className={`w-full p-4 rounded-2xl text-left border shadow-sm transition-all active:scale-95 ${
                  p2Pick === idx
                    ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-200'
                    : 'bg-white text-slate-800 border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-extrabold text-xs leading-snug">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ROUND REVEAL */}
      {state === 'round_reveal' && p1Pick !== null && p2Pick !== null && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className={`p-5 rounded-3xl border shadow-sm ${
            p1Pick === p2Pick
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
              {p1Pick === p2Pick ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              ) : (
                <XCircle className="w-12 h-12 text-rose-500" />
              )}
            </div>

            <h3 className="text-base font-black mb-1">
              {p1Pick === p2Pick ? 'ĐỒNG SÓNG HOÀN TOÀN! ⚡' : 'LỆCH PHA RỒI! 😅'}
            </h3>
            <p className="text-xs font-semibold">
              {p1Pick === p2Pick
                ? `Cả hai đều chọn: "${currentQ.options[p1Pick].label}"`
                : `${p1} chọn "${currentQ.options[p1Pick]?.label || ''}" nhưng ${p2} chọn "${currentQ.options[p2Pick]?.label || ''}"`}
            </p>
          </div>

          <button
            onClick={handleNextRound}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-stone-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{currentRound < QUESTIONS.length - 1 ? 'Tiếp Tục Câu Sau' : 'Xem Kết Quả Checkpoint 3'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FINAL CHECKPOINT 3 CELEBRATION */}
      {state === 'final' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className={`p-6 rounded-3xl border shadow-md ${
            isPassed 
              ? 'bg-gradient-to-b from-amber-50 via-rose-50 to-purple-50 border-amber-300' 
              : 'bg-gradient-to-b from-rose-50 to-orange-50 border-rose-200'
          }`}>
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-3 shadow-lg bg-white">
              {isPassed ? (
                <Crown className="w-10 h-10 text-amber-500 fill-amber-400 animate-bounce" />
              ) : (
                <Flame className="w-10 h-10 text-rose-500" />
              )}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              {isPassed ? 'CHINH PHỤC CHECKPOINT 3! 👑' : 'LỆCH PHA CHƯA THỂ QUA CỘT MỐC! 💔'}
            </h2>

            <p className="text-xs text-slate-600 mb-3 px-2">
              Kết quả: <strong className="text-amber-800 text-sm">{matchedCount}/3 câu</strong> trùng khớp suy nghĩ về tương lai
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-amber-800 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{isPassed ? '+500 Love Power' : '+200 LP An Ủi'}</span>
            </div>
          </div>

          {/* Penalty box if failed */}
          {!isPassed && penaltyText && (
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>HÌNH PHẠT ĐỒNG ĐIỆU:</span>
              </div>
              <p className="text-xs font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-2xl border border-rose-100">
                "{penaltyText}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {isPassed ? (
              <button
                onClick={() => onComplete(500, `Chinh phục Checkpoint 3 thành công rực rỡ với ${matchedCount}/3 câu đồng sóng!`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành Màn 15 & Nhận 500 LP</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử Thách Lại Để Đạt Từ 2/3 Câu</span>
                </button>
                <button
                  onClick={() => onComplete(200, `Đã cùng chịu phạt đồng điệu: "${penaltyText}"`)}
                  className="w-full py-3 rounded-2xl bg-white border border-stone-300 text-slate-600 font-bold text-xs hover:bg-stone-50 transition-colors"
                >
                  <span>Chấp Nhận Chịu Phạt & Qua Màn (+200 LP)</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
