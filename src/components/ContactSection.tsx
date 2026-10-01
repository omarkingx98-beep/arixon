import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS, SERVICES_DATA } from '../data/apps';
import { companyImages } from '../data/companyImages';
import { SocialSection } from './SocialSection';
import { useAuth } from '../context/AuthContext';

interface ContactSectionProps {
  language: Language;
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  language,
  preselectedService = '',
}) => {
  const { currentUser, openChat, openAuthModal, unreadCount } = useAuth();
  const receptionImage = companyImages[1]; // Image 2: Reception
  const isAr = language === 'ar';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(preselectedService);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = TRANSLATIONS[language];

  React.useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const getWhatsAppForwardUrl = () => {
    const text = encodeURIComponent(
      language === 'ar'
        ? `*طلب استفسار جديد عبر موقع اريكسون:*\n\n• الاسم: ${name}\n• البريد: ${email}\n• الهاتف: ${phone || 'غير محدد'}\n• نوع النظام: ${service || 'عام'}\n\n• التفاصيل:\n${message}`
        : `*New Project Inquiry via Arixon:*\n\n• Name: ${name}\n• Email: ${email}\n• Phone: ${phone || 'N/A'}\n• System: ${service || 'General'}\n\n• Details:\n${message}`
    );
    const base = language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;
    return `${base}&text=${text}`;
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Subtle Darkened Reception Background (Image 2) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-15">
        <img
          src={receptionImage.url}
          alt={isAr ? receptionImage.title.ar : receptionImage.title.en}
          loading="lazy"
          className="w-full h-full object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-neutral-50/80 dark:bg-black/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.contactSection.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'تواصل مباشر' : 'Direct Engineering'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.contactSection.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.contactSection.subtitle}
          </p>
        </div>

        {/* Split Grid: Channels & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Channels & Social Media Grid (lg: col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {t.contactSection.directChannelsHeading}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {t.contactSection.directChannelsSubtitle}
              </p>
            </div>

            {/* In-Platform Real-time Chat with Arixon */}
            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  openChat();
                } else {
                  openAuthModal('login');
                }
              }}
              className="w-full text-start flex items-center justify-between p-3.5 sm:p-5 rounded-2xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 group shadow-md cursor-pointer gap-2"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -end-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-xs sm:text-base font-bold transition-colors truncate">
                      {language === 'ar' ? 'المحادثة الفورية مع الإدارة' : 'Direct In-Platform Chat'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black font-semibold shrink-0">
                      {currentUser ? (language === 'ar' ? 'متصل' : 'ONLINE') : (language === 'ar' ? 'دخول' : 'LOGIN')}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-300 dark:text-neutral-600 mt-0.5 line-clamp-1">
                    {currentUser
                      ? language === 'ar'
                        ? 'محادثة مشفرة مع المطور والإدارة مباشرة'
                        : 'Encrypted real-time messaging with Arixon'
                      : language === 'ar'
                      ? 'سجل دخولك لبدء محادثة مباشرة أو راسلنا واتساب'
                      : 'Sign in to start chat, or use WhatsApp below'}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </button>

            {/* WhatsApp Direct (Monochrome) */}
            <a
              href={language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white transition-colors">
                    {t.contactSection.whatsappLabel}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t.contactSection.whatsappSub}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Email Direct (Monochrome) */}
            <a
              href={`mailto:${SOCIAL_LINKS.email}?subject=${encodeURIComponent(
                language === 'ar' ? 'طلب استشارة وتطوير برمجيات - اريكسون' : 'Software Architecture Inquiry - Arixon'
              )}`}
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white transition-colors">
                    {t.contactSection.emailLabel}
                  </div>
                  <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-[210px] sm:max-w-none">
                    {SOCIAL_LINKS.email}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Social Media Grid Section with animated icons */}
            <SocialSection language={language} />

            {/* Trust box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <strong className="block text-neutral-900 dark:text-white mb-1">
                {language === 'ar' ? 'ضمان اريكسون للمشاريع' : 'The Arixon Commitment'}
              </strong>
              {language === 'ar'
                ? 'جميع الاتفاقيات تشمل مواصفات فنية واضحة، فترات تجريبية، ودعماً تقنياً مباشراً لضمان تشغيل سلس وناجح.'
                : 'Every deployment includes strict technical SLAs, complete staging tests, and direct technical consultation to ensure seamless operation.'}
            </div>
          </div>

          {/* Right Column: Contact Form (Strict Monochrome) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {t.contactSection.form.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {t.contactSection.form.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.contactSection.form.namePlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {t.contactSection.form.emailLabel} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.contactSection.form.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {t.contactSection.form.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.contactSection.form.phonePlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {t.contactSection.form.serviceLabel}
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
                      >
                        <option value="">{t.contactSection.form.selectServicePrompt}</option>
                        {SERVICES_DATA.map((s) => (
                          <option key={s.id} value={s.title[language]}>
                            {s.title[language]}
                          </option>
                        ))}
                        <option value="Bespoke Software System">
                          {language === 'ar' ? 'طلب نظام برمجي مخصص بالكامل' : 'Custom Software Architecture'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {t.contactSection.form.messageLabel} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.contactSection.form.messagePlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>{t.contactSection.form.submitting}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contactSection.form.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Feedback State */
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {t.contactSection.form.successHeading}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                    {t.contactSection.form.successBody}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppForwardUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-xl transition-colors shadow-sm whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.contactSection.form.forwardToWhatsApp}</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setMessage('');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {t.contactSection.form.sendAnother}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Always-visible caption for Image 2 (Reception) */}
        <div className="mt-8 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              {isAr ? receptionImage.title.ar : receptionImage.title.en}:
            </span>{' '}
            <span>{isAr ? receptionImage.description.ar : receptionImage.description.en}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
