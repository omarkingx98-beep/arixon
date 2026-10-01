import { PortfolioApp } from '../types';
import eduCentersMockup from '../assets/images/edu_centers_mockup_1790860395425.jpg';
import arixonAiMockup from '../assets/images/arixon_ai_mockup_1790860383673.jpg';
import arixonPosMockup from '../assets/images/arixon_pos_mockup_1790860371929.jpg';
import musallaMockup from '../assets/images/musalla_app_mockup_1790860361005.jpg';
import studentsStudiosMockup from '../assets/images/students_studios_mockup_1790860409176.jpg';

/**
 * OFFICIAL SOCIAL MEDIA & CONTACT CONFIGURATION (REAL LINKS)
 * Exclusively: Instagram, Facebook, WhatsApp, and GitHub.
 */
export const omarPhotoUrl =
  'https://cdn.phototourl.com/member/2026-09-29-8aab535d-3337-4a46-93f8-aa76819618fc.png';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/omarshurrab.1',
  facebook: 'https://www.facebook.com/share/1JB2eN8tBr/',
  whatsappNumber: '+970 594 399 472',
  whatsappRawNumber: '970594399472',
  whatsappUrlEn: 'https://wa.me/970594399472?text=Hello%2C%20I%27d%20like%20to%20ask%20about%20your%20apps.',
  whatsappUrlAr: 'https://wa.me/970594399472?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D8%A7%D8%AA%D9%83%D9%85%20%D9%88%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%D9%85.',
  github: 'https://github.com/omarkingx98-beep',
  email: 'omarsharrabx99@gmail.com',
  omarPhotoUrl,
  developerName: {
    en: 'Omar Shurrab',
    ar: 'عمر شراب',
  },
};

export interface AppConfigItem {
  id: string;
  nameAR: string;
  nameEN: string;
  descAR: string;
  descEN: string;
  features: {
    en: string[];
    ar: string[];
  };
  screenshotUrl?: string;
  links?: {
    github?: string;
    liveDemo?: string;
    [key: string]: string | undefined;
  };
}

/**
 * OFFICIAL 5 APPS CONFIGURATION
 * Exact, realistic descriptions strictly matching the real applications.
 */
