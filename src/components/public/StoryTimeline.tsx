'use client';

import { motion } from 'framer-motion';
import { StoryTimelineItem } from '@/lib/types';

interface StoryTimelineProps {
  story: StoryTimelineItem[];
}

export default function StoryTimeline({ story }: StoryTimelineProps) {
  return (
    <section
      id="story"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Top/bottom section lines */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
            style={{ color: '#D4AF3770' }}
          >
            A Beautiful Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A227, #F3E5AB, #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Love Story
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-[2px] mx-auto"
            style={{ background: 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)' }}
          />
        </div>

        {/* Timeline items */}
        <div className="relative">
          {/* Vertical center line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-px"
            style={{ background: 'linear-gradient(to bottom, transparent, #D4AF3740 10%, #D4AF37 50%, #D4AF3740 90%, transparent)' }}
          />

          <div className="space-y-16 md:space-y-24">
            {story.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={item.id} className="relative flex flex-col md:flex-row items-start">
                  {/* Center dot */}
                  <div
                    className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 border-2"
                    style={{
                      background: '#1A0202',
                      borderColor: '#D4AF37',
                      boxShadow: '0 0 12px rgba(212,175,55,0.4)',
                    }}
                  />

                  {/* Spacer */}
                  {isEven ? <div className="hidden md:block w-[50%]" /> : null}

                  {/* Content card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40, y: 10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' as const }}
                    className="w-full md:w-[46%] ml-10 md:ml-0 rounded-2xl overflow-hidden relative"
                    style={{
                      background: 'linear-gradient(145deg, #1E0101, #2D0505)',
                      border: '1px solid #D4AF3725',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.05)',
                    }}
                  >
                    {/* Photo */}
                    {item.image && (
                      <div className="relative w-full h-52 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        {/* Photo overlay gradient */}
                        <div className="absolute inset-0"
                             style={{ background: 'linear-gradient(to top, #1E0101 0%, transparent 60%)' }} />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="p-6">
                      <span
                        className="text-xs font-semibold tracking-widest uppercase block mb-2"
                        style={{ color: '#D4AF37' }}
                      >
                        {item.date}
                      </span>
                      <h3
                        className="text-xl font-bold text-white mb-3"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom shimmer */}
                    <div className="absolute bottom-0 inset-x-0 h-[1px] opacity-30"
                         style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
                  </motion.div>

                  {!isEven && <div className="hidden md:block w-[50%]" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
