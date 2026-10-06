/**
 * OFFICIAL SINGLE SOURCE OF TRUTH FOR EDITABLE SITE CONTENT
 * GOLDEN RULE: Everything real. Any block whose content is empty will be cleanly hidden.
 */

export interface CompanyValue {
  titleAR: string;
  titleEN: string;
  textAR: string;
  textEN: string;
}

export interface FounderMilestone {
  year: string;
  textAR: string;
  textEN: string;
}

export interface FaqItem {
  qAR: string;
  aAR: string;
  qEN: string;
  aEN: string;
}

export interface CaseStudyItem {
  appId: string;
  forWhomAR: string;
  forWhomEN: string;
  problemAR: string;
  problemEN: string;
  solutionAR: string;
  solutionEN: string;
  outcomeAR: string;
  outcomeEN: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  quoteAR: string;
  quoteEN: string;
  photo?: string;
}

export interface AppLinkItem {
  tryUrl?: string;
  downloadUrl?: string;
  websiteUrl?: string;
}

export interface SiteContent {
  siteUrl: string;
  company: {
    storyAR: string;
    storyEN: string;
    missionAR: string;
    missionEN: string;
    values: CompanyValue[];
  };
  founder: {
    photo: string;
    titleAR: string;
    titleEN: string;
    bioAR: string;
    bioEN: string;
    milestones: FounderMilestone[];
  };
  faq: FaqItem[];
  caseStudies: CaseStudyItem[];
  testimonials: TestimonialItem[];
  appLinks: Record<string, AppLinkItem>;
}