export const appsConfig: AppConfigItem[] = [
  {
    id: 'edu-centers-management',
    nameAR: 'إدارة المراكز التعليمية',
    nameEN: 'Educational Centers Management',
    descAR: 'إدارة المراكز التعليمية (الطلاب، المعلمون، الصفوف والقاعات، الرسوم والأقساط، وتسجيل الحضور والغياب).',
    descEN: 'Managing educational centers (students, teachers, classes, fees, attendance).',
    screenshotUrl: eduCentersMockup,
    features: {
      ar: [
        'تسجيل وإدارة شؤون وبيانات الطلاب بالكامل',
        'متابعة المعلمين واحتساب نسب الحصص والأرباح',
        'تنظيم الصفوف والقاعات وجداول الحصص دون تضارب',
        'متابعة الرسوم المالية والأقساط وإصدار الإيصالات',
        'رصد الحضور والغياب اليومي للطلاب بدقة',
      ],
      en: [
        'Student enrollment and comprehensive record management',
        'Teacher management with automated class commission splits',
        'Classroom schedule matrix with conflict prevention',
        'Tuition fee ledger and automated receipt generation',
        'Daily student attendance logging and absent tracking',
      ],
    },
    links: {
      github: 'https://github.com/omarkingx98-beep/Arixon-Flow',
    },
  },
  {
    id: 'arixon-ai',
    nameAR: 'اريكسون للذكاء الاصطناعي',
    nameEN: 'Arixon AI',
    descAR: 'أدوات مدعومة بالذكاء الاصطناعي تشمل إنشاء وتوليد الصور لمنصات التواصل الاجتماعي.',
    descEN: 'AI-powered tools including social media image creation.',
    screenshotUrl: arixonAiMockup,
    features: {
      ar: [
        'توليد وتصميم صور احترافية لشبكات التواصل الاجتماعي',
        'أدوات مساعدة لمعالجة الأوامر باللغتين العربية والإنجليزية',
        'تصدير بمقاسات مخصصة (قصص، منشورات، أغلفة)',
        'تحسين جودة صور المنتجات والإضاءة بضغطة زر',
      ],
      en: [
        'AI-driven commercial image generation for social channels',
        'Arabic and English prompt engineering refinement',
        'Multi-aspect ratio presets (1:1, 9:16, 16:9)',
        'Commercial product visual enhancement and lighting control',
      ],
    },
    links: {
      github: 'https://github.com/omarkingx98-beep/erikson-ai',
    },
  },
  {
    id: 'arixon-pos',
    nameAR: 'اريكسون بي او اس (POS)',
    nameEN: 'Arixon POS',
    descAR: 'نظام كاشير متكامل للمحلات والمتاجر (المبيعات، المخزون، والتقارير المالية).',
    descEN: 'A complete cashier system for shops and stores (sales, inventory, reports).',
    screenshotUrl: arixonPosMockup,
    features: {
      ar: [
        'معالجة سريعة لعمليات البيع وقراءة الباركود',
        'مراقبة فورية للمخزون وحركة الأصناف والكميات',
        'تقارير يومية ودورية للمبيعات والأرباح والورديات',
        'دعم العمل دون إنترنت وطباعة الفواتير الحرارية',
      ],
      en: [
        'Sub-second transaction processing with barcode scanning',
        'Real-time inventory levels and SKU stock tracking',
        'Daily shift handovers, revenue reports, and sales audits',
        'Offline transaction persistence and ESC/POS thermal printing',
      ],
    },
    links: {
      github: 'https://github.com/omarkingx98-beep/erikson-pos',
    },
  },
  {
    id: 'musalla-sayyidna-muhammad',
    nameAR: 'مصلى سيدنا محمد',
    nameEN: 'Musalla Sayyidna Muhammad',
    descAR: 'تطبيق خاص بمصلى سيدنا محمد لمتابعة مواقيت الصلاة، الإعلانات، والأنشطة.',
    descEN: 'An app for the Musalla (prayer times, announcements, and activities).',
    screenshotUrl: musallaMockup,
    features: {
      ar: [
        'مواقيت دقيقة للصلوات الخمس وموعد الإقامة المعتمد',
        'لوحة إعلانات المصلى وتنبيهات الأنشطة لرواد المسجد',
        'جدول الدروس الأسبوعية وحلقات تحفيظ القرآن الكريم',
        'واجهة هادئة خالية تماماً من أي إعلانات مع أذكار يومية',
      ],
      en: [
        'Accurate daily prayer timetables and Iqamah countdown',
        'Mosque community announcements and notifications',
        'Weekly lessons schedule and Quran memorization circles',
        'Quiet, ad-free spiritual interface with daily Athkar',
      ],
    },
    links: {
      github: 'https://github.com/omarkingx98-beep/musalla-app',
    },
  },
  {
    id: 'arixon-students-studios',
    nameAR: 'استوديوهات طلاب اريكسون',
    nameEN: 'Arixon Students Studios',
    descAR: 'منصة طلابية متكاملة تشمل اختبارات إلكترونية، بنوك أسئلة وتمارين تدريبية.',
    descEN: 'Student platform with electronic exams, practice questions and exercises.',
    screenshotUrl: studentsStudiosMockup,
    features: {
      ar: [
        'اختبارات إلكترونية مؤقتة بزمن دقيق وتصحيح تلقائي فوري',
        'بنوك أسئلة مصنفة حسب المواد والوحدات الدراسية',
        'تمارين ونماذج تدريبية تفاعلية مع الإجابات النموذجية',
        'متابعة تقدم الطالب وتحليل نقاط القوة والضعف',
      ],
      en: [
        'Timed electronic quizzes with instant automated scoring',
        'Categorized question and exercise banks by academic subject',
        'Practice problem sets with step-by-step model answers',
        'Personal student revision progress and analytics',
      ],
    },
    links: {
      github: 'https://github.com/omarkingx98-beep/arixonstudents-1-',
      liveDemo: 'https://arixon-stu4.vercel.app',
    },
  },
];

/**
 * PORTFOLIO_APPS representation for backwards-compatibility with gallery, modals, and search
 */
