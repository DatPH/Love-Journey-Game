import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Search, 
  Award, 
  Flame, 
  Glasses, 
  Check, 
  Plus, 
  ChevronRight 
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level12Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

const COMMON_CHANGES_SUGGESTIONS = [
  'Xắn 1 bên tay áo lên',
  'Tháo hoặc đổi nhẫn sang ngón khác',
  'Đổi bên rẽ ngôi tóc / búi tóc lên',
  'Tháo hoặc đeo đồng hồ / vòng tay',
  'Tháo kính cận hoặc cài lên cổ áo',
  'Xắn 1 bên gấu quần lên',
  'Gài hoặc mở 1 cúc áo phía trên',
  'Đi lệch 1 chiếc tất / giày',
  'Kẹp tóc hoặc tháo dây buộc tóc',
  'Đổi một bên hoa tai / trang sức',
  'Bỏ 1 đồ vật nhỏ vào túi áo trước',
  'Thay đổi biểu cảm / tô lại son môi',
];

export const Level12DetectiveLook: React.FC<Level12Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Turn 1: Player A (p1) is Detective, Player B (p2) changes 3 details
  // Turn 2: Player B (p2) is Detective, Player A (p1) changes 3 details
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);

  // States per turn:
  // 'prep' -> 'countdown_hide' (15s closing eyes) -> 'changing' -> 'countdown_spot' (20s detective search) -> 'turn_score' -> 'final'
  const [turnState, setTurnState] = useState<'prep' | 'countdown_hide' | 'changing' | 'countdown_spot' | 'turn_score' | 'final'>('prep');

  // Timers
  const [hideTimeLeft, setHideTimeLeft] = useState<number>(15);
  const [spotTimeLeft, setSpotTimeLeft] = useState<number>(20);

  // Scores
  const [turn1Score, setTurn1Score] = useState<number>(0);
  const [turn2Score, setTurn2Score] = useState<number>(0);

  // Selected changes discovered in active turn
  const [foundCount, setFoundCount] = useState<number>(0);
  const [penaltyText, setPenaltyText] = useState<string>('');

  const detective = currentTurn === 1 ? p1 : p2;
  const targetPerson = currentTurn === 1 ? p2 : p1;

  // 15s Timer for Closing Eyes & Changing
  useEffect(() => {
    let interval: number;
    if (turnState === 'countdown_hide') {
      interval = window.setInterval(() => {
        setHideTimeLeft((prev) => {
          if (prev <= 1) {
            soundFx.playBell();
            setTurnState('changing');
            return 0;
          }
          if (prev <= 4) soundFx.playTap();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [turnState]);

  // 20s Timer for Detective Inspection
  useEffect(() => {
    let interval: number;
    if (turnState === 'countdown_spot') {
      interval = window.setInterval(() => {
        setSpotTimeLeft((prev) => {
          if (prev <= 1) {
            soundFx.playBell();
            setTurnState('turn_score');
            return 0;
          }
          if (prev <= 5) soundFx.playTap();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [turnState]);

  const handleStartHideCountdown = () => {
    soundFx.playPop();
    setHideTimeLeft(15);
    setTurnState('countdown_hide');
  };

  const handleTargetFinishedChanging = () => {
    soundFx.playPop();
    setSpotTimeLeft(20);
    setFoundCount(0);
    setTurnState('countdown_spot');
  };

  const handleIncrementFound = () => {
    if (foundCount < 3) {
      soundFx.playSuccess();
      setFoundCount((f) => f + 1);
    }
  };

  const handleFinishTurnEarly = () => {
    soundFx.playPop();
    setTurnState('turn_score');
  };

  const handleConfirmTurnScore = () => {
    soundFx.playPop();
    if (currentTurn === 1) {
      setTurn1Score(foundCount);
      setCurrentTurn(2);
      setFoundCount(0);
      setHideTimeLeft(15);
      setSpotTimeLeft(20);
      setTurnState('prep');
    } else {
      setTurn2Score(foundCount);
      setTurnState('final');
      const totalPassed = turn1Score >= 2 && foundCount >= 2;
      if (!totalPassed) {
        const PENALTIES = [
          'Thám tử thua cuộc phải làm ngựa cõng người kia 1 vòng quanh phòng.',
          'Hôn trán, hôn má và hôn môi người kia 3 lần liên tiếp.',
          'Chịu trách nhiệm dọn dẹp bàn ăn sau bữa tối hôm nay.',
          'Quỳ 1 chân và ngâm một bài thơ tỏ tình sến sẩm.',
          'Massage ngón tay và bàn tay cho đối phương trong 5 phút.',
        ];
        setPenaltyText(PENALTIES[Math.floor(Math.random() * PENALTIES.length)]);
      }
    }
  };

  const handleRestart = () => {
    soundFx.playPop();
    setCurrentTurn(1);
    setTurnState('prep');
    setTurn1Score(0);
    setTurn2Score(0);
    setFoundCount(0);
    setHideTimeLeft(15);
    setSpotTimeLeft(20);
    setPenaltyText('');
  };

  const isBothPassed = turn1Score >= 2 && turn2Score >= 2;

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-stone-200 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
          Màn 12 · Thám Tử Soi Chi Tiết
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Turn Indicator */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 mb-4">
        <div className="flex items-center gap-2">
          <Glasses className="w-5 h-5 text-teal-600" />
          <div>
            <p className="text-[10px] text-teal-700 uppercase font-black tracking-widest">
              Lượt {currentTurn}/2 · Thám tử {detective}
            </p>
            <p className="text-xs font-bold text-slate-800">
              Mục tiêu soi: {targetPerson}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-semibold block">Mục tiêu đỗ</span>
          <span className="text-xs font-black text-teal-700 font-mono">≥ 2/3 chi tiết</span>
        </div>
      </div>

      {/* PHASE 1: PREPARATION & RULES */}
      {turnState === 'prep' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <EyeOff className="w-8 h-8" />
            </div>

            <h2 className="text-lg font-black text-slate-900">
              {detective} Nhắm Mắt Lại Nào!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed px-3">
              {detective} sẽ nhắm mắt trong <strong>15 giây</strong>. Trong lúc đó, <strong>{targetPerson}</strong> sẽ bí mật thay đổi <strong>3 chi tiết nhỏ</strong> trên trang phục hoặc ngoại hình của mình.
            </p>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                💡 Gợi ý chi tiết cho {targetPerson}:
              </span>
              <p className="text-[11px] text-amber-950 font-normal leading-relaxed">
                Xắn 1 tay áo, tháo đồng hồ, đổi bên rẽ ngôi tóc, bỏ kính cận, xắn 1 gấu quần, tháo nhẫn...
              </p>
            </div>
          </div>

          <button
            onClick={handleStartHideCountdown}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Timer className="w-4 h-4" />
            <span>Bắt Đầu 15 Giây Nhắm Mắt</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 15s COUNTDOWN FOR CLOSING EYES */}
      {turnState === 'countdown_hide' && (
        <div className="py-8 px-4 text-center space-y-6 bg-slate-950 text-white rounded-3xl shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-3xl font-black font-mono text-teal-300 animate-pulse">
            {hideTimeLeft}s
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">
              {detective} đang nhắm chặt mắt 🙈
            </h3>
            <p className="text-xs text-stone-400">
              {targetPerson} hãy mau thay đổi đúng 3 chi tiết ngay nào!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTargetFinishedChanging}
              className="py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition-colors"
            >
              {targetPerson}: "Đã đổi xong trước giờ!" ⚡
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: CHANGING CONFIRMATION */}
      {turnState === 'changing' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              Hết 15 Giây Chuẩn Bị!
            </h3>
            <p className="text-xs text-slate-600">
              {targetPerson} đã thay đổi xong 3 chi tiết chưa?
            </p>
          </div>

          <button
            onClick={handleTargetFinishedChanging}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Eye className="w-4 h-4" />
            <span>Mở Mắt & Bắt Đầu 20 Giây Soi</span>
          </button>
        </div>
      )}

      {/* PHASE 4: 20s DETECTIVE INSPECTION COUNTDOWN */}
      {turnState === 'countdown_spot' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Timer and Instructions */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md text-center space-y-2">
            <div className="flex items-center justify-between text-xs font-bold px-2">
              <span>THỜI GIAN SOI:</span>
              <span className="font-mono text-xl font-black bg-black/20 px-3 py-0.5 rounded-full">
                {spotTimeLeft}s
              </span>
            </div>
            <h3 className="text-sm font-extrabold">
              {detective} hãy quan sát {targetPerson} thật kỹ!
            </h3>
            <p className="text-[11px] text-teal-100">
              Mỗi khi phát hiện và chỉ đúng 1 điểm thay đổi, bấm nút bên dưới.
            </p>
          </div>

          {/* Points Counter */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Số chi tiết đã tìm ra
            </span>

            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    foundCount >= num
                      ? 'bg-teal-500 text-white shadow-md scale-105'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {foundCount >= num ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <Search className="w-5 h-5 text-stone-300" />
                  )}
                  <span className="text-[9px] font-bold mt-0.5">Điểm {num}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleIncrementFound}
                disabled={foundCount >= 3}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
                  foundCount < 3
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20 active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tìm Thấy 1 Chi Tiết (+1)</span>
              </button>
            </div>
          </div>

          {/* Quick finish */}
          <button
            onClick={handleFinishTurnEarly}
            className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-700 bg-stone-100 transition-colors"
          >
            Xác Nhận & Kết Thúc Lượt Sớm
          </button>
        </div>
      )}

      {/* PHASE 5: TURN SCORE CONFIRMATION */}
      {turnState === 'turn_score' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <Glasses className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Kết Quả Lượt Của {detective}
            </h3>

            <p className="text-sm font-extrabold text-teal-700">
              Tìm được {foundCount}/3 chi tiết thay đổi
            </p>

            <p className="text-xs text-slate-500 leading-relaxed px-4">
              {foundCount >= 2
                ? 'Đôi mắt cú vọ! Bạn quan sát người ấy rất tỉ mỉ và nhạy bén!'
                : 'Chưa đủ 2 chi tiết rồi! Lần sau nhớ nhìn kỹ từng milimet nhé!'}
            </p>
          </div>

          <button
            onClick={handleConfirmTurnScore}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{currentTurn === 1 ? `Đổi Vai: Lượt ${p2} Làm Thám Tử` : 'Xem Tổng Kết Cả 2 Lượt'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PHASE 6: FINAL GAME SUMMARY */}
      {turnState === 'final' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className={`p-6 rounded-3xl border shadow-sm ${
            isBothPassed ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-200' : 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-3 shadow-md bg-white">
              {isBothPassed ? (
                <Sparkles className="w-8 h-8 text-emerald-500" />
              ) : (
                <Flame className="w-8 h-8 text-amber-500" />
              )}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              {isBothPassed ? 'CẢ HAI ĐỀU LÀ ĐẠI THÁM TỬ! 🔍' : 'CẦN CHĂM CHÚT NHÌN NHAU HƠN! 😅'}
            </h2>

            {/* Turn details */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-stone-200">
                <span className="text-[10px] text-slate-400 block font-bold">{p1}</span>
                <span className="font-extrabold text-teal-700 text-sm">{turn1Score}/3 điểm</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-stone-200">
                <span className="text-[10px] text-slate-400 block font-bold">{p2}</span>
                <span className="font-extrabold text-teal-700 text-sm">{turn2Score}/3 điểm</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-teal-700 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{isBothPassed ? '+400 Love Power' : '+180 LP An Ủi'}</span>
            </div>
          </div>

          {/* Penalty box if failed */}
          {!isBothPassed && penaltyText && (
            <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>HÌNH PHẠT THÁM TỬ:</span>
              </div>
              <p className="text-xs font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-2xl border border-rose-100">
                "{penaltyText}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {isBothPassed ? (
              <button
                onClick={() => onComplete(400, `Cả hai đều tìm được >= 2/3 chi tiết (${p1}: ${turn1Score}/3, ${p2}: ${turn2Score}/3).`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành & Nhận 400 LP</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử Thách Lại Từ Đầu</span>
                </button>
                <button
                  onClick={() => onComplete(180, `Đã chấp nhận hình phạt thám tử: "${penaltyText}"`)}
                  className="w-full py-3 rounded-2xl bg-white border border-stone-300 text-slate-600 font-bold text-xs hover:bg-stone-50 transition-colors"
                >
                  <span>Chấp Nhận Chịu Phạt & Qua Màn (+180 LP)</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
