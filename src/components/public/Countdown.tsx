'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDateStr: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDateStr }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calc = () => {
      const diff = +new Date(targetDateStr) - +new Date();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (!isMounted) return null;

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0303 100%)' }}
    >
      <div className="max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.4em] uppercase mb-8 font-light"
          style={{ color: '#D4AF3370' }}
        >
          Counting Down to the Mahurtham
        </motion.p>

        <div className="flex justify-center gap-4 md:gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 md:w-24 md:h-24 rounded-xl flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(145deg, #1E0101, #2D0505)',
                  border: '1px solid #D4AF3740',
                  boxShadow: '0 0 20px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.1)',
                }}
              >
                {/* Top shimmer */}
                <div className="absolute top-0 inset-x-0 h-[1px] rounded-t-xl"
                     style={{ background: 'linear-gradient(to right, transparent, #D4AF3760, transparent)' }} />

                <span
                  className="text-2xl md:text-4xl font-bold tabular-nums"
                  style={{
                    fontFamily: 'var(--font-cinzel)',
                    background: 'linear-gradient(180deg, #F3E5AB 0%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>

              <span className="text-[9px] md:text-[11px] uppercase tracking-widest mt-2 font-light"
                    style={{ color: '#D4AF3760' }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
