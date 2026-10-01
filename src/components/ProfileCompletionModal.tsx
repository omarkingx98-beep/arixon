import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  AtSign,
  Calendar,
  Globe2,
  Phone,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { ARAB_COUNTRIES, CountryOption } from '../data/countries';
import { EriksonLogo } from './EriksonLogo';
import { UserProfile } from '../firebase/config';

export const calculateAgeFromBirthdate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const birth = new Date(dateStr);
    const now = new Date();
    let calculated = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      calculated--;
    }
    if (calculated >= 0 && calculated <= 120) {
      return calculated.toString();
    }
  } catch (_) {}
  return '';
};

interface ProfileCompletionModalProps {
  language: Language;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  language,
}) => {
  const {
    currentUser,
    userProfile,
    isProfileModalOpen,
    closeProfileModal,
    updateUserProfileData,
  } = useAuth();

  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    ARAB_COUNTRIES[0] // Palestine default
  );
  const [phoneDialCode, setPhoneDialCode] = useState<string>(ARAB_COUNTRIES[0].dialCode);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync existing profile data if present
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setName(userProfile.name);
      if (userProfile.username) setUsername(userProfile.username.replace('@', ''));
      if (userProfile.password) setPassword(userProfile.password);
      if (userProfile.birthdate) {
        setBirthdate(userProfile.birthdate);
        const calculatedAge = calculateAgeFromBirthdate(userProfile.birthdate);
        if (calculatedAge) {
          setAge(calculatedAge);
        }
      } else if (userProfile.age) {
        setAge(userProfile.age.toString());
      }
      if (userProfile.phone) setPhone(userProfile.phone);

      if (userProfile.countryCode) {
        const found = ARAB_COUNTRIES.find((c) => c.code === userProfile.countryCode);
        if (found) {
          setSelectedCountry(found);
          setPhoneDialCode(found.dialCode);
        }
      }
    } else if (currentUser) {
      if (currentUser.displayName) setName(currentUser.displayName);
    }
  }, [userProfile, currentUser, isProfileModalOpen]);

  const handleBirthdateChange = (val: string) => {
    setBirthdate(val);
    const calculatedAge = calculateAgeFromBirthdate(val);
    if (calculatedAge) {
      setAge(calculatedAge);
    }
  };

  const handleCountryChange = (code: string) => {
    const c = ARAB_COUNTRIES.find((item) => item.code === code) || ARAB_COUNTRIES[0];
    setSelectedCountry(c);
    setPhoneDialCode(c.dialCode);
  };

  const handleSkip = async () => {
    try {
      await updateUserProfileData({
        profileCompleted: true,
        country: isAr ? selectedCountry.nameAr : selectedCountry.nameEn,
        countryCode: selectedCountry.code,
        countryFlag: selectedCountry.flag,
      });
    } catch (_) {}
    closeProfileModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanName = name.trim();
      const cleanUsername = username.trim().toLowerCase().replace('@', '');
      const cleanPhone = phone.trim().replace(/^0+/, '');
      const parsedAge = age ? parseInt(age, 10) : undefined;

      const updatePayload: Partial<UserProfile> = {
        name: cleanName || currentUser.displayName || 'User',
        country: isAr ? selectedCountry.nameAr : selectedCountry.nameEn,
        countryCode: selectedCountry.code,
        countryFlag: selectedCountry.flag,
        profileCompleted: true,
      };

      if (cleanUsername) {
        updatePayload.username = `@${cleanUsername}`;
      }
      if (birthdate) {
        updatePayload.birthdate = birthdate;
      }
      if (parsedAge) {
        updatePayload.age = parsedAge;
      }
      if (cleanPhone) {
        updatePayload.phone = cleanPhone;
        updatePayload.phoneDialCode = phoneDialCode;
        updatePayload.fullPhone = `${phoneDialCode}${cleanPhone}`;
      }
      if (password.trim()) {
        updatePayload.password = password.trim();
      }

      await updateUserProfileData(updatePayload);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeProfileModal();
      }, 700);
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ أثناء حفظ الملف.' : 'Error saving profile.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isProfileModalOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-lg my-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - always accessible */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 end-4 p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="mb-2">
            <EriksonLogo size="md" glow={true} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'الملف الشخصي والبيانات' : 'Your Profile & Account Details'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            {isAr
              ? 'أدخل بياناتك كاملة (الاسم، اسم المستخدم، كلمة السر، تاريخ الميلاد، والبلد)'
              : 'Complete your profile information (Name, Username, Password, Birthdate, Country)'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'تم حفظ وتحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'مثال: عمر شراب' : 'e.g. Omar Shorab'}
                className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* 2. Username & Password (Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Unique Username */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {isAr ? 'اسم المستخدم (اليوزر)' : 'Username'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="omar_shorab"
                  className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors lowercase"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {isAr ? 'كلمة السر' : 'Password'}{' '}
                <span className="text-neutral-400 font-normal">
                  {isAr ? '(تعيين أو تعديل)' : '(Set or update)'}
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-9 pe-9 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Birthdate & Computed Age */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {isAr ? 'تاريخ الميلاد' : 'Date of Birth'}{' '}
                <span className="text-red-500">*</span>
              </label>
              {age && (
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                  {isAr ? `العمر: ${age} سنة` : `Age: ${age} years`}
                </span>
              )}
            </div>
            <div className="relative">
              <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => handleBirthdateChange(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Country / Region (Palestine & Arab World with Flags) */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {isAr ? 'البلد / المنطقة' : 'Country / Region'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute start-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                {selectedCountry.flag}
              </div>
              <select
                value={selectedCountry.code}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full ps-9 pe-8 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none cursor-pointer"
              >
                {ARAB_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-neutral-900">
                    {c.flag} {isAr ? c.nameAr : c.nameEn} ({c.dialCode})
                  </option>
                ))}
              </select>
              <Globe2 className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* 5. Phone Number with Country Dial Code & Flag */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {isAr ? 'رقم الهاتف مع رمز الدولة' : 'Phone Number with Country Code'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {/* Dial Code Selector */}
              <div className="relative w-32 shrink-0">
                <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  {selectedCountry.flag}
                </span>
                <select
                  value={phoneDialCode}
                  onChange={(e) => setPhoneDialCode(e.target.value)}
                  className="w-full ps-7 pe-2 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none cursor-pointer text-center"
                  dir="ltr"
                >
                  {ARAB_COUNTRIES.map((c) => (
                    <option key={`${c.code}-${c.dialCode}`} value={c.dialCode} className="dark:bg-neutral-900">
                      {c.flag} {c.dialCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Input */}
              <div className="relative flex-1">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isAr ? '594399472' : '594399472'}
                  className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  dir="ltr"
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              {isAr
                ? 'يستخدم للتواصل المباشر مع إدارة اريكسون'
                : 'Used for direct updates and communication'}
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isAr ? 'حفظ البيانات وتأكيد الحساب' : 'Save Profile & Confirm'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1"
            >
              {isAr ? 'تخطي الآن' : 'Skip for now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
