import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, RotateCw, MapPin, Coffee, UtensilsCrossed, Compass } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';

interface Level3SecretCardsProps {
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

interface ScenarioCard {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  rules: string[];
  vibe: string;
}

const CARDS_DATA: ScenarioCard[] = [
  {
    id: 'blind-adventure',
    title: 'Chuyến Phiêu Lưu Giấu Mặt',
    subtitle: 'Rẽ Ngẫu Nhiên Khám Phá',
    tagline: 'Blind Adventure',
    icon: <Compass className="w-10 h-10 text-rose-500" />,
    gradient: 'from-rose-500 to-pink-600',
    description: 'Bỏ qua những cung đường quen thuộc, trao quyền quyết định cho trực giác ngẫu hứng!',
    rules: [
      'Bắt đầu từ điểm hiện tại: Rẽ phải 3 lần, rẽ trái 2 lần hoàn toàn ngẫu nhiên.',
      'Ghé vào quán ăn hoặc tiệm cafe đầu tiên xuất hiện trước mắt.',
      'Dù quán lạ hay quen, hai bạn đều cam kết cùng nhau trải nghiệm!',
    ],
    vibe: 'Bất ngờ & Hồi hộp 🧭',
  },
  {
    id: 'street-food-tour',
    title: 'Tour Ẩm Thực Đường Phố',
    subtitle: '3 Món Vỉa Hè Ngon Lành',
    tagline: 'Street Food Tour',
    icon: <UtensilsCrossed className="w-10 h-10 text-amber-500" />,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Trải nghiệm ẩm thực lề đường chân thật, ăn vặt và buôn chuyện rôm rả dưới trời đêm.',
    rules: [
      'Tìm và cùng ăn 3 món đường phố khác nhau (bánh tráng, xiên que, trà tắc, ốc...).',
      'Thử thách: Tổng chi phí không quá 100k - 150k cho cả hai.',
      'Mỗi món ăn xong, hãy cùng nhau chấm điểm thang 10.',
    ],
    vibe: 'Gần gũi & Ngon miệng 🍢',
  },
  {
    id: 'convenience-store',
    title: 'Hẹn Hò Cửa Hàng Tiện Lợi',
    subtitle: 'Bữa Ăn Khuya Lãng Mạn',
    tagline: 'Convenience Store Date',
    icon: <Coffee className="w-10 h-10 text-teal-500" />,
    gradient: 'from-teal-500 to-emerald-600',
    description: 'Biến những điều bình dị thành khoảnh khắc lãng mạn như phim thanh xuân Hàn Quốc.',
    rules: [
      'Ghé một cửa hàng tiện lợi 24/7 (Circle K, GS25, 7-Eleven).',
      'Mỗi người có 3 phút bí mật chọn cho đối phương 1 món ăn và 1 loại nước uống.',
      'Ngồi lại quầy kính, vừa thưởng thức vừa kể cho nhau 1 bí mật thời thơ ấu.',
    ],
    vibe: 'Ấm áp & Thư giãn 🧃',
  },
  {
    id: 'quiet-corner',
    title: 'Góc Nhỏ Tĩnh Lặng',
    subtitle: 'Hoàng Hôn & Lời Tâm Tình',
    tagline: 'Quiet Corner',
    icon: <MapPin className="w-10 h-10 text-indigo-500" />,
    gradient: 'from-indigo-500 to-purple-600',
    description: 'Tạm gác lại nhịp sống ồn ào để lắng nghe nhịp đập trái tim và những chia sẻ chân thành.',
    rules: [
      'Tìm một góc yên tĩnh: Quán cafe rooftop, ban công lộng gió hoặc bờ hồ thoáng mát.',
      'Cùng đeo chung một tai nghe để nghe bài hát kỷ niệm của hai bạn.',
      'Dành cho nhau 10 phút không bấm điện thoại, chỉ nhìn nhau và tâm sự.',
    ],
    vibe: 'Sâu lắng & Lãng mạn 🌙',
  },
];

export const Level3SecretCards: React.FC<Level3SecretCardsProps> = ({
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    soundFx.playCardFlip();
    setSelectedCardId(id);
  };

  const handleShuffle = () => {
    soundFx.playPop();
    setSelectedCardId(null);
  };

  const handleAcceptMission = (card: ScenarioCard) => {
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(
      140,
      `Đã chọn nhiệm vụ hẹn hò: "${card.title}" (${card.subtitle}). Chúc hai bạn có buổi hẹn ngọt ngào!`
    );
  };

  const selectedCard = CARDS_DATA.find((c) => c.id === selectedCardId);

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
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
            Màn 3 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Thẻ Bài Bí Mật</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-full text-xs font-semibold mb-2">
          <span>🔮 Vận Mệnh Cầm Lái Hôm Nay</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Thẻ Bài Bí Mật
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
          {selectedCard
            ? 'Lá bài số phận của hai bạn đã lộ diện! Hãy cùng nhau thực hiện nhiệm vụ.'
            : 'Chạm vào 1 trong 4 lá bài bí ẩn để mở ra kịch bản hẹn hò bất ngờ do số phận sắp đặt!'}
        </p>
      </div>

      {/* CASE 1: 4 Cards View (Disappears when a card is selected) */}
      {!selectedCard && (
        <div className="grid grid-cols-2 gap-3.5 my-3 animate-in fade-in duration-300">
          {CARDS_DATA.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="h-56 cursor-pointer select-none perspective-[1000px] transition-transform active:scale-95 hover:scale-[1.02] duration-200"
            >
              {/* Face-down Card with Mystical Seal Design */}
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-3.5 flex flex-col items-center justify-between text-white border-2 border-purple-300/40 shadow-md ring-1 ring-purple-500/20">
                <div className="w-full flex justify-between items-center text-[10px] text-purple-300 font-mono tracking-widest uppercase">
                  <span>LÁ BÀI #{idx + 1}</span>
                  <span className="text-amber-300">✦ ✦ ✦</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center mb-2">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-rose-400 text-xl">
                      💌
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-100 tracking-wider">
                    CHẠM ĐỂ MỞ
                  </span>
                  <span className="text-[10px] text-purple-300/80 mt-0.5">
                    Vận Mệnh Tình Yêu
                  </span>
                </div>

                <div className="text-[10px] text-purple-400 text-center font-medium">
                  Bí Mật Đang Chờ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CASE 2: Single Center Flipped Card Spotlight (Other cards disappeared) */}
      {selectedCard && (
        <div className="my-2 animate-in zoom-in-95 fade-in duration-300">
          <div className="w-full rounded-3xl bg-white p-5 border-2 border-purple-200 shadow-xl relative overflow-hidden">
            {/* Top Tagline & Vibe */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {selectedCard.tagline}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {selectedCard.vibe}
              </span>
            </div>

            {/* Central Icon Spotlight */}
            <div className="text-center my-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 flex items-center justify-center mx-auto mb-3 shadow-inner border border-purple-200/60">
                {selectedCard.icon}
              </div>

              <h2 className="text-xl font-black text-slate-900">
                {selectedCard.title}
              </h2>
              <p className="text-xs font-bold text-rose-600 mt-0.5">
                {selectedCard.subtitle}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xs mx-auto">
                {selectedCard.description}
              </p>
            </div>

            {/* 3 Rules Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 space-y-2 text-left">
              <span className="text-[11px] font-bold text-purple-900 block">
                3 Điều Cần Thực Hiện Cùng Nhau:
              </span>
              {selectedCard.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-purple-950">
                  <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                  <span className="leading-snug">{rule}</span>
                </div>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleAcceptMission(selectedCard)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Chốt Nhiệm Vụ Hôm Nay (+140 LP)</span>
              </button>

              <button
                onClick={handleShuffle}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Úp bài & tráo lại từ đầu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helper Footer when looking at 4 cards */}
      {!selectedCard && (
        <div className="mt-3 text-center text-xs text-slate-400">
          Tip: Hai bạn có thể để người cầm lái chạm lật lá bài vận mệnh hôm nay!
        </div>
      )}

      {isAlreadyCompleted && !selectedCard && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            ✓ Hai bạn đã từng hoàn thành thử thách này
          </span>
        </div>
      )}
    </div>
  );
};
