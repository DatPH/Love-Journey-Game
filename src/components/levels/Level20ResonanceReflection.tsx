import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Crown, 
  Award, 
  ChevronRight,
  Flame,
  MessageCircleHeart,
  Quote
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level20Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onOpenStats: () => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

const REFLECTION_PROMPTS = [
  {
    id: 1,
    title: 'Khoảnh Khắc Bất Ngờ & Đáng Yêu',
    question: 'Điều gì ở người ấy trong suốt 20 màn thử thách qua khiến bạn cảm thấy bất ngờ và đáng yêu nhất?',
    icon: '✨',
  },
  {
    id: 2,
    title: 'Tiếng Cười Vỡ Bụng',
    question: 'Màn chơi nào khiến hai bạn cười nhiều nhất và xóa tan mọi mệt mỏi trong ngày?',
    icon: '😂',
  },
  {
    id: 3,
    title: 'Lời Nguyện Ước Tương Lai',
    question: 'Một lời hứa ngọt ngào hoặc điều bạn muốn cùng người ấy thực hiện trong năm tới là gì?',
    icon: '💖',
  },
];

export const Level20ResonanceReflection: React.FC<Level20Props> = ({
  profile,
  onComplete,
  onOpenStats,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Flow: 'intro' -> 'reflect_step_1' -> 'reflect_step_2' -> 'reflect_step_3' -> 'conclude'
  const [currentPromptIdx, setCurrentPromptIdx] = useState<number>(0);
  const [stage, setStage] = useState<'intro' | 'reflecting' | 'conclude'>('intro');

  // Reflection notes written or spoken
  const [customNote, setCustomNote] = useState<string>('');

  const currentP = REFLECTION_PROMPTS[currentPromptIdx];

  const handleStartReflection = () => {
    soundFx.playBell();
    setCurrentPromptIdx(0);
    setStage('reflecting');
  };

  const handleNextPrompt = () => {
    soundFx.playPop();
    if (currentPromptIdx < REFLECTION_PROMPTS.length - 1) {
      setCurrentPromptIdx((i) => i + 1);
      setCustomNote('');
    } else {
      soundFx.playFanfare();
      setStage('conclude');
    }
  };

  const handleFinishLevel20 = () => {
    soundFx.playFanfare();
    onComplete(1000, 'Hoàn thành trọn vẹn 20 màn chơi tình yêu & mở khóa Bảng Vàng Vinh Danh.');
    onOpenStats();
  };

  const handleRestart = () => {
    soundFx.playPop();
    setCurrentPromptIdx(0);
    setCustomNote('');
    setStage('intro');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-amber-200 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
          <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Màn 20 · Đỉnh Cao Tâm Linh</span>
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* PHASE 1: INTRO */}
      {stage === 'intro' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B1B15] via-[#1D1210] to-[#120B0A] text-white shadow-xl space-y-4 border border-amber-900/60 text-left">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
              <Crown className="w-10 h-10 fill-amber-400 text-amber-300 animate-bounce" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black block">
                CHẶNG ĐÍCH VINH QUANG 20 MÀN CHƠI
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Dư Âm Đồng Điệu
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Chúc mừng {p1} & {p2} đã cùng nhau vượt qua 19 trạm thử thách gian nan lẫn ngọt ngào!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-amber-200 space-y-2">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-white">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Khoảnh Khắc Lắng Đọng:
              </span>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Ở chặng đích này, không còn đồng hồ bấm giờ hay sự căng thẳng. Chỉ có 3 câu hỏi suy ngẫm chân thành để hai bạn trao cho nhau những lời yêu thương sâu sắc nhất.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartReflection}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>Bắt Đầu 3 Câu Hỏi Lắng Đọng</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 3 REFLECTION STEPS */}
      {stage === 'reflecting' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Progress dots */}
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider">
              CÂU HỎI {currentPromptIdx + 1}/3
            </span>
            <div className="flex items-center gap-1.5">
              {REFLECTION_PROMPTS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentPromptIdx ? 'w-6 bg-amber-500' : 'w-2.5 bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-3">
            <div className="text-3xl">{currentP.icon}</div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">
              {currentP.title}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug px-2">
              "{currentP.question}"
            </h3>
            <p className="text-xs text-slate-500 italic">
              Lần lượt {p1} và {p2} nhìn vào mắt nhau và chia sẻ thật lòng câu trả lời nhé!
            </p>
          </div>

          {/* Optional notes input */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block px-1">
              Ghi lại một dòng kỷ niệm ngọt ngào (tùy chọn):
            </span>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ghi lại câu nói đáng yêu của người ấy..."
              rows={2}
              className="w-full p-3 rounded-2xl bg-white border border-stone-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            onClick={handleNextPrompt}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{currentPromptIdx < REFLECTION_PROMPTS.length - 1 ? 'Tiếp Tục Câu Hỏi Sau' : 'Đến Bảng Vàng Vinh Danh! 👑'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PHASE 3: CONCLUDE & UNLOCK GRAND SUMMARY */}
      {stage === 'conclude' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 via-rose-50 to-purple-50 border border-amber-300 shadow-xl space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white text-amber-500 flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 fill-amber-400 text-amber-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                CHẠM TỚI ĐỈNH VINH QUANG! 🏆
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed px-2 font-medium">
                {p1} & {p2} đã chính thức chinh phục trọn vẹn <strong>20 Màn Thử Thách Cặp Đôi</strong>. Tình yêu của hai bạn đã đạt tới cảnh giới huyền thoại!
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-black text-amber-800 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+1,000 Love Power Tối Thượng</span>
            </div>
          </div>

          <button
            onClick={handleFinishLevel20}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-rose-500 to-purple-600 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Crown className="w-4 h-4 fill-white" />
            <span>MỞ BẢNG VÀNG THỐNG KÊ & HUY HIỆU VÔ SONG</span>
          </button>
        </div>
      )}
    </div>
  );
};
