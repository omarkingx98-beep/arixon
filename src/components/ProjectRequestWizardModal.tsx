import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  Loader2,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  User,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

interface ProjectRequestWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  prefilledAppType?: string;
  prefilledAppName?: string;
}

export const ProjectRequestWizardModal: React.FC<ProjectRequestWizardModalProps> = ({
  isOpen,
  onClose,
  language,
  prefilledAppType = '',
  prefilledAppName = '',
}) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const isAr = language === 'ar';

  const [step, setStep] = useState<number>(1);
  const [appType, setAppType] = useState<string>('Business management');
  const [description, setDescription] = useState<string>('');
  const [keyFeatures, setKeyFeatures] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('Not sure');
  const [timeline, setTimeline] = useState<string>('2 - 4 weeks');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Sync prefilled data if passed from AppDetailModal or Services
  useEffect(() => {
    if (prefilledAppType) {
      setAppType(prefilledAppType);
    }
    if (prefilledAppName) {
      setDescription(
        isAr
          ? `أرغب في تطوير نظام مماثل لتطبيق (${prefilledAppName}) مخصص لنشاطي التجاري.`
          : `I would like to build a system similar to (${prefilledAppName}) tailored to my business.`
      );
    }
  }, [prefilledAppType, prefilledAppName, isAr, isOpen]);

  // Sync user profile contact fields when user logs in
  useEffect(() => {
    if (currentUser) {
      if (!name && (userProfile?.name || currentUser.displayName)) {
        setName(userProfile?.name || currentUser.displayName || '');
      }
      if (!email && currentUser.email) {
        setEmail(currentUser.email);
      }
      if (!phone && userProfile?.phone) {
        setPhone(userProfile.fullPhone || userProfile.phone);
      }
    }
  }, [currentUser, userProfile]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const appTypes = [
    {
      id: 'Business management',
      labelEn: 'Business Management',
      labelAr: 'إدارة أعمال ومؤسسات',
      descEn: 'ERP, operations, and enterprise workflows',
      descAr: 'أنظمة إدارة الشركات والعمليات',
    },
    {
      id: 'POS/Cashier',
      labelEn: 'POS / Cashier System',
      labelAr: 'نظام كاشير ونقاط بيع',
      descEn: 'Retail stores, supermarkets & barcode checkout',
      descAr: 'محلات التجزئة، الباركود وطباعة الفواتير',
    },
    {
      id: 'AI app',
      labelEn: 'AI & Neural App',
      labelAr: 'تطبيق ذكاء اصطناعي',
      descEn: 'Image generation, automation & custom models',
      descAr: 'توليد الصور، الأتمتة ونماذج الذكاء الاصطناعي',
    },
    {
      id: 'Education/School website',
      labelEn: 'Education & Testing Hub',
      labelAr: 'منظومة تعليمية وامتحانات',
      descEn: 'Institutes, student portals & online exams',
      descAr: 'مراكز تدريبية، شؤون طلاب وبنوك أسئلة',
    },
    {
      id: 'Statistics',
      labelEn: 'Statistics & Dashboards',
      labelAr: 'إحصائيات ولوحات بيانية',
      descEn: 'Analytics, data visualization & reporting',
      descAr: 'تحليل البيانات والمؤشرات المالية',
    },
    {
      id: 'Other',
      labelEn: 'Other Custom System',
      labelAr: 'فكرة أو نظام مخصص آخر',
      descEn: 'Specialized architecture built from scratch',
      descAr: 'بنية برمجية فريدة مصممة من الصفر',
    },
  ];

  const budgetOptions = [
    { id: 'Not sure', labelEn: 'Not sure yet (Need recommendation)', labelAr: 'غير محدد بعد (أحتاج تقييماً)' },
    { id: '$300 - $700', labelEn: '$300 – $700 (Small/Starter)', labelAr: '300$ – 700$ (بداية المشروع)' },
    { id: '$700 - $1,500', labelEn: '$700 – $1,500 (Standard)', labelAr: '700$ – 1,500$ (نظام قياسي)' },
    { id: '$1,500 - $3,000', labelEn: '$1,500 – $3,000 (Advanced)', labelAr: '1,500$ – 3,000$ (نظام متقدم)' },
    { id: '$3,000+', labelEn: '$3,000+ (Full Enterprise)', labelAr: '+3,000$ (منظومة مؤسسية كبرى)' },
  ];

  const timelineOptions = [
    { id: '1 - 2 weeks', labelEn: 'Urgent (1 - 2 weeks)', labelAr: 'عاجل (أسبوع إلى أسبوعين)' },
    { id: '2 - 4 weeks', labelEn: 'Standard (2 - 4 weeks)', labelAr: 'قياسي (أسبوعين إلى شهر)' },
    { id: '1 - 2 months', labelEn: '1 - 2 months', labelAr: 'شهر إلى شهرين' },
    { id: 'Flexible', labelEn: 'Flexible timeline', labelAr: 'جدول زمني مرن' },
  ];

  // Submit request to Firestore
  const handleSubmitRequest = async () => {
    if (!currentUser) {
      openAuthModal('signup');
      return;
    }

    if (userProfile?.blocked) {
      setError(
        isAr
          ? 'تم تقييد حسابك من قبل الإدارة، لا يمكن إرسال طلبات جديدة.'
          : 'Your account has been restricted by administration.'
      );
      return;
    }

    if (!name.trim()) {
      setError(isAr ? 'يرجى إدخال اسمك الكريم.' : 'Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email.');
      return;
    }
    if (!description.trim()) {
      setError(isAr ? 'يرجى كتابة وصف موجز عن مشروعك.' : 'Please write a brief description.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const fullDesc = keyFeatures.trim()
        ? `${description.trim()}\n\n[الميزات المطلوبة / Key Features]:\n${keyFeatures.trim()}`
        : description.trim();

      const docRef = await addDoc(collection(db, 'projectRequests'), {
        userId: currentUser.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        appType,
        budgetRange,
        timeline,
        description: fullDesc,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      setCreatedRequestId(docRef.id);
      setStep(5); // Success step
    } catch (err: any) {
      console.error('Error submitting project request:', err);
      setError(
        err.message ||
          (isAr
            ? 'حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى أو مراسلتنا عبر واتساب.'
            : 'Error submitting request. Please try again or reach out on WhatsApp.')
      );
    } finally {
      setLoading(false);
    }
  };

  const whatsappSuccessUrl = `https://wa.me/970594399472?text=${encodeURIComponent(
    isAr
      ? `مرحباً أستاذ عمر، قمت بتقديم طلب مشروع جديد عبر موقع اريكسون (نوع التطبيق: ${appType}) بالاسم: ${name}.`
      : `Hello Omar, I submitted a project request on the Arixon site (Type: ${appType}) under name: ${name}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl my-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {isAr ? 'طلب مشروع جديد' : 'Request a Project'}
            </h3>
            {step <= 4 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isAr
                  ? `الخطوة ${step} من 4: ${
                      step === 1
                        ? 'نوع التطبيق'
                        : step === 2
                        ? 'الوصف والميزات'
                        : step === 3
                        ? 'الميزانية والوقت'
                        : 'معلومات التواصل'
                    }`
                  : `Step ${step} of 4: ${
                      step === 1
                        ? 'Application Type'
                        : step === 2
                        ? 'Description & Features'
                        : step === 3
                        ? 'Budget & Timeline'
                        : 'Contact Details'
                    }`}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Strict Monochrome) */}
        {step <= 4 && (
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1">
            <div
              className="bg-black dark:bg-white h-1 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: App Type */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="mb-4">
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'ما هو نوع النظام أو التطبيق المطلوب؟' : 'What type of software do you need?'}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {isAr
                    ? 'اختر التصنيف الأقرب لنشاطك، وسنضبط كافة التفاصيل وفق احتياجك الفعلي.'
                    : 'Select the closest category for your project architecture.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAppType(item.id)}
                    className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                      appType === item.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-black dark:border-white shadow-md'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-900 dark:text-white'
                    }`}
                  >
                    <div className="font-bold text-sm">
                      {isAr ? item.labelAr : item.labelEn}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        appType === item.id
                          ? 'text-neutral-300 dark:text-neutral-700'
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {isAr ? item.descAr : item.descEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Description & Key Features */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="mb-4">
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'اشرح لنا فكرة مشروعك وأهم المزايا' : 'Describe your project and key features'}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {isAr
                    ? 'كلما كانت التفاصيل واضحة، استطعنا تقديم تصور تقني دقيق ومباشر.'
                    : 'The more specific you are, the faster we can deliver an architectural proposal.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1.5">
                  {isAr ? 'وصف المشروع والهدف الأساسي *' : 'Project Overview & Main Goal *'}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: نظام لإدارة متجر ملابس مع قارئ باركود وطباعة فواتير، وتقارير مبيعات يومية...'
                      : 'e.g., A cashier system for retail boutique with barcode scanner, receipt printing, and daily shift summaries...'
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-neutral-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1.5">
                  {isAr ? 'أهم الميزات المطلوبة (اختياري)' : 'Key Features & Capabilities (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: العمل دون إنترنت، إشعارات واتساب، صلاحيات للموظفين...'
                      : 'e.g., Offline mode, WhatsApp alerts, staff roles, export to Excel...'
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-neutral-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Budget Range & Timeline */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'الميزانية التقريبية والجدول الزمني' : 'Budget Range & Timeline'}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {isAr
                    ? 'يساعدنا ذلك على اقتراح المعمارية البرمجية المناسبة لحجم أعمالك.'
                    : 'Helps us recommend the most pragmatic engineering scope.'}
                </p>
              </div>

              {/* Budget selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                  {isAr ? 'الميزانية التقريبية المتوقعة' : 'Approximate Budget Range'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBudgetRange(opt.id)}
                      className={`p-3 rounded-xl border text-start text-xs font-semibold transition-all cursor-pointer ${
                        budgetRange === opt.id
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                          : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {isAr ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                  {isAr ? 'الجدول الزمني المرغوب للإطلاق' : 'Desired Timeline for Launch'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timelineOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTimeline(opt.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        timeline === opt.id
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                          : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {isAr ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Authentication Guard */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'بيانات التواصل وتأكيد الطلب' : 'Contact Details & Confirmation'}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {isAr
                    ? 'سنتواصل معك عبر البريد أو الواتساب لمراجعة العرض والخطوات التنفيذية.'
                    : 'We will reach out to schedule an introductory discussion.'}
                </p>
              </div>

              {/* Authentication check notice if not signed in */}
              {!currentUser && (
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <LogIn className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0" />
                    <div className="text-xs text-neutral-800 dark:text-neutral-200">
                      {isAr
                        ? 'يلزم تسجيل الدخول لحفظ الطلب ومتابعة حالته والتواصل المباشر.'
                        : 'Sign-in required to submit and track your project request.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 shrink-0 cursor-pointer"
                  >
                    {isAr ? 'تسجيل الدخول / حساب جديد' : 'Sign in / Sign up'}
                  </button>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. John Doe'}
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                    {isAr ? 'رقم الهاتف / واتساب (اختياري)' : 'Phone / WhatsApp Number (Optional)'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+970 59..."
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>
              </div>

              {/* Summary recap */}
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                <span>{isAr ? `النوع: ${appType}` : `Type: ${appType}`}</span>
                <span>{isAr ? `الميزانية: ${budgetRange}` : `Budget: ${budgetRange}`}</span>
                <span>{isAr ? `المدة: ${timeline}` : `Timeline: ${timeline}`}</span>
              </div>
            </div>
          )}

          {/* STEP 5: Success Screen */}
          {step === 5 && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {isAr ? 'تم استلام طلبك بنجاح!' : 'Project Request Received!'}
              </h4>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'شكراً لتواصلك مع اريكسون. تم تسجيل طلبك في منظومتنا، وسيقوم المهندس المؤسس بمراجعته والتواصل معك في أقرب وقت.'
                  : 'Thank you for choosing Arixon. Your request is registered in Firestore. The lead architect will review it and contact you promptly.'}
              </p>

              {createdRequestId && (
                <div className="inline-block px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  REF: {createdRequestId.slice(0, 10)}
                </div>
              )}

              {/* Action Buttons on Success */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappSuccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'محادثة مباشرة على واتساب الآن' : 'Chat Directly on WhatsApp Now'}</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق والعودة للموقع' : 'Close & Return'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1-4) */}
        {step <= 4 && (
          <div className="flex items-center justify-between p-5 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'السابق' : 'Previous'}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !description.trim()) {
                    setError(isAr ? 'يرجى كتابة وصف موجز عن المشروع.' : 'Please enter a description.');
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <span>{isAr ? 'التالي' : 'Next'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 text-xs sm:text-sm font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال طلب المشروع' : 'Submit Project Request'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
