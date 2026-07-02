import prisma from './db';
import { WeddingConfig } from './types';

export const DEFAULT_WEDDING_DATA: WeddingConfig = {
  couple: {
    bride: 'Meenal',
    groom: 'Avinash',
    brideParents: 'Mrs. Anjana & Mr. Santosh Sahu',
    groomParents: 'Mrs. Rekha & Mr. Ramesh Patel',
    announcement: 'With the blessings of Shri Ganesh and our beloved families, we invite you to share in our joy and celebrate the beginning of our forever.',
  },
  blessing: {
    mantra: '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    translation: 'O Lord Ganesha, of curved trunk, large body, and brilliance of a million suns, please make all my works free of obstacles, always.',
  },
  weddingDate: '2026-12-18T16:00:00.000Z', // Dec 18, 2026 at 4:00 PM UTC
  events: [
    {
      id: '1',
      title: 'Haldi Ceremony',
      date: '2026-12-17',
      time: '10:00 AM',
      venue: 'Shubh Vatika Resorts, Jaipur',
      dressCode: 'Sun-kissed Yellows / Traditional Wear',
      mapLink: 'https://maps.google.com/?q=Shubh+Vatika+Resorts+Jaipur',
      note: 'Start the celebrations with a splash of turmeric, love, and laughter!',
    },
    {
      id: '2',
      title: 'Sangeet & Ring Ceremony',
      date: '2026-12-17',
      time: '06:30 PM',
      venue: 'Grand Palace Banquet Hall, Jaipur',
      dressCode: 'Glittery Indo-Western / Ethnic Glam',
      mapLink: 'https://maps.google.com/?q=Grand+Palace+Jaipur',
      note: 'Join us for an evening of music, dance, and rings! Bring your best moves.',
    },
    {
      id: '3',
      title: 'Phere (The Holy Wedding)',
      date: '2026-12-18',
      time: '04:00 PM',
      venue: 'Rajalakshmi Kalyana Mandapam, Jaipur',
      dressCode: 'Royal Traditional (Maroon, Gold, Ivory)',
      mapLink: 'https://maps.google.com/?q=Rajalakshmi+Kalyana+Mandapam+Jaipur',
      note: 'Witness the sacred vows and seven steps around the fire.',
    },
    {
      id: '4',
      title: 'Reception Dinner',
      date: '2026-12-19',
      time: '07:30 PM',
      venue: 'Hotel Rajvilas Palace lawns, Jaipur',
      dressCode: 'Formal Suits / Evening Gowns',
      mapLink: 'https://maps.google.com/?q=Hotel+Rajvilas+Jaipur',
      note: 'An elegant night of dinner, drinks, and blessings.',
    },
  ],
  story: [
    {
      id: '1',
      title: 'How We Met',
      date: 'January 2024',
      description: 'It all started in a cozy heritage cafe in Jaipur. A spilled cup of masala chai and a shared laugh led to an endless conversation that never really stopped.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'The Proposal',
      date: 'August 2024',
      description: 'Underneath a starry sky at the historic Nahargarh Fort overlooking the pink city, Avinash popped the question, and Meenal, with tears of joy, said YES!',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'The Ring Ceremony Planning',
      date: 'December 2025',
      description: 'Months of planning, endless shopping trips, color-matching swatches, and choosing the perfect invitation card brought us closer and closer to our big day.',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop',
    },
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop', caption: 'The First Steps' },
    { id: '2', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', caption: 'Vibrant Colors' },
    { id: '3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop', caption: 'Groom & Bride' },
    { id: '4', url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=800&auto=format&fit=crop', caption: 'Elegant Details' },
    { id: '5', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', caption: 'Joyful Moments' },
    { id: '6', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=800&auto=format&fit=crop', caption: 'Together Forever' },
  ],
  travel: {
    details: 'Jaipur (The Pink City) is well-connected by air, rail, and road. The nearest airport is Jaipur International Airport (JAI), about 25 minutes from the venues. Railway stations: Jaipur Junction (JP) and Gandhinagar Jaipur (GADJ). We have arranged dedicated shuttle services between the airport/railway stations and the hotels on December 16th & 17th. Accommodation for outstation guests is arranged at Hotel Rajvilas. For any travel assistance or flight bookings, please contact our Travel Coordinators: Sameer (+91 98765 00011) or Rahul (+91 98765 22233).',
  },
  faqs: [
    {
      id: '1',
      question: 'What is the dress code for each function?',
      answer: 'We would love to see you in traditional Indian attire! We have listed dress code recommendations (colors and styles) for each function under the Festivities section, but the most important thing is that you feel comfortable and ready to celebrate.',
    },
    {
      id: '2',
      question: 'How do I RSVP and what is the deadline?',
      answer: 'You can RSVP directly on this website using the RSVP form below. Please submit your response by November 15, 2026, so that we can finalize arrangements for food, transport, and lodging.',
    },
    {
      id: '3',
      question: 'Can I bring my children / family?',
      answer: 'Absolutely! Our wedding is a family event, and we want all our loved ones there. Just make sure to select the correct number of guests in the RSVP form so we can plan the catering and seating.',
    },
    {
      id: '4',
      question: 'Is there a gift registry?',
      answer: 'Your presence at our wedding is the most precious gift we could ask for! If you wish to bless us with a gift, a box will be placed at the reception desk at the wedding venue, or you can send your blessings virtually.',
    },
  ],
  contact: {
    brideCoordinator: '+91 98765 43210 (Rahul Sharma)',
    groomCoordinator: '+91 98765 01234 (Sameer Patel)',
  },
  branding: {
    theme: 'maroon',
    primaryColor: '#800020',
    secondaryColor: '#D4AF37',
    accentColor: '#FAF9F6',
    fontHeader: 'Cinzel Decorative',
    fontBody: 'Outfit',
  },
  seo: {
    title: 'Meenal & Avinash - Wedding Invitation',
    description: 'Join us in celebrating the holy matrimony of Meenal and Avinash on December 18, 2026, in Jaipur.',
    keywords: 'Meenal Avinash Wedding, Jaipur Wedding, Indian Wedding Invitation, Royal Wedding Invitation',
  },
  sectionsVisibility: {
    devotionalOpening: true,
    saveTheDate: true,
    countdown: true,
    story: true,
    family: true,
    festivities: true,
    gallery: true,
    rsvp: true,
    travel: true,
    faq: true,
    contact: true,
  },
};

export async function getWeddingConfig(): Promise<WeddingConfig> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: 'wedding_data' },
    });
    if (config) {
      return JSON.parse(config.value) as WeddingConfig;
    }
  } catch (error) {
    console.error('Error fetching wedding config from DB, returning default:', error);
  }
  return DEFAULT_WEDDING_DATA;
}

export async function saveWeddingConfig(data: WeddingConfig): Promise<boolean> {
  try {
    const updated = await prisma.siteConfig.upsert({
      where: { key: 'wedding_data' },
      update: { value: JSON.stringify(data) },
      create: { key: 'wedding_data', value: JSON.stringify(data) },
    });
    return !!updated;
  } catch (error) {
    console.error('Error saving wedding config to DB:', error);
    return false;
  }
}
