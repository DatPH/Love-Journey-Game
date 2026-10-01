import React, { useState } from 'react';
import { 
  Lock, 
  Check, 
  Sparkles, 
  Utensils, 
  Timer, 
  Camera, 
  Swords, 
  Flame, 
  Award, 
  Heart, 
  Mic, 
  Smile, 
  Drama, 
  Activity, 
  Crown, 
  Star, 
  Play, 
  RotateCcw, 
  X, 
  Compass, 
  Bookmark,
  Glasses,
  Church,
  Shuffle,
  Zap,
  HeartHandshake,
  Footprints,
  Scale
} from 'lucide-react';
import { ALL_LEVELS } from '../data/levelsData';
import { CoupleProfile, LevelDef } from '../types';
import { soundFx } from '../utils/sound';

interface LevelMapProps {
  profile: CoupleProfile;
  onSelectLevel: (levelNumber: number) => void;
  onOpenProfile: () => void;
  onOpenStats?: () => void;
}

// 2D Coordinates for Winding Serpentine Date Trail (SVG coordinate space 380 x 1750)
// Spaced gracefully with safe clearance so banners, markers and buttons never overlap
const NODE_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 105, y: 90 },
  2: { x: 260, y: 170 },
  3: { x: 285, y: 250 },
  4: { x: 135, y: 330 },
  5: { x: 190, y: 410 }, // Milestone 1 (Màn 5)
  6: { x: 275, y: 495 },
  7: { x: 285, y: 575 },
  8: { x: 155, y: 655 },
  9: { x: 95, y: 735 },
  10: { x: 190, y: 815 }, // Milestone 2 (Màn 10)
  11: { x: 280, y: 900 },
  12: { x: 285, y: 980 },
  13: { x: 155, y: 1060 },
  14: { x: 95, y: 1140 },
  15: { x: 190, y: 1225 }, // Milestone 3 (Màn 15 Checkpoint 3 Crown)
  16: { x: 275, y: 1315 },
  17: { x: 285, y: 1400 },
  18: { x: 155, y: 1485 },
  19: { x: 95, y: 1570 },
  20: { x: 190, y: 1660 }, // Summit Milestone 4 (Màn 20 Crown)
};

