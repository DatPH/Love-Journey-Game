import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  Timer, 
  Award, 
  Flame, 
  ShieldCheck, 
  Smartphone,
  MousePointer,
  HelpCircle
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level18Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

export const Level18PendulumGyro: React.FC<Level18Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  const p1 = profile.name1;
  const p2 = profile.name2;

  // Flow: 'prep' -> 'playing' -> 'success' | 'failed'
  const [gameState, setGameState] = useState<'prep' | 'playing' | 'success' | 'failed'>('prep');
  
  // Progress duration (20 seconds needed)
  const [heldSeconds, setHeldSeconds] = useState<number>(0);
  const [isInsideTarget, setIsInsideTarget] = useState<boolean>(true);
  const [sensorMode, setSensorMode] = useState<'gyro' | 'touch_fallback'>('touch_fallback');
  const [stabilityScore, setStabilityScore] = useState<number>(100);

  // Ball physics coordinates (relative to center 0,0, radius limit ~110px)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const targetRadius = 55; // Safe ring radius in px
  const maxRadius = 115; // Outer boundary

  const animFrameRef = useRef<number | null>(null);
  const gameTimerRef = useRef<number | null>(null);

  // Request Gyroscope Permission (iOS / Android)
  const handleRequestGyro = async () => {
    soundFx.playPop();
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        // @ts-expect-error iOS 13+ permission request
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        // @ts-expect-error iOS 13+ permission request
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') {
          setSensorMode('gyro');
        } else {
          setSensorMode('touch_fallback');
        }
      } else if (window.DeviceOrientationEvent) {
        setSensorMode('gyro');
      } else {
        setSensorMode('touch_fallback');
      }
    } catch {
      setSensorMode('touch_fallback');
    }

    startBalanceGame();
  };

  const startBalanceGame = () => {
    setPos({ x: 0, y: 0 });
    posRef.current = { x: 0, y: 0 };
    velRef.current = { vx: 0, vy: 0 };
    setHeldSeconds(0);
    setStabilityScore(100);
    setIsInsideTarget(true);
    setGameState('playing');
    soundFx.playBell();
  };

  // Device orientation listener
  useEffect(() => {
    if (gameState !== 'playing' || sensorMode !== 'gyro') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Gamma: left-to-right tilt in degrees [-90, 90]
      // Beta: front-to-back tilt in degrees [-180, 180]
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;

      // Apply acceleration toward tilt direction
      velRef.current.vx += gamma * 0.05;
      velRef.current.vy += (beta - 25) * 0.05; // Offset slightly for natural 25 deg holding angle
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gameState, sensorMode]);

  // Touch / Drag simulation fallback
  const handleTouchField = (clientX: number, clientY: number, rect: DOMRect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;

    // Apply gentle gravity vector
    velRef.current.vx += dx * 0.04;
    velRef.current.vy += dy * 0.04;
  };

  // Physics animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updatePhysics = () => {
      // Friction damping
      velRef.current.vx *= 0.88;
      velRef.current.vy *= 0.88;

      // Add gentle random breathing noise (simulating heartbeat/finger tremor)
      velRef.current.vx += (Math.random() - 0.5) * 0.4;
      velRef.current.vy += (Math.random() - 0.5) * 0.4;

      let nx = posRef.current.x + velRef.current.vx;
      let ny = posRef.current.y + velRef.current.vy;

      // Distance from center
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Clamp to boundary with elastic bounce
      if (dist > maxRadius) {
        const angle = Math.atan2(ny, nx);
        nx = Math.cos(angle) * maxRadius;
        ny = Math.sin(angle) * maxRadius;
        velRef.current.vx *= -0.3;
        velRef.current.vy *= -0.3;
      }

      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });

      const inside = dist <= targetRadius;
      setIsInsideTarget(inside);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState]);

  // 20s cumulative timer when inside target
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameTimerRef.current = window.setInterval(() => {
      setHeldSeconds((prev) => {
        const next = prev + 1;
        if (next >= 20) {
          if (gameTimerRef.current) clearInterval(gameTimerRef.current);
          soundFx.playFanfare();
          setGameState('success');
          return 20;
        }
        if (next % 5 === 0) soundFx.playPop();
        return next;
      });

      // Decrease stability if outside
      const dist = Math.sqrt(posRef.current.x * posRef.current.x + posRef.current.y * posRef.current.y);
      if (dist > targetRadius) {
        setStabilityScore((s) => Math.max(0, s - 6));
      } else {
        setStabilityScore((s) => Math.min(100, s + 3));
      }
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [gameState]);

  const handleRestart = () => {
    soundFx.playPop();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    setHeldSeconds(0);
    setStabilityScore(100);
    setGameState('prep');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-amber-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Màn 18 · Con Lắc Đồng Điệu
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* PHASE 1: PREP & SENSOR SETUP */}
      {gameState === 'prep' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B2014] via-[#1F170D] to-[#120D06] text-white shadow-xl space-y-4 border border-amber-900/60 text-left">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black block">
                THỬ THÁCH HỒI CHUYỂN GYROSCOPE
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Con Lắc Đồng Điệu
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {p1} và {p2} cùng nhau giữ 2 mép điện thoại nằm ngang, nghiêng nhẹ máy để giữ <strong>hạt ánh sáng</strong> nằm yên trong vòng tròn tâm suốt 20 giây!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-amber-200 space-y-2">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-white">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Cách Phối Hợp:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-300 list-disc pl-4 leading-relaxed font-normal">
                <li>{p1} cầm mép trái, {p2} cầm mép phải của điện thoại.</li>
                <li>Hạt ánh sáng sẽ trôi theo hướng máy bị nghiêng.</li>
                <li>Cả hai phải nhường nhịn và điều chỉnh góc nghiêng cực kỳ êm ái.</li>
                <li>(Có hỗ trợ chạm/vuốt mô phỏng mượt mà trên máy tính/thiết bị không có con xoay).</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleRequestGyro}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Smartphone className="w-4 h-4" />
            <span>Kích Hoạt Cảm Biến & Bắt Đầu 20s Cân Bằng</span>
          </button>
        </div>
      )}

      {/* PHASE 2: ACTIVE GYROSCOPE PLAYING ARENA */}
      {gameState === 'playing' && (
        <div className="space-y-4 text-center animate-in fade-in duration-150">
          {/* Top Status & Timer */}
          <div className="p-4 rounded-3xl bg-slate-950 text-white shadow-md flex items-center justify-between border border-amber-900/50">
            <div className="text-left">
              <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">
                TIẾN ĐỘ CÂN BẰNG
              </span>
              <span className="text-xl font-black font-mono text-amber-400">
                {heldSeconds}s <span className="text-xs text-stone-500 font-normal">/ 20s</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">
                ĐỘ ỔN ĐỊNH
              </span>
              <span className={`text-sm font-black font-mono ${
                stabilityScore >= 70 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {stabilityScore}%
              </span>
            </div>
          </div>

          {/* THE GYRO ORBIT ARENA (Radius 120px) */}
          <div
            className="relative w-72 h-72 mx-auto rounded-full bg-radial from-[#1A162B] via-[#0E0B1A] to-[#07050D] border-4 border-stone-800 shadow-2xl flex items-center justify-center overflow-hidden touch-none"
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleTouchField(e.clientX, e.clientY, rect);
            }}
          >
            {/* Outer warning boundary */}
            <div className="absolute w-60 h-60 rounded-full border border-stone-800/60 pointer-events-none" />

            {/* Inner Golden Safe Ring (55px radius -> 110px diameter) */}
            <div className={`absolute w-[110px] h-[110px] rounded-full border-2 transition-colors pointer-events-none flex items-center justify-center ${
              isInsideTarget
                ? 'border-amber-400/90 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse'
                : 'border-rose-500/50 bg-rose-500/5'
            }`}>
              <div className="w-2 h-2 rounded-full bg-amber-300/40" />
            </div>

            {/* FLOATING LIGHT PARTICLE */}
            <div
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
              className={`absolute w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-75 pointer-events-none ${
                isInsideTarget
                  ? 'bg-radial from-amber-200 via-amber-400 to-yellow-500 shadow-amber-300/60 scale-105'
                  : 'bg-radial from-rose-200 via-rose-500 to-red-600 shadow-rose-500/50 scale-95'
              }`}
            >
              <Sparkles className="w-5 h-5 text-stone-900" />
            </div>

            {/* Crosshair guide lines */}
            <div className="absolute inset-x-0 h-px bg-stone-800/40 pointer-events-none" />
            <div className="absolute inset-y-0 w-px bg-stone-800/40 pointer-events-none" />
          </div>

          <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5 text-[11px]">
              <Smartphone className="w-3.5 h-3.5 text-amber-500" />
              <span>Nghiêng điện thoại nhẹ nhàng để giữ hạt ở giữa</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isInsideTarget ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {isInsideTarget ? 'Ổn Định ✦' : 'Lệch Tâm!'}
            </span>
          </div>
        </div>
      )}

      {/* PHASE 3: SUCCESS */}
      {gameState === 'success' && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-emerald-50 border border-amber-200 shadow-sm space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white text-amber-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              TRỌNG LỰC TÌNH YÊU BẤT KHẢ XÂM PHẠM! 🪐
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Giữ vững con lắc hồi chuyển suốt 20 giây đòi hỏi sự kiên nhẫn và ăn ý đến từng milimet của {p1} & {p2}. Cả hai đã làm được một cách xuất sắc!
            </p>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-amber-700 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+650 Love Power Thăng Bằng</span>
            </div>
          </div>

          <button
            onClick={() => onComplete(650, `Cân bằng con lắc Gyroscope thành công suốt 20 giây (${p1} & ${p2}).`)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn Thành Màn 18 & Nhận 650 LP</span>
          </button>
        </div>
      )}
    </div>
  );
};
