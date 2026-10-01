import React, { useState } from 'react';
import { X, Heart, Sparkles, Calendar, RotateCcw, Check, Award } from 'lucide-react';
import { CoupleProfile, AvatarType } from '../types';
import { getLoveTier, LOVE_LEVEL_TIERS } from '../data/levelsData';
import { soundFx } from '../utils/sound';

interface CoupleProfileModalProps {
  isOpen: boolean;
  profile: CoupleProfile;
  onSave: (updated: Partial<CoupleProfile>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

const AVATAR_OPTIONS: { id: AvatarType; label: string; emoji: string }[] = [
  { id: 'bear', label: 'Gấu Bự', emoji: '🐻' },
  { id: 'bunny', label: 'Thỏ Con', emoji: '🐰' },
  { id: 'cat', label: 'Mèo Lười', emoji: '🐱' },
  { id: 'fox', label: 'Cáo Nhỏ', emoji: '🦊' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'heart', label: 'Trái Tim', emoji: '💖' },
];

export const CoupleProfileModal: React.FC<CoupleProfileModalProps> = ({
  isOpen,
  profile,
  onSave,
  onResetProgress,
  onClose,
}) => {
  if (!isOpen) return null;

  const [name1, setName1] = useState<string>(profile.name1);
  const [name2, setName2] = useState<string>(profile.name2);
  const [anniversary, setAnniversary] = useState<string>(profile.anniversaryDate);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const currentTier = getLoveTier(profile.lpScore);

  const handleSave = () => {
    soundFx.playPop();
    onSave({
      name1: name1.trim() || 'Anh',
      name2: name2.trim() || 'Em',
      anniversaryDate: anniversary,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hồ Sơ Cặp Đôi</h2>
              <p className="text-[10px] text-slate-500">Tùy biến biệt danh & cột mốc</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Love Tier Status */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/15">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold flex items-center gap-1">
              <Award className="w-4 h-4" />
              Đẳng Cấp Tình Yêu
            </span>
            <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
              {profile.lpScore} LP
            </span>
          </div>
          <div className="text-base font-extrabold">{currentTier.title}</div>
          <p className="text-[11px] text-rose-100/90 mt-0.5">{currentTier.subtitle}</p>
        </div>

        {/* Edit Nicknames */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Tên / Biệt danh 1:
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/30 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Anh..."
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Tên / Biệt danh 2:
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/30 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Em..."
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              Ngày kỷ niệm tình yêu:
            </label>
            <input
              type="date"
              value={anniversary}
              onChange={(e) => setAnniversary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* Milestone Levels Overview */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-700 block mb-2">
            Các Bậc Danh Hiệu Tình Yêu:
          </span>
          <div className="space-y-1.5">
            {LOVE_LEVEL_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                  profile.lpScore >= tier.minLp
                    ? 'bg-rose-50 text-rose-900 font-semibold'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                <span>{tier.title}</span>
                <span className="font-mono text-[10px]">{tier.minLp}+ LP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>

          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2 px-3 text-[11px] text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại tiến trình chơi từ đầu</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center space-y-2">
              <span className="text-[11px] font-bold text-red-700 block">
                Bạn có chắc muốn xóa điểm và chơi lại từ Màn 1?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowConfirmReset(false);
                    onClose();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold"
                >
                  Xác nhận xóa
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
