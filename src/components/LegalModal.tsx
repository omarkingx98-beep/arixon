import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle, Mail, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  defaultDoc?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  language,
  defaultDoc = 'privacy',
}) => {
  const [activeDoc, setActiveDoc] = React.useState<'privacy' | 'terms'>(defaultDoc);
  const isAr = language === 'ar';

  useEffect(() => {
    setActiveDoc(defaultDoc);
  }, [defaultDoc]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl my-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDoc('privacy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <button
              onClick={() => setActiveDoc('terms')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDoc === 'terms'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm leading-relaxed">
          {/* Top Notice */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-500">
            <span>{isAr ? 'تاريخ السريان:' : 'Effective Date:'} {COMPANY_CONFIG.effectiveDate}</span>
            <span>ARIXON LEGAL NOTICE</span>
          </div>

          {activeDoc === 'privacy' ? (
            /* PRIVACY POLICY */
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-2">
                  {isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'في اريكسون (Arixon)، نلتزم بالشفافية المطلقة فيما يتعلق بالبيانات التي نتعامل معها. يوضح هذا البيان طبيعة المعلومات المستخدمة في هذا الموقع والغرض التقني منها حصراً.'
                    : 'At Arixon, we operate with absolute transparency regarding data. This policy clearly describes the exact technical information handled on this website and its sole purpose.'}
                </p>
              </div>

              {/* 1. Firebase Authentication */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  <span>1. {isAr ? 'المصادقة وتسجيل الدخول (Firebase Auth)' : 'Authentication (Firebase Auth)'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'عند تسجيل الدخول بواسطة حساب Google أو البريد الإلكتروني، نقوم بحفظ اسمك الكامل وعنوان بريدك الإلكتروني والصورة الرمزية لحسابك فقط. تُستخدم هذه البيانات حصرياً لإنشاء هويتك البرمجية الآمنة وتمكينك من متابعة طلباتك ومراسلة الإدارة.'
                    : 'When you authenticate via Google or Email, we only store your full name, email address, and profile photo. This data is exclusively used to establish your secure user session and enable you to track project requests and chat with us.'}
                </p>
              </div>

              {/* 2. Firestore Storage */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span>2. {isAr ? 'قواعد البيانات (Cloud Firestore)' : 'Database Persistence (Firestore)'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'نستخدم Firestore لحفظ الرسائل المباشرة بينك وبين الإدارة (`conversations`)، وطلبات المشاريع التي ترسلها عبر المعالج (`projectRequests`). لا نقوم بجمع أي معلومات شخصية خفية خارج ما تدخله بملء إرادتك.'
                    : 'We utilize Google Cloud Firestore to store your direct support conversations (`conversations`) and submitted project requests (`projectRequests`). We do not collect any covert telemetry or background data.'}
                </p>
              </div>

              {/* 3. YouTube Embeds */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500" />
                  <span>3. {isAr ? 'عرض الفيديو التعريفي (YouTube Embed)' : 'Intro Video Embed (Privacy-Enhanced)'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'يتم تضمين الفيديو التعريفي باستخدام نطاق YouTube الخالي من ملفات تعريف الارتباط (`youtube-nocookie.com`) لحماية خصوصيتك ومنع التتبع الإعلاني الخارجي.'
                    : 'Our video showcase uses the privacy-enhanced domain (`youtube-nocookie.com`) to prevent third-party tracking cookies.'}
                </p>
              </div>

              {/* 4. LocalStorage */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  <span>4. {isAr ? 'التخزين المحلي للمتصفح (localStorage)' : 'Local Storage (localStorage)'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'نستخدم التخزين المحلي فقط على جهازك لتذكر تفضيل اللغة (العربية/الإنجليزية) والوضع اللوني (داكن/فاتح). لا يتم تتبعك خارج هذا النطاق إطلاقاً.'
                    : 'Local storage is utilized solely on your local device to remember your language (Arabic/English) and theme preference (dark/light).'}
                </p>
              </div>

              {/* 5. Cookie Consent & Analytics */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-500" />
                  <span>5. {isAr ? 'ملفات تعريف الارتباط والتحليلات (Cookies & Analytics)' : 'Cookie Consent & Analytics'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'نطبق سياسة خصوصية صارمة؛ ملفات الارتباط الأساسية تقتصر على إدارة الجلسة واللغة والوضع الليلي. أما تحليلات Firebase Analytics فلا يتم تفعيلها أو تحميلها إطلاقاً إلا بعد موافقتك الصريحة عبر نافذة ملفات تعريف الارتباط. يمكنك في أي وقت تعديل تفضيلاتك بالنقر على "إعدادات ملفات الارتباط" في أسفل الموقع.'
                    : 'We adhere to strict privacy-by-design principles. Essential cookies are limited to secure sessions, language, and theme persistence. Google Firebase Analytics is initialized ONLY if you explicitly give consent. You can modify or revoke your preferences at any time via the "Cookie settings" link in the footer.'}
                </p>
              </div>

              {/* 6. No Ads & No Selling Data */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-500" />
                  <span>6. {isAr ? 'انعدام الإعلانات وعدم بيع البيانات نهائياً' : 'Zero Ads & No Selling of Data'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'لا نعرض أي إعلانات تجارية لطرف ثالث، ولا نقوم إطلاقاً ببيع أو تأجير أو مشاركة بياناتك مع أي وسيط إعلاني أو تسويقي تحت أي ظرف.'
                    : 'Arixon never serves third-party advertisements, and we strictly never sell, lease, or distribute your personal information to data brokers or advertising networks.'}
                </p>
              </div>

              {/* 7. Request Deletion */}
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <span>7. {isAr ? 'طلب حذف البيانات بالكامل' : 'Right to Erasure & Data Deletion'}</span>
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'يحق لأي مستخدم طلب حذف حسابه وسجل رسائله وطلباته نهائياً في أي وقت. يمكنك طلب ذلك ببساطة عبر المحادثة المباشرة في الموقع، أو عبر البريد الإلكتروني (omarsharrabx99@gmail.com)، أو عبر الواتساب (+970 594 399 472).'
                    : 'You hold the right to request permanent deletion of your account, message history, and project requests at any time. Simply reach out via our live in-app chat, email (omarsharrabx99@gmail.com), or WhatsApp (+970 594 399 472).'}
                </p>
              </div>
            </div>
          ) : (
            /* TERMS OF SERVICE */
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-2">
                  {isAr ? 'شروط وأحكام الاستخدام' : 'Terms of Service'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'تنظم هذه الشروط استخدامك لموقع اريكسون (Arixon) ومنصاتها الرقمية وخدمات طلب وتطوير الأنظمة البرمجية.'
                    : 'These terms govern your access to the Arixon website, architectural showcases, and project request workflows.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  1. {isAr ? 'طبيعة الخدمات البرمجية' : 'Nature of Software Services'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'تقدم اريكسون خدمات هندسة وتطوير أنظمة الكاشير (POS)، إدارة المراكز، وتطبيقات الذكاء الاصطناعي للأعمال. كل مشروع يتم الاتفاق على نطاقه ومواصفاته بموجب عرض فني ومواصفات واضحة ومعتمدة.'
                    : 'Arixon engineers bespoke POS systems, educational enterprise portals, and neural AI tools. Every client project scope is formally agreed upon through verified technical milestones.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  2. {isAr ? 'طلبات المشاريع والتسعير' : 'Project Inquiries & Proposals'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'الخيارات المتاحة في معالج طلب المشاريع تمثل تقديرات أولية لتحديد نطاق العمل المطلوب ولا تشكل التزاماً تعاقدياً نهائياً إلا بعد مراجعة المتطلبات الفنية والاتفاق المباشر مع المؤسس.'
                    : 'Indicative budget and timeline tiers selected in the request wizard serve as preliminary scope guidelines and do not constitute a binding contract until technical specifications are mutually approved.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  3. {isAr ? 'الملكية الفكرية والعلامة التجارية' : 'Intellectual Property'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'كافة الشعارات، الأكواد المصدرية، التصاميم الهندسية، والمعاينات البرمجية المنشورة على هذا الموقع مملوكة رسمياً لشركة اريكسون (Arixon) والمؤسس عمر شراب، وتخضع لقوانين حماية الملكية الفكرية.'
                    : 'All brand assets, software architecture previews, source codes, and documentation published on this platform are the intellectual property of Arixon and founder Omar Shorab.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  4. {isAr ? 'الاستخدام العادل والتواصل' : 'Fair Use & Communication'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {isAr
                    ? 'يلتزم المستخدم بعدم إساءة استخدام قنوات التواصل المباشرة أو محاولة اختراق أو تعطيل أي من خدمات المنظومة أو إرسال طلبات وهمية.'
                    : 'Users agree to engage respectfully through direct messaging channels and refrain from sending deceptive submissions, automated spam, or attempting unauthorized system access.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500 font-mono">
            Arixon Legal & Compliance
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