export const PORTFOLIO_APPS: PortfolioApp[] = appsConfig.map((item) => ({
  id: item.id,
  name: {
    en: item.nameEN,
    ar: item.nameAR,
  },
  tagline: {
    en: item.descEN,
    ar: item.descAR,
  },
  description: {
    en: item.descEN,
    ar: item.descAR,
  },
  longDescription: {
    en: item.descEN,
    ar: item.descAR,
  },
  category:
    item.id === 'arixon-pos'
      ? 'business'
      : item.id === 'arixon-ai'
      ? 'ai'
      : item.id === 'musalla-sayyidna-muhammad'
      ? 'social'
      : 'education',
  categoryLabel: {
    en:
      item.id === 'arixon-pos'
        ? 'Retail & POS'
        : item.id === 'arixon-ai'
        ? 'Artificial Intelligence'
        : item.id === 'musalla-sayyidna-muhammad'
        ? 'Community & Faith'
        : 'Education',
    ar:
      item.id === 'arixon-pos'
        ? 'المبيعات ونقاط البيع'
        : item.id === 'arixon-ai'
        ? 'الذكاء الاصطناعي'
        : item.id === 'musalla-sayyidna-muhammad'
        ? 'المجتمع والمسجد'
        : 'التعليم والمراكز',
  },
  keyMetric: {
    en: 'Production-Ready Architecture',
    ar: 'بنية برمجية معتمدة للإنتاج',
  },
  features: item.features,
  techStack:
    item.id === 'arixon-pos'
      ? ['React', 'TypeScript', 'IndexedDB', 'Tailwind CSS']
      : item.id === 'arixon-ai'
      ? ['React', 'Gemini AI', 'Tailwind CSS', 'Vite']
      : item.id === 'musalla-sayyidna-muhammad'
      ? ['React', 'TypeScript', 'Tailwind CSS', 'PWA']
      : item.id === 'edu-centers-management'
      ? ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS']
      : ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
  mockupType:
    item.id === 'arixon-pos'
      ? 'pos'
      : item.id === 'arixon-ai'
      ? 'ai_gen'
      : item.id === 'musalla-sayyidna-muhammad'
      ? 'school'
      : 'stats',
  previewColor: '#171717',
  year: '2025',
  status: 'featured',
  screenshotUrl: item.screenshotUrl,
  links: item.links,
  githubUrl: item.links?.github,
  liveDemoUrl: item.links?.liveDemo,
  repoName: item.links?.github ? item.links.github.replace('https://github.com/', '') : undefined,
}));

/**
 * Flagship Services
 */
