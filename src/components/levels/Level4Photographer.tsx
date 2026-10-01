import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  RotateCw, 
  Clock, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon,
  Download,
  AlertCircle,
  RefreshCw,
  SwitchCamera
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { triggerConfetti } from '../../utils/storage';
import { CoupleProfile } from '../../types';

interface Level4PhotographerProps {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes: string) => void;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}

type ChallengeStep = 'SETUP' | 'SHOOTING' | 'PREVIEW' | 'VOTING';

const POSE_PROMPTS = [
  'Tạo dáng "Nàng thơ bất ngờ quay đầu lại" mắt nhìn xa xăm tìm quán ăn!',
  'Tạo dáng siêu ngầu phong cách poster phim trinh thám Hàn Quốc!',
  'Tạo dáng bắn tim đôi siêu ngọt ngào kiểu idol K-Pop!',
  'Tạo dáng "Chụp lén nhưng cố tình diễn sâu" với nụ cười tỏa nắng!',
  'Tạo dáng nháy mắt chu môi đáng yêu thách thức mọi ống kính!',
  'Tạo dáng tựa đầu vào vai hoặc chạm trán nhìn nhau âu yếm!',
];

export const Level4Photographer: React.FC<Level4PhotographerProps> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted,
}) => {
  const [step, setStep] = useState<ChallengeStep>('SETUP');
  // Roles
  const [photographer, setPhotographer] = useState<string>(profile.name1);
  const [model, setModel] = useState<string>(profile.name2);

  // Pose prompt
  const [currentPoseIdx, setCurrentPoseIdx] = useState<number>(0);

  // 30s timer
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Real Camera streaming states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Photo captured/uploaded (stored only in memory, not saved to app storage)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Rating
  const [rating, setRating] = useState<number>(5);
  const [compliment, setCompliment] = useState<string>('Nhiếp ảnh gia có tâm bậc nhất quả đất!');

  // Stop camera helper
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Direct user-gesture camera connection handler
  const handleConnectCamera = async () => {
    soundFx.playPop();
    setIsConnecting(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ kết nối camera trực tiếp.');
      }

      let stream: MediaStream | null = null;

      // 1. First try with facingMode (ideal for smartphones)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
      } catch (mobileErr) {
        console.warn('Initial facingMode request failed, attempting laptop webcam fallback { video: true }...', mobileErr);
        // 2. Fallback to basic { video: true } (ideal for laptops/desktops with a single webcam)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (stream) {
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        setTimeLeft(30);
        setIsTimerRunning(true);
        setPhotoPreview(null);
        setHasDownloaded(false);
        setStep('SHOOTING');
      }
    } catch (err: unknown) {
      console.error('Camera connection error:', err);
      const errorObj = err as { name?: string; message?: string };
      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        setCameraError('Trình duyệt chưa được cấp quyền mở camera. Vui lòng bấm vào biểu tượng Camera/Ổ khóa trên thanh địa chỉ của trình duyệt, chọn "Cho phép (Allow)" rồi nhấn thử lại.');
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        setCameraError('Không tìm thấy thiết bị camera trên máy. Bạn có thể bấm nút tải ảnh bên dưới.');
      } else {
        setCameraError('Không thể mở camera: ' + (errorObj.message || 'Vui lòng kiểm tra quyền camera.'));
      }
      // Also proceed to SHOOTING view so user can see the error, click retry or choose file
      setTimeLeft(30);
      setStep('SHOOTING');
    } finally {
      setIsConnecting(false);
    }
  };

  // Attach active stream to video element when SHOOTING view mounts
  useEffect(() => {
    if (step === 'SHOOTING' && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((e) => console.warn('Video play error:', e));
    }
  }, [step, isCameraActive]);

  // Clean up on unmount or exiting shooting
  useEffect(() => {
    if (step !== 'SHOOTING') {
      stopCamera();
    }
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Timer loop
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            soundFx.playBeep(true);
            return 0;
          }
          if (prev <= 5) {
            soundFx.playBeep(false);
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
  }, [isTimerRunning, timeLeft]);

  const handleSwapRoles = () => {
    soundFx.playPop();
    const temp = photographer;
    setPhotographer(model);
    setModel(temp);
  };

  const handleNextPose = () => {
    soundFx.playPop();
    setCurrentPoseIdx((prev) => (prev + 1) % POSE_PROMPTS.length);
  };

  // Toggle front/back camera
  const handleToggleCameraFacing = async () => {
    soundFx.playPop();
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: nextFacing },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Switch camera error:', err);
    }
  };

  // Shutter snap button: captures frame from live video stream
  const handleSnapPhoto = () => {
    soundFx.playCameraSnap();
    setIsTimerRunning(false);

    if (videoRef.current && isCameraActive) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // If selfie mode, mirror horizontally for natural perspective
          if (cameraFacing === 'user') {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          setPhotoPreview(dataUrl);
        }
      } catch (err) {
        console.warn('Canvas snapshot error:', err);
      }
    }

    // Stop camera immediately after snapshot
    stopCamera();

    // If camera wasn't active or snapshot empty, fallback to aesthetic placeholder
    setPhotoPreview((prev) => prev || '/src/assets/images/couple_polaroid_card_1790627956036.jpg');
    setStep('PREVIEW');
  };

  // Fallback upload from device gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        soundFx.playCameraSnap();
        setIsTimerRunning(false);
        stopCamera();
        setStep('PREVIEW');
      };
      reader.readAsDataURL(file);
    }
  };

  // Download photo directly to user's device
  const handleDownloadPhoto = () => {
    if (!photoPreview) return;
    soundFx.playPop();
    const a = document.createElement('a');
    a.href = photoPreview;
    a.download = `khoanh-khac-doi-ta-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setHasDownloaded(true);
    triggerConfetti();
  };

  const handleComplete = () => {
    soundFx.playFanfare();
    triggerConfetti();
    // Only challenge metadata and LP are stored. The photo is NOT saved to the app!
    onComplete(
      150,
      `Nhiếp ảnh gia ${photographer} đã chụp cho người mẫu ${model} bức ảnh đạt ${rating} sao! Lời khen: "${compliment}"`
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => {
            soundFx.playPop();
            stopCamera();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bản đồ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">
            Màn 4 / 20
          </span>
          <span className="text-xs font-bold text-slate-700">Nhiếp Ảnh Gia</span>
        </div>
      </div>

      {/* Hidden File Input for Device Photo Gallery / Native Camera */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* STEP 1: SETUP */}
      {step === 'SETUP' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full text-xs font-semibold mb-2">
              <span>📸 Kết Nối Camera Thiết Bị</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Nhiếp Ảnh Gia "Bất Đắc Dĩ"
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Bật camera trực tiếp trên điện thoại hoặc laptop để bắt trọn khoảnh khắc người ấy trong 30 giây!
            </p>
          </div>

          {/* Role Assignment Card */}
          <div className="p-4 rounded-3xl bg-white border border-teal-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Phân Công Vai Trò
              </span>
              <button
                onClick={handleSwapRoles}
                className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi vai</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-center">
                <span className="text-xs font-bold text-teal-700 block uppercase tracking-wider">
                  Nhiếp Ảnh Gia
                </span>
                <span className="text-base font-black text-slate-800 block mt-1 truncate">
                  {photographer}
                </span>
                <span className="text-[10px] text-teal-600">Cầm máy chụp</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
                <span className="text-xs font-bold text-rose-700 block uppercase tracking-wider">
                  Người Mẫu
                </span>
                <span className="text-base font-black text-slate-800 block mt-1 truncate">
                  {model}
                </span>
                <span className="text-[10px] text-rose-600">Tạo dáng thần thái</span>
              </div>
            </div>

            {/* Pose suggestion box */}
            <div className="mt-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Gợi Ý Dáng Chụp Hôm Nay:
                </span>
                <button
                  onClick={handleNextPose}
                  className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-0.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Đổi dáng
                </button>
              </div>
              <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                "{POSE_PROMPTS[currentPoseIdx]}"
              </p>
            </div>

            {/* Privacy note */}
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-snug">
              🔒 <strong>Bảo mật riêng tư:</strong> Ứng dụng sẽ yêu cầu quyền mở camera thiết bị của bạn. Ảnh chụp cho phép tải về máy và <strong>không bao giờ lưu vào ứng dụng hay máy chủ</strong>.
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleConnectCamera}
            disabled={isConnecting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-75"
          >
            <Camera className="w-5 h-5" />
            <span>{isConnecting ? 'Đang Yêu Cầu Kết Nối...' : 'Kết Nối Camera'}</span>
          </button>
        </div>
      )}

      {/* STEP 2: SHOOTING WITH REAL DEVICE CAMERA */}
      {step === 'SHOOTING' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Bar with Timer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400 animate-spin" />
              <span className="text-xs font-semibold">Thời gian chụp:</span>
            </div>
            <div className={`font-mono text-xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-emerald-400'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Camera Viewfinder with Real Video Stream */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-800 shadow-2xl flex flex-col justify-between p-4 text-white">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover z-0 ${
                cameraFacing === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Error or Permission Denied overlay */}
            {!isCameraActive && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center text-slate-200 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Chưa Thể Mở Camera</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                  {cameraError || 'Trình duyệt đang chờ cấp quyền mở camera hoặc camera chưa phản hồi.'}
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs pt-1">
                  <button
                    onClick={handleConnectCamera}
                    className="w-full py-2.5 px-4 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Thử Cấp Quyền & Kết Nối Lại</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 bg-white/20 text-white rounded-xl text-xs font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Chọn ảnh từ thiết bị</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Viewfinder overlay graphics */}
            <div className="relative z-10 flex justify-between items-center text-[10px] text-white/90 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                LIVE {cameraFacing === 'environment' ? 'CAM SAU' : 'CAM TRƯỚC'}
              </span>

              {/* Camera Switch button (Front/Back) */}
              <button
                onClick={handleToggleCameraFacing}
                className="flex items-center gap-1 bg-black/50 hover:bg-black/70 px-2.5 py-1 rounded-full text-white text-[11px] font-sans border border-white/20 transition-colors active:scale-95"
                title="Đổi camera trước/sau"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span>Đổi cam</span>
              </button>
            </div>

            {/* Target Crosshair & Pose Reminder in Center */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
              <div className="w-28 h-28 border border-white/40 rounded-2xl flex items-center justify-center relative">
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-300" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-300" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-300" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-300" />
              </div>

              <div className="mt-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-center max-w-[240px]">
                <span className="text-[10px] text-amber-300 block font-bold uppercase">
                  Dáng của {model}:
                </span>
                <span className="text-xs text-white font-medium line-clamp-2">
                  {POSE_PROMPTS[currentPoseIdx]}
                </span>
              </div>
            </div>

            {/* Viewfinder Bottom Controls */}
            <div className="relative z-10 flex items-center justify-around pt-2">
              {/* Gallery upload alternative */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white border border-white/20 transition-colors"
                title="Tải ảnh từ thư viện"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Big Shutter Button */}
              <button
                onClick={handleSnapPhoto}
                className="w-20 h-20 rounded-full bg-white p-1 ring-4 ring-rose-500/50 flex items-center justify-center transition-transform active:scale-90 shadow-2xl"
                title="Bấm chụp ảnh"
              >
                <div className="w-full h-full rounded-full bg-rose-500 hover:bg-rose-600 border-2 border-white flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>

              {/* Cancel / exit */}
              <button
                onClick={() => {
                  stopCamera();
                  setStep('SETUP');
                }}
                className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-xs font-bold border border-white/20 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: PREVIEW, DOWNLOAD & RATING */}
      {(step === 'PREVIEW' || step === 'VOTING') && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="p-4 rounded-3xl bg-white border-2 border-teal-200 shadow-lg text-center">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              Tác Phẩm Của {photographer}
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-0.5">
              Chụp Thành Công!
            </h2>

            {/* Photo Polaroid Frame */}
            <div className="my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-[280px] mx-auto shadow-sm">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Bức ảnh vừa chụp"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">Ảnh kỷ niệm</div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-mono backdrop-blur-xs">
                  {photographer} 📷 {model}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 italic mt-2 font-medium">
                "{POSE_PROMPTS[currentPoseIdx]}"
              </p>
            </div>

            {/* Download Photo Button */}
            <div className="mb-4">
              <button
                onClick={handleDownloadPhoto}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>{hasDownloaded ? '✓ Đã Tải Ảnh Về Máy (Tải Lại)' : 'Tải Ảnh Về Thiết Bị'}</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-1">
                🔒 Ảnh chỉ lưu trên máy bạn, không được lưu trên ứng dụng nhằm bảo mật riêng tư.
              </p>
            </div>

            {/* 5-Star Rating */}
            <div className="my-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {model} chấm điểm tay nghề của {photographer}:
              </span>
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      soundFx.playPop();
                      setRating(star);
                      if (star === 5) setCompliment('Nhiếp ảnh gia có tâm bậc nhất quả đất!');
                      else if (star === 4) setCompliment('Góc chụp hack dáng cực kỳ xuất sắc!');
                      else setCompliment('Cần luyện thêm nhưng tinh thần 10 điểm!');
                    }}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-rose-600 mt-1">
                {rating} / 5 Sao · {compliment}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleComplete}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Thành Thử Thách (+150 LP)</span>
              </button>

              <button
                onClick={() => {
                  handleSwapRoles();
                  setPhotoPreview(null);
                  setStep('SETUP');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi vai: Lượt {model} làm nhiếp ảnh gia</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
