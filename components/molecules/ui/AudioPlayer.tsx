// components/AudioPlayer.tsx

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 1. Định nghĩa Props Interface
interface AudioPlayerProps {
  src: string;
  title?: string; // Optional title
}

// Hàm định dạng thời gian (00:00)
const formatTime = (time: number): string => {
  if (isNaN(time) || time < 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Custom Audio Player Component
 * @param {AudioPlayerProps} props
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Nghe Tri thức',
}) => {
  // useRef được generic hóa để tham chiếu đến thẻ HTMLAudioElement
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [pulseId, setPulseId] = useState(0);

  // 1. Logic xử lý Play/Pause
  const togglePlayPause = () => {
    // Kiểm tra null/undefined cho audioRef.current
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(error => {
        // Xử lý lỗi khi play() thất bại (ví dụ: trình duyệt chặn autoplay)
        console.error('Error attempting to play audio:', error);
      });
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }

    // Trigger hiệu ứng flash nền
    setPulseId(id => id + 1);
  };

  // 2. Thiết lập và cập nhật trạng thái thời gian
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Type casting: (e.target as HTMLAudioElement)
    const setAudioData = (e: Event) => {
      setDuration((e.target as HTMLAudioElement).duration);
    };
    const updateTime = (e: Event) => {
      setCurrentTime((e.target as HTMLAudioElement).currentTime);
    };
    const handleEnded = () => setIsPlaying(false);

    // Lắng nghe các sự kiện của thẻ <audio>
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    // Dọn dẹp listener khi component unmount
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Không render nếu không có nguồn audio
  if (!src) return null;

  return (
    <div className="mt-4 flex w-full max-w-md items-center justify-between rounded-full bg-white/70 p-2 shadow-md backdrop-blur-sm">
      {/* Hidden Audio */}
      <audio ref={audioRef} preload="metadata" className="hidden">
        <source src={src} />
        Trình duyệt không hỗ trợ audio.
      </audio>

      {/* Nút Play/Pause với hiệu ứng nền chạy nhanh khi click */}
      <button
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
        className={`relative flex items-center gap-2 overflow-hidden rounded-full px-3 py-1.5 text-white shadow-md transition-all active:scale-95 ${
          isPlaying
            ? "bg-linear-to-r from-emerald-400 via-teal-500 to-sky-500 hover:brightness-105"
            : "bg-linear-to-r from-rose-400 via-red-500 to-orange-400 hover:brightness-105"
        }`}
      >
        <motion.div
          key={pulseId}
          className="absolute inset-0 bg-white/25"
          initial={{ x: '-100%' }}
          animate={{
            x: '0%',
            opacity: isPlaying ? 1 : 0.4,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />

        <div className="relative z-10 flex h-6 w-6 items-center justify-center">
          {isPlaying ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        <span className="relative z-10 text-base font-semibold">{title}</span>
      </button>

      {/* Time */}
      <div className="mr-2 text-sm font-medium whitespace-nowrap text-gray-600">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;
