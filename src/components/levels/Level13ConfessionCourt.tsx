import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Church, 
  Award, 
  Smile, 
  ChevronRight, 
  BookOpen, 
  Flame,
  Volume2
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level13Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

const CONFESSION_PROMPTS = [
  'Lén ăn vụng món ngon trong tủ lạnh mà giả vờ đổ thừa cho mèo.',
  'Nói dối là "em/anh chuẩn bị ngủ đây" nhưng lén lướt TikTok thêm 1 tiếng.',
  'Từng lỡ tay làm vỡ/hỏng đồ của người ấy nhưng giấu nhẹm đi.',
  'Từng bảo bạn bè là mình làm "nóc nhà", nhưng thực ra toàn răm rắp nghe lời.',
  'Từng ghen bóng gió một chuyện rất vớ vẩn nhưng ngại không dám nói.',
  'Lén xem trước tập phim mới của bộ phim hai đứa đang xem chung.',
  'Từng chê đồ ăn người ấy nấu dở một lần nhưng vẫn giả vờ khen ngon.',
];

const PENANCE_OPTIONS = [
  'Đấm lưng, bóp vai và dỗ dành người ấy trong 3 phút không ngừng nghỉ.',
  'Bao người ấy 1 ly trà sữa / cà phê full topping vào ngày mai.',
  'Ôm chặt người ấy trong 60 giây và thì thầm 3 lần: "Con biết lỗi rồi!"',
  'Nhận làm toàn bộ việc dọn dẹp bàn ăn và rửa bát sau bữa tối hôm nay.',
  'Hôn lên má và trán người ấy 5 cái thật kêu để chuộc tội.',
  'Miễn tội hoàn toàn vì lời xưng tội quá sức đáng yêu!',
];

