import React from 'react';
import {
  Moon,
  Clock,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  Sparkles,
  Layers,
  Receipt,
  ScanLine,
  CheckCircle2,
  Check,
  AlertCircle,
  HelpCircle,
  Wifi,
  Battery,
  Signal,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { Language } from '../types';

interface AppDeviceFrameProps {
  appId: string;
  language: Language;
  screenshotUrl?: string;
  frameType?: 'laptop' | 'phone';
}

export const AppDeviceFrame: React.FC<AppDeviceFrameProps> = ({
  appId,
  language,
  screenshotUrl,
  frameType = appId === 'musalla-sayyidna-muhammad' || appId === 'arixon-ai' ? 'phone' : 'laptop',
}) => {
  const isAr = language === 'ar';

  // If a real screenshotUrl is provided in config, render that image inside the frame!
  if (screenshotUrl) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-xl">
        <div className="absolute top-3 end-3 z-10 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-black/80 backdrop-blur text-white border border-neutral-700">
          {isAr ? 'معاينة الواجهة' : 'Interface preview'}
        </div>
        <img
          src={screenshotUrl}
          alt={isAr ? 'معاينة الواجهة' : 'Interface preview'}
          className="w-full h-auto object-cover max-h-[420px]"
          loading="lazy"
          width="800"
          height="500"
        />
      </div>
    );
  }

  // --- 1. PHONE FRAME (For Musalla and Mobile Apps) ---
  if (frameType === 'phone') {
    return (
      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[340px] rounded-[40px] p-3 bg-neutral-900 border-4 border-neutral-700 dark:border-neutral-800 shadow-2xl">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          <span className="w-2 h-2 rounded-full bg-neutral-900" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-[540px] rounded-[32px] overflow-hidden bg-black text-white flex flex-col justify-between pt-7 pb-4 px-3 select-none">
          {/* Status bar */}
          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-neutral-400">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Small label: Interface preview / معاينة الواجهة */}
          <div className="flex justify-end my-1 px-1">
            <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              {isAr ? 'معاينة الواجهة' : 'Interface preview'}
            </span>
          </div>

          {/* Screen Content for MUSALLA SAYYIDNA MUHAMMAD */}
          {appId === 'musalla-sayyidna-muhammad' ? (
            <div className="flex-1 flex flex-col justify-between space-y-2 py-1">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 mb-1">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {isAr ? 'مصلى سيدنا محمد' : 'Musalla Sayyidna Muhammad'}
                </h4>
                <p className="text-[10px] text-neutral-400">
                  {isAr ? 'الخميس، 15 ربيع الأول 1448 هـ' : 'Thursday, 15 Rabi al-Awwal 1448 AH'}
                </p>
              </div>

              {/* Next Prayer Card */}
              <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 font-medium">
                  {isAr ? 'الصلاة القادمة' : 'Next Prayer'}
                </span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {isAr ? 'صلاة العصر (3:30 م)' : 'Asr Prayer (03:30 PM)'}
                </div>
                <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] bg-neutral-800 text-neutral-200 border border-neutral-700">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{isAr ? 'متبقي 28 دقيقة للإقامة' : '28m until Iqamah'}</span>
                </div>
              </div>

              {/* Daily Prayer Times Grid */}
              <div className="grid grid-cols-5 gap-1 text-center">
                {[
                  { name: isAr ? 'الفجر' : 'Fajr', time: '04:32' },
                  { name: isAr ? 'الظهر' : 'Dhuhr', time: '12:15' },
                  { name: isAr ? 'العصر' : 'Asr', time: '03:30', current: true },
                  { name: isAr ? 'المغرب' : 'Maghrib', time: '05:48' },
                  { name: isAr ? 'العشاء' : 'Isha', time: '07:18' },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    className={`py-1.5 px-1 rounded-xl text-[10px] border ${
                      p.current
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    <div>{p.name}</div>
                    <div className="font-mono text-[9px] mt-0.5">{p.time}</div>
                  </div>
                ))}
              </div>

              {/* Sample Announcement */}
              <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-start">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-200">
                  <BookOpen className="w-3 h-3 text-neutral-400" />
                  <span>{isAr ? 'إعلان رواد المصلى (عينة)' : 'Congregation Notice (Sample)'}</span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  {isAr
                    ? 'بدء التسجيل في حلقة القرآن الأسبوعية لجميع الفئات بعد صلاة المغرب.'
                    : 'Weekly Quran study circle registration open after Maghrib prayer.'}
                </p>
              </div>

              {/* Sample Daily Hadith / Athkar */}
              <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-850 text-center">
                <p className="text-[9px] text-neutral-400 italic">
                  {isAr
                    ? '«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ»'
                    : '"Glory be to Allah and all praise is due to Him, Glory be to Allah the Great"'}
                </p>
              </div>
            </div>
          ) : (
            /* Screen Content for ARIXON AI (Mobile Mode) */
            <div className="flex-1 flex flex-col justify-between space-y-2 py-1">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white">Arixon AI Studio</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400">v2.4 PRO</span>
              </div>

              {/* Prompt box */}
              <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">
                <div className="text-[9px] text-neutral-500 uppercase font-mono">Prompt</div>
                <p className="mt-0.5 text-white line-clamp-2">
                  {isAr
                    ? 'تصميم بوست تسويقي لمنتج تجاري بخلفية استوديو وإضاءة سينمائية داكنة...'
                    : 'Commercial luxury product photo with studio rim lighting and dark marble...'}
                </p>
              </div>

              {/* Aspect Ratio Tabs */}
              <div className="flex gap-1">
                {['1:1 Post', '9:16 Story', '16:9 Banner'].map((ratio, i) => (
                  <span
                    key={ratio}
                    className={`flex-1 py-1 text-center rounded text-[9px] font-mono border ${
                      i === 1
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    {ratio}
                  </span>
                ))}
              </div>

              {/* Simulated Generated Result */}
              <div className="flex-1 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-750 flex flex-col items-center justify-center p-3 text-center">
                <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg mb-2">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-semibold text-white">
                  {isAr ? 'تم توليد الصورة بدقة 4K' : 'Generated in 4K Ultra-HD'}
                </span>
                <span className="text-[9px] text-neutral-400 mt-0.5">
                  {isAr ? 'عينة منتج تجاري جاهزة للنشر' : 'Sample commercial asset ready'}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Home Indicator */}
          <div className="w-24 h-1 bg-neutral-600 rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  // --- 2. LAPTOP FRAME (For POS, Educational Centers, and Exam Studios) ---
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Laptop Screen Bezel */}
      <div className="relative rounded-2xl p-2.5 sm:p-3 bg-neutral-900 border-2 border-neutral-700 dark:border-neutral-800 shadow-2xl">
        {/* Top Camera dot */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-700" />

        {/* Screen Display */}
        <div className="w-full h-[340px] sm:h-[370px] rounded-xl overflow-hidden bg-black text-white flex flex-col justify-between select-none">
          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800 bg-neutral-950 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              arixon://{appId}
            </div>

            <div className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-300">
              {isAr ? 'معاينة الواجهة' : 'Interface preview'}
            </div>
          </div>

          {/* Inner Content Based on App Purpose */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-hidden flex flex-col justify-between">
            {/* 1. Educational Centers Management */}
            {appId === 'edu-centers-management' && (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-white" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isAr ? 'منظومة إدارة المراكز والطلاب' : 'Educational Center Hub'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {isAr ? 'العام الدراسي 2025/2026' : 'Academic Year 2025/2026'}
                  </span>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 uppercase">
                      {isAr ? 'الطلاب' : 'Students'}
                    </span>
                    <div className="text-sm font-bold text-white">142</div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 uppercase">
                      {isAr ? 'المعلمون' : 'Teachers'}
                    </span>
                    <div className="text-sm font-bold text-white">8</div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 uppercase">
                      {isAr ? 'القاعات' : 'Rooms'}
                    </span>
                    <div className="text-sm font-bold text-white">6</div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 uppercase">
                      {isAr ? 'نسبة الحضور' : 'Attendance'}
                    </span>
                    <div className="text-sm font-bold text-white">98.4%</div>
                  </div>
                </div>

                {/* Sample Table / Student Rows */}
                <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950/60">
                  <div className="grid grid-cols-4 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 bg-neutral-900/80 border-b border-neutral-800">
                    <span>{isAr ? 'اسم الطالب' : 'Student'}</span>
                    <span>{isAr ? 'الصف / القاعة' : 'Grade / Room'}</span>
                    <span>{isAr ? 'حالة الرسوم' : 'Fees'}</span>
                    <span className="text-end">{isAr ? 'الحضور اليوم' : 'Attendance'}</span>
                  </div>

                  {[
                    {
                      name: isAr ? 'طالب تجريبي 01' : 'Sample Student 01',
                      grade: isAr ? 'صف 11 · قاعة A' : 'Grade 11 · Room A',
                      fee: isAr ? 'مسدد بالكامل' : 'Paid',
                      attend: isAr ? 'حاضر (08:00)' : 'Present',
                    },
                    {
                      name: isAr ? 'طالب تجريبي 02' : 'Sample Student 02',
                      grade: isAr ? 'صف 10 · قاعة B' : 'Grade 10 · Room B',
                      fee: isAr ? 'قسط متبقي' : 'Pending',
                      attend: isAr ? 'حاضر (08:05)' : 'Present',
                    },
                    {
                      name: isAr ? 'طالب تجريبي 03' : 'Sample Student 03',
                      grade: isAr ? 'صف 12 · قاعة C' : 'Grade 12 · Room C',
                      fee: isAr ? 'مسدد بالكامل' : 'Paid',
                      attend: isAr ? 'معتذر' : 'Excused',
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 px-2.5 py-1.5 text-[10px] border-b border-neutral-900 text-neutral-300"
                    >
                      <span className="font-medium text-white">{row.name}</span>
                      <span className="text-neutral-400">{row.grade}</span>
                      <span className={row.fee === 'Paid' || row.fee === 'مسدد بالكامل' ? 'text-white' : 'text-neutral-400'}>
                        {row.fee}
                      </span>
                      <span className="text-end text-neutral-300 font-mono">{row.attend}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                  <span>{isAr ? 'توليد تلقائي لسندات القبض' : 'Auto receipts & SMS alerts'}</span>
                  <span className="font-mono text-neutral-300">
                    {isAr ? 'مصفوفة الحصص: 0 تضارب' : 'Conflict-Free Matrix'}
                  </span>
                </div>
              </div>
            )}

            {/* 2. Arixon POS Cashier System */}
            {appId === 'arixon-pos' && (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-white" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isAr ? 'شاشة كاشير المبيعات ونقاط البيع' : 'Retail POS Cashier Register'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    OFFLINE-READY
                  </span>
                </div>

                {/* Barcode Search Bar */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <ScanLine className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-400 font-mono">
                    {isAr ? 'امسح الباركود أو ابحث عن صنف: 629104001923' : 'Scan barcode or SKU: 629104001923'}
                  </span>
                </div>

                {/* Items in Cart */}
                <div className="space-y-1.5 flex-1 overflow-hidden">
                  {[
                    {
                      item: isAr ? 'صنف تجريبي رقم 01' : 'Sample Retail Item A',
                      qty: '2 x $12.00',
                      total: '$24.00',
                    },
                    {
                      item: isAr ? 'صنف تجريبي رقم 02' : 'Sample Product SKU B',
                      qty: '1 x $8.50',
                      total: '$8.50',
                    },
                  ].map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-850 text-xs"
                    >
                      <div>
                        <div className="font-medium text-white">{it.item}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{it.qty}</div>
                      </div>
                      <div className="font-mono font-bold text-white">{it.total}</div>
                    </div>
                  ))}
                </div>

                {/* Checkout Summary */}
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-400">{isAr ? 'الإجمالي' : 'Subtotal'}</div>
                    <div className="text-base font-bold text-white font-mono">$32.50</div>
                  </div>
                  <div className="text-end">
                    <div className="text-[10px] text-neutral-400">{isAr ? 'الضريبة والوردية' : 'Shift & VAT'}</div>
                    <div className="text-[11px] font-mono text-neutral-300">Shift #14 · Confirmed</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs">
                    {isAr ? 'إتمام وطباعة' : 'Checkout & Print'}
                  </button>
                </div>
              </div>
            )}

            {/* 3. Arixon Students Studios */}
            {appId === 'arixon-students-studios' && (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-white" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isAr ? 'منصة الامتحانات والتمارين التفاعلية' : 'Digital Examination & Quiz Studio'}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    <Clock className="w-2.5 h-2.5" />
                    <span>TIMER: 24:18</span>
                  </div>
                </div>

                {/* Question Box */}
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>{isAr ? 'السؤال 03 من 20 (مادة الفيزياء)' : 'Question 03 of 20 (Physics)'}</span>
                    <span className="font-mono">{isAr ? 'درجتان' : '2 Points'}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                    {isAr
                      ? 'سؤال تدريبي: عند ثبات درجة الحرارة، ما هي العلاقة بين حجم الغاز وضغطه؟'
                      : 'Sample Question: At constant temperature, what is the relation between gas volume and pressure?'}
                  </p>
                </div>

                {/* Multiple Choices */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'A', text: isAr ? 'طردية خطية' : 'Linear Direct' },
                    { key: 'B', text: isAr ? 'عكسية (قانون بويل)' : 'Inverse (Boyle\'s Law)', selected: true },
                    { key: 'C', text: isAr ? 'ثابتة لا تتغير' : 'Constant' },
                    { key: 'D', text: isAr ? 'تربيعية' : 'Quadratic' },
                  ].map((choice) => (
                    <div
                      key={choice.key}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        choice.selected
                          ? 'bg-neutral-800 border-white text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <span>
                        <strong className="me-1.5">{choice.key}.</strong> {choice.text}
                      </span>
                      {choice.selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[10px] text-neutral-400">
                  <span>{isAr ? 'تصحيح تلقائي فوري' : 'Automated instant scoring'}</span>
                  <span className="text-neutral-300 font-mono">
                    {isAr ? 'تقدم الطالب: 85%' : 'Student Revision: 85%'}
                  </span>
                </div>
              </div>
            )}

            {/* 4. Arixon AI (Desktop view if laptop selected) */}
            {appId === 'arixon-ai' && (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isAr ? 'استوديو توليد وتصميم الصور الذكي' : 'Arixon AI Social Image Generation'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    GEMINI ENGINE
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <div className="text-[9px] text-neutral-400 uppercase font-mono">Prompt Input</div>
                  <div className="text-white mt-0.5 truncate">
                    {isAr
                      ? 'تصميم بوست تسويقي احترافي لمنتج تجاري بخلفية استوديو وإضاءة سينمائية داكنة'
                      : 'High-end commercial product shot on matte obsidian surface with dark rim illumination'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 flex-1 items-center">
                  <div className="h-full rounded-lg bg-neutral-950 border border-neutral-800 p-2 flex flex-col justify-between text-center">
                    <span className="text-[9px] font-mono text-neutral-400">1:1 Square Post</span>
                    <div className="w-10 h-10 mx-auto rounded bg-neutral-900 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] text-white">Export 1080x1080</span>
                  </div>

                  <div className="h-full rounded-lg bg-neutral-900 border border-white p-2 flex flex-col justify-between text-center">
                    <span className="text-[9px] font-mono text-white font-bold">9:16 Story / Reel</span>
                    <div className="w-10 h-10 mx-auto rounded bg-neutral-800 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] text-white font-bold">Export 1080x1920</span>
                  </div>

                  <div className="h-full rounded-lg bg-neutral-950 border border-neutral-800 p-2 flex flex-col justify-between text-center">
                    <span className="text-[9px] font-mono text-neutral-400">16:9 Landscape</span>
                    <div className="w-10 h-10 mx-auto rounded bg-neutral-900 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] text-white">Export 1920x1080</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[10px] text-neutral-400">
                  <span>{isAr ? 'عزل العناصر وتفريغ الخلفيات' : 'One-click subject isolation'}</span>
                  <span className="text-white font-mono">{isAr ? 'دقة فائقة 4K' : 'Ultra-HD 4K'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Laptop Base Stand */}
      <div className="relative mx-auto w-[65%] h-3 bg-neutral-800 rounded-b-xl border-t border-neutral-700 shadow-lg flex justify-center">
        <div className="w-12 h-1 bg-neutral-600 rounded-full" />
      </div>
    </div>
  );
};
