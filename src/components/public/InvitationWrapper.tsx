'use client';

import { useState } from 'react';
import { WeddingConfig } from '@/lib/types';
import DevotionalOpening from './DevotionalOpening';
import Hero from './Hero';
import SaveTheDate from './SaveTheDate';
import Countdown from './Countdown';
import StoryTimeline from './StoryTimeline';
import EventSchedule from './EventSchedule';
import GalleryLightbox from './GalleryLightbox';
import RSVPForm from './RSVPForm';
import BackgroundMusic from './BackgroundMusic';
import TravelFaqContact from './TravelFaqContact';
import Link from 'next/link';

interface InvitationWrapperProps {
  config: WeddingConfig;
}

export default function InvitationWrapper({ config }: InvitationWrapperProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [playMusicTrigger, setPlayMusicTrigger] = useState(false);

  const { sectionsVisibility, couple, weddingDate, story, events, gallery, travel, faqs, contact } = config;

  const handleEnter = (playMusic: boolean) => {
    setHasEntered(true);
    setPlayMusicTrigger(playMusic);
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#0D0101' }}>
      {/* Devotional entry overlay */}
      {sectionsVisibility.devotionalOpening && (
        <DevotionalOpening
          mantra={config.blessing.mantra}
          translation={config.blessing.translation}
          onEnter={handleEnter}
        />
      )}

      {/* Main Content (faded/hidden until user enters or if devotional opening is turned off) */}
      <div className={`transition-opacity duration-1000 ${(!sectionsVisibility.devotionalOpening || hasEntered) ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        
        {/* Hero Section */}
        <Hero config={config} />

        {/* Save The Date Reveal */}
        {sectionsVisibility.saveTheDate && (
          <SaveTheDate weddingDateStr={weddingDate} />
        )}

        {/* Countdown */}
        {sectionsVisibility.countdown && (
          <Countdown targetDateStr={weddingDate} />
        )}

        {/* Story Timeline */}
        {sectionsVisibility.story && (
          <StoryTimeline story={story} />
        )}

        {/* Ceremonies & Schedule */}
        {sectionsVisibility.festivities && (
          <EventSchedule events={events} />
        )}

        {/* Gallery */}
        {sectionsVisibility.gallery && (
          <GalleryLightbox gallery={gallery} />
        )}

        {/* RSVP Card */}
        {sectionsVisibility.rsvp && (
          <RSVPForm events={events} />
        )}

        {/* Travel, FAQ, Contact Details */}
        <TravelFaqContact
          travel={travel}
          faqs={faqs}
          contact={contact}
          brideName={couple.bride}
          groomName={couple.groom}
        />

        {/* Floating Audio controller */}
        <BackgroundMusic autoPlayTrigger={playMusicTrigger} />

        {/* Discreet Admin Link Footer */}
        <div className="py-6 text-center bg-[#0D0101] border-t border-[#1E0101] mt-8">
          <Link href="/admin/login" className="text-xs text-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors font-sans tracking-widest uppercase">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
