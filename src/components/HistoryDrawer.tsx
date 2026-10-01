import React from 'react';
import { X, Sparkles, Trophy, Calendar, Award } from 'lucide-react';
import { ChallengeLog } from '../types';
import { soundFx } from '../utils/sound';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: ChallengeLog[];
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-rose-100 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Award className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Nhật Ký Thử Thách</h2>
              <p className="text-[10px] text-slate-500">Các kỷ niệm hai bạn đã cùng vượt qua</p>
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

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <span className="text-3xl block mb-2">📜</span>
              Hai bạn chưa hoàn thành thử thách nào. Hãy bắt đầu từ Màn 1 nhé!
            </div>
          ) : (
            history.map((log) => {
              const dateStr = new Date(log.completedAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-left space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-rose-600 uppercase tracking-wider">
                      Màn {log.levelNumber}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">
                    {log.levelTitle}
                  </h4>

                  {log.notes && (
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                      {log.notes}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-end">
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-rose-100">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      +{log.earnedLp} LP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
