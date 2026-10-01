import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCw, Sparkles, CheckCircle2, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';

interface Level1SpinnerProps {
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

interface FoodCategory {
  id: string;
  number: number;
  name: string;
  emoji: string;
  desc: string;
  color: string;
  highlightColor: string;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'cat-1',
    number: 1,
    name: 'Món lạ hoắc chưa thử bao giờ',
    emoji: '🛸',
    desc: 'Dũng cảm bước ra khỏi vùng an toàn! Cùng tìm một quán có món hai bạn chưa từng nếm thử, ngon dở cùng chia sẻ!',
    color: '#f87171', // Coral red
    highlightColor: '#fca5a5',
  },
  {
    id: 'cat-2',
    number: 2,
    name: 'Món béo ngậy tội lỗi không màng hậu quả',
    emoji: '🧀',
    desc: 'Tạm quên chuyện cân nặng tối nay! Thỏa sức thưởng thức phô mai kéo sợi, đồ chiên giòn rụm hoặc sốt béo ngậy.',
    color: '#fb923c', // Warm orange
    highlightColor: '#fdba74',
  },
  {
    id: 'cat-3',
    number: 3,
    name: 'Món cay xé lưỡi phải ăn tới miếng cuối cùng',
    emoji: '🌶️',
    desc: 'Thử thách độ ăn cay của hai bạn! Vừa ăn vừa xuýt xoa toát mồ hôi, nhớ chuẩn bị sẵn sữa tươi giải nhiệt nhé!',
    color: '#ef4444', // Fiery red
    highlightColor: '#f87171',
  },
  {
    id: 'cat-4',
    number: 4,
    name: 'Món lười tối thượng, được phục vụ tận bàn, chỉ há mồm ra ăn',
    emoji: '🛋️',
    desc: 'Phong cách quý tộc chiều chuộng! Quán có nhân viên nướng/gắp tận đĩa hoặc một người tình nguyện đút cho người kia ăn.',
    color: '#a855f7', // Regal purple
    highlightColor: '#c084fc',
  },
  {
    id: 'cat-5',
    number: 5,
    name: 'Món nhậu đưa mồi cùng chút hơi men',
    emoji: '🍻',
    desc: 'Lai rai vài ly bia ướp lạnh, chút soju hoặc mocktail cùng đĩa mồi thơm lừng, cùng tâm sự chuyện đời thâu đêm.',
    color: '#f59e0b', // Amber gold
    highlightColor: '#fcd34d',
  },
  {
    id: 'cat-6',
    number: 6,
    name: 'Món húp xùm sụp bất chấp nóng lạnh',
    emoji: '🍲',
    desc: 'Một tô phở nóng, bún bò ngập topping, mì ramen đậm đà hoặc nồi lẩu sôi sùng sục. Húp trọn từng giọt nước dùng ấm bụng!',
    color: '#06b6d4', // Cyan teal
    highlightColor: '#67e8f9',
  },
  {
    id: 'cat-7',
    number: 7,
    name: 'Món ăn quá khứ hoài niệm một thời',
    emoji: '📻',
    desc: 'Tìm về hương vị hoài niệm: Quán ăn ngày đầu mới quen, món ăn tuổi thơ hoặc quán ruột từng gắn liền với kỷ niệm cũ.',
    color: '#ec4899', // Nostalgic pink
    highlightColor: '#f472b6',
  },
  {
    id: 'cat-8',
    number: 8,
    name: 'Món ăn phong cách học sinh sinh viên',
    emoji: '🎒',
    desc: 'Bánh tráng nướng, nem chua rán, trà tắc vỉa hè cổng trường — vừa rẻ, vừa vui, ngồi ngắm đường phố nhộn nhịp!',
    color: '#10b981', // Emerald green
    highlightColor: '#34d399',
  },
];