export const Level13ConfessionCourt: React.FC<Level13Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Turn 1: p1 is Sinner, p2 is Priest
  // Turn 2: p2 is Sinner, p1 is Priest
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [subStep, setSubStep] = useState<'sinner_write' | 'priest_judge' | 'turn_absolved' | 'final'>('sinner_write');

  const [sinnerConfession, setSinnerConfession] = useState<string>('');
  const [selectedPenance, setSelectedPenance] = useState<number | null>(null);
  const [customVerdict, setCustomVerdict] = useState<string>('');

  const [turn1Data, setTurn1Data] = useState<{ sinner: string; confession: string; penance: string } | null>(null);
  const [turn2Data, setTurn2Data] = useState<{ sinner: string; confession: string; penance: string } | null>(null);

  const sinner = currentTurn === 1 ? p1 : p2;
  const priest = currentTurn === 1 ? p2 : p1;

  const handleSelectPrompt = (prompt: string) => {
    soundFx.playPop();
    setSinnerConfession(prompt);
  };

  const handleConfirmConfession = () => {
    if (!sinnerConfession.trim()) return;
    soundFx.playBell();
    setSubStep('priest_judge');
  };

  const handleSelectPenance = (idx: number) => {
    soundFx.playPop();
    setSelectedPenance(idx);
    setCustomVerdict(PENANCE_OPTIONS[idx]);
  };

  const effectiveVerdict = customVerdict.trim() || (selectedPenance !== null ? PENANCE_OPTIONS[selectedPenance] : '');

  const handleAbsolve = () => {
    if (!effectiveVerdict) return;
    soundFx.playSuccess();

    if (currentTurn === 1) {
      setTurn1Data({
        sinner,
        confession: sinnerConfession,
        penance: effectiveVerdict,
      });
      setSubStep('turn_absolved');
    } else {
      setTurn2Data({
        sinner,
        confession: sinnerConfession,
        penance: effectiveVerdict,
      });
      setSubStep('final');
    }
  };

  const handleNextTurn = () => {
    soundFx.playPop();
    setCurrentTurn(2);
    setSubStep('sinner_write');
    setSinnerConfession('');
    setSelectedPenance(null);
    setCustomVerdict('');
  };

  const handleRestart = () => {
    soundFx.playPop();
    setCurrentTurn(1);
    setSubStep('sinner_write');
    setSinnerConfession('');
    setSelectedPenance(null);
    setCustomVerdict('');
    setTurn1Data(null);
    setTurn2Data(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-indigo-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
          Màn 13 · Tòa Xưng Tội Lầy Lội
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Role Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 mb-4">
        <div className="flex items-center gap-2">
          <Church className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-[10px] text-indigo-700 uppercase font-black tracking-widest">
              Lượt {currentTurn}/2 · Tòa Án Tình Yêu
            </p>
            <p className="text-xs font-bold text-slate-800">
              Con Chiên: <span className="text-rose-600">{sinner}</span> ✦ Cha Xứ: <span className="text-indigo-700">{priest}</span>
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: SINNER CONFESSION */}
      {subStep === 'sinner_write' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-3xl bg-white border border-indigo-100 shadow-sm space-y-2 text-center">
            <span className="text-[10px] text-indigo-600 uppercase font-extrabold tracking-widest block">
              LƯỢT THÚ TỘI CỦA {sinner}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              "Con lạy Cha {priest}, con có tội..."
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Hãy dũng cảm xưng ra một tội lỗi lầy lội hoặc một bí mật ngố tàu gần đây với người ấy!
            </p>
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2 px-1">
              Gợi ý các tội lỗi kinh điển:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {CONFESSION_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(p)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${
                    sinnerConfession === p
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-xs'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-indigo-300'
                  }`}
                >
                  <p className="line-clamp-2 leading-relaxed font-medium">"{p}"</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom text input */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block px-1">
              Hoặc tự viết lời thú tội chân thật của bạn:
            </span>
            <textarea
              value={sinnerConfession}
              onChange={(e) => setSinnerConfession(e.target.value)}
              placeholder="Ví dụ: Con lén mua đồ mà nói là được tặng..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-white border border-stone-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={handleConfirmConfession}
            disabled={!sinnerConfession.trim()}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              sinnerConfession.trim()
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Church className="w-4 h-4" />
            <span>Nộp Lời Thú Tội & Chuyền Cho Cha {priest}</span>
          </button>
        </div>
      )}

      {/* STEP 2: PRIEST VERDICT (WITH MANUAL TEXT BOX INPUT) */}
      {subStep === 'priest_judge' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          {/* Confession Display */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-lg space-y-2 border border-indigo-900 text-center">
            <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
              📜 LỜI XƯNG TỘI TỪ CON CHIÊN {sinner}
            </span>
            <p className="text-sm font-bold text-amber-200 leading-relaxed italic px-2">
              "{sinnerConfession}"
            </p>
            <span className="text-[10px] text-stone-400 block pt-1">
              Cha {priest} hãy giữ mặt nghiêm nghị và lắng nghe!
            </span>
          </div>

          {/* Penance Selection */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-800 px-1 block mb-1.5">
                Gợi ý hình phạt chuộc tội:
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {PENANCE_OPTIONS.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPenance(idx)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${
                      selectedPenance === idx || customVerdict === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-300'
                        : 'bg-white text-slate-700 border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                        selectedPenance === idx || customVerdict === opt ? 'bg-white text-indigo-700' : 'bg-stone-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Verdict Text Box Input */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block px-1">
                Hoặc Cha {priest} tự soạn phán quyết hình phạt tùy ý:
              </span>
              <textarea
                value={customVerdict}
                onChange={(e) => {
                  setCustomVerdict(e.target.value);
                  if (selectedPenance !== null && e.target.value !== PENANCE_OPTIONS[selectedPenance]) {
                    setSelectedPenance(null);
                  }
                }}
                placeholder="Ví dụ: Phạt làm bữa sáng cả tuần, hoặc đấm bóp 10 phút, hay bao một vé xem phim..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-white border border-stone-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-2xs"
              />
            </div>
          </div>

          <button
            onClick={handleAbsolve}
            disabled={!effectiveVerdict}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              effectiveVerdict
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ban Phán Quyết: Được Ân Xá & Xí Xóa!</span>
          </button>
        </div>
      )}

      {/* STEP 3: TURN ABSOLVED */}
      {subStep === 'turn_absolved' && turn1Data && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {turn1Data.sinner} Đã Được Ân Xá! 🎉
            </h3>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 text-xs text-left space-y-1">
              <span className="text-[10px] text-emerald-700 font-extrabold uppercase">Hình phạt cần thi hành:</span>
              <p className="font-bold text-slate-800 leading-relaxed">
                "{turn1Data.penance}"
              </p>
            </div>
          </div>

          <button
            onClick={handleNextTurn}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Đổi Vai: Lượt {p2} Xưng Tội Với Cha {p1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: FINAL MUTUAL ABSOLUTION */}
      {subStep === 'final' && turn1Data && turn2Data && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white text-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              TỘI LỖI ĐÃ ĐƯỢC XÍ XÓA! 💖
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Cả hai đã cùng dũng cảm thú nhận và trao cho nhau sự tha thứ ngọt ngào nhất. Không còn ấm ức hay giấu diếm nữa nhé!
            </p>

            {/* Verdict summary */}
            <div className="space-y-2 my-2 text-left">
              <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase block">{p1}:</span>
                <p className="font-semibold text-slate-800 leading-snug">"{turn1Data.penance}"</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase block">{p2}:</span>
                <p className="font-semibold text-slate-800 leading-snug">"{turn2Data.penance}"</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-indigo-700 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+420 Love Power Gắn Kết</span>
            </div>
          </div>

          <button
            onClick={() => onComplete(420, `Cả hai đã thú nhận và ân xá cho nhau trong Tòa Xưng Tội Lầy Lội.`)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn Thành Màn 13 & Nhận 420 LP</span>
          </button>
        </div>
      )}
    </div>
  );
};
