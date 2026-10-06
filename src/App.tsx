import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Language, Theme, PortfolioApp } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MeetArixonSection } from './components/MeetArixonSection';
import { CompanyStatsSection } from './components/CompanyStatsSection';
import { WhyArixonSection } from './components/WhyArixonSection';
import { HowWeWorkSection } from './components/HowWeWorkSection';
import { LatestUpdatesSection } from './components/LatestUpdatesSection';
import { AboutSection } from './components/AboutSection';
import { WorkspaceSection } from './components/WorkspaceSection';
import { AppsGallery } from './components/AppsGallery';
import { JourneySection } from './components/JourneySection';
import { ServicesSection } from './components/ServicesSection';
import { TechStackSection } from './components/TechStackSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CtaBanner } from './components/CtaBanner';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingSocialDock } from './components/FloatingSocialDock';
import { AuthModal } from './components/AuthModal';
import { ProfileCompletionModal } from './components/ProfileCompletionModal';
import { ChatModal } from './components/ChatModal';
import { VideoModal } from './components/VideoModal';
import { LegalModal } from './components/LegalModal';
import { NotFoundPage } from './components/NotFoundPage';
import { CustomCursor } from './components/CustomCursor';
import { BackToTopButton } from './components/BackToTopButton';
import { CommandPalette } from './components/CommandPalette';
import { CookieConsent } from './components/CookieConsent';
import { sound } from './utils/sound';

