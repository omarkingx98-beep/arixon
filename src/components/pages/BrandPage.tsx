import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Copy,
  Check,
  QrCode,
  Palette,
  Type,
  FileCheck2,
  Shield,
  Layers,
} from 'lucide-react';
import { Language } from '../../types';
import { siteContent } from '../../data/siteContent';
import { sound } from '../../utils/sound';
import { generateQrSvg } from '../../utils/qrCode';
import { EriksonLogo } from '../EriksonLogo';

interface BrandPageProps {
  language: Language;
  onGoHome: () => void;
}

interface ColorSwatch {
  nameAr: string;
  nameEn: string;
  hex: string;
  usageAr: string;
  usageEn: string;
  textDark: boolean;
}

const BRAND_COLORS: ColorSwatch[] = [
  {
    nameAr: 'الأسود القاتم (Pitch Black)',
    nameEn: 'Obsidian Black',
    hex: '#000000',
    usageAr: 'الخلفية الداكنة، الأزرار الأساسية، الشعار الرسمي',
    usageEn: 'Dark theme canvas, primary CTA buttons, official logo',
    textDark: false,
  },
  {
    nameAr: 'الأبيض النقي (Pure White)',
    nameEn: 'Pure White',
    hex: '#FFFFFF',
    usageAr: 'الخلفية الفاتحة، النصوص في الوضع الداكن، التباين العالي',
    usageEn: 'Light theme canvas, dark mode typography, high contrast',
    textDark: true,
  },
  {
    nameAr: 'الرمادي الداكن (Dark Neutral)',
    nameEn: 'Dark Neutral 900',
    hex: '#171717',
    usageAr: 'البطاقات في الوضع الداكن، القوائم المنبثقة، الحواف',
    usageEn: 'Dark cards, backdrop containers, modular borders',
    textDark: false,
  },
  {
    nameAr: 'الرمادي المتوسط (Medium Gray)',
    nameEn: 'Neutral Gray 500',
    hex: '#737373',
    usageAr: 'النصوص الثانوية، البيانات التوضيحية، الأيقونات الهادئة',
    usageEn: 'Secondary captions, metadata labels, quiet icons',
    textDark: false,
  },
  {
    nameAr: 'الرمادي الفاتح (Light Neutral)',
    nameEn: 'Neutral Gray 100',
    hex: '#F5F5F5',
    usageAr: 'البطاقات الفاتحة، حقول الإدخال، الحواشي الناعمة',
    usageEn: 'Light theme card fills, inputs, subtle dividers',
    textDark: true,
  },
  {
    nameAr: 'الذهبي التحذيري (Accent Gold)',
    nameEn: 'Accent Amber',
    hex: '#F59E0B',
    usageAr: 'حالات الإشعار النشطة، تنبيهات الإدارة الجذرية (Root)',
    usageEn: 'Active pulse indicators, root admin badges',
    textDark: true,
  },
];

const FONTS_LIST = [
  {
    name: 'Cairo (القاهرة)',
    roleAr: 'الخط العربي الأساسي للعناوين والواجهات الكبيرة',
    roleEn: 'Primary Arabic font for bold headlines and hero typography',
    sample: 'أنظمة اريكسون البرمجية — دقة هندسية عالية',
    weights: '400, 500, 600, 700, 800, 900',
  },
  {
    name: 'Plus Jakarta Sans',
    roleAr: 'الخط الإنجليزي الحديث للأرقام والمصطلحات التقنية',
    roleEn: 'Clean geometric sans for English typography and technical data',
    sample: 'Arixon Software Architecture — Engineered for Reliability',
    weights: '400, 500, 600, 700, 800',
  },
  {
    name: 'Tajawal (تجوال)',
    roleAr: 'الخط العربي المساعد للنصوص الطويلة والشروحات',
    roleEn: 'Supporting Arabic humanist font for body copy and descriptions',
    sample: 'بنية برمجية صلبة تعمل أوفلاين مع ملكية كاملة للكود',
    weights: '400, 500, 700, 800',
  },
];

