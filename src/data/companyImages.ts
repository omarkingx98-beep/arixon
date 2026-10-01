export interface CompanyImage {
  id: string;
  url: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export const companyImages: CompanyImage[] = [
  {
    id: 'hq-exterior',
    url: 'https://i.ibb.co/KxRY8gr2/file-00000000d44c8210834ffe82785bb3dd.png',
    title: {
      en: 'Arixon Headquarters',
      ar: 'مقر اريكسون',
    },
    description: {
      en: 'The face of Arixon: a modern building where our team designs and builds smart business and education apps.',
      ar: 'واجهة اريكسون: مبنى عصري يصمم ويبني فيه فريقنا تطبيقات ذكية للأعمال والتعليم.',
    },
  },
  {
    id: 'reception',
    url: 'https://i.ibb.co/MxCH8XVz/file-0000000088fc8210b299c2a83d2235b2.png',
    title: {
      en: 'Reception',
      ar: 'الاستقبال',
    },
    description: {
      en: 'Where clients are welcomed and their projects begin, from first idea to first meeting.',
      ar: 'المكان الذي نستقبل فيه عملاءنا وتبدأ منه مشاريعهم، من الفكرة الأولى حتى أول اجتماع.',
    },
  },
  {
    id: 'software-studio',
    url: 'https://i.ibb.co/whtSR6YM/file-000000002e688210bce6e6bb9ba26d09.png',
    title: {
      en: 'Software Studio',
      ar: 'استوديو البرمجة',
    },
    description: {
      en: 'The development floor where POS systems, management platforms, and AI apps are designed, coded, and tested.',
      ar: 'قسم التطوير حيث تُصمم وتُبرمج وتُختبر أنظمة الكاشير ومنصات الإدارة وتطبيقات الذكاء الاصطناعي.',
    },
  },
  {
    id: 'meeting-room',
    url: 'https://i.ibb.co/TBCqB2Gm/file-000000006e84820aa57b2dbef965013a.png',
    title: {
      en: 'Meeting Room',
      ar: 'قاعة الاجتماعات',
    },
    description: {
      en: 'Where we sit with clients to plan features, review progress, and agree on the next steps.',
      ar: 'نجتمع فيها مع العملاء لتخطيط المزايا ومراجعة التقدم والاتفاق على الخطوات القادمة.',
    },
  },
  {
    id: 'hq-dusk',
    url: 'https://i.ibb.co/F4sCW9jL/file-00000000469881f4be02645efedc298f.png',
    title: {
      en: 'Arixon at Dusk',
      ar: 'اريكسون عند الغروب',
    },
    description: {
      en: 'The same headquarters in the evening light, a look at the atmosphere we work in.',
      ar: 'المقر نفسه في ضوء المساء، لمحة من الأجواء التي نعمل فيها.',
    },
  },
];

// Company stats & performance indicators configuration
export interface CompanyStatItem {
  id: string;
  value: string;
  numericTarget?: number;
  label: {
    en: string;
    ar: string;
  };
  sublabel: {
    en: string;
    ar: string;
  };
  trend?: string;
  isPositiveTrend?: boolean;
}

export const COMPANY_STATS: CompanyStatItem[] = [
  {
    id: 'apps-built',
    value: '5',
    numericTarget: 5,
    label: {
      en: 'Flagship Systems Built',
      ar: 'تطبيقات وأنظمة منجزة',
    },
    sublabel: {
      en: 'POS, Centers, AI & Community Platforms',
      ar: 'نقاط بيع، مراكز، ذكاء اصطناعي ومنصات',
    },
    trend: '+100%',
    isPositiveTrend: true,
  },
  {
    id: 'founded',
    value: '2024',
    numericTarget: 2024,
    label: {
      en: 'Founded & Established',
      ar: 'سنة التأسيس والانطلاق',
    },
    sublabel: {
      en: 'Continuous architecture and growth',
      ar: 'بداية رحلة الابتكار وتطوير الأنظمة',
    },
  },
  {
    id: 'team-size',
    value: '8+',
    numericTarget: 8,
    label: {
      en: 'Specialized Engineers & Team',
      ar: 'فريق العمل والمهندسين',
    },
    sublabel: {
      en: 'Software architects, designers & QA',
      ar: 'مهندسو برمجيات، مصممو واجهات ودعم',
    },
    trend: '+60%',
    isPositiveTrend: true,
  },
  {
    id: 'profit-growth',
    value: '+142%',
    numericTarget: 142,
    label: {
      en: 'Annual Revenue & Growth Trend',
      ar: 'مؤشر نمو الأرباح والعوائد',
    },
    sublabel: {
      en: 'High efficiency, recurring clients',
      ar: 'تصاعد سنوي مستمر ومشاريع ناجحة',
    },
    trend: '↗ +142%',
    isPositiveTrend: true,
  },
  {
    id: 'pricing-plans',
    value: '4',
    numericTarget: 4,
    label: {
      en: 'System Pricing Tiers',
      ar: 'باقات الأسعار والأنظمة',
    },
    sublabel: {
      en: 'POS, Academies, Custom Cloud & AI',
      ar: 'باقات متدرجة تناسب المشاريع والشركات',
    },
    trend: 'Bespoke',
    isPositiveTrend: true,
  },
];
