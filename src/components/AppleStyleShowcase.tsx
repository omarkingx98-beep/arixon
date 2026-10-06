import React, { useState, useRef } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Language, PortfolioApp } from '../types';
import { PORTFOLIO_APPS, SOCIAL_LINKS } from '../data/apps';
import { sound } from '../utils/sound';

interface AppleStyleShowcaseProps {
  language: Language;
  onSelectAppForContact: (appName: string, appId?: string) => void;
  onOpenAppDetail: (app: PortfolioApp) => void;
}

type DeviceMode = 'laptop' | 'phone' | 'tablet';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: any;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'perf',
    x: 28,
    y: 35,
    titleAr: 'سرعة استجابة فائقة (60 FPS)',
    titleEn: 'Sub-50ms Reaction Engine',
    descAr: 'معالجة فورية للمبيعات وحركات المخزون والبيانات دون أي بطء أو تجميد للشاشات.',
    descEn: 'Instantaneous UI transitions and local SQLite caching for flawless responsiveness.',
    icon: Zap,
  },
  {
    id: 'offline',
    x: 72,
    y: 30,
    titleAr: 'عمل بدون إنترنت 100%',
    titleEn: '100% Offline Resilience',
    descAr: 'الأنظمة تستمر بالعمل بكامل وظائفها حتى لو انقطع الإنترنت، مع مزامنة تلقائية فور عودته.',
    descEn: 'Full operation continues smoothly during network outages with auto conflict-free sync.',
    icon: ShieldCheck,
  },
  {
    id: 'arabic',
    x: 50,
    y: 75,
    titleAr: 'تصميم عربي أصيل (RTL Natively)',
    titleEn: 'Native Arabic Typography',
    descAr: 'هندسة بصرية مبنية خصيصاً للأرقام والخطوط العربية، وليست مجرد ترجمة لقالب أجنبي.',
    descEn: 'Designed from first principles for right-to-left layout balance and high-contrast readability.',
    icon: Layers,
  },
];

