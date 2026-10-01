/**
 * ARIXON COMPANY CONFIGURATION (100% REAL DATA)
 * Editable configuration for founder details, company sections,
 * legal information, technology marquee, and verified metrics.
 */

export interface WhyArixonPoint {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export interface HowWeWorkStep {
  step: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export interface CompanyConfig {
  siteUrl: string;
  effectiveDate: string;
  companyName: {
    en: string;
    ar: string;
  };
  founder: {
    nameEn: string;
    nameAr: string;
    titleEn: string;
    titleAr: string;
    email: string;
    whatsapp: string;
    whatsappRaw: string;
    photoUrl: string;
  };
  techMarquee: string[];
  whyArixon: WhyArixonPoint[];
  howWeWork: HowWeWorkStep[];
  realStats: {
    id: string;
    value: string;
    label: {
      en: string;
      ar: string;
    };
    sublabel: {
      en: string;
      ar: string;
    };
  }[];
  socialLinks: {
    instagram: string;
    facebook: string;
    github: string;
    whatsappUrlEn: string;
    whatsappUrlAr: string;
  };
}

export const COMPANY_CONFIG: CompanyConfig = {
  siteUrl: 'https://arixon.app',
  effectiveDate: '2026-01-01',
  companyName: {
    en: 'Arixon',
    ar: 'اريكسون',
  },
  founder: {
    nameEn: 'Omar Shorab',
    nameAr: 'عمر شراب',
    titleEn: 'Founder & Lead Systems Architect',
    titleAr: 'المؤسس ورئيس مهندسي الأنظمة',
    email: 'omarsharrabx99@gmail.com',
    whatsapp: '+970 594 399 472',
    whatsappRaw: '970594399472',
    photoUrl: 'https://cdn.phototourl.com/member/2026-09-29-8aab535d-3337-4a46-93f8-aa76819618fc.png',
  },
  techMarquee: ['Firebase', 'Gemini AI', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'PostgreSQL'],
  whyArixon: [
    {
      id: 'tailored',
      title: {
        en: 'Tailored to Your Business',
        ar: 'مُصممة خصيصاً لاحتياج أعمالك',
      },
      description: {
        en: 'Every system is engineered to match your exact business workflow without rigid software limitations.',
        ar: 'نُطور كل نظام ليلائم دورة عملك الخاصة وطبيعة نشاطك بدقة، دون قيود القوالب الجاهزة.',
      },
    },
    {
      id: 'direct-founder',
      title: {
        en: 'Direct Line to the Founder',
        ar: 'تواصل مباشر مع المؤسس',
      },
      description: {
        en: 'Zero sales middlemen. You plan and execute directly with the lead engineer and founder from day one.',
        ar: 'لا وجود لوسطاء أو مندوبي مبيعات؛ تخطيط وتنفيذ مباشر مع المؤسس ومهندس الأنظمة منذ اللحظة الأولى.',
      },
    },
    {
      id: 'firebase-speed',
      title: {
        en: 'Modern, Fast & Secure on Firebase',
        ar: 'بنية حديثة، فائقة السرعة وآمنة على Firebase',
      },
      description: {
        en: 'Built on Google Cloud & Firebase for sub-second responses, instant synchronization, and enterprise security.',
        ar: 'معمارية سحابية متقدمة على Google Cloud وFirebase لسرعة معالجة فورية وأمان بيانات معتمد.',
      },
    },
    {
      id: 'native-bilingual',
      title: {
        en: 'Native Arabic RTL & English LTR',
        ar: 'دعم كامل ومتكافئ للغتين (عربي/إنجليزي)',
      },
      description: {
        en: 'First-class bilingual user experience crafted natively for local Arab enterprises and international standards.',
        ar: 'تجربة مستخدم حقيقية صُممت أصلاً للشركات والمؤسسات العربية مع معايير برمجية عالمية.',
      },
    },
  ],
  howWeWork: [
    {
      step: '01',
      title: {
        en: 'Discuss',
        ar: 'دراسة ونقاش',
      },
      description: {
        en: 'We dissect your exact operational needs, bottlenecks, and timeline to design a solution tailored to your team.',
        ar: 'نجلس معك لتحليل متطلبات أعمالك ونقاط التحدي ووضع خارطة طريق واضحة ومحددة.',
      },
    },
    {
      step: '02',
      title: {
        en: 'Design',
        ar: 'تصميم وهندسة',
      },
      description: {
        en: 'We create clean, functional interface architectures ensuring fast workflows for your staff and customers.',
        ar: 'رسم هندسي وتصميم لشاشات النظام لضمان سهولة وسرعة العمل للموظفين والعملاء.',
      },
    },
    {
      step: '03',
      title: {
        en: 'Build',
        ar: 'بناء وبرمجة',
      },
      description: {
        en: 'High-performance software development with clean code, offline resilience, and Firebase cloud persistence.',
        ar: 'تطوير الأنظمة بأحدث التقنيات مع دعم العمل دون إنترنت والتكامل السحابي المباشر.',
      },
    },
    {
      step: '04',
      title: {
        en: 'Launch & Support',
        ar: 'إطلاق ودعم مستمر',
      },
      description: {
        en: 'Smooth deployment to production, direct team training, and continuous technical support.',
        ar: 'تشغيل النظام فعلياً في مقرك، تدريب فريقك، وتقديم دعم فني ومتابعة دورية مستمرة.',
      },
    },
  ],
  realStats: [
    {
      id: 'apps-built',
      value: '5',
      label: {
        en: 'Flagship Systems Built',
        ar: 'تطبيقات وأنظمة رئيسية منجزة',
      },
      sublabel: {
        en: 'Production-ready software architectures',
        ar: 'أنظمة برمجية جاهزة وتعمل في بيئات حقيقية',
      },
    },
  ],
  socialLinks: {
    instagram: 'https://www.instagram.com/omarshurrab.1',
    facebook: 'https://www.facebook.com/share/1JB2eN8tBr/',
    github: 'https://github.com/omarkingx98-beep',
    whatsappUrlEn: 'https://wa.me/970594399472?text=Hello%2C%20I%27d%20like%20to%20request%20a%20project%20with%20Arixon.',
    whatsappUrlAr: 'https://wa.me/970594399472?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%B7%D9%84%D8%A8%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%A3%D9%88%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D8%A7%D8%AA%20%D8%A7%D8%B1%D9%8A%D9%83%D8%B3%D9%88%D9%86.',
  },
};
