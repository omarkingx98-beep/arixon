import React, { useState, useEffect } from 'react';
import { Language, Theme, PortfolioApp } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
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
import { CtaBanner } from './components/CtaBanner';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingSocialDock } from './components/FloatingSocialDock';
import { AuthModal } from './components/AuthModal';
import { ProfileCompletionModal } from './components/ProfileCompletionModal';
import { ChatModal } from './components/ChatModal';
import { VideoModal } from './components/VideoModal';
import { ProjectRequestWizardModal } from './components/ProjectRequestWizardModal';
import { LegalModal } from './components/LegalModal';
import { NotFoundPage } from './components/NotFoundPage';
import { CustomCursor } from './components/CustomCursor';
import { AdminDashboard } from './components/AdminDashboard';
import { BackToTopButton } from './components/BackToTopButton';

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

  // Contact form pre-fill state from cards/services
  const [preselectedService, setPreselectedService] = useState<string>('');
  // Selected app for modal popup (from search or cards)
  const [selectedAppForModal, setSelectedAppForModal] = useState<PortfolioApp | null>(null);
  // Fullscreen cinematic intro video modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Project Request Wizard state
  const [isRequestWizardOpen, setIsRequestWizardOpen] = useState(false);
  const [prefilledAppType, setPrefilledAppType] = useState<string>('');
  const [prefilledAppName, setPrefilledAppName] = useState<string>('');

  // Legal Modal state ('privacy' | 'terms' | null)
  const [legalModalDoc, setLegalModalDoc] = useState<'privacy' | 'terms' | null>(null);

  // 404 Page state
  const [is404View, setIs404View] = useState(false);

  // Admin Dashboard View State (supports route /admin and #admin)
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin'
      );
    }
    return false;
  });

  // Listen to hash and route changes for #admin, #privacy, #terms, #404
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (path === '/admin' || hash === '#admin') {
        setShowAdminDashboard(true);
      } else {
        setShowAdminDashboard(false);
      }

      if (hash === '#privacy') {
        setLegalModalDoc('privacy');
      } else if (hash === '#terms') {
        setLegalModalDoc('terms');
      }

      if (hash === '#404') {
        setIs404View(true);
      } else {
        setIs404View(false);
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

  const handleOpenAdmin = () => {
    setShowAdminDashboard(true);
    window.location.hash = '#admin';
  };

  const handleCloseAdmin = () => {
    setShowAdminDashboard(false);
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname);
    }
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

  if (is404View) {
    return (
      <NotFoundPage
        language={language}
        onGoHome={() => {
          setIs404View(false);
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Subtle Desktop Precision Cursor */}
      <CustomCursor />

      {/* Animated Loading Screen */}
      <LoadingScreen language={language} />

      {/* Floating Glass Social & Code Dock (Desktop Side / Mobile Bottom) */}
      <FloatingSocialDock language={language} />

      {/* Sticky Top Navigation with Reading Progress, Auth & Quick Search */}
      <Navbar
        language={language}
        theme={theme}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onOpenAdmin={handleOpenAdmin}
      />

      <main>
        {/* 1. Cinematic Hero Section with Top Search Bar & Watch Intro */}
        <Hero
          language={language}
          onSelectApp={handleSelectAppFromSearch}
          onSelectService={handleSelectServiceForContact}
          onOpenIntroVideo={() => {
            const el = document.getElementById('meet-arixon');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* 2. Meet Arixon (Official Direct In-Page Video Showcase) */}
        <MeetArixonSection
          language={language}
        />

        {/* 3. Verified Performance Metrics (Real numbers only: Apps built: 5) */}
        <CompanyStatsSection language={language} />

        {/* 4. Why Arixon: 4 Non-Numeric Core Value Points + Tech Marquee */}
        <WhyArixonSection language={language} />

        {/* 5. How We Work: 4-Stage Transparent Timeline (Discuss, Design, Build, Launch & Support) */}
        <HowWeWorkSection language={language} />

        {/* 6. Flagship Apps Gallery (Pinned Storytelling on Desktop + Bento Grid) */}
        <AppsGallery
          language={language}
          onSelectAppForContact={handleSelectAppForContact}
          externalActiveModalApp={selectedAppForModal}
          onCloseExternalModal={() => setSelectedAppForModal(null)}
        />

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

      {/* 16. Footer with Official Links & Legal Navigation */}
      <Footer
        language={language}
        onOpenLegal={(doc) => setLegalModalDoc(doc)}
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
      <ProjectRequestWizardModal
        isOpen={isRequestWizardOpen}
        onClose={() => setIsRequestWizardOpen(false)}
        language={language}
        prefilledAppType={prefilledAppType}
        prefilledAppName={prefilledAppName}
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
      {showAdminDashboard && (
        <AdminDashboard language={language} onClose={handleCloseAdmin} />
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

  // 2. Theme state: remembered in localStorage, defaulting to system preference or dark
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
