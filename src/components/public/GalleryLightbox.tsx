'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { GalleryItem } from '@/lib/types';

interface GalleryLightboxProps {
  gallery: GalleryItem[];
}

export default function GalleryLightbox({ gallery }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % gallery.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length);
  };

  // Varied heights for masonry feel
  const heights = ['h-56', 'h-72', 'h-64', 'h-80', 'h-60', 'h-72', 'h-56', 'h-64', 'h-80'];

  return (
    <section
      id="gallery"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Top/Bottom gradient separators */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
            style={{ color: '#D4AF3770' }}
          >
            Moments Captured Forever
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
            Gallery
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

        {/* Masonry / Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.06, duration: 0.7 }}
              className="relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                border: '1px solid rgba(212,175,55,0.15)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={item.url}
                alt={item.caption || 'Wedding moment'}
                className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                style={{ display: 'block' }}
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
                   style={{ background: 'rgba(13,1,1,0.7)' }}>
                <ZoomIn className="text-[#D4AF37] mb-2" size={28} />
                {item.caption && (
                  <p className="text-white text-sm font-light text-center px-4">{item.caption}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
            style={{ background: 'rgba(13,1,1,0.95)' }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white p-3 rounded-full transition-all"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <X size={20} className="text-[#D4AF37]" />
            </button>

            {/* Previous Button */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-8 p-3 rounded-full transition-all"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <ChevronLeft size={24} className="text-[#D4AF37]" />
            </button>

            {/* Active Image */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[selectedIndex].url}
                alt={gallery[selectedIndex].caption || 'Lightbox View'}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
                style={{ border: '1px solid rgba(212,175,55,0.2)' }}
              />
              {gallery[selectedIndex].caption && (
                <div className="text-center mt-5 px-6 text-white">
                  <p className="text-xs tracking-[0.35em] uppercase mb-1 font-light"
                     style={{ color: '#D4AF37' }}>Caption</p>
                  <p className="text-base md:text-lg font-light text-gray-300">
                    {gallery[selectedIndex].caption}
                  </p>
                </div>
              )}
              <p className="text-gray-600 text-xs mt-3">
                {selectedIndex + 1} / {gallery.length}
              </p>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-8 p-3 rounded-full transition-all"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <ChevronRight size={24} className="text-[#D4AF37]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
