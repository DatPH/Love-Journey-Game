import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Timer, 
  Award, 
  Crown, 
  Shuffle, 
  Smile, 
  ChevronRight,
  Heart,
  Zap,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';

interface Level17Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

const PLANK_PENALTIES = [
  'Đấm bóp vai và xoa bóp bắp tay cho người thắng trong 3 phút.',
  'Khen người thắng 5 câu có cánh về sức mạnh thể lực và độ kiên cường.',
  'Rót một cốc nước mát tận tay và vừa đút vừa gọi "Đại hiệp / Nữ hoàng của lòng em/anh".',
  'Làm tư thế em bé (Child\'s pose hoặc Cat-cow) xin tha thứ thật đáng yêu.',
  'Bao một ly trà sữa / sinh tố full topping bù năng lượng cho người thắng.',
  'Chụp 1 tấm ảnh biểu cảm gục ngã sau khi plank để làm kỷ niệm lầy lội.',
  'Ôm chặt người thắng 30 giây để "sạc lại năng lượng" cho cơ bụng.',
  'Vừa quạt mát vừa bóp chân cho người thắng trong 2 phút.',
];

const MOTIVATIONAL_CALLOUTS = [
  { atSeconds: 0, text: 'Vào thế chuẩn chỉnh: Lưng thẳng, siết chặt cơ bụng!' },
  { atSeconds: 15, text: 'Khởi động nhẹ nhàng! Giữ nhịp thở đều đặn nha!' },
  { atSeconds: 30, text: 'Bắt đầu nóng lên rồi đó! Nhìn vào mắt nhau lấy động lực nào!' },
  { atSeconds: 45, text: 'Cơ bụng đang bùng cháy! Ai chớp mắt trước là lung lay!' },
  { atSeconds: 60, text: 'VƯỢT MỐC 1 PHÚT! Đẳng cấp chiến thần thể lực!' },
  { atSeconds: 90, text: '90 GIÂY! Quá đỉnh cao, không ai chịu nhường ai!' },
  { atSeconds: 120, text: '2 PHÚT RỒI! Cặp đôi huyền thoại cơ bắp bất bại!' },
  { atSeconds: 150, text: 'Sức mạnh tình yêu vô hạn! Ai sẽ là người trụ lại sau cùng?' },
];

