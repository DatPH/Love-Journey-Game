import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  Drama,
  Check,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level8FlawCharadesProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

interface FlawItem {
  id: string;
  name: string;
  emoji: string;
  hint: string;
}

const FLAW_POOL: FlawItem[] = [
  { id: 'flaw-1', name: 'Ngủ nướng khò khè tới tận trưa trật', emoji: '😴', hint: 'Giả vờ ngáy to, dụi mắt, trùm chăn ngủ nướng' },
  { id: 'flaw-2', name: 'Nghiện trà sữa trân châu 100% đường', emoji: '🧋', hint: 'Hành động cắm ống hút, lắc ly trà sữa, nhai trân châu' },
  { id: 'flaw-3', name: 'Lướt TikTok cười sặc sụa lúc nửa đêm', emoji: '📱', hint: 'Hai tay cầm điện thoại quẹt lên, cười khúc khích' },
  { id: 'flaw-4', name: 'Lười rửa bát kiếm cớ trốn vào toilet', emoji: '🧼', hint: 'Nhìn đống bát đĩa rồi ôm bụng giả vờ đau bụng' },
  { id: 'flaw-5', name: 'Mua sắm chốt đơn lia lịa lúc 0h đêm', emoji: '🛍️', hint: 'Bấm màn hình liên tục chốt đơn, xách túi đồ nặng' },
  { id: 'flaw-6', name: 'Hay dỗi vu vơ "Em/Anh không sao đâu"', emoji: '😤', hint: 'Khoanh tay, quay ngoắt mặt đi phụng phịu' },
  { id: 'flaw-7', name: 'Soi gương chải chuốt ngắm nghía 30 phút', emoji: '🪞', hint: 'Cầm gương soi, vuốt tóc, dặm phấn, tạo dáng' },
  { id: 'flaw-8', name: 'Vứt tất vớ vung vãi mỗi nơi một chiếc', emoji: '🧦', hint: 'Tháo tất ném bay lung tung sang hai bên' },
];

const SHARED_PENALTIES = [
  'Cùng nhau hát chay 1 bài hát thiếu nhi mà cả hai nhớ nhất! 🎶',
  'Cùng ăn chung 1 món ăn hoặc uống chung 1 cốc nước bằng 2 ống hút! 🥤',
  'Mỗi người chịu 1 cái bẹo má ngọt ngào từ đối phương! 🤏',
  'Ôm nhau thật chặt và nói lời cảm ơn trong 30 giây! 🫂',
];

type Phase = 'INTRO' | 'SECRET_SELECTION' | 'PREPARE_ACT' | 'ACTING_45S' | 'TIMEOUT_FAIL' | 'SUCCESS_WIN';

