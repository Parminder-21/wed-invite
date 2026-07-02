import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// This route seeds the database with initial data.
// Visit /api/seed?secret=SEED_SECRET after first deployment.
// Then delete or secure this file.

const SEED_SECRET = process.env.SEED_SECRET || 'seed-me-now-2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== SEED_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized. Pass ?secret=YOUR_SEED_SECRET' },
      { status: 401 }
    );
  }

  const prisma = new PrismaClient();

  try {
    // Check if already seeded
    const existing = await prisma.admin.findFirst();
    if (existing) {
      await prisma.$disconnect();
      return NextResponse.json({
        message: 'Database already seeded.',
        admin: existing.username,
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });

    // Create default site config
    const defaultConfig = {
      couple: {
        bride: 'Meenal',
        groom: 'Avinash',
        brideParents: 'Mr. & Mrs. Sharma',
        groomParents: 'Mr. & Mrs. Verma',
        announcement: 'Together with their families, they joyfully invite you to celebrate their union.',
      },
      blessing: {
        mantra: 'ॐ गणेशाय नमः',
        translation: 'We bow to Lord Ganesha, the remover of obstacles, who blesses all new beginnings.',
      },
      weddingDate: '2026-12-10T00:00:00.000Z',
      events: [
        {
          id: 'evt-1',
          title: 'Haldi Ceremony',
          date: '2026-12-08',
          time: '10:00 AM',
          venue: 'Sharma Residence, Jaipur',
          dressCode: 'Yellow / Pastel shades',
          mapLink: 'https://maps.google.com',
          note: 'Come ready to get yellow!',
        },
        {
          id: 'evt-2',
          title: 'Mehendi & Sangeet',
          date: '2026-12-09',
          time: '6:00 PM',
          venue: 'The Grand Ballroom, Jaipur',
          dressCode: 'Ethnic / Lehenga / Sherwani',
          mapLink: 'https://maps.google.com',
          note: 'An evening of music and dance',
        },
        {
          id: 'evt-3',
          title: 'Wedding Ceremony (Phere)',
          date: '2026-12-10',
          time: '11:00 AM (Mahurtham)',
          venue: 'Laxmi Narayan Temple Grounds, Jaipur',
          dressCode: 'Formal / Traditional Indian',
          mapLink: 'https://maps.google.com',
          note: 'Followed by a grand reception lunch',
        },
        {
          id: 'evt-4',
          title: 'Reception & Dinner',
          date: '2026-12-10',
          time: '7:00 PM',
          venue: 'The Grand Ballroom, Jaipur',
          dressCode: 'Formal / Cocktail attire',
          mapLink: 'https://maps.google.com',
          note: 'Celebration dinner with family & friends',
        },
      ],
      story: [
        {
          id: 'st-1',
          title: 'The First Meeting',
          date: 'January 2022',
          description: 'Two strangers sat next to each other at a friend\'s dinner party. By the end of the evening, they had talked for four hours straight.',
          image: '',
        },
        {
          id: 'st-2',
          title: 'Our First Date',
          date: 'March 2022',
          description: 'A walk through Lalbagh Garden that was meant to last an hour turned into an all-day adventure — chai, books, and endless laughter.',
          image: '',
        },
        {
          id: 'st-3',
          title: 'The Proposal',
          date: 'December 2025',
          description: 'Under the stars at Amer Fort, with their favourite song playing softly, he asked the question she had been hoping for.',
          image: '',
        },
      ],
      gallery: [],
      travel: {
        details: 'Jaipur is well connected by air, train, and road.\n\n✈️ By Air: Jaipur International Airport (JAI) — 30 minutes from venue.\n\n🚆 By Train: Jaipur Junction — 15 minutes from venue. Pre-paid taxis are available.\n\n🏨 Hotels: We have blocked rooms at Hotel Pearl Palace (5 min from venue). Mention "Meenal-Avinash Wedding" for a special rate.\n\nFor airport/railway pickup, please contact our coordinators.',
      },
      faqs: [
        {
          id: 'faq-1',
          question: 'Is there parking available at the venue?',
          answer: 'Yes, complimentary valet parking is available at all ceremony and reception venues.',
        },
        {
          id: 'faq-2',
          question: 'Will there be vegetarian food options?',
          answer: 'Yes! Our menu is primarily vegetarian. There will also be Jain-friendly options. Please specify your preference in the RSVP form.',
        },
        {
          id: 'faq-3',
          question: 'What should I wear?',
          answer: 'Each event has a suggested dress code — please refer to the Festivities section. For the wedding day, traditional Indian attire or formal wear is preferred.',
        },
        {
          id: 'faq-4',
          question: 'Can I bring children?',
          answer: 'Absolutely! Children are welcome at all ceremonies. We will have a small kids zone at the reception.',
        },
      ],
      contact: {
        brideCoordinator: '+91 98765 43210',
        groomCoordinator: '+91 91234 56789',
      },
      branding: {
        theme: 'royal-gold',
        primaryColor: '#800020',
        secondaryColor: '#D4AF37',
        accentColor: '#FAF9F6',
        fontHeader: 'Cinzel Decorative',
        fontBody: 'Outfit',
      },
      seo: {
        title: 'Meenal & Avinash — Wedding Invitation',
        description: 'Join us to celebrate the wedding of Meenal & Avinash. December 10, 2026 — Jaipur, India.',
        keywords: 'wedding, invitation, Meenal, Avinash, Jaipur, 2026',
      },
      sectionsVisibility: {
        devotionalOpening: true,
        saveTheDate: true,
        countdown: true,
        story: true,
        family: false,
        festivities: true,
        gallery: true,
        rsvp: true,
        travel: true,
        faq: true,
        contact: true,
      },
    };

    // Store each config key separately
    for (const [key, value] of Object.entries(defaultConfig)) {
      await prisma.siteConfig.create({
        data: {
          key,
          value: JSON.stringify(value),
        },
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully! Admin: admin / admin123',
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Seeding failed', details: String(error) },
      { status: 500 }
    );
  }
}
