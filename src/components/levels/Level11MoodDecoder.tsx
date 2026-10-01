import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  Sparkles, 
  Heart, 
  Smartphone, 
  Flame, 
  Award,
  ChevronRight,
  Smile
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level11Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

interface QuestionItem {
  id: number;
  statement: string;
  speaker: string;
  listener: string;
  context: string;
  options: string[];
}

export const Level11MoodDecoder: React.FC<Level11Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  const QUESTIONS: QuestionItem[] = [
    {
      id: 1,
      statement: '“Tùy anh/em đấy, sao cũng được...”',
      speaker: p1,
      listener: p2,
      context: 'Khi được hỏi tối nay ăn gì hoặc cuối tuần đi đâu.',
      options: [
        'Thực sự đang thoải mái, người ấy chọn gì mình cũng vui vẻ.',
        'Chọn sai món mình ghét là chuẩn bị tinh thần tới công chuyện!',
        'Đang lười suy nghĩ, hãy đưa ra 2 gợi ý cụ thể để chọn.',
        'Đang dỗi nhẹ vì không được chủ động quan tâm trước đó.',
      ],
    },
    {
      id: 2,
      statement: '“Em / Anh không sao, bình thường mà.”',
      speaker: p2,
      listener: p1,
      context: 'Sau một thoáng im lặng và nét mặt bỗng lạnh tanh.',
      options: [
        'Có sao to đùng đấy, mau ôm và hỏi dồn dập ngay đi!',
        'Thực sự bình thường, chỉ là đang hơi mệt mỏi chút thôi.',
        'Cần 5 phút yên tĩnh một mình để tự cân bằng lại.',
        'Đang chờ xem người ấy có nhận ra mình khác lạ không.',
      ],
    },
    {
      id: 3,
      statement: '“Cứ đi chơi với bạn đi, không cần lo đâu!”',
      speaker: p1,
      listener: p2,
      context: 'Khi chuẩn bị đi tụ tập bạn bè vào ngày nghỉ.',
      options: [
        'Muốn người ấy ở nhà cùng mình hơn, nhưng ngại nói thẳng.',
        'Cứ đi chơi thoải mái nhưng nhớ nhắn tin báo về đến đâu.',
        'Đi thì đi nhưng về trước 10h tối và mang đồ ăn ngon về!',
        'Đi chơi vui vẻ thật lòng, mình cũng có kế hoạch riêng.',
      ],
    },
    {
      id: 4,
      statement: '“Thôi để đó lát nữa em/anh làm cho!”',
      speaker: p2,
      listener: p1,
      context: 'Khi thấy việc nhà hay chén bát đang còn để đó.',
      options: [
        'Nhắc khéo là người kia nên đứng dậy phụ làm ngay đi!',
        'Thực lòng muốn tự làm vì sợ người kia làm không đúng ý.',
        'Lười quá, hoãn binh để tí nữa có hứng rồi tính tiếp.',
        'Muốn cả hai cùng làm chung cho vui chứ không muốn làm một mình.',
      ],
    },
    {
      id: 5,
      statement: '“Không có gì đâu, quên đi...”',
      speaker: p1,
      listener: p2,
      context: 'Khi vừa định nói điều gì đó rồi bỗng dưng ngập ngừng nuốt lại.',
      options: [
        'Rất muốn nói ra nhưng sợ làm người ấy buồn hoặc cãi vã.',
        'Nghĩ lại thấy chuyện cỏn con không đáng để nhắc tới.',
        'Đang thử lòng xem người ấy có gặng hỏi tiếp hay bỏ qua luôn.',
        'Quên thật, tự nhiên mạch não bị đứng hình!',
      ],
    },
  ];

  // Game state:
  // step: 'speaker_pick' -> 'hand_off_lock' -> 'listener_guess' -> 'round_reveal' -> 'finished'
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [speakerChoice, setSpeakerChoice] = useState<number | null>(null);
  const [listenerGuess, setListenerGuess] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'speaker_pick' | 'hand_off_lock' | 'listener_guess' | 'round_reveal' | 'finished'>('speaker_pick');
  const [score, setScore] = useState<number>(0);
  const [historyResults, setHistoryResults] = useState<{ round: number; matched: boolean; statement: string }[]>([]);
  const [penaltyText, setPenaltyText] = useState<string>('');

  const currentQ = QUESTIONS[currentRound] || QUESTIONS[0];

  const handleSpeakerSelect = (idx: number) => {
    soundFx.playPop();
    setSpeakerChoice(idx);
  };

  const handleConfirmSpeaker = () => {
    if (speakerChoice === null) return;
    soundFx.playPop();
    setGameState('hand_off_lock');
  };

  const handleUnlockListener = () => {
    soundFx.playPop();
    setGameState('listener_guess');
  };

  const handleListenerSelect = (idx: number) => {
    soundFx.playPop();
    setListenerGuess(idx);
  };

  const handleConfirmListener = () => {
    if (listenerGuess === null || speakerChoice === null) return;
    const isMatch = listenerGuess === speakerChoice;
    if (isMatch) {
      soundFx.playSuccess();
      setScore((s) => s + 1);
    } else {
      soundFx.playTap();
    }

    setHistoryResults((prev) => [
      ...prev,
      { round: currentRound + 1, matched: isMatch, statement: currentQ.statement },
    ]);
    setGameState('round_reveal');
  };

  const handleNextRound = () => {
    soundFx.playPop();
    if (currentRound < QUESTIONS.length - 1) {
      setCurrentRound((r) => r + 1);
      setSpeakerChoice(null);
      setListenerGuess(null);
      setGameState('speaker_pick');
    } else {
      // Finished
      setGameState('finished');
      if (score + (listenerGuess === speakerChoice ? 0 : 0) < 4) {
        const PENALTIES = [
          'Massage vai và gáy cho người ấy trong 3 phút không ngừng nghỉ.',
          'Uống 1 cốc nước ấm đầy và nói 3 câu nịnh ngọt lịm như mía lùi.',
          'Chụp 1 bức ảnh selfie làm mặt xấu nhất gửi vào album kỷ niệm.',
          'Bao người ấy một món ăn vặt hoặc trà sữa vào ngày mai.',
          'Hát 1 bài hát tình ca bằng giọng điệu nũng nịu nhất.',
        ];
        setPenaltyText(PENALTIES[Math.floor(Math.random() * PENALTIES.length)]);
      }
    }
  };

  const handleRestart = () => {
    soundFx.playPop();
    setCurrentRound(0);
    setSpeakerChoice(null);
    setListenerGuess(null);
    setGameState('speaker_pick');
    setScore(0);
    setHistoryResults([]);
    setPenaltyText('');
  };

  const isPassed = score >= 4;

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2 border-b border-rose-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
          Màn 11 · Giải Mã Cơn Dỗi
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Chơi lại từ đầu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5">
          {QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentRound
                  ? historyResults[idx]?.matched
                    ? 'w-6 bg-emerald-500'
                    : 'w-4 bg-rose-300'
                  : idx === currentRound
                  ? 'w-7 bg-rose-500 shadow-xs'
                  : 'w-3 bg-stone-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-600 font-mono">
          Vòng {currentRound + 1}/5 · Đúng: {score}
        </span>
      </div>

      {/* STEP 1: SPEAKER SECRET PICK */}
      {gameState === 'speaker_pick' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Speaker Badge */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-rose-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentQ.speaker.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-[10px] text-rose-500 uppercase tracking-wider font-extrabold">Lượt Người Nói</p>
                <p className="text-xs font-bold text-slate-800">{currentQ.speaker} hãy chọn bí mật</p>
              </div>
            </div>
            <span className="text-[10px] text-rose-500 bg-white px-2 py-0.5 rounded-full border border-rose-200 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-500" /> Giấu màn hình
            </span>
          </div>

          {/* Statement Box */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm text-center space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Câu nói cửa miệng kinh điển
            </span>
            <h2 className="text-lg font-black text-rose-600 leading-snug px-2">
              {currentQ.statement}
            </h2>
            <p className="text-[11px] text-slate-500 italic">
              Hoàn cảnh: {currentQ.context}
            </p>
          </div>

          {/* Question Prompt */}
          <p className="text-xs font-bold text-slate-700 px-1">
            Ý thật sự trong lòng của {currentQ.speaker} là gì?
          </p>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSpeakerSelect(idx)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-medium transition-all border ${
                  speakerChoice === idx
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm ring-2 ring-rose-200'
                    : 'bg-white text-slate-700 border-stone-200 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                    speakerChoice === idx ? 'bg-white text-rose-600' : 'bg-stone-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Action */}
          <button
            onClick={handleConfirmSpeaker}
            disabled={speakerChoice === null}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              speakerChoice !== null
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Khóa Bí Mật & Chuyền Máy</span>
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: HAND-OFF CURTAIN GATING */}
      {gameState === 'hand_off_lock' && (
        <div className="py-8 px-4 text-center space-y-6 bg-gradient-to-b from-[#22151D] to-[#140D12] text-white rounded-3xl border border-stone-800 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-rose-400 uppercase tracking-widest font-extrabold">
              ĐÃ KHÓA CÂU TRẢ LỜI 🔒
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Chuyền máy cho {currentQ.listener}!
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              {currentQ.speaker} đã chọn xong ý nghĩa bí mật. Đưa điện thoại cho {currentQ.listener} để bắt đầu lượt đoán tâm ý.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleUnlockListener}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Unlock className="w-4 h-4" />
              <span>Tôi Là {currentQ.listener} - Mở Khóa Đoán</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LISTENER GUESS */}
      {gameState === 'listener_guess' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Listener Badge */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentQ.listener.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-[10px] text-teal-600 uppercase tracking-wider font-extrabold">Lượt Người Đoán</p>
                <p className="text-xs font-bold text-slate-800">{currentQ.listener} đoán ý người ấy</p>
              </div>
            </div>
            <span className="text-[10px] text-teal-600 bg-white px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
              🎯 Thử tài thấu hiểu
            </span>
          </div>

          {/* Statement Box */}
          <div className="p-4 rounded-3xl bg-white border border-teal-100 shadow-sm text-center space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              {currentQ.speaker} vừa nói:
            </span>
            <h2 className="text-lg font-black text-slate-800 leading-snug px-2">
              {currentQ.statement}
            </h2>
            <p className="text-[11px] text-slate-500 italic">
              Hoàn cảnh: {currentQ.context}
            </p>
          </div>

          {/* Options */}
          <p className="text-xs font-bold text-slate-700 px-1">
            Theo {currentQ.listener}, thật ra {currentQ.speaker} đang muốn nói điều gì?
          </p>

          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleListenerSelect(idx)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-medium transition-all border ${
                  listenerGuess === idx
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-teal-200'
                    : 'bg-white text-slate-700 border-stone-200 hover:border-teal-300 hover:bg-teal-50/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                    listenerGuess === idx ? 'bg-white text-teal-700' : 'bg-stone-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Action */}
          <button
            onClick={handleConfirmListener}
            disabled={listenerGuess === null}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              listenerGuess !== null
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Xác Nhận Dự Đoán</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: ROUND REVEAL */}
      {gameState === 'round_reveal' && speakerChoice !== null && listenerGuess !== null && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className={`p-5 rounded-3xl text-center border shadow-sm ${
            speakerChoice === listenerGuess
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
              {speakerChoice === listenerGuess ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              ) : (
                <XCircle className="w-12 h-12 text-rose-500" />
              )}
            </div>

            <h3 className="text-base font-extrabold mb-1">
              {speakerChoice === listenerGuess ? 'TÂM ĐẦU Ý HỢP! 🎉' : 'HIỂU LẦM TAI HẠI RỒI! 😅'}
            </h3>
            <p className="text-xs font-medium">
              {speakerChoice === listenerGuess
                ? `${currentQ.listener} đã bắt đúng tần số của ${currentQ.speaker}!`
                : `Hai bạn có góc nhìn khác nhau về câu nói này rồi!`}
            </p>
          </div>

          {/* Side by side comparison */}
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase">
                {currentQ.speaker} chọn (Ý Thật):
              </span>
              <p className="font-bold text-slate-800">
                "{currentQ.options[speakerChoice]}"
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
              speakerChoice === listenerGuess ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <span className="text-[10px] font-extrabold text-teal-700 uppercase">
                {currentQ.listener} đoán:
              </span>
              <p className="font-bold text-slate-800">
                "{currentQ.options[listenerGuess]}"
              </p>
            </div>
          </div>

          <button
            onClick={handleNextRound}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-stone-800 text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{currentRound < QUESTIONS.length - 1 ? 'Tiếp Tục Vòng Kế Tiếp' : 'Xem Tổng Kết Thử Thách'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: FINISHED SUMMARY */}
      {gameState === 'finished' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className={`p-6 rounded-3xl border shadow-sm ${
            isPassed ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-200' : 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-3 shadow-md bg-white">
              {isPassed ? (
                <Sparkles className="w-8 h-8 text-emerald-500" />
              ) : (
                <Flame className="w-8 h-8 text-amber-500" />
              )}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              {isPassed ? 'XUẤT SẮC VƯỢT QUA! 🏆' : 'CHƯA ĐỦ ĐIỂM THẤU CẢM! 💔'}
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Kết quả: <strong className="text-slate-900 text-sm">{score}/5 câu</strong> đoán chính xác
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-rose-600 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{isPassed ? '+380 Love Power' : '+150 LP An Ủi'}</span>
            </div>
          </div>

          {/* Penalty box if failed */}
          {!isPassed && penaltyText && (
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>HÌNH PHẠT VUI CHUNG:</span>
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
                onClick={() => onComplete(380, `Đoán trúng ${score}/5 câu dỗi hờn kinh điển.`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành & Nhận 380 LP</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử Lại Để Đạt Từ 4/5 Câu</span>
                </button>
                <button
                  onClick={() => onComplete(150, `Đã cùng chịu phạt: "${penaltyText}"`)}
                  className="w-full py-3 rounded-2xl bg-white border border-stone-300 text-slate-600 font-bold text-xs hover:bg-stone-50 transition-colors"
                >
                  <span>Chấp Nhận Chịu Phạt & Qua Màn (+150 LP)</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
