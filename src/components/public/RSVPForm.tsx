'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Phone, Mail, Users, Utensils, MessageSquare, Music } from 'lucide-react';
import { EventDetail } from '@/lib/types';

interface RSVPFormProps {
  events: EventDetail[];
}

export default function RSVPForm({ events }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    attending: true,
    guestsCount: 1,
    mealPreference: 'Vegetarian',
    eventsAttending: events.map((e) => e.title), // Pre-check all by default
    songRequest: '',
    advice: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleEventCheck = (eventTitle: string) => {
    setFormData((prev) => {
      const current = [...prev.eventsAttending];
      if (current.includes(eventTitle)) {
        return { ...prev, eventsAttending: current.filter((t) => t !== eventTitle) };
      } else {
        return { ...prev, eventsAttending: [...current, eventTitle] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // If declining, set guests count and event list to defaults
          guestsCount: formData.attending ? formData.guestsCount : 0,
          eventsAttending: formData.attending ? formData.eventsAttending : [],
          mealPreference: formData.attending ? formData.mealPreference : null,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccess(true);
      } else {
        setError(resData.error || 'Failed to submit RSVP. Please try again.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 relative overflow-hidden text-white" style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}>
      {/* Separator lines */}
      <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-3xl mx-auto relative z-10 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light"
            style={{ color: '#D4AF3770' }}
          >
            Will You Join Us?
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
            RSVP
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-[2px] mx-auto mb-4"
            style={{ background: 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)' }}
          />
          <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wider font-light">
            Kindly respond by November 15, 2026
          </p>
        </div>

        {/* Success Card */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-[#1E0101] rounded-2xl p-8 md:p-12 text-center border-2 border-[#D4AF37] shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="text-[#800020]" size={64} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#800020] mb-4">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto select-text">
                Your response has been saved. We are thrilled to celebrate this special day with you!
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    attending: true,
                    guestsCount: 1,
                    mealPreference: 'Vegetarian',
                    eventsAttending: events.map((e) => e.title),
                    songRequest: '',
                    advice: '',
                  });
                }}
                className="px-6 py-2.5 bg-[#800020] hover:bg-[#A30029] text-white rounded-full font-semibold uppercase tracking-wider text-xs transition-colors"
              >
                Submit another RSVP
              </button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 md:p-10 space-y-6"
              style={{
                background: 'linear-gradient(145deg, #1E0101, #2D0505)',
                border: '1px solid rgba(212,175,55,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {error && (
                <div className="text-red-400 p-4 rounded-lg text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  {error}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                    <User size={13} style={{ color: '#D4AF37' }} />
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Guest Name"
                    className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                    <Phone size={13} style={{ color: '#D4AF37' }} />
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                  <Mail size={13} style={{ color: '#D4AF37' }} />
                  Email Address <span className="text-gray-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. guest@example.com"
                  className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
                />
              </div>

              {/* Attending Toggle */}
              <div className="flex flex-col">
                <label className="text-xs uppercase font-semibold mb-3" style={{ color: '#D4AF3780' }}>
                  Will you attend?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: true })}
                    className="py-3 rounded-lg font-semibold text-sm transition-all"
                    style={formData.attending
                      ? { background: 'linear-gradient(135deg, #D4AF37, #AA7C11)', color: '#1A0202', border: '1px solid #D4AF37' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(212,175,55,0.15)' }}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: false })}
                    className="py-3 rounded-lg font-semibold text-sm transition-all"
                    style={!formData.attending
                      ? { background: 'linear-gradient(135deg, #D4AF37, #AA7C11)', color: '#1A0202', border: '1px solid #D4AF37' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(212,175,55,0.15)' }}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Dynamic Attending Sections */}
              <AnimatePresence initial={false}>
                {formData.attending && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden space-y-6"
                  >
                    <div className="h-[1px] my-4" style={{ background: 'rgba(212,175,55,0.15)' }} />

                    {/* Guests & Food */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                          <Users size={13} style={{ color: '#D4AF37' }} />
                          Number of Guests
                        </label>
                        <select
                          value={formData.guestsCount}
                          onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                          className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', color: 'white' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n} style={{ background: '#1A0202' }}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                          <Utensils size={13} style={{ color: '#D4AF37' }} />
                          Meal Preference
                        </label>
                        <select
                          value={formData.mealPreference}
                          onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                          className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', color: 'white' }}
                        >
                          <option value="Vegetarian" style={{ background: '#1A0202' }}>Pure Vegetarian</option>
                          <option value="Non-Vegetarian" style={{ background: '#1A0202' }}>Non-Vegetarian</option>
                          <option value="Jain" style={{ background: '#1A0202' }}>Jain food</option>
                          <option value="Vegan" style={{ background: '#1A0202' }}>Vegan</option>
                        </select>
                      </div>
                    </div>

                    {/* Event-Wise Attendance checks */}
                    <div className="flex flex-col">
                      <label className="text-xs uppercase font-semibold mb-3" style={{ color: '#D4AF3780' }}>
                        Select events you will attend:
                      </label>
                      <div className="space-y-3">
                        {events.map((e) => {
                          const checked = formData.eventsAttending.includes(e.title);
                          return (
                            <div
                              key={e.id}
                              onClick={() => handleEventCheck(e.title)}
                              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer select-none transition-all"
                              style={checked
                                ? { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)' }
                                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              <div
                                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                                style={checked
                                  ? { background: '#D4AF37', border: '1px solid #D4AF37' }
                                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                              >
                                {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#1A0202" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-white font-light">{e.title}</span>
                                <span className="text-[10px] font-normal" style={{ color: '#D4AF3760' }}>
                                  {e.date} • {e.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Song Request */}
                    <div className="flex flex-col">
                      <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                        <Music size={13} style={{ color: '#D4AF37' }} />
                        Song Request <span className="font-normal text-gray-600">(Get it played at Sangeet!)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.songRequest}
                        onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                        placeholder="Song Title / Artist Name"
                        className="rounded-lg px-4 py-3 text-sm outline-none transition-colors text-white placeholder-gray-600"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Advice / Wishes */}
              <div className="flex flex-col">
                <label className="text-xs uppercase font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#D4AF3780' }}>
                  <MessageSquare size={13} style={{ color: '#D4AF37' }} />
                  Blessings & Advice for the Couple
                </label>
                <textarea
                  rows={3}
                  value={formData.advice}
                  onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
                  placeholder="Share your warm wishes, congratulations, or marriage tips..."
                  className="rounded-lg px-4 py-3 text-sm outline-none resize-none transition-colors text-white placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA7C11 100%)',
                  color: '#1A0202',
                  boxShadow: loading ? 'none' : '0 8px 30px rgba(212,175,55,0.3)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting response...
                  </>
                ) : (
                  'Submit RSVP Response'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
