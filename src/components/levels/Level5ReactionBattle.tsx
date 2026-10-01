import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Swords, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Zap, 
  Coffee, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level5ReactionBattleProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

interface DecoyColor {
  name: string;
  label: string;
  bgClass: string;
  accentClass: string;
}

const DECOY_COLORS: DecoyColor[] = [
  { name: 'Màu Đỏ', label: '🛑 MÀU ĐỎ - BẪY! ĐỪNG BẤM!', bgClass: 'bg-red-600', accentClass: 'text-red-100' },
  { name: 'Màu Vàng', label: '⚠️ MÀU VÀNG - COI CHỪNG BẪY!', bgClass: 'bg-amber-500', accentClass: 'text-amber-100' },
  { name: 'Xanh Dương', label: '🔷 XANH DƯƠNG - CHƯA PHẢI!', bgClass: 'bg-blue-600', accentClass: 'text-blue-100' },
  { name: 'Màu Tím', label: '🔮 MÀU TÍM - BÌNH TĨNH!', bgClass: 'bg-purple-600', accentClass: 'text-purple-100' },
  { name: 'Màu Cam', label: '🍊 MÀU CAM - KHÔNG PHẢI XANH LÁ!', bgClass: 'bg-orange-500', accentClass: 'text-orange-100' },
];

type BattleState = 
  | 'INTRO' 
  | 'SUSPENSE' 
  | 'GREEN_TRIGGER' 
  | 'EARLY_TAP' 
  | 'ROUND_OVER' 
  | 'MATCH_OVER' 
  | 'WAITER_TIMER';

const WAITER_TASKS = [
  'Rót một cốc nước mát và dâng tận tay người thắng kèm nụ cười tươi.',
  'Bóc vỏ tôm hoặc gắp miếng ngon nhất cho người thắng trong bữa ăn.',
  'Đấm lưng hoặc xoa bóp vai nhẹ nhàng trong 2 phút.',
  'Quạt mát và bóc vỏ trái cây cho người thắng thưởng thức.',
  'Lắng nghe và tuân lệnh mọi mệnh lệnh hợp lý của người thắng.',
];