export const Level1Spinner: React.FC<Level1SpinnerProps> = ({
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [showCategoryGuide, setShowCategoryGuide] = useState<boolean>(false);

  // 5-minute countdown lock timer state (300 seconds)
  const [lockTimeLeft, setLockTimeLeft] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning && lockTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            soundFx.playBeep(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, lockTimeLeft]);

  const handleSpin = () => {
    if (isSpinning) return;

    soundFx.playPop();
    setIsSpinning(true);
    setSelectedCategory(null);
    setIsTimerRunning(false);
    setLockTimeLeft(300);

    const sliceCount = FOOD_CATEGORIES.length; // 8
    const sliceAngle = 360 / sliceCount; // 45 degrees

    // Pick random target category index
    const randomIndex = Math.floor(Math.random() * sliceCount);

    // Target slice midpoint angle in initial SVG space
    const sliceMidAngle = (randomIndex + 0.5) * sliceAngle;

    // Pointer is at the top (12 o'clock = 270 degrees in SVG coordinate space)
    // We want: (sliceMidAngle + targetAngle) % 360 === 270
    // => targetBase = (270 - sliceMidAngle) % 360
    let targetBase = (270 - sliceMidAngle) % 360;
    if (targetBase < 0) targetBase += 360;

    // Current rotation modulo 360
    let currentMod = rotation % 360;
    if (currentMod < 0) currentMod += 360;

    // Additional forward rotation needed to align target slice with top pointer
    let diff = (targetBase - currentMod) % 360;
    if (diff <= 0) diff += 360;

    // Add 5 to 7 full extra rotations (1800 to 2520 degrees)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetAngle = rotation + extraSpins + diff;

    // Play periodic ticking sounds
    const tickInterval = setInterval(() => {
      soundFx.playTick();
    }, 130);

    setTimeout(() => {
      clearInterval(tickInterval);
    }, 2800);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = FOOD_CATEGORIES[randomIndex];
      setSelectedCategory(chosen);
      soundFx.playFanfare();
      triggerConfetti();
      // Auto-start 5-min timer
      setIsTimerRunning(true);
    }, 3600);
  };

  const handleFinish = () => {
    if (!selectedCategory) return;
    soundFx.playFanfare();
    triggerConfetti();
    onComplete(
      100,
      `Vòng quay đã quyết định: "${selectedCategory.name}". Cặp đôi cam kết tuân thủ quy tắc 5 phút!`
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            Màn 1 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Giải Cứu Bụng Đói</span>
        </div>
      </div>

      {/* Challenge Title Banner */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-semibold mb-2">
          <span>🍜 8 Thể Loại Ẩm Thực Bất Ngờ</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Vòng Quay Giải Cứu Bụng Đói
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
          Chấm dứt câu hỏi "Ăn gì cũng được"! Quay ngẫu nhiên 1 trong 8 phong cách ăn uống cho buổi hẹn hò hôm nay.
        </p>
      </div>

      {/* Spinner Wheel Viewport */}
      <div className="relative flex flex-col items-center justify-center my-3">
        {/* Top Pointer Indicator */}
        <div className="absolute top-[-10px] z-20 flex flex-col items-center drop-shadow-md">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-600" />
          <div className="w-3.5 h-3.5 bg-white rounded-full -mt-5 ring-2 ring-rose-600 shadow-xs" />
        </div>

        {/* Outer Wheel Rim */}
        <div className="relative w-72 h-72 rounded-full p-2 bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 shadow-xl shadow-rose-500/20 ring-4 ring-white">
          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full overflow-hidden transition-transform duration-[3600ms] cubic-bezier(0.12, 0.8, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {FOOD_CATEGORIES.map((cat, index) => {
                const angle = 360 / FOOD_CATEGORIES.length;
                const startAngle = (index * angle * Math.PI) / 180;
                const endAngle = ((index + 1) * angle * Math.PI) / 180;

                const x1 = 150 + 150 * Math.cos(startAngle);
                const y1 = 150 + 150 * Math.sin(startAngle);
                const x2 = 150 + 150 * Math.cos(endAngle);
                const y2 = 150 + 150 * Math.sin(endAngle);

                const midAngle = ((index + 0.5) * angle * Math.PI) / 180;
                const iconX = 150 + 95 * Math.cos(midAngle);
                const iconY = 150 + 95 * Math.sin(midAngle);
                const iconRotate = (index + 0.5) * angle + 90;

                const isSelected = selectedCategory?.id === cat.id;

                return (
                  <g key={cat.id}>
                    <path
                      d={`M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`}
                      fill={cat.color}
                      stroke={isSelected ? '#fef08a' : '#ffffff'}
                      strokeWidth={isSelected ? '4.5' : '2.5'}
                    />
                    {/* Clean Wheel Display: Emoji + Category Number (No cluttered long text) */}
                    <g transform={`translate(${iconX}, ${iconY}) rotate(${iconRotate})`}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                      >
                        {cat.emoji}
                      </text>
                      <text
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-black fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] select-none pointer-events-none"
                      >
                        #{cat.number}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex flex-col items-center justify-center font-extrabold text-xs transition-transform active:scale-95 z-10 border-4 border-rose-100 ${
              isSpinning ? 'text-slate-400 cursor-not-allowed' : 'text-rose-600 hover:scale-105'
            }`}
          >
            <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>QUAY</span>
          </button>
        </div>
      </div>

      {/* Result Display Card & 5-Minute Lock-In Rule */}
      {selectedCategory && (
        <div className="mt-4 p-4 rounded-3xl bg-white border-2 border-rose-200 shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1 justify-center">
            <Sparkles className="w-4 h-4 fill-rose-400" />
            <span>Thể Loại Ăn Uống Được Lựa Chọn!</span>
          </div>

          <div className="text-center my-2 p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
            <div className="text-4xl mb-1">{selectedCategory.emoji}</div>
            <div className="inline-block text-[11px] font-bold text-rose-600 uppercase tracking-widest bg-rose-100 px-2.5 py-0.5 rounded-full mb-1">
              Ô số #{selectedCategory.number}
            </div>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {selectedCategory.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xs mx-auto">
              {selectedCategory.desc}
            </p>
          </div>

          {/* 5-Minute Lock-In countdown rule box */}
          <div className="mt-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Quy Tắc Khóa 5 Phút (Bắt Buộc)
              </span>
              <span className="text-sm font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                {formatTimer(lockTimeLeft)}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Hai bạn có 5 phút để cùng tìm quán đáp ứng thể loại này và lên đường. <strong>Tuyệt đối cấm đổi ý</strong> và <strong>nghiêm cấm thốt ra câu "Ăn gì cũng được"</strong>!
            </p>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/60 text-[11px]">
              <button
                onClick={() => {
                  soundFx.playPop();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className="text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2"
              >
                {isTimerRunning ? 'Tạm dừng đếm giờ' : 'Tiếp tục đếm giờ'}
              </button>

              <span className="text-amber-600 font-medium">
                {lockTimeLeft === 0 ? '✓ Hết 5 phút - Đã chốt kèo!' : 'Đang áp dụng luật...'}
              </span>
            </div>
          </div>

          {/* Complete challenge button */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Chấp Nhận Thử Thách (+100 LP)</span>
            </button>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Quay lại (chỉ khi quán đóng cửa)
            </button>
          </div>
        </div>
      )}

      {/* Guide Note when not spun yet */}
      {!selectedCategory && (
        <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-rose-100 text-xs text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">Luật chơi Vòng Quay Ẩm Thực:</strong>
              1. Chạm nút <strong>QUAY</strong> ở tâm vòng xoay.<br />
              2. Vòng dừng ở ô nào, thẻ bài kết quả sẽ lộ diện thể loại ăn uống của ngày hôm nay.<br />
              3. Hai bạn có 5 phút để khóa kèo và xuất phát, không được bàn lùi!
            </div>
          </div>
        </div>
      )}

      {/* Toggle to inspect all 8 categories */}
      <div className="mt-3">
        <button
          onClick={() => {
            soundFx.playPop();
            setShowCategoryGuide(!showCategoryGuide);
          }}
          className="w-full py-2 px-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>{showCategoryGuide ? 'Thu gọn danh sách 8 thể loại' : 'Xem danh sách 8 thể loại ẩm thực bí mật'}</span>
        </button>

        {showCategoryGuide && (
          <div className="mt-2 p-3 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-2 animate-in fade-in duration-200">
            {FOOD_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color + '25', color: cat.color }}
                >
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 block">
                    #{cat.number}. {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block line-clamp-1 mt-0.5">
                    {cat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAlreadyCompleted && !selectedCategory && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            ✓ Hai bạn đã từng vượt qua màn chơi này
          </span>
        </div>
      )}
    </div>
  );
};
