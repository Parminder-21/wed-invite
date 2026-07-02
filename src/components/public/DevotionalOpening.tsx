'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface DevotionalOpeningProps {
  mantra: string;
  translation: string;
  onEnter: (playMusic: boolean) => void;
}

const FloralDivider = () => (
  <div className="flex items-center justify-center gap-3 my-4">
    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2" fill="#D4AF37"/>
      <path d="M12 4 C14 8 14 8 12 12 C10 8 10 8 12 4Z" fill="#D4AF37" opacity="0.8"/>
      <path d="M12 20 C14 16 14 16 12 12 C10 16 10 16 12 20Z" fill="#D4AF37" opacity="0.8"/>
      <path d="M4 12 C8 14 8 14 12 12 C8 10 8 10 4 12Z" fill="#D4AF37" opacity="0.8"/>
      <path d="M20 12 C16 14 16 14 12 12 C16 10 16 10 20 12Z" fill="#D4AF37" opacity="0.8"/>
      <path d="M6.3 6.3 C9.5 9 9.5 9 12 12 C9 9.5 9 9.5 6.3 6.3Z" fill="#D4AF37" opacity="0.6"/>
      <path d="M17.7 17.7 C14.5 15 14.5 15 12 12 C15 14.5 15 14.5 17.7 17.7Z" fill="#D4AF37" opacity="0.6"/>
      <path d="M6.3 17.7 C9 14.5 9 14.5 12 12 C9.5 15 9.5 15 6.3 17.7Z" fill="#D4AF37" opacity="0.6"/>
      <path d="M17.7 6.3 C15 9.5 15 9.5 12 12 C14.5 9 14.5 9 17.7 6.3Z" fill="#D4AF37" opacity="0.6"/>
    </svg>
    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
  </div>
);

export default function DevotionalOpening({ mantra, translation, onEnter }: DevotionalOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playMusic, setPlayMusic] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsOpen(true);
    setTimeout(() => {
      onEnter(playMusic);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: 'easeInOut' as const } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white text-center select-none overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #2D0505 0%, #1A0202 40%, #0D0101 100%)'
          }}
        >
          {/* Animated bokeh particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: '#D4AF37',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut' as const,
              }}
            />
          ))}

          {/* Lotus pattern background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-full max-w-2xl" fill="none">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                return (
                  <ellipse
                    key={i}
                    cx={200 + 80 * Math.cos(angle)}
                    cy={200 + 80 * Math.sin(angle)}
                    rx="60"
                    ry="25"
                    transform={`rotate(${i * 30} ${200 + 80 * Math.cos(angle)} ${200 + 80 * Math.sin(angle)})`}
                    fill="#D4AF37"
                    opacity="0.8"
                  />
                );
              })}
              <circle cx="200" cy="200" r="30" fill="#D4AF37" />
            </svg>
          </div>

          {/* Corner ornaments */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-24 h-24 opacity-40 pointer-events-none`}>
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d={i === 0 ? "M5,5 L5,40 M5,5 L40,5" :
                     i === 1 ? "M95,5 L95,40 M95,5 L60,5" :
                     i === 2 ? "M5,95 L5,60 M5,95 L40,95" :
                     "M95,95 L95,60 M95,95 L60,95"}
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx={i === 0 ? 5 : i === 1 ? 95 : i === 2 ? 5 : 95}
                        cy={i === 0 ? 5 : i === 1 ? 5 : i === 2 ? 95 : 95}
                        r="3" fill="#D4AF37" />
              </svg>
            </div>
          ))}

          {/* Main content */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative z-10 flex flex-col items-center px-6 max-w-xl"
              >
                {/* Om / Ganesha Symbol */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: 'easeOut' as const }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                       style={{ background: 'radial-gradient(circle, #3D0A0A, #1A0202)' }}>
                    <span className="text-[#D4AF37] text-3xl md:text-4xl font-serif leading-none" style={{ fontFamily: 'serif' }}>
                      ॐ
                    </span>
                  </div>
                </motion.div>

                {/* Top label */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-4 font-light"
                >
                  Shubh Vivah
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="w-full"
                >
                  <FloralDivider />
                </motion.div>

                {/* Mantra text */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1.2 }}
                  className="text-base md:text-lg font-serif text-[#D4AF37] leading-relaxed tracking-wide mb-3 text-center"
                >
                  {mantra}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="text-xs md:text-sm text-gray-400 italic leading-relaxed text-center px-2 mb-8"
                >
                  "{translation}"
                </motion.p>

                {/* Music toggle */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  onClick={() => setPlayMusic(!playMusic)}
                  className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: playMusic ? '#D4AF37' : '#6b7280',
                  }}
                >
                  {playMusic ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>Music: {playMusic ? 'On' : 'Off'}</span>
                </motion.button>

                {/* Enter CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <button
                    onClick={handleEnter}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
                    <div className="relative px-10 py-4 rounded-full text-sm font-semibold tracking-[0.2em] uppercase text-[#1A0202] transition-all"
                         style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA7C11 100%)' }}>
                      Open Invitation
                    </div>
                  </button>

                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
                    className="text-gray-500 text-xs tracking-[0.3em] uppercase"
                  >
                    Scroll to See Magic
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
