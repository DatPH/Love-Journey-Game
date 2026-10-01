import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Flag, Trophy, RotateCcw, Sparkles, CheckCircle2, Clock, Users } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level2DressingRaceProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

type RacePhase = 'INTRO' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

const FUN_PENALTIES = [
  'Người về nhì phải xách túi và cầm ô che nắng/mưa cho người thắng suốt cả buổi hẹn!',
  'Người về nhì phải bao chầu trà sữa hoặc kem tráng miệng tối nay!',
  'Người về nhì phải chụp ít nhất 5 tấm ảnh "sống ảo" có tâm cho người thắng!',
  'Người về nhì phải thơm má người thắng 3 cái trước khi bước ra khỏi cửa!',
  'Người về nhì phải bóc vỏ tôm hoặc gắp đồ ăn cho người thắng trong bữa ăn!',
];

export const Level2DressingRace: React.FC<Level2DressingRaceProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<RacePhase>('INTRO');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [p1FinishTime, setP1FinishTime] = useState<number | null>(null);
  const [p2FinishTime, setP2FinishTime] = useState<number | null>(null);
  const [penaltyIndex, setPenaltyIndex] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Countdown 3-2-1 logic
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (phase === 'COUNTDOWN') {
      setCountdownNum(3);
      soundFx.playBeep(false);

      countdownInterval = setInterval(() => {
        setCountdownNum((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            soundFx.playBeep(true);
            setPhase('RACING');
            startTimeRef.current = Date.now();
            return 0;
          }
          soundFx.playBeep(false);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [phase]);

  // Stopwatch race ticking
  useEffect(() => {
    if (phase === 'RACING') {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleStartCountdown = () => {
    soundFx.playPop();
    setP1FinishTime(null);
    setP2FinishTime(null);
    setWinner(null);
    setElapsedTime(0);
    setPhase('COUNTDOWN');
  };

  const handlePlayerFinish = (player: 'p1' | 'p2') => {
    soundFx.playPop();
    const current = Date.now() - startTimeRef.current;

    if (player === 'p1') {
      setP1FinishTime(current);
      if (!p2FinishTime) {
        setWinner(profile.name1);
      }
    } else {
      setP2FinishTime(current);
      if (!p1FinishTime) {
        setWinner(profile.name2);
      }
    }

    // If both finished or first finishes, user can end race
  };

  const handleFinishRace = (chosenWinner?: string) => {
    soundFx.playFanfare();
    triggerConfetti();
    if (chosenWinner) {
      setWinner(chosenWinner);
    }
    setPhase('FINISHED');
  };

  const handleResetRace = () => {
    soundFx.playPop();
    setPhase('INTRO');
    setElapsedTime(0);
    setP1FinishTime(null);
    setP2FinishTime(null);
    setWinner(null);
  };

  const formatStopwatch = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const handleCompleteMission = () => {
    soundFx.playFanfare();
    triggerConfetti();
    const winningText = winner ? `${winner} chiến thắng` : 'Cả hai hòa nhau';
    onComplete(
      120,
      `Đường Đua Mặc Đồ kết thúc: ${winningText}! Hình phạt: "${FUN_PENALTIES[penaltyIndex]}"`
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => {
            soundFx.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bản đồ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
            Màn 2 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Tốc Độ Mặc Đồ</span>
        </div>
      </div>

      {/* Main Container by Phase */}
      {phase === 'INTRO' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-700 border border-pink-200/60 rounded-full text-xs font-semibold mb-2">
              <span>⏱️ Thử Thách Lên Đồ Thần Tốc</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Đường Đua Tốc Độ Mặc Đồ
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Ai là người chuẩn bị lâu nhất trong hai bạn? Hôm nay hãy thi đấu công bằng bằng đồng hồ bấm giờ!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-rose-500" />
              Luật Thi Đấu Cặp Đôi
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <span>Cả hai chuẩn bị sẵn hai bộ đồ cùng loại (Ví dụ : quần jeans áo sơ mi và ao áo khoác có khóa kéo)</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <span>Bấm bắt đầu để đếm ngược 3-2-1, rồi nhanh chóng mặc tất cả trang phục lên người đến khi hoàn chỉnh</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <span>Người hoàn thành trước bấm nút xác nhận. Người về nhì sẽ gánh hình phạt thú vị!</span>
              </div>
            </div>

            {/* Competitors Preview */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                <span className="text-2xl block mb-1">👔</span>
                <span className="text-xs font-bold text-slate-800 block truncate">{profile.name1}</span>
                <span className="text-[10px] text-slate-500">Chiến thần tốc độ</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-2xl block mb-1">👗</span>
                <span className="text-xs font-bold text-slate-800 block truncate">{profile.name2}</span>
                <span className="text-[10px] text-slate-500">Nữ hoàng thời trang</span>
              </div>
            </div>
          </div>

          {/* CTA Start */}
          <button
            onClick={handleStartCountdown}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>SẴN SÀNG: BẮT ĐẦU ĐẾM NGƯỢC</span>
          </button>
        </div>
      )}

      {/* Countdown Phase */}
      {phase === 'COUNTDOWN' && (
        <div className="flex flex-col items-center justify-center min-h-[320px] text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Chuẩn bị vào vị trí...
          </span>
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center font-black text-6xl shadow-xl shadow-rose-500/30 animate-ping duration-1000">
            {countdownNum}
          </div>
          <p className="mt-8 text-sm font-semibold text-rose-600">
            {countdownNum === 1 ? 'LÊN ĐỒ THÔI NÀO!' : '3... 2... 1...'}
          </p>
        </div>
      )}

      {/* Racing Stopwatch Phase */}
      {phase === 'RACING' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Big Digital Stopwatch */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white text-center shadow-xl ring-4 ring-rose-200">
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Đang Tính Giờ Thi Đấu</span>
            </div>
            <div className="text-5xl font-mono font-black tracking-tight text-white my-1">
              {formatStopwatch(elapsedTime)}
            </div>
            <p className="text-[11px] text-slate-400">
              Nhanh tay lên nào! Ai hoàn thành trước thì ấn nút bên dưới!
            </p>
          </div>

          {/* Interactive Player Finish Triggers */}
          <div className="grid grid-cols-2 gap-3">
            {/* Player 1 Button */}
            <button
              onClick={() => handlePlayerFinish('p1')}
              disabled={p1FinishTime !== null}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
                p1FinishTime !== null
                  ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800'
                  : 'bg-white border-2 border-rose-300 hover:border-rose-500 active:scale-95 shadow-md'
              }`}
            >
              <span className="text-2xl mb-1">👔</span>
              <span className="text-xs font-extrabold text-slate-800 truncate w-full text-center">
                {profile.name1} ĐÃ XONG!
              </span>
              <span className="text-[11px] mt-1 font-mono font-bold text-rose-600">
                {p1FinishTime ? `Hoàn tất: ${formatStopwatch(p1FinishTime)}` : 'Chạm khi lên đồ xong'}
              </span>
            </button>

            {/* Player 2 Button */}
            <button
              onClick={() => handlePlayerFinish('p2')}
              disabled={p2FinishTime !== null}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
                p2FinishTime !== null
                  ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800'
                  : 'bg-white border-2 border-indigo-300 hover:border-indigo-500 active:scale-95 shadow-md'
              }`}
            >
              <span className="text-2xl mb-1">👗</span>
              <span className="text-xs font-extrabold text-slate-800 truncate w-full text-center">
                {profile.name2} ĐÃ XONG!
              </span>
              <span className="text-[11px] mt-1 font-mono font-bold text-indigo-600">
                {p2FinishTime ? `Hoàn tất: ${formatStopwatch(p2FinishTime)}` : 'Chạm khi lên đồ xong'}
              </span>
            </button>
          </div>

          {/* Finish Race Button */}
          {(p1FinishTime !== null || p2FinishTime !== null) && (
            <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm text-center space-y-3">
              <p className="text-xs font-bold text-slate-800">
                {p1FinishTime && !p2FinishTime && `🏆 ${profile.name1} đã hoàn thành trước!`}
                {p2FinishTime && !p1FinishTime && `🏆 ${profile.name2} đã hoàn thành trước!`}
                {p1FinishTime && p2FinishTime && 'Cả hai bạn đều đã hoàn thành trang phục!'}
              </p>

              <button
                onClick={() => handleFinishRace()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                Xem Kết Quả & Công Bố Hình Phạt 🏆
              </button>
            </div>
          )}
        </div>
      )}

      {/* Finished / Winner & Penalty Phase */}
      {phase === 'FINISHED' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="p-5 rounded-3xl bg-white border-2 border-rose-200 shadow-lg text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 ring-4 ring-amber-50">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
              Chiến Thần Tốc Độ Xuất Sắc
            </span>

            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {winner ? `Chúc Mừng ${winner}!` : 'Cả Hai Đồng Hạng!'}
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Thời gian xuất sắc: <strong className="font-mono text-slate-800">{formatStopwatch(elapsedTime)}</strong>
            </p>

            {/* Selector to manually adjust winner if desired */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-400">Chọn người thắng:</span>
              <button
                onClick={() => setWinner(profile.name1)}
                className={`px-2.5 py-1 rounded-full font-bold ${
                  winner === profile.name1 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {profile.name1}
              </button>
              <button
                onClick={() => setWinner(profile.name2)}
                className={`px-2.5 py-1 rounded-full font-bold ${
                  winner === profile.name2 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {profile.name2}
              </button>
            </div>

            {/* Fun Penalty Note Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Hình Phạt Dành Cho Người Thua
                </span>
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setPenaltyIndex((prev) => (prev + 1) % FUN_PENALTIES.length);
                  }}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  Đổi hình phạt ↻
                </button>
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed mt-1">
                "{FUN_PENALTIES[penaltyIndex]}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={handleCompleteMission}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành Thử Thách (+120 LP)</span>
              </button>

              <button
                onClick={handleResetRace}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đua lại lần nữa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
