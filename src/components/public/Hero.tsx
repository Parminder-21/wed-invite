'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { WeddingConfig } from '@/lib/types';

interface HeroProps {
  config: WeddingConfig;
}

const OrnamentDivider = () => (
  <div className="flex items-center justify-center gap-4 w-full my-6">
    <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 2 L16 12 L14 14 L12 12 Z" fill="#D4AF37" opacity="0.9"/>
      <path d="M14 26 L16 16 L14 14 L12 16 Z" fill="#D4AF37" opacity="0.9"/>
      <path d="M2 14 L12 12 L14 14 L12 16 Z" fill="#D4AF37" opacity="0.9"/>
      <path d="M26 14 L16 12 L14 14 L16 16 Z" fill="#D4AF37" opacity="0.9"/>
      <circle cx="14" cy="14" r="3" fill="#D4AF37"/>
    </svg>
    <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
  </div>
);

export default function Hero({ config }: HeroProps) {
  const { couple } = config;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-white"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #3D0808 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Parallax background texture */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Radial decorative mandala rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <svg viewBox="0 0 600 600" className="w-full max-w-3xl">
            {[60, 100, 140, 180, 220, 260].map((r, i) => (
              <circle key={i} cx="300" cy="300" r={r} stroke="#D4AF37" strokeWidth="0.5" fill="none" />
            ))}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={300 + 60 * Math.cos(angle)} y1={300 + 60 * Math.sin(angle)}
                  x2={300 + 260 * Math.cos(angle)} y2={300 + 260 * Math.sin(angle)}
                  stroke="#D4AF37" strokeWidth="0.3" opacity="0.6"
                />
              );
            })}
          </svg>
        </div>

        {/* Bokeh/particle effect */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.05, 0.3, 0.05] }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut' as const,
            }}
          />
        ))}
      </motion.div>

      {/* Golden border frame */}
      <div className="absolute inset-4 md:inset-8 pointer-events-none border border-[#D4AF3730] rounded-2xl" />
      <div className="absolute inset-5 md:inset-9 pointer-events-none border border-[#D4AF3715] rounded-xl" />

      {/* Scrolling content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20 text-center"
      >
        {/* Top announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-[1px] w-8 bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
            With the Blessings of the Almighty
          </span>
          <div className="h-[1px] w-8 bg-[#D4AF37]" />
        </motion.div>

        {/* Parents announcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-12 mb-10"
        >
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF3780] mb-1 font-light">Daughter of</p>
            <p className="text-sm md:text-base text-gray-200 font-light tracking-wide">{couple.brideParents}</p>
          </div>
          <div className="hidden md:block w-[1px] h-12 bg-[#D4AF3730]" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF3780] mb-1 font-light">Son of</p>
            <p className="text-sm md:text-base text-gray-200 font-light tracking-wide">{couple.groomParents}</p>
          </div>
        </motion.div>

        {/* Couple names — the star of the show */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mb-6"
        >
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-bold leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A227 0%, #F3E5AB 40%, #D4AF37 60%, #AA7C11 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))',
            }}
          >
            {couple.bride}
          </h1>

          <div className="flex flex-col items-center gap-2 my-2 md:my-0">
            <div className="h-[1px] w-6 bg-[#D4AF3750] md:hidden" />
            <span
              className="text-lg md:text-3xl italic font-light text-[#D4AF3780]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              weds
            </span>
            <div className="h-[1px] w-6 bg-[#D4AF3750] md:hidden" />
          </div>

          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-bold leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A227 0%, #F3E5AB 40%, #D4AF37 60%, #AA7C11 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))',
            }}
          >
            {couple.groom}
          </h1>
        </motion.div>

        {/* Divider ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-full max-w-sm"
        >
          <OrnamentDivider />
        </motion.div>

        {/* Announcement text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-gray-400 text-xs md:text-sm max-w-lg leading-relaxed text-center font-light tracking-wide mb-12"
        >
          {couple.announcement}
        </motion.p>

        {/* Scroll CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => document.getElementById('save-the-date')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 group"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF3780] group-hover:text-[#D4AF37] transition-colors">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <ChevronDown className="text-[#D4AF3760] group-hover:text-[#D4AF37] transition-colors" size={20} />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
}