export const Level17PlankChallenge: React.FC<Level17Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Flow: 'prep' -> 'countdown' -> 'planking' -> 'result'
  const [stage, setStage] = useState<'prep' | 'countdown' | 'planking' | 'result'>('prep');
  const [countdown, setCountdown] = useState<number>(3);
  const [plankSeconds, setPlankSeconds] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Result state
  const [winner, setWinner] = useState<string | null>(null);
  const [loser, setLoser] = useState<string | null>(null);
  const [selectedPenance, setSelectedPenance] = useState<string | null>(null);
  const [customPenance, setCustomPenance] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const plankTimerRef = useRef<number | null>(null);

  // Stop any speaking on unmount & preload Vietnamese cheer audio
  useEffect(() => {
    const phrasesToPreload = [
      'Ba',
      'Hai',
      'Một',
      'Bắt đầu! Lưng thẳng, siết chặt cơ bụng!',
      ...MOTIVATIONAL_CALLOUTS.map((m) => m.text),
    ];
    soundFx.preloadVietnameseVoice(phrasesToPreload);

    return () => {
      soundFx.stopSpeaking();
      if (plankTimerRef.current) clearInterval(plankTimerRef.current);
    };
  }, []);

  // Countdown 3-2-1 with voice
  useEffect(() => {
    let interval: number;
    if (stage === 'countdown') {
      if (voiceEnabled) soundFx.speak('Ba');
      interval = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            soundFx.playBeep(true);
            if (voiceEnabled) {
              soundFx.speak('Bắt đầu! Lưng thẳng, siết chặt cơ bụng!');
            }
            setPlankSeconds(0);
            setStage('planking');
            return 0;
          }
          soundFx.playBeep(false);
          const nextVal = c - 1;
          if (voiceEnabled) {
            if (nextVal === 2) soundFx.speak('Hai');
            if (nextVal === 1) soundFx.speak('Một');
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, voiceEnabled]);

  // Plank stopwatch timer
  useEffect(() => {
    if (stage === 'planking') {
      plankTimerRef.current = window.setInterval(() => {
        setPlankSeconds((s) => {
          const next = s + 1;
          if (next % 15 === 0) soundFx.playPop();
          return next;
        });
      }, 1000);
    }

    return () => {
      if (plankTimerRef.current) clearInterval(plankTimerRef.current);
    };
  }, [stage]);

  // Trigger voice cheer at milestone seconds
  useEffect(() => {
    if (stage === 'planking' && voiceEnabled && plankSeconds > 0) {
      const match = MOTIVATIONAL_CALLOUTS.find((m) => m.atSeconds === plankSeconds);
      if (match) {
        soundFx.speak(match.text);
      }
    }
  }, [plankSeconds, stage, voiceEnabled]);

  // Current motivational callout
  const currentCallout = [...MOTIVATIONAL_CALLOUTS]
    .reverse()
    .find((m) => plankSeconds >= m.atSeconds)?.text || MOTIVATIONAL_CALLOUTS[0].text;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCountdown = () => {
    soundFx.playPop();
    setCountdown(3);
    setStage('countdown');
  };

  // Called when one player taps their button (they gave up / dropped)
  const handlePlayerGaveUp = (loserName: string, winnerName: string) => {
    if (plankTimerRef.current) clearInterval(plankTimerRef.current);
    soundFx.stopSpeaking();
    soundFx.playFanfare();
    triggerConfetti();

    setLoser(loserName);
    setWinner(winnerName);
    setSelectedPenance(PLANK_PENALTIES[0]);
    setStage('result');

    if (voiceEnabled) {
      soundFx.speak(`Chúc mừng ${winnerName} đã chiến thắng đại chiến Plank! ${loserName} hãy chuẩn bị nhận hình phạt nào!`);
    }
  };

  // Speak current callout manually
  const handleManualSpeakCheer = () => {
    soundFx.speak(currentCallout);
  };

  // Random spin penalty draw
  const handleRandomDraw = () => {
    soundFx.playPop();
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * PLANK_PENALTIES.length);
      setSelectedPenance(PLANK_PENALTIES[randIdx]);
      setCustomPenance('');
      soundFx.playTap();
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        soundFx.playSuccess();
        if (voiceEnabled) {
          soundFx.speak(`Hình phạt được chọn là: ${PLANK_PENALTIES[randIdx]}`);
        }
      }
    }, 100);
  };

  const effectivePenance = customPenance.trim() || selectedPenance || PLANK_PENALTIES[0];

  const handleFinishLevel = () => {
    soundFx.stopSpeaking();
    soundFx.playFanfare();
    const note = `${winner} đã chiến thắng Đại Chiến Plank với thành tích ${formatTime(plankSeconds)}! ${loser} chấp nhận hình phạt: "${effectivePenance}".`;
    onComplete(600, note);
  };

  const handleRestart = () => {
    soundFx.stopSpeaking();
    soundFx.playPop();
    if (plankTimerRef.current) clearInterval(plankTimerRef.current);
    setCountdown(3);
    setPlankSeconds(0);
    setWinner(null);
    setLoser(null);
    setSelectedPenance(null);
    setCustomPenance('');
    setStage('prep');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-orange-100 mb-3">
        <button
          onClick={() => {
            soundFx.stopSpeaking();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>Màn 17 · Đại Chiến Plank Cặp Đôi</span>
        </span>
        <div className="flex items-center gap-1">
          {/* Voice cheer toggle button */}
          <button
            onClick={() => {
              soundFx.playPop();
              const nextVoice = !voiceEnabled;
              setVoiceEnabled(nextVoice);
              if (!nextVoice) soundFx.stopSpeaking();
              else soundFx.speak('Đã bật giọng đọc cổ vũ!');
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              voiceEnabled
                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={voiceEnabled ? 'Đang bật giọng đọc cổ vũ (Chạm để tắt)' : 'Đang tắt giọng đọc (Chạm để bật)'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRestart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            title="Bắt đầu lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PHASE 1: PREPARATION & RULES */}
      {stage === 'prep' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2C1409] via-[#1F0D05] to-[#140602] text-white shadow-xl space-y-4 border border-orange-950 text-left">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shadow-lg">
              <Flame className="w-8 h-8 fill-orange-500 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-orange-400 uppercase tracking-widest font-black block">
                THỬ THÁCH SỨC BỀN CƠ BỤNG & TÌNH YÊU
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Đại Chiến Plank Cặp Đôi
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {p1} và {p2} vào tư thế Plank đối diện nhau. Ai giữ được lâu hơn sẽ là người chiến thắng, người thua sẽ phải chịu 1 hình phạt hài hước!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-orange-200 space-y-2">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-white">
                <Zap className="w-4 h-4 text-orange-400" />
                Luật Chơi & Tính Năng Giọng Đọc Cổ Vũ:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-300 list-disc pl-4 leading-relaxed font-normal">
                <li>Đặt điện thoại nằm ngang ở giữa hai bạn trên thảm hoặc sàn nhà.</li>
                <li>Sau 3 giây đếm ngược, cả hai cùng nâng người vào tư thế <strong>Plank tiêu chuẩn</strong>.</li>
                <li>Hệ thống sẽ <strong>phát giọng nói cổ vũ trực tiếp</strong> qua từng mốc thời gian (15s, 30s, 60s...) để tiếp thêm năng lượng!</li>
                <li>Khi một người <strong>chạm đất / buông xuôi</strong>, hãy bấm ngay vào nút tên mình bên dưới màn hình.</li>
                <li>Người còn lại sẽ được vinh danh là <strong>Chiến Thần Plank</strong> và phát hình phạt cho người thua!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartCountdown}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Vào Vị Trí & Bắt Đầu Đếm Ngược!</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 3-2-1 COUNTDOWN */}
      {stage === 'countdown' && (
        <div className="py-20 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <span className="text-xs uppercase font-black text-orange-600 tracking-widest block">
            CHUẨN BỊ NÂNG NGƯỜI LÊN THẢM
          </span>
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-2xl animate-bounce">
            <span className="text-6xl font-black font-mono">{countdown}</span>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            Hít thở sâu, siết chặt cơ bụng sẵn sàng!
          </p>
        </div>
      )}

      {/* PHASE 3: LIVE PLANK STOPWATCH & SURRENDER BUTTONS */}
      {stage === 'planking' && (
        <div className="space-y-5 text-center animate-in fade-in duration-150">
          {/* Central Live Stopwatch Banner */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl border border-orange-900/60 space-y-3 relative overflow-hidden">
            {/* Glowing background heat pulse */}
            <div className="absolute inset-0 bg-radial from-orange-600/20 to-transparent pointer-events-none animate-pulse" />

            <div className="flex items-center justify-between text-[11px] text-stone-400 uppercase font-black tracking-widest relative z-10">
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-bounce" />
                ĐANG ĐUA THỂ LỰC
              </span>
              <div className="flex items-center gap-2">
                {voiceEnabled && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span>Giọng cổ vũ đang bật</span>
                  </span>
                )}
                <span className="text-stone-400 font-mono">
                  {plankSeconds}s
                </span>
              </div>
            </div>

            {/* Giant Live Clock Display */}
            <div className="relative z-10 py-1">
              <h1 className="text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 drop-shadow-md">
                {formatTime(plankSeconds)}
              </h1>
            </div>

            {/* Motivational Live Cheer With Audio Speaker Re-play Button */}
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs text-amber-200 font-bold relative z-10 flex items-center justify-between gap-2 shadow-inner">
              <span className="text-left flex-1 leading-relaxed">
                💬 "{currentCallout}"
              </span>
              <button
                onClick={handleManualSpeakCheer}
                className="w-8 h-8 rounded-full bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0 transition-transform active:scale-90"
                title="Nghe lại lời cổ vũ bằng giọng nói"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DUAL SURRENDER BUTTONS */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <Info className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>Ai chạm đất hoặc đổi thế trước thì chạm vào nút tên mình:</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* P1 Surrender Button */}
              <button
                onClick={() => handlePlayerGaveUp(p1, p2)}
                className="p-4 rounded-2xl bg-white border-2 border-rose-300 hover:border-rose-500 hover:bg-rose-50 shadow-md active:scale-95 transition-all text-left flex flex-col justify-between h-32 group"
              >
                <div>
                  <span className="text-[10px] text-rose-500 uppercase font-black tracking-wider block">
                    ĐẦU HÀNG / CHẠM ĐẤT
                  </span>
                  <p className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors mt-0.5">
                    {p1}
                  </p>
                </div>
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
                  <span>Em/Anh gục rồi 🏳️</span>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* P2 Surrender Button */}
              <button
                onClick={() => handlePlayerGaveUp(p2, p1)}
                className="p-4 rounded-2xl bg-white border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 shadow-md active:scale-95 transition-all text-left flex flex-col justify-between h-32 group"
              >
                <div>
                  <span className="text-[10px] text-indigo-500 uppercase font-black tracking-wider block">
                    ĐẦU HÀNG / CHẠM ĐẤT
                  </span>
                  <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                    {p2}
                  </p>
                </div>
                <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                  <span>Em/Anh gục rồi 🏳️</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: RESULT & PUNISHMENT SELECTION */}
      {stage === 'result' && winner && loser && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          {/* Winner Celebration Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-amber-500 flex items-center justify-center shadow-lg animate-bounce">
              <Crown className="w-9 h-9 fill-amber-500" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-100 block">
                CHIẾN THẦN PLANK VÔ ĐỊCH
              </span>
              <h2 className="text-2xl font-black text-white">
                {winner} Thắng Cuộc! 🏆
              </h2>
              <p className="text-xs text-amber-100 font-bold mt-1">
                Kỷ lục bền bỉ: <span className="font-mono text-white font-extrabold text-sm">{formatTime(plankSeconds)}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 text-xs text-amber-100 flex items-center justify-center gap-2">
              <Smile className="w-4 h-4 text-amber-300" />
              <span>{loser} đã kiên cường chịu thua và sẵn sàng chịu phạt!</span>
            </div>
          </div>

          {/* PUNISHMENT LIST & RANDOM DRAW */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-600 font-black uppercase tracking-wider block">
                  BẢN ÁN DÀNH CHO {loser}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Chọn Hoặc Bốc Thăm Hình Phạt
                </h3>
              </div>

              {/* Random Draw Button */}
              <button
                onClick={handleRandomDraw}
                disabled={isSpinning}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Bốc Ngẫu Nhiên</span>
              </button>
            </div>

            {/* List of preset punishments */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {PLANK_PENALTIES.map((penalty, idx) => {
                const isSelected = selectedPenance === penalty && !customPenance.trim();
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playTap();
                      setSelectedPenance(penalty);
                      setCustomPenance('');
                      if (voiceEnabled) soundFx.speak(penalty);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-1 ring-rose-300'
                        : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-stone-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{penalty}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Punishment input from the winner */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">
                Hoặc {winner} tự soạn hình phạt riêng cho {loser}:
              </span>
              <textarea
                value={customPenance}
                onChange={(e) => setCustomPenance(e.target.value)}
                placeholder="Ví dụ: Phạt làm bữa ăn nhẹ, bóp chân 5 phút, hoặc hôn má 10 cái liên tục..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Selected Penalty Display */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
            <span className="text-[10px] text-amber-800 font-extrabold uppercase">
              Hình phạt được ấn định cho {loser}:
            </span>
            <p className="font-bold text-slate-900 leading-relaxed italic">
              "{effectivePenance}"
            </p>
          </div>

          {/* Action Button: Confirm & Finish */}
          <button
            onClick={handleFinishLevel}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã Chấp Nhận Hình Phạt & Hoàn Thành (+600 LP)</span>
          </button>
        </div>
      )}
    </div>
  );
};