export const BrandPage: React.FC<BrandPageProps> = ({ language, onGoHome }) => {
  const isAr = language === 'ar';
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    sound.playClick();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownloadLogoSvg = () => {
    sound.playClick();
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="23" ry="23" fill="#000000" />
  <polygon points="52.5,31.8 60.5,31.8 32.7,67.8 24.5,67.8" fill="#FFFFFF" />
  <polygon points="49.8,49.7 59.4,49.7 75.8,67.8 65.4,67.8" fill="#FFFFFF" />
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arixon-logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const qrSvg = generateQrSvg(siteContent.siteUrl || 'https://arixon.app', 160);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Navigation Breadcrumb / Go Home */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </button>

          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            {isAr ? 'الهوية البصرية والعلامة' : 'Arixon Brand Kit'}
          </span>
        </div>

        {/* 1. Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            <Palette className="w-3.5 h-3.5" />
            <span>{isAr ? 'دليل الهوية الرسمية' : 'Official Brand Guidelines'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {isAr ? 'شعار وهوية اريكسون البرمجية' : 'Arixon Brand Assets & Identity'}
          </h1>

          <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
            {isAr
              ? 'تعتمد هوية اريكسون على فلسفة التصميم المونكرومي الصارم (أسود، أبيض، وتدرجات الرمادي الصناعي)، لتعكس دقة الأنظمة وصلابة البرمجيات وخلوها من التعقيد.'
              : 'Our brand is rooted in strict monochrome discipline — high contrast obsidian black, pure white, and industrial grays representing engineered precision.'}
          </p>
        </div>

        {/* 2. Official Logo & Download */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isAr ? 'الشعار الرسمي (Logo Assets)' : 'Official Mark & Download'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dark Mark Card */}
            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-5">
              <div className="p-6 rounded-2xl bg-black border border-neutral-800">
                <EriksonLogo size="hero" glow={false} />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  {isAr ? 'الشعار المظلم (Dark Background)' : 'Dark Canvas Mark'}
                </span>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  {isAr ? 'المعتمد للأيقونات وشاشات الإقلاع والأنظمة' : 'Recommended for splash screens & app icons'}
                </span>
              </div>
              <button
                onClick={handleDownloadLogoSvg}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل الشعار المتجهي (SVG)' : 'Download Vector (SVG)'}</span>
              </button>
            </div>

            {/* Clear-Space Guidance Diagram */}
            <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  <Shield className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>{isAr ? 'مساحة الأمان (Clear Space)' : 'Clear Space & Safe Zone'}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isAr
                    ? 'يجب أن يُحاط الشعار دائماً بمساحة فراغ آمنة تعادل ربع عرضه على الأقل (0.25X)، ويُمنع تشويه أبعاده، أو إضافة تأثيرات وظلال متكلفة، أو تغيير زاوية خطوط الرمز.'
                    : 'Maintain a safe exclusion zone of at least 25% of the logo width around all edges. Never rotate, stretch, or alter the geometric polygon angles.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center py-8">
                <div className="relative p-6 border border-neutral-300/60 dark:border-neutral-700/60">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 text-[10px] font-mono bg-white dark:bg-neutral-900 text-neutral-400">
                    SAFE ZONE (≥ 0.25X)
                  </span>
                  <EriksonLogo size="md" glow={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Real Color Palette with Copy-To-Clipboard */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isAr ? 'لوحة الألوان الرسمية (Color Palette)' : 'Official Color Palette'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {isAr ? 'انقر على أي كود لنسخه فوراً إلى الحافظة' : 'Click any hex code to copy directly to clipboard'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_COLORS.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.hex}
                  onClick={() => handleCopy(color.hex)}
                  className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-400 dark:hover:border-neutral-700 transition-all cursor-pointer group"
                >
                  <div
                    className="w-full h-20 rounded-xl mb-3 flex items-end justify-end p-2 border border-neutral-200/40 dark:border-neutral-800/40"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                        color.textDark ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {color.hex}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">
                        {isAr ? color.nameAr : color.nameEn}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        {isAr ? color.usageAr : color.usageEn}
                      </span>
                    </div>

                    <button
                      className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors"
                      title={isAr ? 'نسخ الكود' : 'Copy Hex'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Real Typography Used On The Site */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isAr ? 'الخطوط والطباعة (Typography)' : 'Site Typography & Fonts'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FONTS_LIST.map((font) => (
              <div
                key={font.name}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-neutral-500" />
                  <h3 className="font-bold text-sm">{font.name}</h3>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isAr ? font.roleAr : font.roleEn}
                </p>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-750 text-xs text-neutral-900 dark:text-white font-medium">
                  "{font.sample}"
                </div>

                <div className="text-[10px] font-mono text-neutral-400">
                  Weights: {font.weights}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Client-Side QR Code of the Site URL */}
        {siteContent.siteUrl && (
          <section className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
                <QrCode className="w-4 h-4" />
                <span>{isAr ? 'رمز الاستجابة السريعة (QR Code)' : 'Official Portal QR Code'}</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {isAr ? 'مسح مباشر لزيارة موقع اريكسون' : 'Scan to Open Arixon Platform'}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                {siteContent.siteUrl}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white text-black shadow-lg border border-neutral-200 shrink-0">
              <div
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                className="w-36 h-36 flex items-center justify-center"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