export const siteContent: SiteContent = {
  siteUrl: 'https://arixon.app',

  company: {
    storyAR:
      'تأسست شركة اريكسون (Arixon) برؤية هندسية واضحة تهدف إلى القضاء على البرمجيات البطيئة والقوالب الجاهزة الهشة. نحن نبني أنظمة برمجية متخصصة من الصفر، مصممة لتحمل ضغط العمل الحقيقي للمؤسسات والمتاجر والمراكز التعليمية، مع التركيز على استمرارية العمل دون إنترنت، وملكية العميل الكاملة لكوده وبياناته دون أي احتكار أو اشتراكات إجبارية.',
    storyEN:
      'Arixon was founded with a singular engineering philosophy: to eliminate sluggish templates and brittle SaaS rentals. We engineer bespoke software systems from first principles, built to withstand real-world operational pressure across retail counters, educational academies, and business workflows — delivering true offline resilience and 100% client code ownership.',
    missionAR:
      'تمكين الأعمال والمؤسسات بأنظمة ذكية فائقة السرعة والاعتمادية تمنحهم الاستقلالية التقنية التامة وتضاعف إنتاجيتهم اليومية.',
    missionEN:
      'To empower enterprises with high-speed, resilient software systems that grant total technological independence and multiply daily operational throughput.',
    values: [
      {
        titleAR: 'ملكية تامة 100%',
        titleEN: '100% Code & Data Ownership',
        textAR: 'أنت المالك الحقيقي لقاعدة بياناتك وأكوادك؛ لا اشتراكات شهرية إجبارية ولا قفل على أعمالك.',
        textEN: 'Zero vendor lock-in. You own your source code, your data, and your infrastructure outright.',
      },
      {
        titleAR: 'الاستمرارية دون إنترنت',
        titleEN: 'Offline-First Resilience',
        textAR: 'تصميم الأنظمة لتواصل البيع والفوترة وإدارة العمليات دون توقف حتى في حال انقطاع الشبكة.',
        textEN: 'Architected to scan, bill, and operate seamlessly during internet outages with zero downtime.',
      },
      {
        titleAR: 'سرعة استجابة فورية',
        titleEN: 'Sub-50ms Reaction Speed',
        textAR: 'معالجة محلية فورية لحركات الكاشير والمخزون دون أي انتظار أو بطء في شاشات العمل.',
        textEN: 'Local caching and tuned queries delivering instant UI response times during peak rush hours.',
      },
      {
        titleAR: 'تصميم عربي أصيل',
        titleEN: 'Native Arabic RTL Craft',
        textAR: 'هندسة بصرية مبنية خصيصاً للغة والأرقام العربية والطباعة الحرارية، وليست مجرد قوالب مترجمة.',
        textEN: 'Engineered natively for right-to-left layout balance, Arabic numerals, and thermal receipt hardware.',
      },
    ],
  },

  founder: {
    photo: 'https://cdn.phototourl.com/member/2026-09-29-8aab535d-3337-4a46-93f8-aa76819618fc.png',
    titleAR: 'المؤسس والمدير',
    titleEN: 'Founder & Manager',
    bioAR:
      'أنا عمر شراب، مؤسس والمهندس البرمجي الأول في اريكسون (Arixon). أؤمن بأن البرمجيات الحقيقية ليست مجرد مظهر أنيق، بل يجب أن تحل جذور المشاكل التشغيلية للمنشأة. من أنظمة نقاط البيع والكاشير السريعة إلى بوابات المراكز التعليمية ومحركات الذكاء الاصطناعي، أشرف شخصياً على تصميم وهندسة وكتابة كل سطر برمجي لضمان أعلى مستويات الدقة والصلابة.',
    bioEN:
      'I am Omar Shurrab, founder and lead software architect at Arixon. I believe software must not merely look modern; it must fundamentally transform how businesses operate, eradicate bottlenecks, and endure peak pressures without flinching. From sub-50ms cashier systems to complex educational hubs and neural AI engines, I personally architect and oversee every line of code.',
    milestones: [
      {
        year: '2024',
        textAR: 'انطلاق اريكسون وهندسة أول نظام كاشير متقدم يعمل دون إنترنت مع دعم الطابعات الحرارية والباركود.',
        textEN: 'Founded Arixon and engineered our first offline-first POS cashier system with thermal printing and barcode scanning.',
      },
      {
        year: '2025',
        textAR: 'تطوير منصات المراكز التعليمية المتكاملة وإطلاق استوديوهات الامتحانات الإلكترونية للطلاب.',
        textEN: 'Architected high-throughput educational center management portals and student e-examination studios.',
      },
      {
        year: '2026',
        textAR: 'دمج أدوات الذكاء الاصطناعي التوليدي للأعمال والتوسع في البنى التحتية السحابية فائقة الأمان والسرعة.',
        textEN: 'Integrated generative AI capabilities for commercial branding and expanded real-time enterprise cloud infrastructure.',
      },
    ],
  },

  faq: [
    {
      qAR: 'ما هي أنواع الأنظمة والتطبيقات التي تطورها اريكسون؟',
      qEN: 'What types of software does Arixon build?',
      aAR: 'تتخصص اريكسون في هندسة أنظمة الكاشير ونقاط البيع (POS)، منظومات إدارة المراكز التعليمية والأكاديميات، منصات الامتحانات والتمارين للطلاب، وتطبيقات الذكاء الاصطناعي لإنشاء وتوليد الصور والمحتوى للأعمال.',
      aEN: 'Arixon specializes in point-of-sale (POS) cashier systems, educational centers management portals, student e-examination platforms, and AI-powered visual creation tools.',
    },
    {
      qAR: 'هل تعمل أنظمة الكاشير ونقاط البيع دون اتصال بالإنترنت؟',
      qEN: 'Do your POS systems work without internet connectivity?',
      aAR: 'نعم بالتأكيد. تم تصميم معمارية أنظمتنا وفق مبدأ (Offline-First)، مما يتيح متابعة المبيعات والباركود وطباعة الفواتير الحرارية دون أي توقف، مع المزامنة السحابية فور عودة الاتصال.',
      aEN: 'Yes. Our POS platforms are engineered with an offline-first architecture, allowing cashier registers to scan barcodes, make sales, and print thermal receipts seamlessly without internet, syncing back automatically once online.',
    },
    {
      qAR: 'هل هناك رسوم اشتراك شهرية إجبارية؟',
      qEN: 'Are there mandatory recurring monthly subscription fees?',
      aAR: 'لا. فلسفة اريكسون مبنية على منحك ملكية النظام وقاعدة بياناتك بنسبة 100% دون أي رسوم شهرية إجبارية أو قفل على عملك.',
      aEN: 'No. Our model is built on 100% code and database ownership for your business, eliminating forced monthly vendor rent.',
    },
    {
      qAR: 'هل تدعم الأنظمة الطابعات الحرارية ودرج الكاشير والباركود؟',
      qEN: 'Do the systems support thermal receipt printers, cash drawers, and barcode scanners?',
      aAR: 'نعم، تدعم كافة طابعات الفواتير الحرارية القياسية (ESC/POS) وقارئات الباركود وأدراج النقدية عبر منافذ USB أو الشبكة المحلية.',
      aEN: 'Yes. Fully compatible with industry-standard ESC/POS thermal printers, cash drawers, and 1D/2D barcode scanners via USB or LAN.',
    },
    {
      qAR: 'كيف يتم تسليم المشروع والبدء في التنفيذ؟',
      qEN: 'How does project delivery and onboarding work?',
      aAR: 'نبدأ بجلسة استماع دقيقة لمتطلباتك، ثم تصميم واختبار النسخة التجريبية، تليها مرحلة التثبيت والتدريب الميداني مع دعم فني مستمر ومباشر مع المؤسس عمر شراب.',
      aEN: 'We start with an in-depth requirement analysis, followed by prototype validation, production deployment, and direct onboarding with lead architect Omar Shurrab.',
    },
  ],

  caseStudies: [
    {
      appId: 'arixon-pos',
      forWhomAR: 'المتاجر، محلات التجزئة، السوبرماركت، ونقاط البيع السريعة',
      forWhomEN: 'Retail stores, supermarkets, boutiques, and high-frequency cashier counters',
      problemAR: 'بطء أنظمة الكاشير السحابية وتوقفها التام عند انقطاع الإنترنت، مما يتسبب في طوابير طويلة وتذمر الزبائن.',
      problemEN: 'Slow cloud POS terminals freezing during internet outages, creating long queues and lost retail transactions.',
      solutionAR: 'هندسة نظام كاشير أوفلاين فائق السرعة يعالج كل حركة بيع في أقل من 50 ميلي ثانية مع طباعة حرارية فورية.',
      solutionEN: 'An offline-first cashier terminal processing transactions under 50ms locally with instant ESC/POS thermal printing.',
      outcomeAR: 'القضاء التام على أوقات التوقف، مضاعفة سرعة محاسبة الزبائن، ومزامنة تلقائية لكافة الفروع دون فقدان أي فاتورة.',
      outcomeEN: 'Zero downtime during network blackouts, 2x faster checkout throughput, and automated background ledger reconciliation.',
    },
    {
      appId: 'edu-centers-management',
      forWhomAR: 'المراكز التعليمية، المعاهد الأكاديمية، والمدارس الخاصة',
      forWhomEN: 'Educational institutes, training academies, and private learning centers',
      problemAR: 'تشتت سجلات الطلاب، تضارب مواعيد القاعات، وصعوبة تحصيل ومتابعة الأقساط والعمولات يدويًا.',
      problemEN: 'Fragmented spreadsheets, classroom timetable overlaps, and manual student tuition tracking chaos.',
      solutionAR: 'منصة مركزية ذكية تجمع الطلاب، المعلمين، القاعات، الحضور والغياب، مع نظام محاسبي دقيق للأقساط.',
      solutionEN: 'A centralized portal unifying enrollment, classroom scheduling, attendance, and student tuition ledgers.',
      outcomeAR: 'توفير 15+ ساعة أسبوعياً من العمل الإداري، وضوح تام في الإيرادات، ومتابعة لحظية لأداء كل طالب ومعلم.',
      outcomeEN: '15+ administrative hours saved weekly, crystal-clear fee collection, and real-time student performance insights.',
    },
    {
      appId: 'arixon-students-studios',
      forWhomAR: 'الطلاب، المعلمين، والمراكز التي تنظم امتحانات دورية',
      forWhomEN: 'Students, instructors, and examination institutes',
      problemAR: 'صعوبة عقد وتصحيح الاختبارات الورقية وتأخر النتائج والتغذية الراجعة للطلاب.',
      problemEN: 'Inefficient paper exams, delayed grading cycles, and lack of detailed question-level student analytics.',
      solutionAR: 'استوديو اختبارات إلكتروني تفاعلي مع بنوك أسئلة ذكية، توقيت دقيق، وتصحيح فوري مع شروحات للإجابات.',
      solutionEN: 'An interactive examination studio with question banks, timers, instant automated grading, and answer explanations.',
      outcomeAR: 'إصدار النتائج فورياً، تحفيز الطلاب على المذاكرة، وتقارير أداء تحليلية دقيقة لنقاط القوة والضعف.',
      outcomeEN: 'Instantaneous grading, enhanced student engagement, and actionable weakness diagnosis reports.',
    },
    {
      appId: 'arixon-ai',
      forWhomAR: 'المسوقون، أصحاب الأعمال، وصناع المحتوى التجاري',
      forWhomEN: 'Marketers, business owners, and digital content creators',
      problemAR: 'ارتفاع تكلفة تصميم المنشورات والإعلانات التجارية والحاجة لأدوات سريعة وموجهة للأعمال.',
      problemEN: 'High graphic design costs and long turnaround times for daily promotional social media visuals.',
      solutionAR: 'محرك ذكاء اصطناعي توليدي مخصص للأعمال يولد تصاميم وإعلانات احترافية خلال ثوانٍ بدقة عالية.',
      solutionEN: 'A specialized generative AI studio crafting commercial imagery and campaign visuals in seconds.',
      outcomeAR: 'تقليص وقت إنتاج الإعلانات بنسبة 80% وتوفير آلاف الدولارات في الإنتاج التسويقي الدوري.',
      outcomeEN: '80% faster visual production turnaround and drastic cost savings on external agency contracts.',
    },
  ],

  // Left empty by default as requested (GOLDEN RULE: zero fake data, shown only when real entries exist)
  testimonials: [],

  appLinks: {
    'arixon-pos': {
      tryUrl: 'https://wa.me/970594399472?text=Demo%20Arixon%20POS',
      websiteUrl: 'https://arixon.app/#apps',
    },
    'edu-centers-management': {
      tryUrl: 'https://wa.me/970594399472?text=Demo%20Edu%20Centers',
      websiteUrl: 'https://arixon.app/#apps',
    },
    'arixon-students-studios': {
      websiteUrl: 'https://arixon.app/#apps',
    },
    'arixon-ai': {
      tryUrl: 'https://wa.me/970594399472?text=Demo%20Arixon%20AI',
      websiteUrl: 'https://arixon.app/#apps',
    },
    'musalla-sayyidna-muhammad': {
      websiteUrl: 'https://arixon.app/#apps',
    },
  },
};
