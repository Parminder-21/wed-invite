export interface CoupleDetails {
  bride: string;
  groom: string;
  brideParents: string;
  groomParents: string;
  announcement: string;
}

export interface BlessingDetails {
  mantra: string;
  translation: string;
}

export interface EventDetail {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  dressCode: string;
  mapLink: string;
  note: string;
}

export interface StoryTimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export interface TravelDetails {
  details: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactDetails {
  brideCoordinator: string;
  groomCoordinator: string;
}

export interface BrandingDetails {
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeader: string;
  fontBody: string;
}

export interface SEODetails {
  title: string;
  description: string;
  keywords: string;
}

export interface SectionsVisibility {
  devotionalOpening: boolean;
  saveTheDate: boolean;
  countdown: boolean;
  story: boolean;
  family: boolean;
  festivities: boolean;
  gallery: boolean;
  rsvp: boolean;
  travel: boolean;
  faq: boolean;
  contact: boolean;
}

export interface WeddingConfig {
  couple: CoupleDetails;
  blessing: BlessingDetails;
  weddingDate: string;
  events: EventDetail[];
  story: StoryTimelineItem[];
  gallery: GalleryItem[];
  travel: TravelDetails;
  faqs: FAQItem[];
  contact: ContactDetails;
  branding: BrandingDetails;
  seo: SEODetails;
  sectionsVisibility: SectionsVisibility;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  attending: boolean;
  guestsCount: number;
  mealPreference: string | null;
  eventsAttending: string; // JSON string of events
  songRequest: string | null;
  advice: string | null;
  createdAt: string;
}