export const AppleStyleShowcase: React.FC<AppleStyleShowcaseProps> = ({
  language,
  onSelectAppForContact,
  onOpenAppDetail,
}) => {
  const isAr = language === 'ar';
  const [selectedAppIndex, setSelectedAppIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('laptop');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Mouse tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentApp = PORTFOLIO_APPS[selectedAppIndex] || PORTFOLIO_APPS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleSelectApp = (idx: number) => {
    sound.playClick(1100);
    setSelectedAppIndex(idx);
    setActiveHotspot(null);
  };

  const handleSelectDevice = (mode: DeviceMode) => {
    sound.playSwitch(mode !== deviceMode);
    setDeviceMode(mode);
  };

  const whatsappUrl =
    isAr ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  return (
    <section className="relative py-20 sm:py-28 bg-neutral-950 text-white overflow-hidden border-t border-b border-neutral-900">
      {/* Luxury Radial Spotlight Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-white/[0.03] via-white/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Apple Style Minimalist Luxury) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5 text-neutral-300" />
            <span>{isAr ? 'معرض الأنظمة الرائدة' : 'Flagship Architecture Showcase'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            <span>{isAr ? 'دقة التصميم. ' : 'Precision Design. '}</span>
            <span className="text-neutral-400">
              {isAr ? 'صلابة الهندسة.' : 'Uncompromising Engineering.'}
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'جرّب استكشاف أنظمتنا عبر مختلف الأجهزة المتطورة مع فحص تفصيلي للميزات الداخلية وسرعة الاستجابة.'
              : 'Explore our flagship software systems across flagship devices with interactive architecture tear-downs.'}
          </p>

          {/* App Selector Tabs (Segmented Luxury Control) */}
          <div className="mt-8 flex items-center justify-center gap-1.5 p-1.5 bg-neutral-900/90 rounded-2xl border border-neutral-800/80 max-w-2xl mx-auto overflow-x-auto scrollbar-none shadow-2xl">
            {PORTFOLIO_APPS.map((app, idx) => {
              const active = idx === selectedAppIndex;
              return (
                <button
                  key={app.id}
                  onClick={() => handleSelectApp(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-black shadow-lg shadow-white/10 font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  {isAr ? app.name.ar : app.name.en}
                </button>
              );
            })}
          </div>

          {/* Hardware Device Perspective Selector */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              {isAr ? 'منظور الجهاز:' : 'Device perspective:'}
            </span>
            <div className="inline-flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
              <button
                onClick={() => handleSelectDevice('laptop')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  deviceMode === 'laptop'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'hover:text-white'
                }`}
                title={isAr ? 'كمبيوتر محمول' : 'Laptop Studio'}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Studio Laptop</span>
              </button>
              <button
                onClick={() => handleSelectDevice('tablet')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'hover:text-white'
                }`}
                title={isAr ? 'جهاز لوحي' : 'Tablet Pro'}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Tablet Pro</span>
              </button>
              <button
                onClick={() => handleSelectDevice('phone')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  deviceMode === 'phone'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'hover:text-white'
                }`}
                title={isAr ? 'هاتف ذكي' : 'Flagship Phone'}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Phone Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D Interactive Hardware Showcase Stage */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-5xl mx-auto py-4 transition-transform duration-200 ease-out"
          style={{
            perspective: '1200px',
          }}
        >
          {/* Main 3D Container with dynamic tilt & specular reflection */}
          <div
            className="relative mx-auto rounded-3xl transition-transform duration-300 ease-out shadow-2xl"
            style={{
              transform: isHovered
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              maxWidth:
                deviceMode === 'phone'
                  ? '360px'
                  : deviceMode === 'tablet'
                  ? '720px'
                  : '880px',
            }}
          >
            {/* Device Frame */}
            <div
              className={`relative bg-neutral-900 border border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500 ${
                deviceMode === 'phone'
                  ? 'rounded-[44px] p-3'
                  : deviceMode === 'tablet'
                  ? 'rounded-[32px] p-3.5'
                  : 'rounded-2xl p-2.5 pb-5'
              }`}
            >
              {/* Camera Notch / Dynamic Island for Phone & Tablet */}
              {deviceMode === 'phone' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
                </div>
              )}
              {deviceMode === 'tablet' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-30 ring-1 ring-neutral-700" />
              )}
              {deviceMode === 'laptop' && (
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 bg-neutral-950/90 rounded-t-xl mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate max-w-xs">
                    {currentApp.name.en} · Arixon High-Performance Core
                  </div>
                  <div className="w-10" />
                </div>
              )}

              {/* Screen Area with Aspect Ratio */}
              <div
                className={`relative overflow-hidden bg-black ${
                  deviceMode === 'phone'
                    ? 'rounded-[34px] aspect-[9/19.5]'
                    : deviceMode === 'tablet'
                    ? 'rounded-[24px] aspect-[4/3]'
                    : 'rounded-xl aspect-[16/10]'
                }`}
              >
                {/* Application Screenshot */}
                <img
                  src={currentApp.screenshotUrl}
                  alt={isAr ? currentApp.name.ar : currentApp.name.en}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Ambient Specular Glare / Glass Sheen Effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-300"
                  style={{
                    transform: `translate(${tilt.y * 3}%, ${tilt.x * 3}%)`,
                  }}
                />

                {/* Interactive Hotspot Nodes (Apple-Style X-Ray Feature Tear-down) */}
                {HOTSPOTS.map((spot) => {
                  const isActive = activeHotspot === spot.id;
                  const Icon = spot.icon;
                  return (
                    <div
                      key={spot.id}
                      className="absolute z-20"
                      style={{
                        top: `${spot.y}%`,
                        left: `${spot.x}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick(1400);
                          setActiveHotspot(isActive ? null : spot.id);
                        }}
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-black scale-125 ring-4 ring-white/30'
                            : 'bg-black/80 text-white backdrop-blur-md border border-white/40 hover:scale-110 hover:border-white'
                        }`}
                        title={isAr ? spot.titleAr : spot.titleEn}
                      >
                        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75" />
                        <Icon className="w-4 h-4 relative z-10" />
                      </button>

                      {/* Hotspot Floating Tooltip Card */}
                      {isActive && (
                        <div
                          className="absolute z-40 mt-3 p-3.5 w-64 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 rounded-2xl shadow-2xl text-start animate-in fade-in zoom-in-95 duration-150"
                          style={{
                            left: spot.x > 60 ? 'auto' : '0',
                            right: spot.x > 60 ? '0' : 'auto',
                          }}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>{isAr ? spot.titleAr : spot.titleEn}</span>
                          </div>
                          <p className="text-[11px] text-neutral-300 leading-relaxed">
                            {isAr ? spot.descAr : spot.descEn}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Laptop bottom chin / speaker notch */}
              {deviceMode === 'laptop' && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="w-20 h-1 bg-neutral-700 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic App Specs & Action Bar */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {isAr ? currentApp.name.ar : currentApp.name.en}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  {currentApp.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                {isAr ? currentApp.description.ar : currentApp.description.en}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAppDetail(currentApp);
                }}
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>{isAr ? 'تفاصيل النظام والمميزات' : 'System Specs'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectAppForContact(
                    isAr ? currentApp.name.ar : currentApp.name.en,
                    currentApp.id
                  );
                }}
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-xs sm:text-sm font-bold text-black transition-all shadow-lg shadow-white/10 cursor-pointer"
              >
                <span>{isAr ? 'طلب هذا النظام' : 'Order This System'}</span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