export const SERVICES_DATA = [
  {
    id: 'service-business',
    title: {
      en: 'Enterprise POS & Cashier Systems',
      ar: 'أنظمة الكاشير ونقاط البيع المتقدمة',
    },
    subtitle: {
      en: 'Zero-latency retail & inventory architectures',
      ar: 'بنى تحتية للمحلات التجارية والمتاجر الكبرى',
    },
    description: {
      en: 'Offline-first, high-throughput point-of-sale systems engineered for high transaction volume. Includes thermal receipt printing, barcode integration, inventory management, and profit analytics.',
      ar: 'أنظمة نقاط بيع متطورة تعمل دون انقطاع حتى عند غياب الإنترنت. تشتمل على طباعة الفواتير الحرارية، مسح الباركود، مراقبة المخزون، وتقارير المبيعات والورديات.',
    },
    iconName: 'Store' as const,
    deliverables: {
      en: [
        'Sub-200ms transaction processing speed',
        'Automatic cloud synchronization with offline persistence',
        'Thermal receipt printing & cash drawer triggers',
        'Shift reconciliation & profit margin analytics',
      ],
      ar: [
        'معالجة فائقة السرعة للمبيعات في أجزاء من الثانية',
        'مزامنة سحابية تلقائية مع استمرار العمل عند انقطاع الشبكة',
        'ربط طابعات الفواتير الحرارية وأدراج النقدية آلياً',
        'تقارير تفصيلية للورديات وهوامش الربح وحركة المخزون',
      ],
    },
    highlightTag: {
      en: 'POS Engine',
      ar: 'نظام الكاشير',
    },
  },
  {
    id: 'service-education',
    title: {
      en: 'Educational & Center Management Systems',
      ar: 'منظومات إدارة المراكز التعليمية والامتحانات',
    },
    subtitle: {
      en: 'Digital student records, classrooms & e-testing',
      ar: 'إدارة الطلاب، المعلمين، القاعات، والاختبارات',
    },
    description: {
      en: 'Complete administrative infrastructure for tutoring centers, institutes, and student examination studios. Features clash-free classroom matrix, student installment ledgers, automated fee receipts, and digital timed testing.',
      ar: 'بنية إدارية وتقنية متكاملة للمراكز والمعاهد التعليمية؛ تشمل جداول القاعات الدراسية، متابعة أقساط ورسوم الطلاب، حساب نسب المدرسين، ومنصات للاختبارات الإلكترونية وبنوك الأسئلة.',
    },
    iconName: 'GraduationCap' as const,
    deliverables: {
      en: [
        'Automated classroom schedule conflict prevention',
        'Student digital accounts & installment receipts',
        'Teacher commission splits & revenue accounting',
        'Interactive timed exams with instant grading',
      ],
      ar: [
        'مصفوفة ذكية لحصص القاعات تمنع أي تضارب',
        'سجل مالي لأقساط ورسوم الطلاب مع سندات القبض',
        'احتساب تلقائي لنسب أرباح ومستحقات المدرسين',
        'امتحانات إلكترونية مؤقتة بزمن وتصحيح آلي فوري',
      ],
    },
    highlightTag: {
      en: 'Education Hub',
      ar: 'المنظومة التعليمية',
    },
  },
  {
    id: 'service-ai',
    title: {
      en: 'AI Business & Visual Creation Tools',
      ar: 'أدوات الذكاء الاصطناعي وتوليد الصور للأعمال',
    },
    subtitle: {
      en: 'Commercial neural assets & visual generation',
      ar: 'تصاميم تسويقية مدعومة بالرؤية الحاسوبية',
    },
    description: {
      en: 'Intelligent AI-powered visual creation tools for social media marketing, commercial product photography enhancement, and brand asset generation in both Arabic and English.',
      ar: 'أدوات ذكية مبنية على خوارزميات الذكاء الاصطناعي لتوليد وتصميم صور السوشيال ميديا للمنتجات، وتحسين الإضاءة وتفريغ الخلفيات بجودة سينمائية فائقة الدقة.',
    },
    iconName: 'Cpu' as const,
    deliverables: {
      en: [
        'AI product background synthesis & lighting control',
        'Arabic & English natural language prompt refinement',
        'Multi-aspect ratio exports (posts, stories, reels)',
        'One-click subject isolation & vector upscaling',
      ],
      ar: [
        'توليد خلفيات استوديو وإضاءة سينمائية لصور المنتجات',
        'محرك متقدم لمعالجة الأوامر باللغتين العربية والإنجليزية',
        'تصدير فوري بمقاسات منصات التواصل الاجتماعي المتعددة',
        'تفريغ الخلفيات وعزل العناصر بدقة متناهية فوراً',
      ],
    },
    highlightTag: {
      en: 'Gemini AI',
      ar: 'ذكاء اصطناعي',
    },
  },
];

/**
 * Historical milestones & journey
 */
export const JOURNEY_MILESTONES = [
  {
    year: '2024',
    title: {
      en: 'Founding of Arixon & First POS Architecture',
      ar: 'تأسيس اريكسون وهندسة أول نظام كاشير متطور',
    },
    description: {
      en: 'Established by Omar Shorab to deliver resilient, offline-ready retail point-of-sale solutions with thermal receipt printing and inventory tracking.',
      ar: 'انطلاق الشركة بقيادة عمر شراب بهدف تقديم أنظمة كاشير ونقاط بيع صلبة تعمل دون انقطاع مع دعم الطابعات الحرارية والباركود.',
    },
  },
  {
    year: '2025',
    title: {
      en: 'Education Center Portals & E-Examination Studios',
      ar: 'إطلاق منصات المراكز التعليمية واستوديوهات الامتحانات',
    },
    description: {
      en: 'Architected high-throughput educational hubs for institutes (classrooms, fee ledgers, teacher commissions) and student test studios with timed quizzes.',
      ar: 'هندسة منصات شاملة لإدارة شؤون الطلاب، المدرسين، القاعات والأقساط، بجانب استوديوهات إلكترونية للاختبارات وبنوك الأسئلة.',
    },
  },
  {
    year: '2026',
    title: {
      en: 'AI Neural Visual Tools & Cloud Enterprise Expansion',
      ar: 'دمج الذكاء الاصطناعي وتطوير الحلول السحابية المتقدمة',
    },
    description: {
      en: 'Integrated modern neural generation capabilities for commercial marketing assets and expanded Firebase real-time enterprise architectures.',
      ar: 'تطوير أدوات ذكاء اصطناعي متطورة لتوليد الصور والتصاميم التسويقية مع التوسع في حلول Firebase السحابية فائقة السرعة والأمان.',
    },
  },
];

