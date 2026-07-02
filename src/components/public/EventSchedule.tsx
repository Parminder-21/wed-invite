'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Shirt } from 'lucide-react';
import { EventDetail } from '@/lib/types';

interface EventScheduleProps {
  events: EventDetail[];
}

const eventIcons: Record<string, string> = {
  haldi: '🌻',
  mehendi: '🌿',
  sangeet: '🎶',
  phere: '🔥',
  wedding: '🔥',
  reception: '✨',
};

function getEventIcon(title: string) {
  const key = Object.keys(eventIcons).find(k => title.toLowerCase().includes(k));
  return key ? eventIcons[key] : '💛';
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
};

export default function EventSchedule({ events }: EventScheduleProps) {
  return (
    <section
      id="schedule"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Separator lines */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
            style={{ color: '#D4AF3770' }}
          >
            Join the Celebrations
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
            Festivities
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-[2px] mx-auto mb-4"
            style={{ background: 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)' }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: 'easeOut' as const }}
              className="rounded-2xl relative overflow-hidden group"
              style={{
                background: 'linear-gradient(145deg, #1E0101 0%, #2D0505 100%)',
                border: '1px solid #D4AF3725',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.35)' }} />

              {/* Top accent line */}
              <div className="h-[2px] w-full"
                   style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

              <div className="p-6 md:p-8">
                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}
                  >
                    {getEventIcon(event.title)}
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-white leading-tight"
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      {event.title}
                    </h3>
                    {event.note && (
                      <p className="text-gray-500 text-xs mt-1 font-light italic">"{event.note}"</p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Calendar size={14} className="shrink-0" style={{ color: '#D4AF3760' }} />
                    <span className="font-light">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock size={14} className="shrink-0" style={{ color: '#D4AF3760' }} />
                    <span className="font-light">{event.time}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: '#D4AF3760' }} />
                    <span className="font-light">{event.venue}</span>
                  </div>
                  {event.dressCode && (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Shirt size={14} className="shrink-0" style={{ color: '#D4AF3760' }} />
                      <span className="font-light">{event.dressCode}</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-[1px] mb-5"
                     style={{ background: 'linear-gradient(to right, transparent, #D4AF3720, transparent)' }} />

                {/* Map Link */}
                {event.mapLink && (
                  <a
                    href={event.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300"
                    style={{
                      background: 'rgba(212,175,55,0.1)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      color: '#D4AF37',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.2)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.1)';
                    }}
                  >
                    <MapPin size={12} />
                    View on Maps
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
