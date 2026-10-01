export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export type AppCategory = 'all' | 'business' | 'ai' | 'education' | 'social';

export interface PortfolioApp {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  tagline: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  longDescription: {
    en: string;
    ar: string;
  };
  category: 'business' | 'ai' | 'education' | 'social';
  categoryLabel: {
    en: string;
    ar: string;
  };
  keyMetric: {
    en: string;
    ar: string;
  };
  features: {
    en: string[];
    ar: string[];
  };
  techStack: string[];
  mockupType:
    | 'pos'
    | 'store'
    | 'warehouse'
    | 'ai_gen'
    | 'social_tool'
    | 'school'
    | 'stats'
    | 'clinic'
    | 'restaurant'
    | 'logistics';
  previewColor: string;
  badge?: {
    en: string;
    ar: string;
  };
  year: string;
  status: 'production' | 'featured' | 'deployed';
  screenshotUrl?: string;
  links?: {
    github?: string;
    liveDemo?: string;
    [key: string]: string | undefined;
  };
  githubUrl?: string;
  liveDemoUrl?: string;
  repoName?: string;
}

export interface ServiceItem {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  iconName: 'Store' | 'Cpu' | 'Palette' | 'GraduationCap' | 'Code' | 'Boxes';
  deliverables: {
    en: string[];
    ar: string[];
  };
  highlightTag: {
    en: string;
    ar: string;
  };
}

export interface ContactChannel {
  id: string;
  label: { en: string; ar: string };
  value: string;
  href: string;
  actionText: { en: string; ar: string };
  type: 'whatsapp' | 'email' | 'instagram' | 'phone';
}