// Lazy-loaded Heavy Sections & Dedicated Subpages for High Performance
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AboutPage = lazy(() =>
  import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const BrandPage = lazy(() =>
  import('./components/pages/BrandPage').then((m) => ({ default: m.BrandPage }))
);
const FaqPage = lazy(() =>
  import('./components/pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const SupportPage = lazy(() =>
  import('./components/pages/SupportPage').then((m) => ({ default: m.SupportPage }))
);
const AppleStyleShowcase = lazy(() =>
  import('./components/AppleStyleShowcase').then((m) => ({ default: m.AppleStyleShowcase }))
);
const ComparisonMatrixSection = lazy(() =>
  import('./components/ComparisonMatrixSection').then((m) => ({ default: m.ComparisonMatrixSection }))
);
const ProjectConfiguratorModal = lazy(() =>
  import('./components/ProjectConfiguratorModal').then((m) => ({ default: m.ProjectConfiguratorModal }))
);
const ProjectRequestWizardModal = lazy(() =>
  import('./components/ProjectRequestWizardModal').then((m) => ({ default: m.ProjectRequestWizardModal }))
);

type ActiveRoute = 'home' | 'about' | 'brand' | 'faq' | 'support' | 'admin' | '404';

function AppContent({
  language,
  theme,
  toggleLanguage,
  toggleTheme,
}: {
  language: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
}) {
  const { isAdmin } = useAuth();
  const isAr = language === 'ar';

  // Active Route State
  const [currentRoute, setCurrentRoute] = useState<ActiveRoute>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/admin' || h === '#admin') return 'admin';
      if (p === '/about' || h === '#about-page') return 'about';
      if (p === '/brand' || h === '#brand' || h === '#brand-page') return 'brand';
      if (p === '/faq' || h === '#faq-page') return 'faq';
      if (p === '/support' || h === '#support' || h === '#support-page') return 'support';
      if (h === '#404') return '404';
    }
    return 'home';
  });

  // Contact form pre-fill state from cards/services
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [selectedAppForModal, setSelectedAppForModal] = useState<PortfolioApp | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Project Request Wizard state
  const [isRequestWizardOpen, setIsRequestWizardOpen] = useState(false);
  const [prefilledAppType, setPrefilledAppType] = useState<string>('');
  const [prefilledAppName, setPrefilledAppName] = useState<string>('');

  // World-Class Modals: Command Palette (Cmd+K / '/') & Studio Configurator & Cookie Settings
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);

  // Legal Modal state ('privacy' | 'terms' | null)
  const [legalModalDoc, setLegalModalDoc] = useState<'privacy' | 'terms' | null>(null);

  // Global keyboard shortcuts: Cmd+K / Ctrl+K and '/' (slash)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput && !isCommandPaletteOpen) {
        e.preventDefault();
        sound.playClick();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandPaletteOpen]);

  // Route & URL sync listener
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else if (path === '/about' || hash === '#about-page') {
        setCurrentRoute('about');
      } else if (path === '/brand' || hash === '#brand' || hash === '#brand-page') {
        setCurrentRoute('brand');
      } else if (path === '/faq' || hash === '#faq-page') {
        setCurrentRoute('faq');
      } else if (path === '/support' || hash === '#support' || hash === '#support-page') {
        setCurrentRoute('support');
      } else if (hash === '#404') {
        setCurrentRoute('404');
      } else {
        setCurrentRoute('home');
      }

      if (hash === '#privacy') {
        setLegalModalDoc('privacy');
      } else if (hash === '#terms') {
        setLegalModalDoc('terms');
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Sync document.title and meta description for SEO per route
  useEffect(() => {
    if (currentRoute === 'about') {
      document.title = isAr
        ? 'عن اريكسون والمؤسس عمر شراب | Arixon Architecture'
        : 'About Arixon & Founder Omar Shurrab | Software Systems';
    } else if (currentRoute === 'brand') {
      document.title = isAr
        ? 'الهوية البصرية وشعار اريكسون | Arixon Brand Kit'
        : 'Official Brand Kit & Vector Assets | Arixon Systems';
    } else if (currentRoute === 'faq') {
      document.title = isAr
        ? 'الأسئلة الشائعة ومعمارية الأنظمة | Arixon FAQ'
        : 'Frequently Asked Questions | Arixon Software Architecture';
    } else if (currentRoute === 'support') {
      document.title = isAr
        ? 'بوابة دعم العملاء وتذاكر الأنظمة | Arixon Support'
        : 'Client Support Portal & Ticket Desk | Arixon';
    } else if (currentRoute === 'admin') {
      document.title = isAr ? 'لوحة تحكم الإدارة | Arixon Admin' : 'Executive Dashboard | Arixon Admin';
    } else {
      document.title = isAr
        ? 'إريكسون — هندسة الأنظمة والبرمجيات للأعمال | Arixon Software Systems'
        : 'Arixon — Bespoke Software Systems & Enterprise AI';
    }
  }, [currentRoute, isAr]);

  const navigateTo = (path: string) => {
    sound.playClick();
    if (path.startsWith('/')) {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (path.startsWith('#')) {
      if (currentRoute !== 'home') {
        window.history.pushState(null, '', `/${path}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.querySelector(path);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(path);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = path;
        }
      }
    }
  };

  const handleGoHome = () => {
    sound.playClick();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    sound.playClick();
    window.history.pushState(null, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleCloseAdmin = () => {
    handleGoHome();
  };

  // Open Project Request Wizard prefilled
  const handleOpenProjectWizard = (appName?: string, appId?: string) => {
    let mappedType = 'Business management';
    if (appId === 'arixon-pos') mappedType = 'POS/Cashier';
    else if (appId === 'arixon-ai') mappedType = 'AI app';
    else if (appId === 'edu-centers-management' || appId === 'arixon-students-studios') mappedType = 'Education/School website';
    else if (appId === 'musalla-sayyidna-muhammad') mappedType = 'Other';

    setPrefilledAppType(mappedType);
    setPrefilledAppName(appName || '');
    setIsRequestWizardOpen(true);
  };

  const handleSelectAppForContact = (appName: string, appId?: string) => {
    handleOpenProjectWizard(appName, appId);
  };

  const handleSelectServiceForContact = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    handleOpenProjectWizard(serviceTitle);
  };

  const handleSelectAppFromSearch = (app: PortfolioApp) => {
    setSelectedAppForModal(app);
  };

  if (currentRoute === '404') {
    return <NotFoundPage language={language} onGoHome={handleGoHome} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Subtle Desktop Precision Cursor */}
      <CustomCursor />

      {/* Animated Loading Screen */}
      <LoadingScreen language={language} />

      {/* Live Announcement Bar (Above Navbar, driven by Firestore settings/announcement) */}
      <AnnouncementBar language={language} />

      {/* Sticky Top Navigation with Reading Progress, Auth & Quick Search */}
      <Navbar
        language={language}
        theme={theme}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onOpenAdmin={handleOpenAdmin}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenStudioConfigurator={() => setIsConfiguratorOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Floating Glass Social & Code Dock (Desktop Side / Mobile Bottom) */}
      <FloatingSocialDock language={language} />

      {/* ROUTE VIEW SWITCHER */}
      {currentRoute === 'about' ? (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs text-neutral-500">Loading...</div>}>
          <AboutPage language={language} onGoHome={handleGoHome} />
        </Suspense>
      ) : currentRoute === 'brand' ? (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs text-neutral-500">Loading...</div>}>
          <BrandPage language={language} onGoHome={handleGoHome} />
        </Suspense>
      ) : currentRoute === 'faq' ? (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs text-neutral-500">Loading...</div>}>
          <FaqPage language={language} onGoHome={handleGoHome} />
        </Suspense>
      ) : currentRoute === 'support' ? (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs text-neutral-500">Loading...</div>}>
          <SupportPage language={language} onGoHome={handleGoHome} />
        </Suspense>
      ) : (
        /* MAIN HOMEPAGE VIEW */
        <main>
          {/* 1. Cinematic Hero Section with Top Search Bar & Watch Intro */}
          <Hero
            language={language}
            onSelectApp={handleSelectAppFromSearch}
            onSelectService={handleSelectServiceForContact}
            onOpenIntroVideo={() => {
              const el = document.getElementById('meet-arixon');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 2. Meet Arixon (Official Direct In-Page Video Showcase) */}
          <MeetArixonSection language={language} />

          {/* 3. Verified Performance Metrics (Real numbers only: Apps built: 5) */}
          <CompanyStatsSection language={language} />

          {/* 4. Why Arixon: 4 Non-Numeric Core Value Points + Tech Marquee */}
          <WhyArixonSection language={language} />

          {/* 4.5 Engineering Benchmark: Comparison Matrix Section (Apple 'Compare Models' Style) */}
          <Suspense fallback={null}>
            <ComparisonMatrixSection
              language={language}
              onOpenProjectWizard={() => setIsConfiguratorOpen(true)}
            />
          </Suspense>

          {/* 5. How We Work: 4-Stage Transparent Timeline */}
          <HowWeWorkSection language={language} />

          {/* 6. Flagship Apps Gallery (Pinned Storytelling on Desktop + Bento Grid) */}
          <AppsGallery
            language={language}
            onSelectAppForContact={handleSelectAppForContact}
            externalActiveModalApp={selectedAppForModal}
            onCloseExternalModal={() => setSelectedAppForModal(null)}
          />

          {/* 6.5 Apple/Samsung Pro Hardware & Interactive 3D Architecture Showcase */}
          <Suspense fallback={null}>
            <AppleStyleShowcase
              language={language}
              onSelectAppForContact={handleSelectAppForContact}
              onOpenAppDetail={(app) => setSelectedAppForModal(app)}
            />
          </Suspense>

          {/* 7. Latest Updates & Releases (Dynamically hidden if zero updates) */}
          <LatestUpdatesSection language={language} />

          {/* 8. About the Developer & Founder: Omar Shurrab */}
          <AboutSection language={language} />

          {/* 9. Our Workspace & Engineering Studio (Images 1-4 with Fullscreen Lightbox) */}
          <WorkspaceSection language={language} />

          {/* 10. Milestones & Journey Timeline */}
          <JourneySection language={language} />

          {/* 11. Services Section */}
          <ServicesSection
            language={language}
            onSelectService={handleSelectServiceForContact}
          />

          {/* 12. Tech Stack Section */}
          <TechStackSection language={language} />

          {/* 12.5 Client Testimonials Carousel (Hidden when empty) */}
          <TestimonialsSection language={language} />

          {/* 13. Start a Project CTA Banner */}
          <CtaBanner language={language} />

          {/* 14. FAQ Accordion Section */}
          <FaqSection language={language} />

          {/* 15. Contact Section with 4 Official Channels & Form */}
          <ContactSection
            language={language}
            preselectedService={preselectedService}
          />
        </main>
      )}

      {/* Complete Footer with Full Sitemap, Language Selector & Cookie Settings */}
      <Footer
        language={language}
        onOpenLegal={(doc) => setLegalModalDoc(doc)}
        onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
        onToggleLanguage={toggleLanguage}
        onNavigate={navigateTo}
      />

      {/* Cookie Consent Bilingual Banner & Settings Modal */}
      <CookieConsent
        language={language}
        isOpenOverride={isCookieSettingsOpen}
        onCloseOverride={() => setIsCookieSettingsOpen(false)}
      />

      {/* Modals & Overlays */}
      <AuthModal language={language} />
      <ProfileCompletionModal language={language} />
      <ChatModal language={language} />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        language={language}
      />

      {/* Project Request Wizard Modal */}
      <Suspense fallback={null}>
        {isRequestWizardOpen && (
          <ProjectRequestWizardModal
            isOpen={isRequestWizardOpen}
            onClose={() => setIsRequestWizardOpen(false)}
            language={language}
            prefilledAppType={prefilledAppType}
            prefilledAppName={prefilledAppName}
          />
        )}
      </Suspense>

      {/* World-Class Studio Configurator Modal */}
      <Suspense fallback={null}>
        {isConfiguratorOpen && (
          <ProjectConfiguratorModal
            isOpen={isConfiguratorOpen}
            onClose={() => setIsConfiguratorOpen(false)}
            language={language}
            onTransferToWizard={() => {
              setPrefilledAppName('Custom Configured Architecture');
              setPrefilledAppType('Bespoke Architecture');
              setIsRequestWizardOpen(true);
            }}
          />
        )}
      </Suspense>

      {/* Global Spotlight Command Palette (Cmd+K / Ctrl+K / '/') */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        language={language}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
        onSelectApp={(app) => setSelectedAppForModal(app)}
        onOpenAdmin={isAdmin ? handleOpenAdmin : undefined}
        onOpenProjectWizard={() => setIsConfiguratorOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Legal Modal (Privacy Policy & Terms of Service) */}
      <LegalModal
        isOpen={legalModalDoc !== null}
        onClose={() => {
          setLegalModalDoc(null);
          if (window.location.hash === '#privacy' || window.location.hash === '#terms') {
            history.pushState(null, '', window.location.pathname);
          }
        }}
        language={language}
        defaultDoc={legalModalDoc || 'privacy'}
      />

      {/* Floating Back to Top Button */}
      <BackToTopButton language={language} />

      {/* Admin Dashboard Overlay / View */}
      {currentRoute === 'admin' && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white text-xs">Loading Admin...</div>}>
          <AdminDashboard language={language} onClose={handleCloseAdmin} />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  // 1. Language state: remembered in localStorage, defaulting to 'ar' (Arabic)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('arixon_language') || localStorage.getItem('erikson_language');
    if (saved === 'en' || saved === 'ar') return saved;
    return 'ar';
  });

  // 2. Theme state: remembered in localStorage, defaulting to dark
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('arixon_theme') || localStorage.getItem('erikson_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Sync Language and Direction (RTL / LTR)
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('arixon_language', language);
  }, [language]);

  // Sync Theme (dark / light) class on <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    root.style.colorScheme = theme;
    localStorage.setItem('arixon_theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AuthProvider>
      <AppContent
        language={language}
        theme={theme}
        toggleLanguage={toggleLanguage}
        toggleTheme={toggleTheme}
      />
    </AuthProvider>
  );
}
