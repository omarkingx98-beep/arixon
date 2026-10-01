export interface CountryOption {
  code: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  dialCode: string;
}

export const FULL_COUNTRIES_LIST: CountryOption[] = [
  // Middle East & North Africa
  { code: 'PS', nameEn: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸', dialCode: '+970' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', dialCode: '+962' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', dialCode: '+20' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', dialCode: '+966' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', dialCode: '+971' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', dialCode: '+974' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', dialCode: '+965' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', dialCode: '+973' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'سلطنة عُمان', flag: '🇴🇲', dialCode: '+968' },
  { code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', dialCode: '+964' },
  { code: 'SY', nameEn: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', dialCode: '+963' },
  { code: 'LB', nameEn: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', dialCode: '+961' },
  { code: 'YE', nameEn: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', dialCode: '+967' },
  { code: 'DZ', nameEn: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', dialCode: '+213' },
  { code: 'MA', nameEn: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', dialCode: '+212' },
  { code: 'TN', nameEn: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', dialCode: '+216' },
  { code: 'LY', nameEn: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', dialCode: '+218' },
  { code: 'SD', nameEn: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', dialCode: '+249' },
  { code: 'SO', nameEn: 'Somalia', nameAr: 'الصومال', flag: '🇸🇴', dialCode: '+252' },
  { code: 'MR', nameEn: 'Mauritania', nameAr: 'موريتانيا', flag: '🇲🇷', dialCode: '+222' },
  { code: 'DJ', nameEn: 'Djibouti', nameAr: 'جيبوتي', flag: '🇩🇯', dialCode: '+253' },
  { code: 'KM', nameEn: 'Comoros', nameAr: 'جزر القمر', flag: '🇰🇲', dialCode: '+269' },
  // Europe & Americas & Global
  { code: 'TR', nameEn: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', dialCode: '+90' },
  { code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة الأمريكية', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', nameEn: 'Canada', nameAr: 'كندا', flag: '🇨🇦', dialCode: '+1' },
  { code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', nameEn: 'France', nameAr: 'فرنسا', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', nameEn: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', nameEn: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', nameEn: 'Netherlands', nameAr: 'هولندا', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SE', nameEn: 'Sweden', nameAr: 'السويد', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', nameEn: 'Norway', nameAr: 'النرويج', flag: '🇳🇴', dialCode: '+47' },
  { code: 'CH', nameEn: 'Switzerland', nameAr: 'سويسرا', flag: '🇨🇭', dialCode: '+41' },
  { code: 'BE', nameEn: 'Belgium', nameAr: 'بلجيكا', flag: '🇧🇪', dialCode: '+32' },
  { code: 'AU', nameEn: 'Australia', nameAr: 'أستراليا', flag: '🇦🇺', dialCode: '+61' },
  { code: 'NZ', nameEn: 'New Zealand', nameAr: 'نيوزيلندا', flag: '🇳🇿', dialCode: '+64' },
  { code: 'MY', nameEn: 'Malaysia', nameAr: 'ماليزيا', flag: '🇲🇾', dialCode: '+60' },
  { code: 'ID', nameEn: 'Indonesia', nameAr: 'إندونيسيا', flag: '🇮🇩', dialCode: '+62' },
  { code: 'PK', nameEn: 'Pakistan', nameAr: 'باكستان', flag: '🇵🇰', dialCode: '+92' },
  { code: 'IN', nameEn: 'India', nameAr: 'الهند', flag: '🇮🇳', dialCode: '+91' },
  { code: 'BR', nameEn: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷', dialCode: '+55' },
  { code: 'RU', nameEn: 'Russia', nameAr: 'روسيا', flag: '🇷🇺', dialCode: '+7' },
  { code: 'OTHER', nameEn: 'Other Country', nameAr: 'دولة أخرى', flag: '🌍', dialCode: '+' },
];

export const ARAB_COUNTRIES: CountryOption[] = FULL_COUNTRIES_LIST;
