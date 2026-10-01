import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Music, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Send, 
  Flame,
  Volume2
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level6SingingChainProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

const STARTING_KEYWORDS = ['Yêu', 'Đêm', 'Mưa', 'Nhớ', 'Mơ', 'Say', 'Thương', 'Tim', 'Nắng', 'Gió', 'Môi', 'Tay'];

const PENALTIES = [
  'Thơm má đối phương 3 cái thật kêu và ngọt ngào! 💋',
  'Uống cạn một cốc nước đầy không được nghỉ nhịp nào! 🥤',
  'Tạo dáng mặt xấu ngộ nghĩnh nhất cho người kia ngắm 10 giây! 🤪',
  'Hát chay một đoạn điệp khúc bằng giọng sóc chuột líu lo! 🐿️',
  'Nói "Anh/Em yêu đối phương nhất trần đời" 5 lần với 5 sắc thái khác nhau! 💖',
  'Nhắm mắt để đối phương đút cho 1 thìa đồ ăn hoặc ngụm nước! 🥄',
];

const PASS_THRESHOLD = 10;

type Phase = 'INTRO' | 'TURN_ACTIVE' | 'TIMEOUT_FAIL' | 'COMPLETED_SUCCESS';

export const Level6SingingChain: React.FC<Level6SingingChainProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [activePlayer, setActivePlayer] = useState<string>(profile.name1);
  const [currentKeyword, setCurrentKeyword] = useState<string>('Yêu');
  const [nextWordInput, setNextWordInput] = useState<string>('');
  const [chainCount, setChainCount] = useState<number>(0);
  const [singHistory, setSingHistory] = useState<{ singer: string; word: string; nextWord: string }[]>([]);
  
  // 20-second countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Penalty draw state
  const [drawnPenalty, setDrawnPenalty] = useState<string>(PENALTIES[0]);
  const [penaltyAccepted, setPenaltyAccepted] = useState<boolean>(false);

  // Clear timer safely on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop when TURN_ACTIVE
  useEffect(() => {
    if (phase === 'TURN_ACTIVE' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            soundFx.playBeep(true);
            // Time out: Fail turn!
            handleTimeout();
            return 0;
          }
          if (prev <= 5) {
            soundFx.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeft]);

  // Start the battle
  const handleStartBattle = () => {
    soundFx.playPop();
    const initialWord = STARTING_KEYWORDS[Math.floor(Math.random() * STARTING_KEYWORDS.length)];
    setCurrentKeyword(initialWord);
    setActivePlayer(profile.name1);
    setChainCount(0);
    setSingHistory([]);
    setTimeLeft(20);
    setNextWordInput('');
    setPenaltyAccepted(false);
    setPhase('TURN_ACTIVE');
  };

  // Timeout handler
  const handleTimeout = () => {
    soundFx.playBeep(false);
    const randomPen = PENALTIES[Math.floor(Math.random() * PENALTIES.length)];
    setDrawnPenalty(randomPen);
    setPhase('TIMEOUT_FAIL');
  };

  // Turn successful submission
  const handleSubmitTurn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phase !== 'TURN_ACTIVE') return;

    soundFx.playPop();
    const cleanWord = nextWordInput.trim();
    const nextWord = cleanWord || STARTING_KEYWORDS[Math.floor(Math.random() * STARTING_KEYWORDS.length)];

    setSingHistory((prev) => [
      ...prev,
      {
        singer: activePlayer,
        word: currentKeyword,
        nextWord: nextWord,
      },
    ]);

    const nextChain = chainCount + 1;
    setChainCount(nextChain);

    // If reached 10 successful chained verses, celebrate victory!
    if (nextChain >= PASS_THRESHOLD) {
      soundFx.playFanfare();
      triggerConfetti();
      setPhase('COMPLETED_SUCCESS');
      return;
    }

    // Switch to other player with new keyword
    const nextPlayer = activePlayer === profile.name1 ? profile.name2 : profile.name1;
    setActivePlayer(nextPlayer);
    setCurrentKeyword(nextWord);
    setNextWordInput('');
    setTimeLeft(20);
  };

  const handleFinishLevel = (notes: string) => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(220, notes);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => {
            soundFx.playPop();
            if (timerRef.current) clearInterval(timerRef.current);
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bản đồ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Màn 6 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Hát Nối Chữ</span>
        </div>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'INTRO' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-semibold mb-2">
              <Mic className="w-3.5 h-3.5" />
              <span>Thử Thách Âm Nhạc Đối Kháng</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Đại Chiến Hát Nối Chữ
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Thử tài phản xạ âm nhạc! Hát một câu chứa từ khóa trong 20 giây, từ cuối câu sẽ thành thử thách cho đối phương!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-blue-500" />
              Luật Chơi Hát Nối 20 Giây
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60">
                <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <span>Ứng dụng cấp từ khóa ngẫu nhiên (Ví dụ: <strong>"Yêu"</strong>).</span>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60">
                <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <span>
                  Đồng hồ đếm ngược <strong>20 giây</strong>. Người đến lượt phải hát to một câu hát có chứa từ khóa đó!
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60">
                <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <span>
                  Từ cuối cùng của câu hát trở thành từ khóa cho người tiếp theo (Ví dụ: "Vì em quá <strong>yêu</strong> anh nhiều <strong>quá</strong>" → Từ kế tiếp là <strong>"Quá"</strong>).
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200/60">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  !
                </span>
                <span>Hết 20 giây không hát được hoặc hát lặp bài cũ sẽ phải chịu <strong>Hình Phạt Ngọt Ngào</strong>!</span>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  🎯
                </span>
                <span>
                  <strong>Mục tiêu chiến thắng:</strong> Cùng nhau nối thành công liên tiếp <strong>10 câu hát</strong> để vượt qua màn chơi!
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartBattle}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Mic className="w-5 h-5" />
            <span>BẮT ĐẦU ĐẠI CHIẾN HÁT NỐI (MỤC TIÊU 10 CÂU)</span>
          </button>
        </div>
      )}

      {/* PHASE 2: TURN ACTIVE (20-SECOND SUSPENSE COUNTDOWN) */}
      {phase === 'TURN_ACTIVE' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Singer Badge & Streak */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                {activePlayer.charAt(0)}
              </span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lượt hát:</span>
                <span className="text-xs font-bold text-slate-800">{activePlayer}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-extrabold text-xs">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>Tiến độ: {chainCount} / {PASS_THRESHOLD} câu</span>
            </div>
          </div>

          {/* Central Keyword & Timer Arena */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white text-center shadow-xl border-2 border-blue-400/40 relative overflow-hidden">
            {/* Countdown Badge */}
            <div className="flex justify-center mb-3">
              <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                timeLeft <= 3 
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse scale-105' 
                  : 'border-blue-400 bg-blue-500/20 text-blue-300'
              }`}>
                <span className="font-mono text-3xl font-black">{timeLeft}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">GIÂY</span>
              </div>
            </div>

            <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest block mb-1">
              Từ Khóa Bắt Buộc Trong Câu Hát
            </span>

            {/* Glowing Big Keyword */}
            <div className="text-4xl font-black text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] my-2">
              "{currentKeyword}"
            </div>

            <p className="text-xs text-blue-100/80 max-w-xs mx-auto mt-1">
              {activePlayer} hãy hát thật to câu hát chứa từ <strong>"{currentKeyword}"</strong> trước khi hết giờ!
            </p>
          </div>

          {/* Input for Next Word */}
          <form onSubmit={handleSubmitTurn} className="p-4 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Từ Cuối Cùng Của Câu Vừa Hát (Cho người tiếp theo):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nextWordInput}
                  onChange={(e) => setNextWordInput(e.target.value)}
                  placeholder="Ví dụ: Đêm, Mơ, Thương,..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Đổi Lượt</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Gợi ý: Nếu chưa kịp nhập, bấm "Đổi Lượt" hệ thống sẽ tự chọn từ nối ngẫu nhiên!
              </span>
            </div>

            {/* Emergency Give Up Button */}
            <button
              type="button"
              onClick={handleTimeout}
              className="w-full py-2 text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Bí bài rồi, chấp nhận chịu phạt!
            </button>
          </form>

          {/* Singing History */}
          {singHistory.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Chuỗi câu hát vừa nối:
              </span>
              {singHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700 text-[11px]">
                  <span>{item.singer}: Chứa từ <strong>"{item.word}"</strong></span>
                  <span className="text-blue-600 font-bold">→ Chuyền từ: "{item.nextWord}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: TIMEOUT / FAIL => PENALTY DRAW */}
      {phase === 'TIMEOUT_FAIL' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="p-5 rounded-3xl bg-white border-2 border-rose-300 shadow-xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-50">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">
              Hết 20 Giây Không Kịp Hát Nối!
            </span>

            <h2 className="text-lg font-black text-slate-900">
              {activePlayer} Chịu Hình Phạt Ngọt Ngào
            </h2>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-1.5">
              <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Nhiệm Vụ Hình Phạt Bốc Thăm:
              </span>
              <p className="text-sm font-black text-rose-950 leading-relaxed">
                "{drawnPenalty}"
              </p>
            </div>

            <div className="pt-2 space-y-2">
              {!penaltyAccepted ? (
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setPenaltyAccepted(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã Thực Hiện Hình Phạt Xong!</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFinishLevel(
                      `Đại chiến hát nối chữ: ${activePlayer} đã dũng cảm thực hiện hình phạt "${drawnPenalty}"!`
                    );
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn Thành Màn 6 (+220 LP)</span>
                </button>
              )}

              <button
                onClick={handleStartBattle}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hát lại từ đầu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: SUCCESS CHAIN (COMPLETED >= 10 SONGS) */}
      {phase === 'COMPLETED_SUCCESS' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="p-5 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Tuyệt Đỉnh Song Ca!
            </span>

            <h2 className="text-xl font-black text-slate-900">
              Nối Thành Công Trọn Vẹn 10 Câu Hát!
            </h2>

            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Hai bạn đã phối hợp cực kỳ ăn ý và phản xạ thần tốc trong từng câu hát. Cặp đôi vàng trong làng âm nhạc!
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              🎉 Nhận ngay +220 LP cho màn song ca xuất sắc!
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  handleFinishLevel(
                    `Đại chiến hát nối chữ: Hai bạn đã xuất sắc nối thành công ${chainCount} câu hát liên tiếp không trật nhịp nào!`
                  );
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành Màn 6 (+220 LP)</span>
              </button>

              <button
                onClick={handleStartBattle}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi tiếp vòng mới</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