export const Level5ReactionBattle: React.FC<Level5ReactionBattleProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [battleState, setBattleState] = useState<BattleState>('INTRO');

  // Best of 3 (Bo3) match state
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [lastRoundWinner, setLastRoundWinner] = useState<string | null>(null);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);

  // Distraction decoy state
  const [currentDecoy, setCurrentDecoy] = useState<DecoyColor | null>(null);
  const [foulReason, setFoulReason] = useState<string>('');
  const [fouledPlayer, setFouledPlayer] = useState<string | null>(null);

  // Reaction timestamps
  const triggerTimeRef = useRef<number>(0);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);

  // 2-minute waiter timer (120 seconds)
  const [waiterSeconds, setWaiterSeconds] = useState<number>(120);
  const [isWaiterActive, setIsWaiterActive] = useState<boolean>(false);
  const waiterTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timeouts pool for suspense & decoys
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (waiterTimerRef.current) clearInterval(waiterTimerRef.current);
    };
  }, []);

  // Waiter timer effect
  useEffect(() => {
    if (isWaiterActive && waiterSeconds > 0) {
      waiterTimerRef.current = setInterval(() => {
        setWaiterSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(waiterTimerRef.current!);
            setIsWaiterActive(false);
            soundFx.playBeep(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (waiterTimerRef.current) clearInterval(waiterTimerRef.current);
    }

    return () => {
      if (waiterTimerRef.current) clearInterval(waiterTimerRef.current);
    };
  }, [isWaiterActive, waiterSeconds]);

  // Start or restart full Bo3 match
  const handleStartMatch = () => {
    soundFx.playPop();
    setP1Score(0);
    setP2Score(0);
    setCurrentRound(1);
    setMatchWinner(null);
    setLastRoundWinner(null);
    startRoundSequence();
  };

  // Begin a specific round's suspense with color decoys
  const startRoundSequence = () => {
    clearAllTimeouts();
    setCurrentDecoy(null);
    setFoulReason('');
    setFouledPlayer(null);
    setLastReactionTime(null);
    setBattleState('SUSPENSE');

    // Number of decoy flashes before real green (1 to 3 decoys)
    const decoyCount = Math.floor(Math.random() * 3) + 1;
    let accumulatedTime = 1000 + Math.random() * 800; // Initial dark waiting

    // Pick unique decoy colors
    const shuffledDecoys = [...DECOY_COLORS].sort(() => 0.5 - Math.random()).slice(0, decoyCount);

    shuffledDecoys.forEach((decoy) => {
      // Show decoy color
      const tShow = setTimeout(() => {
        setCurrentDecoy(decoy);
        soundFx.playTick();
      }, accumulatedTime);
      timeoutsRef.current.push(tShow);

      // Duration of this decoy (700ms - 1100ms)
      const decoyDuration = 700 + Math.random() * 400;
      accumulatedTime += decoyDuration;

      // Reset back to dark briefly between decoys (300ms - 600ms)
      const tClear = setTimeout(() => {
        setCurrentDecoy(null);
      }, accumulatedTime);
      timeoutsRef.current.push(tClear);

      accumulatedTime += 300 + Math.random() * 300;
    });

    // Finally: TRIGGER REAL GREEN LIGHT!
    const tGreen = setTimeout(() => {
      setCurrentDecoy(null);
      setBattleState('GREEN_TRIGGER');
      triggerTimeRef.current = performance.now();
      soundFx.playAlert();
    }, accumulatedTime);
    timeoutsRef.current.push(tGreen);
  };

  // Player taps their zone
  const handlePlayerTap = (player: 'p1' | 'p2') => {
    const playerName = player === 'p1' ? profile.name1 : profile.name2;
    const opponentName = player === 'p1' ? profile.name2 : profile.name1;

    // CASE 1: Tap during SUSPENSE (Before Green light, on decoy or dark) => FOUL!
    if (battleState === 'SUSPENSE') {
      clearAllTimeouts();
      soundFx.playBeep(false);

      const reason = currentDecoy 
        ? `Đã bấm nhầm khi đang là ${currentDecoy.name}!` 
        : 'Đã nôn nóng chạm trước khi có Đèn Xanh Lá!';

      setFouledPlayer(playerName);
      setFoulReason(reason);
      setLastRoundWinner(opponentName);

      // Other player gets the point!
      if (player === 'p1') {
        const nextP2 = p2Score + 1;
        setP2Score(nextP2);
        checkMatchProgress(p1Score, nextP2, opponentName, 'EARLY_TAP');
      } else {
        const nextP1 = p1Score + 1;
        setP1Score(nextP1);
        checkMatchProgress(nextP1, p2Score, opponentName, 'EARLY_TAP');
      }
      return;
    }

    // CASE 2: Tap during REAL GREEN LIGHT => Fastest tap wins round!
    if (battleState === 'GREEN_TRIGGER') {
      clearAllTimeouts();
      const diff = Math.round(performance.now() - triggerTimeRef.current);
      setLastReactionTime(diff);
      setLastRoundWinner(playerName);
      soundFx.playPop();

      if (player === 'p1') {
        const nextP1 = p1Score + 1;
        setP1Score(nextP1);
        checkMatchProgress(nextP1, p2Score, playerName, 'ROUND_OVER');
      } else {
        const nextP2 = p2Score + 1;
        setP2Score(nextP2);
        checkMatchProgress(p1Score, nextP2, playerName, 'ROUND_OVER');
      }
    }
  };

  // Evaluate if someone won 2 rounds (Bo3 Champion)
  const checkMatchProgress = (
    score1: number, 
    score2: number, 
    roundWinner: string, 
    fallbackState: BattleState
  ) => {
    if (score1 >= 2) {
      setMatchWinner(profile.name1);
      soundFx.playFanfare();
      triggerConfetti();
      setBattleState('MATCH_OVER');
    } else if (score2 >= 2) {
      setMatchWinner(profile.name2);
      soundFx.playFanfare();
      triggerConfetti();
      setBattleState('MATCH_OVER');
    } else {
      setBattleState(fallbackState);
    }
  };

  // Move to next round
  const handleNextRound = () => {
    soundFx.playPop();
    setCurrentRound((prev) => prev + 1);
    startRoundSequence();
  };

  const handleStartWaiterTimer = () => {
    soundFx.playPop();
    setWaiterSeconds(120);
    setIsWaiterActive(true);
    setBattleState('WAITER_TIMER');
  };

  const handleFinishLevel = () => {
    soundFx.playFanfare();
    triggerConfetti();
    const winningNote = matchWinner 
      ? `${matchWinner} chiến thắng kịch tính tỉ số ${p1Score} - ${p2Score}` 
      : 'Cả hai bạn phản xạ tuyệt vời';
    onComplete(
      200,
      `Trận Chiến Giao Thức (3 Hiệp Thắng 2): ${winningNote}! Đặc quyền phục vụ 2 phút đã được kích hoạt!`
    );
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => {
            soundFx.playPop();
            clearAllTimeouts();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bản đồ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
            Màn 5 / 20 · Cột Mốc
          </span>
          <span className="text-xs font-bold text-slate-700">Trận Chiến Giao Thức</span>
        </div>
      </div>

      {/* PHASE: INTRO WITH NEW BEST-OF-3 & DECOY INSTRUCTIONS */}
      {battleState === 'INTRO' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full text-xs font-semibold mb-2">
              <span>⚡ Đấu Phản Xạ: 3 Hiệp Thắng 2 (Bo3)</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Trận Chiến Giao Thức
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              "Ai Thắng Người Đó Đứng Lên" — Thi đấu 3 hiệp thắng 2 với bẫy màu sắc gây nhiễu cực kỳ kịch tính!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-rose-500" />
              Luật Thi Đấu Mới (3 Hiệp Thắng 2)
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Thể thức 3 hiệp thắng 2:</strong> Người nào chạm mốc <strong>2 hiệp thắng trước</strong> sẽ là Quán Quân chung cuộc!
                </span>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-amber-900">Bẫy Màu Sắc Gây Nhiễu:</strong>
                  <span className="block mt-0.5 text-amber-950">
                    Màn hình sẽ chớp nháy các màu lừa (Đỏ 🛑, Vàng ⚠️, Xanh Dương 🔷, Tím 🔮...). <strong>Tuyệt đối không được bấm!</strong> Ai bấm nhầm sẽ bị xử thua ngay hiệp đó.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-emerald-900">Tín Hiệu Đèn Xanh Lá (🟢):</strong>
                  <span className="block mt-0.5 text-emerald-950">
                    CHỈ ĐƯỢC CHẠM khi màn hình lóe lên <strong>MÀU XANH LÁ RỰC RỠ</strong>! Ai chạm nhanh nhất sẽ ghi điểm hiệp đó.
                  </span>
                </div>
              </div>
            </div>

            {/* Privilege Preview */}
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
              <span className="font-bold text-rose-900 block mb-1 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-rose-600" />
                Đặc Quyền Quán Quân (2 Phút)
              </span>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Người thắng 2/3 hiệp có quyền ra lệnh đối phương phục vụ bàn: rót nước, gắp đồ ăn, đấm lưng xoa bóp trong 2 phút!
              </p>
            </div>
          </div>

          <button
            onClick={handleStartMatch}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>BẮT ĐẦU TRẬN ĐẤU (HIỆP 1 / 3)</span>
          </button>
        </div>
      )}

      {/* PHASE: ACTIVE ARENA (SUSPENSE with Decoys OR GREEN TRIGGER) */}
      {(battleState === 'SUSPENSE' || battleState === 'GREEN_TRIGGER') && (
        <div className="space-y-3 animate-in fade-in">
          {/* Real-time Match Scoreboard */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-rose-200 shadow-xs text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 truncate">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                {profile.name1.charAt(0)}
              </span>
              <span className="truncate">{profile.name1}:</span>
              <span className="text-sm font-mono text-rose-600">{p1Score}</span>
            </div>

            <div className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
              Hiệp {currentRound} / 3 (Bo3)
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-800 truncate">
              <span className="text-sm font-mono text-indigo-600">{p2Score}</span>
              <span className="truncate">:{profile.name2}</span>
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                {profile.name2.charAt(0)}
              </span>
            </div>
          </div>

          {/* 2-Player Split Battle Arena */}
          <div className="h-[440px] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl flex flex-col relative select-none">
            {/* Top Half: Player 2 (Em) */}
            <div
              onClick={() => handlePlayerTap('p2')}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-150 ${
                battleState === 'GREEN_TRIGGER'
                  ? 'bg-emerald-500 text-white active:bg-emerald-600 animate-pulse'
                  : currentDecoy
                  ? `${currentDecoy.bgClass} text-white`
                  : 'bg-indigo-950 text-indigo-200'
              }`}
            >
              <div className="rotate-180 text-center px-4">
                <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                  VÙNG CỦA {profile.name2.toUpperCase()}
                </span>
                <span className="text-lg font-black block mt-1">
                  {battleState === 'GREEN_TRIGGER'
                    ? '🟢 BẤM NGAYYY! (XANH LÁ) 🟢'
                    : currentDecoy
                    ? currentDecoy.label
                    : 'ĐẶT TAY & CHỜ ĐÈN XANH LÁ...'}
                </span>
                <span className="text-[10px] opacity-75 block mt-0.5">
                  {battleState === 'GREEN_TRIGGER' ? '⚡ CHẠM TỐC ĐỘ! ⚡' : 'Đừng bấm nhầm màu bẫy!'}
                </span>
              </div>
            </div>

            {/* Center Dividing Suspense Bar */}
            <div className={`h-12 border-y-2 flex items-center justify-center text-center z-10 px-4 transition-colors ${
              battleState === 'GREEN_TRIGGER'
                ? 'bg-emerald-700 border-white text-white font-black animate-bounce'
                : currentDecoy
                ? 'bg-slate-900 border-white/30 text-white font-bold'
                : 'bg-slate-900 border-slate-700 text-amber-300 font-bold'
            }`}>
              {battleState === 'GREEN_TRIGGER' ? (
                <span className="text-xs tracking-wider">💥 CHẠM XANH LÁ NGAY! 💥</span>
              ) : currentDecoy ? (
                <span className="text-xs uppercase tracking-wider animate-pulse">
                  ⚠️ BẪY: {currentDecoy.name.toUpperCase()} (KHÔNG BẤM)
                </span>
              ) : (
                <span className="text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>ĐANG CHỜ TÍN HIỆU XANH LÁ...</span>
                </span>
              )}
            </div>

            {/* Bottom Half: Player 1 (Anh) */}
            <div
              onClick={() => handlePlayerTap('p1')}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-150 ${
                battleState === 'GREEN_TRIGGER'
                  ? 'bg-emerald-500 text-white active:bg-emerald-600 animate-pulse'
                  : currentDecoy
                  ? `${currentDecoy.bgClass} text-white`
                  : 'bg-slate-900 text-rose-200'
              }`}
            >
              <div className="text-center px-4">
                <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                  VÙNG CỦA {profile.name1.toUpperCase()}
                </span>
                <span className="text-lg font-black block mt-1">
                  {battleState === 'GREEN_TRIGGER'
                    ? '🟢 BẤM NGAYYY! (XANH LÁ) 🟢'
                    : currentDecoy
                    ? currentDecoy.label
                    : 'ĐẶT TAY & CHỜ ĐÈN XANH LÁ...'}
                </span>
                <span className="text-[10px] opacity-75 block mt-0.5">
                  {battleState === 'GREEN_TRIGGER' ? '⚡ CHẠM TỐC ĐỘ! ⚡' : 'Đừng bấm nhầm màu bẫy!'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE: FOUL / EARLY TAP PENALTY */}
      {battleState === 'EARLY_TAP' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl text-center space-y-3 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            Phạm Quy Hiệp {currentRound}
          </div>

          <h2 className="text-base font-black text-slate-800">
            {fouledPlayer} dính bẫy: {foulReason}
          </h2>

          <p className="text-xs text-emerald-600 font-bold">
            +1 Điểm Hiệp Được Trao Cho {lastRoundWinner}!
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block mb-1">Tỉ số hiện tại (3 hiệp thắng 2):</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {profile.name1} {p1Score} - {p2Score} {profile.name2}
            </div>
          </div>

          <button
            onClick={handleNextRound}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>VÀO HIỆP TIẾP THEO (HIỆP {currentRound + 1})</span>
          </button>
        </div>
      )}

      {/* PHASE: ROUND OVER (When a round is won cleanly on green light, but neither has 2 wins yet) */}
      {battleState === 'ROUND_OVER' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl text-center space-y-3 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            Kết Thúc Hiệp {currentRound}
          </div>

          <h2 className="text-lg font-black text-slate-900">
            🏆 {lastRoundWinner} Thắng Hiệp {currentRound}!
          </h2>

          <p className="text-xs text-slate-500">
            Tốc độ phản xạ: <strong className="font-mono text-emerald-600 font-bold">{lastReactionTime} ms</strong>
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block mb-1">Tỉ số hiện tại (3 hiệp thắng 2):</span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {profile.name1} {p1Score} - {p2Score} {profile.name2}
            </div>
            <span className="text-[11px] text-rose-500 font-medium block mt-1">
              Ai đạt 2 điểm trước sẽ thắng chung cuộc!
            </span>
          </div>

          <button
            onClick={handleNextRound}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>VÀO HIỆP TIẾP THEO (HIỆP {currentRound + 1})</span>
          </button>
        </div>
      )}

      {/* PHASE: MATCH OVER (Someone won 2 out of 3 rounds!) */}
      {battleState === 'MATCH_OVER' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="p-5 rounded-3xl bg-white border-2 border-rose-300 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 ring-4 ring-amber-50">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">
              Quán Quân Chung Cuộc (3 Hiệp Thắng 2)
            </span>

            <h2 className="text-2xl font-black text-slate-900 mt-1">
              🎉 Chúc Mừng {matchWinner}!
            </h2>

            <p className="text-xs text-slate-600 mt-1">
              Chiến thắng chung cuộc với tỉ số: <strong className="font-mono text-rose-600 font-extrabold">{p1Score} - {p2Score}</strong>
            </p>

            {/* Waiter Favor Privilege Box */}
            <div className="mt-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-left space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                <Coffee className="w-4 h-4 text-rose-600" />
                <span>Kích Hoạt Đặc Quyền: 2 Phút Phục Vụ Bàn</span>
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed">
                Người về nhì ({matchWinner === profile.name1 ? profile.name2 : profile.name1}) phải ngoan ngoãn phục vụ Quán Quân trong 2 phút tới:
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                {WAITER_TASKS.slice(0, 3).map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={handleStartWaiterTimer}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Clock className="w-4 h-4" />
                <span>Bắt Đầu 2 Phút Phục Vụ Bàn ⏱️</span>
              </button>

              <button
                onClick={handleStartMatch}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tái đấu trận mới (Bo3)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE: WAITER TIMER (2 Minutes Service Countdown) */}
      {battleState === 'WAITER_TIMER' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 text-white text-center shadow-xl ring-4 ring-rose-200">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-2">
              2 Phút Phục Vụ Bàn Đang Trôi Qua
            </span>
            <div className="text-5xl font-mono font-black text-rose-400 my-2">
              {formatTimer(waiterSeconds)}
            </div>
            <p className="text-xs text-slate-300">
              Quán quân {matchWinner} hãy thoải mái tận hưởng sự chăm sóc ngọt ngào từ người thương!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">Nhiệm vụ phục vụ gợi ý:</span>
            <p className="text-slate-600 italic">
              "{WAITER_TASKS[Math.floor(Math.random() * WAITER_TASKS.length)]}"
            </p>
          </div>

          <button
            onClick={handleFinishLevel}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Hoàn Thành Màn 5 Cột Mốc (+200 LP)</span>
          </button>
        </div>
      )}
    </div>
  );
};
