import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Smile, 
  Clock, 
  Heart, 
  Award,
  AlertCircle
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level7MirrorSymmetryProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

interface PosePrompt {
  id: number;
  title: string;
  emoji: string;
  hint: string;
}

const ROUND1_POSES: PosePrompt[] = [
  { id: 1, title: 'Kinh Hoàng Tột Độ', emoji: '😱', hint: 'Trợn tròn mắt, há hốc miệng kinh ngạc như vừa thấy chuột!' },
  { id: 2, title: 'Aegyo Siêu Ngọt Ngào', emoji: '😽', hint: 'Nháy một bên mắt, phồng má chu môi đáng yêu cấp độ thần thánh!' },
  { id: 3, title: 'Tổng Tài Lạnh Lùng', emoji: '😏', hint: 'Nheo một bên lông mày, cười nhếch mép kiểu phim Hàn Quốc!' },
];

const ROUND2_POSES: PosePrompt[] = [
  { id: 1, title: 'Quyến Rũ Kiêu Kỳ', emoji: '💃', hint: 'Cắn nhẹ bờ môi, hất cằm vuốt tóc thần thái siêu mẫu quốc tế!' },
  { id: 2, title: 'Dỗi Hờn Đòi Trà Sữa', emoji: '🥺', hint: 'Mắt long lanh ngấn lệ, mếu môi phụng phịu đòi người yêu dỗ dành!' },
  { id: 3, title: 'Biểu Cảm Hề Hước 10 Điểm', emoji: '🤪', hint: 'Mắt lác, lè lưỡi nghiêng đầu cười khẩy không màng hình tượng!' },
];

type Phase = 'INTRO' | 'COUNTDOWN' | 'ROUND_POSING' | 'BETWEEN_ROUNDS' | 'VOTING' | 'MASSAGE_TIMER';

