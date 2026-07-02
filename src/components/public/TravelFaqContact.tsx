'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, HelpCircle, PhoneCall, Share2, ChevronDown, Heart } from 'lucide-react';
import { TravelDetails, FAQItem, ContactDetails } from '@/lib/types';

interface TravelFaqContactProps {
  travel: TravelDetails;
  faqs: FAQItem[];
  contact: ContactDetails;
  brideName: string;
  groomName: string;
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="py-4 border-b select-none last:border-b-0"
      style={{ borderColor: 'rgba(212,175,55,0.12)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-light text-gray-200 text-base md:text-lg pr-4 select-text leading-snug">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
          style={{ color: '#D4AF37' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm leading-relaxed mt-3 pr-4 select-text">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SectionHeading = ({ label, title }: { label: string; title: string }) => (
  <div className="text-center mb-12">
    <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-light" style={{ color: '#D4AF3770' }}>{label}</p>
    <h2
      className="text-2xl md:text-4xl font-bold mb-4"
      style={{
        fontFamily: 'var(--font-cinzel)',
        background: 'linear-gradient(135deg, #C9A227, #F3E5AB, #D4AF37)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {title}
    </h2>
    <div className="w-12 h-[2px] mx-auto" style={{ background: 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)' }} />
  </div>
);

export default function TravelFaqContact({ travel, faqs, contact, brideName, groomName }: TravelFaqContactProps) {
  const handleWhatsAppShare = () => {
    const inviteText = `You are cordially invited to the wedding celebration of ${brideName} & ${groomName}. View the invitation card, schedule, and RSVP here: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText)}`;
    window.open(url, '_blank');
  };

  return (
    <section
      className="relative text-white"
      style={{ background: 'linear-gradient(180deg, #0D0101 0%, #1A0202 50%, #0D0101 100%)' }}
    >
      {/* Separator top */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
           style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      <div className="max-w-4xl mx-auto px-6 py-24 space-y-24">
        {/* Travel and Stay Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="travel"
          className="rounded-2xl relative overflow-hidden p-8 md:p-12"
          style={{
            background: 'linear-gradient(145deg, #1E0101, #2D0505)',
            border: '1px solid rgba(212,175,55,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div className="h-[2px] absolute top-0 inset-x-0"
               style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <Plane style={{ color: '#D4AF37' }} size={18} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white select-text"
                style={{ fontFamily: 'var(--font-cinzel)' }}>
              Travel & Lodging
            </h3>
          </div>
          <div className="w-12 h-[1px] mb-6" style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }} />
          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line select-text font-light">
            {travel.details}
          </p>
        </motion.div>

        {/* FAQs Section */}
        <div id="faq">
          <SectionHeading label="Common Questions" title="Frequently Asked" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 md:p-10"
            style={{
              background: 'linear-gradient(145deg, #1E0101, #2D0505)',
              border: '1px solid rgba(212,175,55,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {faqs.map((item) => (
              <FAQAccordionItem key={item.id} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Coordinators & Contacts Section */}
        <div id="contact">
          <SectionHeading label="Need Help?" title="Contact Us" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Bride Side Coordinator', number: contact.brideCoordinator, note: "For guest assistance, room keys, and transport on the bride's side" },
              { title: 'Groom Side Coordinator', number: contact.groomCoordinator, note: "For guest assistance, room keys, and transport on the groom's side" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1E0101, #2D0505)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                <div className="h-[1px] absolute top-0 inset-x-0"
                     style={{ background: 'linear-gradient(to right, transparent, #D4AF3740, transparent)' }} />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <PhoneCall style={{ color: '#D4AF37' }} size={16} />
                    <h4 className="text-base font-bold text-white select-text"
                        style={{ fontFamily: 'var(--font-cinzel)' }}>{c.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 select-text font-light">{c.note}:</p>
                </div>
                <a
                  href={`tel:${c.number}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.35)',
                    color: '#D4AF37',
                  }}
                >
                  <PhoneCall size={12} />
                  Call Coordinator
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WhatsApp Share CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 text-center flex flex-col items-center"
          style={{
            background: 'linear-gradient(145deg, #1E0101, #2D0505)',
            border: '1px solid rgba(212,175,55,0.15)',
          }}
        >
          <h4 className="text-lg font-bold text-white mb-2 select-text"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
            Invite Family & Friends
          </h4>
          <p className="text-gray-500 text-xs md:text-sm mb-6 max-w-md select-text font-light">
            Share this beautiful wedding invitation microsite link directly with your guests via WhatsApp.
          </p>
          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-xs shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <Share2 size={14} />
            Share on WhatsApp
          </button>
        </motion.div>
      </div>

      {/* Signature Footer */}
      <footer
        className="py-16 text-center"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}
      >
        <div className="mb-8">
          <div
            className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A227, #F3E5AB, #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <span>{brideName}</span>
            <Heart size={20} fill="#D4AF37" style={{ WebkitTextFillColor: '#D4AF37', color: '#D4AF37' }} className="animate-pulse shrink-0" />
            <span>{groomName}</span>
          </div>
          <p className="text-gray-600 text-sm max-w-sm mx-auto font-light italic leading-relaxed select-text px-4">
            "Two souls with but a single thought, two hearts that beat as one."
          </p>
        </div>
        <p className="text-xs tracking-[0.35em] uppercase font-light" style={{ color: '#D4AF3750' }}>
          Shubh Vivah · 2026
        </p>
      </footer>
    </section>
  );
}
