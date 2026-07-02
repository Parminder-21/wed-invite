'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  label: string;
  hiddenValue: string;
  onReveal: () => void;
}

function ScratchCard({ label, hiddenValue, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 150;
      canvas.height = rect?.height || 150;
      drawScratchLayer(ctx, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const drawScratchLayer = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Gold metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#8B6914');
    gradient.addColorStop(0.3, '#D4AF37');
    gradient.addColorStop(0.5, '#F3E5AB');
    gradient.addColorStop(0.7, '#D4AF37');
    gradient.addColorStop(1, '#8B6914');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Subtle pattern overlay
    ctx.globalAlpha = 0.15;
    for (let x = 0; x < w; x += 8) {
      for (let y = 0; y < h; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Instruction text
    ctx.fillStyle = '#4A2C00';
    ctx.font = `bold ${Math.floor(w / 10)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', w / 2, h / 2 - 8);
    ctx.fillText('TO REVEAL', w / 2, h / 2 + 8);
  };

  const getCoords = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      if (!e.touches.length) return null;
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoords(e, canvas);
    if (!coords) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, canvas.width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    if (e.cancelable) e.preventDefault();
  };

  const checkReveal = () => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] < 128) transparent++;
      }
      const pct = Math.round((transparent / (imgData.data.length / 4)) * 100);
      setScratchPercent(pct);

      if (pct > 40) {
        setIsRevealed(true);
        onReveal();
      }
    } catch (err) {
      console.error('Canvas error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="text-[10px] uppercase tracking-[0.3em] font-semibold"
        style={{ color: '#D4AF3790' }}
      >
        {label}
      </span>

      <div
        className="relative rounded-2xl overflow-hidden select-none flex items-center justify-center"
        style={{
          width: '130px',
          height: '130px',
          background: 'linear-gradient(135deg, #1A0202 0%, #2D0505 100%)',
          border: '2px solid #D4AF3750',
          boxShadow: '0 0 30px rgba(212,175,55,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Hidden date value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-3xl md:text-4xl font-bold leading-none"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A227, #F3E5AB, #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {hiddenValue}
          </span>
        </div>

        {/* Scratch canvas overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
            style={{ borderRadius: '14px' }}
            onMouseDown={() => setIsDrawing(true)}
            onMouseMove={(e) => scratch(e.nativeEvent)}
            onMouseUp={() => { setIsDrawing(false); checkReveal(); }}
            onMouseLeave={() => { setIsDrawing(false); checkReveal(); }}
            onTouchStart={() => setIsDrawing(true)}
            onTouchMove={(e) => scratch(e.nativeEvent)}
            onTouchEnd={() => { setIsDrawing(false); checkReveal(); }}
          />
        )}

        {/* Revealed shimmer */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Progress hint */}
      {!isRevealed && scratchPercent > 5 && (
        <div className="w-24 h-1 rounded-full bg-[#ffffff10]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(scratchPercent * 2.5, 100)}%`,
              background: 'linear-gradient(to right, #D4AF37, #F3E5AB)',
            }}
          />
        </div>
      )}
    </div>
  );
}

interface SaveTheDateProps {
  weddingDateStr: string;
}

export default function SaveTheDate({ weddingDateStr }: SaveTheDateProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const d = new Date(weddingDateStr);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()].toUpperCase().slice(0, 3);
  const year = String(d.getFullYear());

  const handleReveal = () => setRevealedCount(c => c + 1);

  useEffect(() => {
    if (revealedCount === 3 && !confettiTriggered) {
      setConfettiTriggered(true);
      const end = Date.now() + 4000;
      const fire = () => {
        confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#D4AF37', '#FAF9F6', '#800020', '#F3E5AB'] });
        confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#D4AF37', '#FAF9F6', '#800020', '#F3E5AB'] });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
    }
  }, [revealedCount, confettiTriggered]);

  return (
    <section
      id="save-the-date"
      className="relative py-24 overflow-hidden text-white"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Decorative top line */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Section tag */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
          style={{ color: '#D4AF3780' }}
        >
          Mark Your Calendar
        </motion.p>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-3"
          style={{
            fontFamily: 'var(--font-cinzel)',
            background: 'linear-gradient(135deg, #C9A227, #F3E5AB, #D4AF37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Save The Date
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-16 h-[2px] mb-8 mx-auto"
          style={{ background: 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm max-w-md mb-14 font-light leading-relaxed"
        >
          Scratch the golden panels to unveil our auspicious wedding date — use your finger or cursor.
        </motion.p>

        {/* Scratch Cards */}
        <div className="flex items-end justify-center gap-6 md:gap-10 flex-wrap mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <ScratchCard label="Month" hiddenValue={month} onReveal={handleReveal} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <ScratchCard label="Day" hiddenValue={day} onReveal={handleReveal} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <ScratchCard label="Year" hiddenValue={year} onReveal={handleReveal} />
          </motion.div>
        </div>

        {/* Reveal result message */}
        <div className="h-10 flex items-center justify-center">
          {revealedCount === 3 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <p className="text-base md:text-xl font-serif font-semibold"
                 style={{ color: '#D4AF37' }}>
                🎊 {months[d.getMonth()]} {d.getDate()}, {d.getFullYear()} — The Most Awaited Day!
              </p>
            </motion.div>
          ) : (
            <p className="text-xs tracking-widest text-gray-600 uppercase">
              {revealedCount} of 3 revealed
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
