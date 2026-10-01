import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Crown, 
  Heart, 
  ShieldCheck, 
  Award,
  Star,
  Check
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level10Checkpoint2Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

const DESCRIPTOR_KEYWORDS = [
  { id: 'tri-ky', label: 'Tri Kỷ Sâu Sắc', emoji: '🌟', desc: 'Hiểu nhau từng ánh mắt nụ cười' },
  { id: 'dong-pham', label: 'Đồng Phạm Ăn Ý', emoji: '🤝', desc: 'Cùng nhau bày trò quậy phá khắp nơi' },
  { id: 'cuc-no', label: 'Cục Nợ Đáng Yêu', emoji: '🧸', desc: 'Có giận mấy cũng không thể rời xa' },
  { id: 'binh-yen', label: 'Bến Đỗ Bình Yên', emoji: '🍃', desc: 'Ở bên nhau mọi muộn phiền tan biến' },
  { id: 'gia-dinh', label: 'Gia Đình Ấm Áp', emoji: '🏡', desc: 'Luôn là chỗ dựa vững chãi nhất' },
];

type Phase = 'INTRO' | 'P1_CHOOSE' | 'P2_CHOOSE' | 'REVEAL_BADGE' | 'CLAIM_PERK';

export const Level10Checkpoint2: React.FC<Level10Checkpoint2Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [p1Choice, setP1Choice] = useState<string>('');
  const [p2Choice, setP2Choice] = useState<string>('');

  // Fireworks confetti on intro and completion
  useEffect(() => {
    triggerConfetti();
    soundFx.playFanfare();
    const interval = setInterval(() => {
      triggerConfetti();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStartSelection = () => {
    soundFx.playPop();
    setPhase('P1_CHOOSE');
  };

  const handleP1Submit = (choiceId: string) => {
    soundFx.playPop();
    setP1Choice(choiceId);
    setPhase('P2_CHOOSE');
  };

  const handleP2Submit = (choiceId: string) => {
    soundFx.playFanfare();
    triggerConfetti();
    setP2Choice(choiceId);
    setPhase('REVEAL_BADGE');
  };

  const isMatched = p1Choice === p2Choice;
  const p1Obj = DESCRIPTOR_KEYWORDS.find((k) => k.id === p1Choice);
  const p2Obj = DESCRIPTOR_KEYWORDS.find((k) => k.id === p2Choice);

  const handleFinishCheckpoint = () => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(
      350,
      `Checkpoint 2: Hai bạn đã hoàn thành nửa chặng đường (Màn 10)! Đã mở khóa danh hiệu "Cặp Đôi Cứng Cựa: Đồng Đội Ăn Ý" và nhận quyền Phủ Quyết (Veto Power)!`
    );
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
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Cột Mốc 10 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Checkpoint 2</span>
        </div>
      </div>

      {/* PHASE 1: CELEBRATION INTRO */}
      {phase === 'INTRO' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-semibold mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Cột Mốc Nửa Chặng Đường (10/20 Màn)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Trạm Dừng Đồng Đội Ăn Ý
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Chúc mừng {profile.name1} & {profile.name2}! Hai bạn đã cùng nhau vượt qua 10 thử thách ngoạn mục và gắn kết bền chặt.
            </p>
          </div>

          {/* Grand Trophy & Badges Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-400 to-pink-500 text-white shadow-xl text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-2 flex items-center justify-center mx-auto mb-3 ring-4 ring-white/40 shadow-inner">
              <Trophy className="w-12 h-12 text-amber-200 drop-shadow-md" />
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase bg-black/20 px-3 py-1 rounded-full">
              DANH HIỆU CAO QUÝ NỬA CHẶNG ĐƯỜNG
            </span>

            <h2 className="text-xl font-black mt-2 drop-shadow-sm">
              Cặp Đôi Cứng Cựa: Đồng Đội Ăn Ý
            </h2>

            <p className="text-xs text-white/90 max-w-xs mx-auto mt-1">
              Mở khóa đặc quyền độc quyền: <strong>Thẻ Bài Quyền Phủ Quyết (Veto Power)</strong> cho tuần tới!
            </p>
          </div>

          {/* Prompt Challenge Preview */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-2 text-xs">
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Nghi Thức Checkpoint 2:
            </span>
            <p className="text-slate-600 leading-relaxed">
              Mỗi người sẽ bí mật chọn 1 từ khóa mô tả chuẩn xác nhất về sự gắn kết của hai bạn. Cùng xem hai bạn có chọn trùng khớp không nhé!
            </p>
          </div>

          <button
            onClick={handleStartSelection}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Star className="w-5 h-5 fill-amber-200 text-amber-200" />
            <span>BẮT ĐẦU NGHI THỨC CHỌN TỪ KHÓA</span>
          </button>
        </div>
      )}

      {/* PHASE 2: PLAYER 1 CHOOSES */}
      {phase === 'P1_CHOOSE' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Lượt Chọn Của {profile.name1}
            </span>
            <span className="text-xs text-amber-800">
              Chọn từ khóa mà bạn cảm nhận rõ nhất về mối quan hệ của hai người:
            </span>
          </div>

          <div className="space-y-2">
            {DESCRIPTOR_KEYWORDS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleP1Submit(item.id)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center justify-between active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: PLAYER 2 CHOOSES */}
      {phase === 'P2_CHOOSE' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
              Đổi Máy Cho {profile.name2}
            </span>
            <span className="text-xs text-rose-800">
              {profile.name2} hãy chọn từ khóa bạn cảm nhận rõ nhất về tình yêu đôi ta:
            </span>
          </div>

          <div className="space-y-2">
            {DESCRIPTOR_KEYWORDS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleP2Submit(item.id)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 cursor-pointer transition-all flex items-center justify-between active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 4: REVEAL BADGE & CHOICES */}
      {phase === 'REVEAL_BADGE' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-xl text-center space-y-3">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Kết Quả Thần Giao Cách Cảm
            </span>

            {isMatched ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="text-xl block mb-1">🎉 TRÙNG KHỚP TUYỆT ĐỐI! 🎉</span>
                <span className="text-xs font-bold">
                  Cả hai bạn đều cùng chọn: "{p1Obj?.label}" {p1Obj?.emoji}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
                <span className="font-bold text-rose-900 block mb-1">Mảnh Ghép Hoàn Hảo Bổ Khuyết Nhau:</span>
                <div className="flex items-center justify-around text-slate-700 mt-2 font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{profile.name1}:</span>
                    <span className="font-bold text-rose-600">{p1Obj?.label} {p1Obj?.emoji}</span>
                  </div>
                  <span className="text-rose-400 font-bold">&</span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{profile.name2}:</span>
                    <span className="font-bold text-rose-600">{p2Obj?.label} {p2Obj?.emoji}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Shiny Badge Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30 flex-shrink-0">
                  🏅
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">
                    HUY HIỆU ĐỘC QUYỀN ĐÃ MỞ KHÓA
                  </span>
                  <h3 className="text-base font-black text-white">
                    Cặp Đôi Cứng Cựa: Đồng Đội Ăn Ý
                  </h3>
                  <span className="text-[11px] text-white/80 block mt-0.5">
                    Đã hoàn thành 10/20 màn thử thách
                  </span>
                </div>
              </div>
            </div>

            {/* Veto Power Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Đặc Quyền Veto Power (Quyền Phủ Quyết):</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Mỗi người được trao <strong>1 lần quyền Phủ Quyết</strong> trong 7 ngày tới: Được quyền từ chối bất kỳ yêu cầu/nhiệm vụ nào của người kia mà không cần giải thích!
              </p>
            </div>

            <button
              onClick={handleFinishCheckpoint}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>HOÀN THÀNH CHECKPOINT 2 (+350 LP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