export const Level8FlawCharades: React.FC<Level8FlawCharadesProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  
  // Selected 3 secret flaws by Player 1
  const [selectedFlawIds, setSelectedFlawIds] = useState<string[]>([]);
  // Correctly guessed flaw IDs by Player 2
  const [guessedFlawIds, setGuessedFlawIds] = useState<string[]>([]);

  // 45-second countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shared penalty
  const [penaltyText, setPenaltyText] = useState<string>(SHARED_PENALTIES[0]);

  // Clean timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop in ACTING_45S
  useEffect(() => {
    if (phase === 'ACTING_45S' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          if (prev <= 5) {
            soundFx.playBeep(false);
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

  // Timeout handler
  const handleTimeout = () => {
    soundFx.playBeep(false);
    const pen = SHARED_PENALTIES[Math.floor(Math.random() * SHARED_PENALTIES.length)];
    setPenaltyText(pen);
    setPhase('TIMEOUT_FAIL');
  };

  // Toggle selection of 3 secret flaws by Player 1
  const handleToggleFlawSelection = (id: string) => {
    soundFx.playPop();
    if (selectedFlawIds.includes(id)) {
      setSelectedFlawIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (selectedFlawIds.length < 3) {
        setSelectedFlawIds((prev) => [...prev, id]);
      }
    }
  };

  // Player 2 taps a flaw to guess
  const handleGuessTap = (id: string) => {
    if (phase !== 'ACTING_45S') return;
    if (guessedFlawIds.includes(id)) return;

    if (selectedFlawIds.includes(id)) {
      // Correct guess!
      soundFx.playPop();
      const updated = [...guessedFlawIds, id];
      setGuessedFlawIds(updated);

      // Check if all 3 guessed!
      if (updated.length === 3) {
        if (timerRef.current) clearInterval(timerRef.current);
        soundFx.playFanfare();
        triggerConfetti();
        setPhase('SUCCESS_WIN');
      }
    } else {
      // Wrong guess
      soundFx.playBeep(false);
    }
  };

  const handleStartGame = () => {
    soundFx.playPop();
    setSelectedFlawIds([]);
    setGuessedFlawIds([]);
    setTimeLeft(45);
    setPhase('SECRET_SELECTION');
  };

  const handleFinishLevel = (notes: string) => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(260, notes);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Header */}
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
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Màn 8 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Đồng Tâm Kịch Câm</span>
        </div>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'INTRO' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-semibold mb-2">
              <Drama className="w-3.5 h-3.5" />
              <span>Thử Thách Kịch Câm 45 Giây</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bí Mật Tật Xấu
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              {profile.name1} bí mật chọn 3 tật xấu hài hước của {profile.name2} rồi diễn kịch câm trong 45 giây để người kia đoán đúng!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Cách Thức Chơi Kịch Câm
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-amber-900">Bí mật chọn 3 tật xấu:</strong>
                  <span className="block text-[11px] text-amber-800 mt-0.5">
                    {profile.name1} cầm máy và chọn 3 tật xấu đáng yêu nhất từ danh sách.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-amber-900">Diễn kịch câm không lời (45s):</strong>
                  <span className="block text-[11px] text-amber-800 mt-0.5">
                    {profile.name1} chỉ dùng cử chỉ và biểu cảm, <strong>tuyệt đối không phát ra âm thanh</strong>.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-amber-900">{profile.name2} chạm màn hình để đoán:</strong>
                  <span className="block text-[11px] text-amber-800 mt-0.5">
                    Đoán đúng cả 3 tật xấu trước khi hết 45 giây để giành chiến thắng trọn vẹn!
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Eye className="w-5 h-5" />
            <span>{profile.name1.toUpperCase()} CẦM MÁY CHỌN 3 TẬT XẤU</span>
          </button>
        </div>
      )}

      {/* PHASE 2: SECRET SELECTION BY PLAYER 1 */}
      {phase === 'SECRET_SELECTION' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Bí Mật Dành Riêng Cho {profile.name1}
            </span>
            <span className="text-xs text-amber-800">
              Hãy chọn đúng <strong>3 tật xấu</strong> để chuẩn bị diễn cho {profile.name2} đoán ({selectedFlawIds.length}/3)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {FLAW_POOL.map((flaw) => {
              const isSelected = selectedFlawIds.includes(flaw.id);
              return (
                <div
                  key={flaw.id}
                  onClick={() => handleToggleFlawSelection(flaw.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-400 shadow-xs ring-2 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{flaw.emoji}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{flaw.name}</span>
                      <span className="text-[10px] text-slate-500 italic">{flaw.hint}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isSelected ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (selectedFlawIds.length === 3) {
                soundFx.playPop();
                setPhase('PREPARE_ACT');
              }
            }}
            disabled={selectedFlawIds.length !== 3}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-sm shadow-md disabled:opacity-50 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>ĐÃ CHỌN XONG ({selectedFlawIds.length}/3) → SẴN SÀNG DIỄN</span>
          </button>
        </div>
      )}

      {/* PHASE 3: PREPARE ACT (REMINDER FOR ACTOR BEFORE PASSING PHONE) */}
      {phase === 'PREPARE_ACT' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-xl space-y-3">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Ghi Nhớ 3 Tật Xấu Vừa Chọn
            </span>

            <div className="space-y-2 text-left">
              {FLAW_POOL.filter((f) => selectedFlawIds.includes(f.id)).map((flaw, idx) => (
                <div key={flaw.id} className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-lg">{flaw.emoji}</span>
                  <span className="text-xs font-bold text-amber-950">{flaw.name}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 pt-1 leading-relaxed">
              Bây giờ, hãy đặt điện thoại trên bàn trước mặt <strong>{profile.name2}</strong>. Bấm bắt đầu để đồng hồ 45 giây đếm ngược!
            </p>

            <button
              onClick={() => {
                soundFx.playPop();
                setTimeLeft(45);
                setPhase('ACTING_45S');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Clock className="w-5 h-5" />
              <span>BẮT ĐẦU ĐẾM NGƯỢC 45 GIÂY!</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: ACTING & GUESSING 45S */}
      {phase === 'ACTING_45S' && (
        <div className="space-y-3 animate-in fade-in">
          {/* Timer and score top bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white shadow-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-xs font-semibold">Thời gian còn lại:</span>
            </div>
            <div className={`font-mono text-xl font-black ${timeLeft <= 10 ? 'text-rose-500 animate-ping' : 'text-amber-400'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 font-bold flex items-center justify-center gap-2">
            <span>{profile.name2} chạm vào tật xấu đoán đúng:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono">
              {guessedFlawIds.length} / 3
            </span>
          </div>

          {/* List of 8 choices for Player 2 to guess */}
          <div className="grid grid-cols-1 gap-2">
            {FLAW_POOL.map((flaw) => {
              const isGuessed = guessedFlawIds.includes(flaw.id);
              return (
                <div
                  key={flaw.id}
                  onClick={() => handleGuessTap(flaw.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isGuessed
                      ? 'bg-emerald-100 border-emerald-400 shadow-sm ring-2 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-amber-300 active:scale-98'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{flaw.emoji}</span>
                    <span className={`text-xs font-bold ${isGuessed ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {flaw.name}
                    </span>
                  </div>

                  {isGuessed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Đoán đúng
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 5: TIMEOUT / FAIL => SHARED PENALTY */}
      {phase === 'TIMEOUT_FAIL' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-5 rounded-3xl bg-white border-2 border-rose-300 shadow-xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-50">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">
              Hết 45 Giây Kịch Câm!
            </span>

            <h2 className="text-lg font-black text-slate-900">
              Chỉ đoán đúng {guessedFlawIds.length}/3 tật xấu
            </h2>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-1.5">
              <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Hình Phạt Gắn Kết Cặp Đôi:
              </span>
              <p className="text-sm font-black text-rose-950 leading-relaxed">
                "{penaltyText}"
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  handleFinishLevel(
                    `Đồng Tâm Kịch Câm: Hai bạn đã thực hiện hình phạt ngọt ngào "${penaltyText}" cùng nhau!`
                  );
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã Thực Hiện Xong (+260 LP)</span>
              </button>

              <button
                onClick={handleStartGame}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Diễn lại từ đầu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 6: SUCCESS WIN */}
      {phase === 'SUCCESS_WIN' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-5 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Thấu Hiểu Tuyệt Đối!
            </span>

            <h2 className="text-xl font-black text-slate-900">
              Đoán Đúng Trọn Vẹn 3/3 Tật Xấu!
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Không cần nói một lời nào, {profile.name2} vẫn thấu suốt từng cử chỉ điệu bộ của {profile.name1}. Đồng tâm tương ứng!
            </p>

            <button
              onClick={() => {
                handleFinishLevel(
                  `Đồng Tâm Kịch Câm: ${profile.name2} đã xuất sắc đoán đúng 3 tật xấu trong thời gian kỷ lục!`
                );
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn Thành Màn 8 (+260 LP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