export const Level7MirrorSymmetry: React.FC<Level7MirrorSymmetryProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [currentRound, setCurrentRound] = useState<1 | 2>(1);
  const [currentPoseIdx, setCurrentPoseIdx] = useState<number>(0);
  
  // 5-second pose countdown timer
  const [poseTimeLeft, setPoseTimeLeft] = useState<number>(5);
  const poseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3-2-1 initial start countdown
  const [startCountdown, setStartCountdown] = useState<number>(3);
  const countTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 2-minute massage penalty timer (120 seconds)
  const [massageTime, setMassageTime] = useState<number>(120);
  const [isMassageRunning, setIsMassageRunning] = useState<boolean>(false);
  const massageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voting state
  const [loserName, setLoserName] = useState<string | null>(null);

  const activeOriginal = currentRound === 1 ? profile.name1 : profile.name2;
  const activeMirror = currentRound === 1 ? profile.name2 : profile.name1;
  const currentPoses = currentRound === 1 ? ROUND1_POSES : ROUND2_POSES;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (poseTimerRef.current) clearInterval(poseTimerRef.current);
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      if (massageTimerRef.current) clearInterval(massageTimerRef.current);
    };
  }, []);

  // 3-2-1 start countdown
  useEffect(() => {
    if (phase === 'COUNTDOWN') {
      countTimerRef.current = setInterval(() => {
        setStartCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countTimerRef.current!);
            soundFx.playAlert();
            setPhase('ROUND_POSING');
            setPoseTimeLeft(5);
            return 3;
          }
          soundFx.playTick();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countTimerRef.current) clearInterval(countTimerRef.current);
    }

    return () => {
      if (countTimerRef.current) clearInterval(countTimerRef.current);
    };
  }, [phase]);

  // 5-second pose timer loop
  useEffect(() => {
    if (phase === 'ROUND_POSING' && poseTimeLeft > 0) {
      poseTimerRef.current = setInterval(() => {
        setPoseTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(poseTimerRef.current!);
            handleNextPoseOrRound();
            return 5;
          }
          soundFx.playTick();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (poseTimerRef.current) clearInterval(poseTimerRef.current);
    }

    return () => {
      if (poseTimerRef.current) clearInterval(poseTimerRef.current);
    };
  }, [phase, poseTimeLeft, currentPoseIdx, currentRound]);

  // Advance pose or round
  const handleNextPoseOrRound = () => {
    soundFx.playPop();
    if (currentPoseIdx < 2) {
      setCurrentPoseIdx((prev) => prev + 1);
      setPoseTimeLeft(5);
    } else {
      // Completed 3 poses of this round
      if (currentRound === 1) {
        soundFx.playFanfare();
        setPhase('BETWEEN_ROUNDS');
      } else {
        // Completed both rounds -> go to vote
        soundFx.playFanfare();
        triggerConfetti();
        setPhase('VOTING');
      }
    }
  };

  const handleStartRound1 = () => {
    soundFx.playPop();
    setCurrentRound(1);
    setCurrentPoseIdx(0);
    setStartCountdown(3);
    setPhase('COUNTDOWN');
  };

  const handleStartRound2 = () => {
    soundFx.playPop();
    setCurrentRound(2);
    setCurrentPoseIdx(0);
    setStartCountdown(3);
    setPhase('COUNTDOWN');
  };

  // Massage timer effect
  useEffect(() => {
    if (phase === 'MASSAGE_TIMER' && isMassageRunning && massageTime > 0) {
      massageTimerRef.current = setInterval(() => {
        setMassageTime((prev) => {
          if (prev <= 1) {
            clearInterval(massageTimerRef.current!);
            setIsMassageRunning(false);
            soundFx.playBeep(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (massageTimerRef.current) clearInterval(massageTimerRef.current);
    }

    return () => {
      if (massageTimerRef.current) clearInterval(massageTimerRef.current);
    };
  }, [phase, isMassageRunning, massageTime]);

  const handleTriggerMassagePenalty = (loser: string) => {
    soundFx.playPop();
    setLoserName(loser);
    setMassageTime(120);
    setIsMassageRunning(true);
    setPhase('MASSAGE_TIMER');
  };

  const handleFinishLevel = (notes: string) => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(240, notes);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Header */}
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
          <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wider block">
            Màn 7 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Gương Thần Đối Xứng</span>
        </div>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'INTRO' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200/60 rounded-full text-xs font-semibold mb-2">
              <Smile className="w-3.5 h-3.5" />
              <span>Thử Thách Biểu Cảm Cặp Đôi</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gương Thần Đối Xứng
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Đứng đối diện nhau (hoặc trước gương). Một người làm "Bản Gốc", người kia làm "Gương Thần" sao chép biểu cảm trong 5 giây mà không được cười!
            </p>
          </div>

          {/* Rules Card */}
          <div className="p-4 rounded-3xl bg-white border border-violet-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Quy Trình Thi Đấu 2 Lượt
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-violet-900">Lượt 1: {profile.name1} làm Bản Gốc</strong>
                  <p className="text-[11px] text-violet-800 mt-0.5">
                    {profile.name1} tạo 3 biểu cảm độc lạ, {profile.name2} phải sao chép y đúc tức thì trong 5 giây!
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-pink-900">Lượt 2: Đổi vai cho {profile.name2}</strong>
                  <p className="text-[11px] text-pink-800 mt-0.5">
                    {profile.name2} làm Bản Gốc với 3 biểu cảm mới, {profile.name1} vào vai Gương Thần bắt chước!
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug">
                ⚖️ <strong>Hình Phạt Mát-Xa 2 Phút:</strong> Cuối màn, hai bạn cùng bình chọn xem ai là người bật cười trước hoặc không bắt chước kịp! Người thua sẽ xoa bóp vai cho người thắng trong 2 phút.
              </div>
            </div>
          </div>

          <button
            onClick={handleStartRound1}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white font-extrabold text-sm shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Smile className="w-5 h-5" />
            <span>BẮT ĐẦU LƯỢT 1 ({profile.name1} LÀM BẢN GỐC)</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 3-2-1 SUSPENSE COUNTDOWN */}
      {phase === 'COUNTDOWN' && (
        <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in-90 duration-200 text-center">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest block mb-2">
            Chuẩn bị nhìn thẳng vào nhau...
          </span>
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-6xl font-black shadow-2xl animate-pulse">
            {startCountdown}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Bản Gốc: <strong>{activeOriginal}</strong> · Gương Thần: <strong>{activeMirror}</strong>
          </p>
        </div>
      )}

      {/* PHASE 3: ROUND POSING (3 POSES, 5 SECONDS EACH) */}
      {phase === 'ROUND_POSING' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Role Bar */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-violet-50 border border-violet-200">
              <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider block">Bản Gốc Diễn</span>
              <span className="font-extrabold text-slate-800 text-sm">{activeOriginal}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-fuchsia-50 border border-fuchsia-200">
              <span className="text-[10px] text-fuchsia-600 font-bold uppercase tracking-wider block">Gương Thần Soi</span>
              <span className="font-extrabold text-slate-800 text-sm">{activeMirror}</span>
            </div>
          </div>

          {/* Big Posing Card with 5s countdown */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-violet-900 to-slate-900 text-white text-center shadow-xl border-2 border-violet-400/40 relative">
            <div className="flex items-center justify-between text-[11px] text-violet-300 font-bold uppercase tracking-wider mb-2">
              <span>LƯỢT {currentRound}/2</span>
              <span>DÁNG #{currentPoseIdx + 1}/3</span>
            </div>

            <div className="text-6xl my-2 animate-bounce">
              {currentPoses[currentPoseIdx].emoji}
            </div>

            <h2 className="text-xl font-black text-amber-300">
              "{currentPoses[currentPoseIdx].title}"
            </h2>

            <p className="text-xs text-violet-100/90 mt-2 max-w-xs mx-auto leading-relaxed bg-white/10 p-2.5 rounded-xl border border-white/10">
              {currentPoses[currentPoseIdx].hint}
            </p>

            {/* 5-second countdown progress bar & ring */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-2xl font-black text-amber-300">
                00:0{poseTimeLeft}
              </span>
              <span className="text-[10px] text-violet-300 uppercase tracking-wider">GIỮ DÁNG!</span>
            </div>
          </div>

          {/* Manual advance button */}
          <button
            onClick={handleNextPoseOrRound}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Dáng tiếp theo ngay (Không chờ 5s)</span>
          </button>
        </div>
      )}

      {/* PHASE 4: BETWEEN ROUNDS */}
      {phase === 'BETWEEN_ROUNDS' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-6 rounded-3xl bg-white border-2 border-violet-200 shadow-xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
              <Smile className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider block">
              Hoàn Thành Lượt 1!
            </span>

            <h2 className="text-xl font-black text-slate-900">
              Đến Lượt {profile.name2} Làm Bản Gốc!
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Bây giờ {profile.name2} sẽ biến hóa 3 biểu cảm siêu hài hước, {profile.name1} làm Gương Thần phản chiếu!
            </p>

            <button
              onClick={handleStartRound2}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Smile className="w-5 h-5" />
              <span>BẮT ĐẦU LƯỢT 2 ({profile.name2} LÀM BẢN GỐC)</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5: VOTING & EVALUATION */}
      {phase === 'VOTING' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="p-5 rounded-3xl bg-white border-2 border-violet-200 shadow-xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-4 ring-amber-50">
              <Award className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider block">
              Cả Hai Đã Hoàn Thành 2 Lượt Gương Thần!
            </span>

            <h2 className="text-xl font-black text-slate-900">
              Bình Chọn Kết Quả
            </h2>

            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Ai là người đã bật cười phá vỡ hình tượng hoặc không sao chép kịp biểu cảm của đối phương?
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => handleTriggerMassagePenalty(profile.name1)}
                className="p-3 rounded-2xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-center transition-transform active:scale-95"
              >
                <span className="text-xs font-black text-violet-900 block truncate">{profile.name1} Bị Lỗi</span>
                <span className="text-[10px] text-violet-600 block mt-0.5">Bật cười trước</span>
              </button>

              <button
                onClick={() => handleTriggerMassagePenalty(profile.name2)}
                className="p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-center transition-transform active:scale-95"
              >
                <span className="text-xs font-black text-pink-900 block truncate">{profile.name2} Bị Lỗi</span>
                <span className="text-[10px] text-pink-600 block mt-0.5">Bật cười trước</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  handleFinishLevel(
                    `Gương Thần Đối Xứng: Cả hai bạn đồng điệu tuyệt đối, sao chép thần thái 10/10 không ai chịu thua!`
                  );
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cả Hai Đều Quá Xuất Sắc (+240 LP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 6: 2-MINUTE MASSAGE PENALTY TIMER */}
      {phase === 'MASSAGE_TIMER' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 text-white text-center shadow-xl ring-4 ring-pink-200">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest block mb-2">
              Hình Phạt Mát-Xa 2 Phút
            </span>

            <div className="text-5xl font-mono font-black text-pink-400 my-2">
              {formatTimer(massageTime)}
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              <strong>{loserName}</strong> hãy tận tình xoa bóp vai và đấm lưng thư giãn cho người ấy trong 2 phút!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm text-xs text-slate-600 space-y-1.5">
            <strong className="text-slate-800 block">Lời khuyên thư giãn:</strong>
            <p>Xoa bóp theo chuyển động tròn nhẹ nhàng vùng vai gáy, hỏi người ấy xem lực ấn đã vừa vặn chưa nhé!</p>
          </div>

          <button
            onClick={() => {
              handleFinishLevel(
                `Gương thần đối xứng: ${loserName} đã hoàn thành xuất sắc 2 phút mát-xa xoa bóp ngọt ngào!`
              );
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Hoàn Thành Màn 7 (+240 LP)</span>
          </button>
        </div>
      )}
    </div>
  );
};