export const LevelMap: React.FC<LevelMapProps> = ({
  profile,
  onSelectLevel,
  onOpenProfile,
  onOpenStats,
}) => {
  const completedCount = profile.completedLevels.length;
  const bannerImage = '/src/assets/images/couple_journey_banner_1790627923068.jpg';

  // Selected level for the date preview card
  const [selectedLevelDef, setSelectedLevelDef] = useState<LevelDef | null>(null);

  // Determine current active level (up to level 20)
  const activeLevelNum = Math.min(
    20,
    ALL_LEVELS.find((l) => !profile.completedLevels.includes(l.number))?.number || 20
  );

  // Generate SVG curve path through all 20 stations
  const generateTrailPath = () => {
    let d = `M ${NODE_COORDS[1].x} ${NODE_COORDS[1].y}`;
    for (let i = 1; i < 20; i++) {
      const p1 = NODE_COORDS[i];
      const p2 = NODE_COORDS[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Generate completed path segment up to completed count
  const generateCompletedTrailPath = () => {
    const highestCompleted = Math.max(...profile.completedLevels, 0);
    if (highestCompleted <= 1) return '';

    const limit = Math.min(20, highestCompleted);
    let d = `M ${NODE_COORDS[1].x} ${NODE_COORDS[1].y}`;
    for (let i = 1; i < limit; i++) {
      const p1 = NODE_COORDS[i];
      const p2 = NODE_COORDS[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Render refined icons with luxury gold accent
  const renderStationIcon = (level: LevelDef) => {
    const isCompleted = profile.completedLevels.includes(level.number);
    const size = level.number === 5 || level.number === 10 || level.number === 15 || level.number === 20 ? 'w-6 h-6' : 'w-5 h-5';

    if (isCompleted) {
      return <Check className={`${size} text-amber-200 stroke-[3] drop-shadow-xs`} />;
    }

    switch (level.number) {
      case 1:
        return <Utensils className={`${size} text-rose-100`} />;
      case 2:
        return <Timer className={`${size} text-rose-100`} />;
      case 3:
        return <Sparkles className={`${size} text-rose-100`} />;
      case 4:
        return <Camera className={`${size} text-rose-100`} />;
      case 5:
        return <Swords className={`${size} text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]`} />;
      case 6:
        return <Mic className={`${size} text-rose-100`} />;
      case 7:
        return <Smile className={`${size} text-rose-100`} />;
      case 8:
        return <Drama className={`${size} text-rose-100`} />;
      case 9:
        return <Activity className={`${size} text-rose-100`} />;
      case 10:
        return <Crown className={`${size} text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]`} />;
      case 11:
        return <HeartHandshake className={`${size} text-rose-100`} />;
      case 12:
        return <Glasses className={`${size} text-rose-100`} />;
      case 13:
        return <Church className={`${size} text-rose-100`} />;
      case 14:
        return <Shuffle className={`${size} text-rose-100`} />;
      case 15:
        return <Zap className={`${size} text-amber-300 fill-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]`} />;
      case 16:
        return <Footprints className={`${size} text-sky-100`} />;
      case 17:
        return <Flame className={`${size} text-orange-200 fill-orange-400/40`} />;
      case 18:
        return <Compass className={`${size} text-amber-100`} />;
      case 19:
        return <Activity className={`${size} text-rose-100`} />;
      case 20:
        return <Crown className={`${size} text-amber-300 fill-amber-300 drop-shadow-[0_2px_12px_rgba(251,191,36,0.9)] animate-pulse`} />;
      default:
        return <Lock className={`${size} text-slate-400`} />;
    }
  };

  const handleStationClick = (level: LevelDef) => {
    soundFx.playPop();
    setSelectedLevelDef(level);
  };

  const handleStartExperience = () => {
    if (!selectedLevelDef) return;
    soundFx.playPop();
    const num = selectedLevelDef.number;
    setSelectedLevelDef(null);
    onSelectLevel(num);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 relative select-none">
      {/* Luxury Keepsake Hero Passport */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-stone-200/80 mb-4 bg-gradient-to-b from-[#2A1820] to-[#1A1218] text-white">
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={bannerImage}
            alt="Hành Trình Gắn Kết Cặp Đôi"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-70 transform hover:scale-105 transition-transform duration-1000"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          {/* Subtle warm luxury vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1218] via-[#1A1218]/45 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Top Monogram Seal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold text-rose-200/90">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Relationship Passport</span>
              </div>
              <div className="flex items-center gap-2">
                {onOpenStats && (
                  <button
                    onClick={onOpenStats}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-xs transition-colors ${
                      completedCount >= 20
                        ? 'bg-amber-400/25 border-amber-300/50 text-amber-200 animate-pulse hover:bg-amber-400/35'
                        : 'bg-white/10 border-white/20 text-stone-200 hover:bg-white/20'
                    }`}
                    title="Bảng Vàng Thống Kê & Huy Hiệu"
                  >
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Bảng Vàng</span>
                  </button>
                )}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center -space-x-1.5 transition-transform active:scale-95"
                  title="Hồ sơ cặp đôi"
                >
                  <span className="w-7 h-7 rounded-full bg-rose-950/90 border border-rose-300/50 text-rose-200 text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {profile.name1.charAt(0).toUpperCase()}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-900/90 border border-amber-300/50 text-amber-200 text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {profile.name2.charAt(0).toUpperCase()}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Title & Couple Signature */}
            <div className="space-y-0.5">
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xs">
                Hành Trình Gắn Kết
              </h1>
              <p className="text-xs text-rose-200/90 font-medium truncate">
                {profile.name1} & {profile.name2} · 20 Trạm Chinh Phục Tình Yêu
              </p>
            </div>
          </div>
        </div>

        {/* Clean Editorial Stats */}
        <div className="grid grid-cols-3 divide-x divide-stone-800/80 bg-[#1D141C] p-3 text-center text-xs border-t border-stone-800/60">
          <div className="px-1">
            <span className="block text-[10px] text-stone-400 tracking-wider uppercase font-semibold">Tiến độ</span>
            <span className="font-bold text-stone-200 text-xs">
              {completedCount} <span className="text-[10px] text-stone-500 font-normal">/ 20 Trạm</span>
            </span>
          </div>
          <div className="px-1">
            <span className="block text-[10px] text-stone-400 tracking-wider uppercase font-semibold">Chuỗi ngày</span>
            <span className="font-bold text-amber-400 text-xs flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span>{profile.currentStreak} ngày</span>
            </span>
          </div>
          <div className="px-1">
            <span className="block text-[10px] text-stone-400 tracking-wider uppercase font-semibold">Love Power</span>
            <span className="font-bold text-rose-300 text-xs flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>{profile.lpScore} LP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Map Sub-Navigation Bar */}
      <div className="flex items-center justify-between px-1 mb-2.5 text-xs text-stone-600">
        <div className="flex items-center gap-1.5 font-bold text-stone-800">
          <Compass className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>Lộ Trình Trải Nghiệm Hẹn Hò</span>
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          Chạm vào trạm để mở thiệp
        </span>
      </div>

      {/* LUXURY ADVENTURE WINDING CANVAS (Height: 1750px for all 20 levels) */}
      <div className="relative w-full h-[1750px] rounded-3xl bg-[#FAF6F3] border border-stone-200 shadow-xs overflow-hidden">
        {/* Soft Organic Ambient Background Shimmer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-8 w-36 h-36 rounded-full bg-rose-200/20 blur-2xl" />
          <div className="absolute top-[430px] right-6 w-44 h-44 rounded-full bg-amber-100/30 blur-2xl" />
          <div className="absolute top-[860px] left-10 w-44 h-44 rounded-full bg-violet-100/30 blur-2xl" />
          <div className="absolute top-[1280px] right-10 w-44 h-44 rounded-full bg-sky-100/30 blur-2xl" />
          <div className="absolute bottom-24 left-10 w-48 h-48 rounded-full bg-amber-200/20 blur-3xl" />
        </div>

        {/* SVG Luxury Silk Ribbon Road Paths */}
        <svg
          viewBox="0 0 380 1750"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="silkBaseGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EAD8D2" />
              <stop offset="50%" stopColor="#DFCBC4" />
              <stop offset="100%" stopColor="#D5BFB7" />
            </linearGradient>
            <linearGradient id="silkGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Underlay Shadow for 3D depth */}
          <path
            d={generateTrailPath()}
            fill="none"
            stroke="#000000"
            strokeWidth="10"
            strokeLinecap="round"
            className="opacity-[0.04]"
          />

          {/* Base Silk Trail Ribbon */}
          <path
            d={generateTrailPath()}
            fill="none"
            stroke="url(#silkBaseGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Golden Pin Stitches Texture */}
          <path
            d={generateTrailPath()}
            fill="none"
            stroke="#BEA8A0"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* Completed Golden Ribbon */}
          {generateCompletedTrailPath() && (
            <path
              d={generateCompletedTrailPath()}
              fill="none"
              stroke="url(#silkGoldGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
            />
          )}
        </svg>

        {/* Chapter 1 Watermark Landmark */}
        <div className="absolute top-4 left-5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-stone-400">
              CHƯƠNG I
            </span>
            <span className="text-[11px] text-stone-700 font-semibold">
              · Khởi Động & Tiếng Cười
            </span>
          </div>
        </div>

        {/* Chapter 2 Watermark Landmark */}
        <div className="absolute top-[460px] left-5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-stone-400">
              CHƯƠNG II
            </span>
            <span className="text-[11px] text-stone-700 font-semibold">
              · Thấu Cảm & Tần Số Yêu
            </span>
          </div>
        </div>

        {/* Chapter 3 Watermark Landmark */}
        <div className="absolute top-[860px] left-5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-amber-600">
              CHƯƠNG III
            </span>
            <span className="text-[11px] text-stone-800 font-semibold">
              · Chuyến Tàu Đồng Sóng
            </span>
          </div>
        </div>

        {/* Chapter 4 Watermark Landmark */}
        <div className="absolute top-[1270px] left-5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-rose-600">
              CHƯƠNG IV
            </span>
            <span className="text-[11px] text-stone-900 font-semibold">
              · Đỉnh Núi Thề Nguyện
            </span>
          </div>
        </div>

        {/* 20 ADVENTURE DATE STATION MEDALLIONS */}
        {ALL_LEVELS.slice(0, 20).map((level) => {
          const coord = NODE_COORDS[level.number];
          const isCompleted = profile.completedLevels.includes(level.number);
          const isActive = level.number === activeLevelNum;
          const isMilestone = level.number === 5 || level.number === 10 || level.number === 15 || level.number === 20;

          return (
            <div
              key={level.id}
              style={{
                left: `${coord.x}px`,
                top: `${coord.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 flex flex-col items-center"
            >
              {/* Couple Presence Pin Badge (Hovering comfortably above active level) */}
              {isActive && (
                <div className="absolute -top-10 z-30 flex flex-col items-center pointer-events-none animate-bounce">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1218] text-amber-200 text-[10px] font-bold tracking-wide shadow-md border border-amber-400/30 whitespace-nowrap max-w-[210px] truncate">
                    <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{profile.name1} & {profile.name2}</span>
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#1A1218]" />
                </div>
              )}

              {/* Station Medallion Button */}
              <button
                onClick={() => handleStationClick(level)}
                className={`relative flex items-center justify-center transition-all duration-300 active:scale-95 group ${
                  level.number === 20
                    ? 'w-18 h-18 rounded-full'
                    : isMilestone
                    ? 'w-16 h-16 rounded-full'
                    : 'w-13 h-13 rounded-full'
                } ${
                  isCompleted
                    ? 'bg-gradient-to-tr from-[#92400E] via-[#B45309] to-[#F59E0B] text-white shadow-md shadow-amber-900/20 border-2 border-amber-200/90'
                    : isActive
                    ? level.number === 20
                      ? 'bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-700 text-white shadow-2xl ring-4 ring-amber-400 ring-offset-4 ring-offset-[#FAF6F3] scale-110 border-2 border-white'
                      : 'bg-gradient-to-tr from-[#3B121F] via-[#6B2139] to-[#B9385C] text-white shadow-xl shadow-rose-950/25 ring-2 ring-rose-400 ring-offset-4 ring-offset-[#FAF6F3] scale-105 border border-rose-300/40'
                    : level.number === 20
                    ? 'bg-gradient-to-tr from-amber-950 via-rose-950 to-purple-950 text-amber-200 border-2 border-amber-400/60 shadow-md'
                    : 'bg-gradient-to-tr from-[#3D252E] via-[#5C3442] to-[#8C4F64] text-white shadow-xs hover:shadow-md border border-stone-200/40 opacity-90 hover:opacity-100'
                }`}
                title={level.title}
              >
                {/* Active Medallion Candlelight Glow */}
                {isActive && (
                  <span className="absolute -inset-1.5 rounded-full bg-rose-400/20 animate-pulse pointer-events-none" />
                )}

                {/* Micro Number Seal on Corner */}
                <span className={`absolute -top-1 -left-1 w-5 h-5 rounded-full text-[9px] font-mono font-bold flex items-center justify-center border shadow-xs ${
                  isCompleted
                    ? 'bg-amber-400 text-stone-900 border-amber-100'
                    : isActive
                    ? 'bg-rose-500 text-white border-white'
                    : 'bg-stone-800 text-stone-300 border-stone-600'
                }`}>
                  {level.number}
                </span>

                {/* Center Icon */}
                <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  {renderStationIcon(level)}
                </div>

                {/* Milestone Golden Laurel Accent */}
                {isMilestone && (
                  <div className={`absolute -bottom-1 rounded-full text-stone-950 flex items-center justify-center shadow-xs border border-white ${
                    level.number === 20
                      ? 'w-6 h-6 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-200 animate-bounce'
                      : 'w-5 h-5 bg-gradient-to-tr from-amber-500 to-yellow-300'
                  }`}>
                    <Star className="w-3 h-3 fill-stone-950 text-stone-950" />
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* Summit Footer Accent */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/10 text-[10px] text-stone-600 font-bold">
            <Crown className="w-3 h-3 text-amber-600" />
            <span>Đỉnh Núi Thề Nguyện · Trọn Vẹn 20 Màn Chơi</span>
          </div>
        </div>
      </div>

      {/* LUXURY DATE EXPERIENCE CARD (INVITATION MODAL SHEET) */}
      {selectedLevelDef && (
        <div 
          onClick={() => setSelectedLevelDef(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-[#FAF7F5] border border-stone-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 relative text-left"
          >
            {/* Elegant Close Button */}
            <button
              onClick={() => setSelectedLevelDef(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300/80 flex items-center justify-center text-stone-600 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Date Header */}
            <div className="pr-6">
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-rose-800">
                <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Trạm Hẹn Hò Số {selectedLevelDef.number < 10 ? `0${selectedLevelDef.number}` : selectedLevelDef.number}</span>
                <span className="text-stone-400 font-normal">·</span>
                <span className="text-stone-600 font-medium">{selectedLevelDef.estimatedMinutes} Phút</span>
              </div>
              <h2 className="text-lg font-extrabold text-stone-900 leading-snug mt-1">
                {selectedLevelDef.title}
              </h2>
            </div>

            {/* Subtitle & Intimate Purpose */}
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-2xs">
              <p className="text-xs font-bold text-rose-900 leading-relaxed">
                "{selectedLevelDef.subtitle}"
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                {selectedLevelDef.description}
              </p>
            </div>

            {/* Emotional Takeaway / Rewards (Unboxed metadata) */}
            <div className="flex items-center justify-between text-xs py-2 border-y border-stone-200">
              <span className="text-stone-500 font-medium">Phần thưởng gắn kết:</span>
              <span className="font-extrabold text-amber-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>+{selectedLevelDef.lpReward} Love Power</span>
              </span>
            </div>

            {/* Action CTA: Enter Experience */}
            <div className="pt-1">
              <button
                onClick={handleStartExperience}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#3B121F] via-[#6B2139] to-[#9E2B4E] hover:from-[#4E1829] hover:to-[#B53159] text-amber-100 font-bold text-xs tracking-wider uppercase shadow-md shadow-rose-950/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {profile.completedLevels.includes(selectedLevelDef.number) ? (
                  <>
                    <RotateCcw className="w-4 h-4 text-amber-200 flex-shrink-0" />
                    <span>Trải Nghiệm Lại Màn {selectedLevelDef.number}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-amber-200 text-amber-200 flex-shrink-0" />
                    <span>Bước Vào Trải Nghiệm Màn {selectedLevelDef.number}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
