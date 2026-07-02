'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  autoPlayTrigger: boolean;
}

export default function BackgroundMusic({ autoPlayTrigger }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Reference site's exact background music track
  const musicUrl = 'https://invifest-demo.vercel.app/assets/bg-music.mp3';

  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay blocked by browser, waiting for user:', err));
    }
  }, [autoPlayTrigger]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Failed to play music:', err));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      {/* Wave bars when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-end gap-[3px] px-3 py-2 rounded-full"
            style={{
              background: 'rgba(13,1,1,0.85)',
              border: '1px solid rgba(212,175,55,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {[0.6, 1, 0.8, 1.2, 0.7].map((scale, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ background: '#D4AF37' }}
                animate={{ scaleY: [scale * 0.3, scale, scale * 0.5, scale * 0.8, scale * 0.3] }}
                transition={{
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: i * 0.1,
                }}
                initial={{ height: '16px', transformOrigin: 'bottom' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={togglePlayback}
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group"
        style={{
          background: 'rgba(13,1,1,0.85)',
          border: '2px solid rgba(212,175,55,0.5)',
          backdropFilter: 'blur(8px)',
          boxShadow: isPlaying ? '0 0 20px rgba(212,175,55,0.25)' : '0 4px 20px rgba(0,0,0,0.5)',
        }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <Volume2 size={18} style={{ color: '#D4AF37' }} className="group-hover:scale-110 transition-transform" />
        ) : (
          <VolumeX size={18} style={{ color: '#D4AF3780' }} className="group-hover:scale-110 transition-transform" />
        )}

        {/* Pulsing ring when playing */}
        {isPlaying && (
          <span
            className="absolute -inset-1 rounded-full border pointer-events-none animate-ping"
            style={{ borderColor: 'rgba(212,175,55,0.3)', opacity: 0.5 }}
          />
        )}
      </button>
    </motion.div>
  );
}