/**
 * Technical disciplines and architecture stack
 */
export const TECH_STACK = [
  { name: 'Firebase', category: 'Cloud Infrastructure' },
  { name: 'Gemini AI', category: 'Artificial Intelligence' },
  { name: 'React', category: 'Frontend Architecture' },
  { name: 'TypeScript', category: 'Type Safety & Logic' },
  { name: 'Tailwind CSS', category: 'Interface Design' },
  { name: 'Vite', category: 'Build Engine' },
  { name: 'PostgreSQL', category: 'Relational Database' },
  { name: 'IndexedDB', category: 'Offline Persistence' },
  { name: 'WebUSB POS', category: 'Hardware & ESC/POS' },
  { name: 'PWA', category: 'Mobile & Offline' },
];

/**
 * Frequently Asked Questions
 */
export const FAQ_DATA = [
  {
    id: 'faq-1',
    question: {
      en: 'What types of software does Arixon build?',
      ar: 'ما هي أنواع الأنظمة والتطبيقات التي تطورها اريكسون؟',
    },
    answer: {
      en: 'Arixon specializes in point-of-sale (POS) cashier systems, educational centers management portals, student e-examination platforms, and AI-powered visual creation tools.',
      ar: 'تتخصص اريكسون في هندسة أنظمة الكاشير ونقاط البيع (POS)، منظومات إدارة المراكز التعليمية، منصات الامتحانات والتمارين للطلاب، وأدوات الذكاء الاصطناعي لإنشاء وتوليد الصور للأعمال.',
    },
  },
  {
    id: 'faq-2',
    question: {
      en: 'Do your POS systems work without internet connectivity?',
      ar: 'هل تعمل أنظمة الكاشير ونقاط البيع دون إنترنت؟',
    },
    answer: {
      en: 'Yes. Our POS platforms are engineered with an offline-first architecture, allowing cashier registers to scan barcodes, make sales, and print thermal receipts seamlessly without internet, syncing back automatically once online.',
      ar: 'نعم بالتأكيد. تم تصميم نظام الكاشير بمعمارية تعمل دون اتصال بالإنترنت (Offline-First)، مما يتيح متابعة المبيعات والباركود وطباعة الفواتير دون أي توقف، مع المزامنة السحابية فور توفر الشبكة.',
    },
  },
  {
    id: 'faq-3',
    question: {
      en: 'How can I request a custom system or consultation?',
      ar: 'كيف يمكنني طلب مشروع مخصص أو استشارة فنية؟',
    },
    answer: {
      en: 'You can submit your project requirements directly through the Request Wizard on this site, or reach out to the founder directly via WhatsApp (+970 594 399 472) or email.',
      ar: 'يمكنك تقديم تفاصيل مشروعك عبر معالج طلب المشاريع التفاعلي في الموقع، أو التواصل المباشر مع المؤسس عمر شراب عبر الواتساب (+970 594 399 472) أو البريد الإلكتروني.',
    },
  },
  {
    id: 'faq-4',
    question: {
      en: 'Do you offer ongoing technical support and training?',
      ar: 'هل تقدمون دعماً فنياً وتدريباً مستمراً بعد الإطلاق؟',
    },
    answer: {
      en: 'Yes. Every project includes comprehensive staff onboarding, technical documentation, and continuous maintenance and support directly from our engineering team.',
      ar: 'نعم. تتضمن كافة المشاريع تدريباً شاملاً لفريق العمل على استخدام النظام، وتوثيقاً برمجياً دقيقاً، مع دعم فني مستمر ومتابعة دورية مباشرة من فريقنا الهندسي.',
    },
  },
];

