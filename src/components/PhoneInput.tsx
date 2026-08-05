import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  dialCode: string;
  pattern: RegExp;
  placeholder: string;
  minLength: number;
  maxLength: number;
  formatHelp: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  {
    code: 'IN',
    country: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    pattern: /^[6-9]\d{9}$/,
    placeholder: '98765 43210',
    minLength: 10,
    maxLength: 10,
    formatHelp: '10 digits starting with 6-9'
  },
  {
    code: 'US',
    country: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    pattern: /^[2-9]\d{9}$/,
    placeholder: '(555) 000-0000',
    minLength: 10,
    maxLength: 10,
    formatHelp: '10 digits (area code + 7 digits)'
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    pattern: /^7\d{9}$/,
    placeholder: '7911 123456',
    minLength: 10,
    maxLength: 10,
    formatHelp: '10 digits starting with 7'
  },
  {
    code: 'AU',
    country: 'Australia',
    flag: '🇦🇺',
    dialCode: '+61',
    pattern: /^4\d{8}$/,
    placeholder: '412 345 678',
    minLength: 9,
    maxLength: 9,
    formatHelp: '9 digits starting with 4'
  },
  {
    code: 'DE',
    country: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    pattern: /^1[5-7]\d{8,9}$/,
    placeholder: '151 23456789',
    minLength: 10,
    maxLength: 11,
    formatHelp: '10-11 digits starting with 15/16/17'
  },
  {
    code: 'SG',
    country: 'Singapore',
    flag: '🇸🇬',
    dialCode: '+65',
    pattern: /^[89]\d{7}$/,
    placeholder: '8123 4567',
    minLength: 8,
    maxLength: 8,
    formatHelp: '8 digits starting with 8 or 9'
  },
  {
    code: 'AE',
    country: 'UAE',
    flag: '🇦🇪',
    dialCode: '+971',
    pattern: /^5[024568]\d{7}$/,
    placeholder: '50 123 4567',
    minLength: 9,
    maxLength: 9,
    formatHelp: '9 digits starting with 50/52/54/55/56/58'
  },
  {
    code: 'JP',
    country: 'Japan',
    flag: '🇯🇵',
    dialCode: '+81',
    pattern: /^[789]0\d{8}$/,
    placeholder: '90 1234 5678',
    minLength: 10,
    maxLength: 10,
    formatHelp: '10 digits starting with 70/80/90'
  }
];

interface PhoneInputProps {
  value: string;
  onChange: (fullPhoneNumber: string, isValid: boolean) => void;
  required?: boolean;
  className?: string;
  darkGlass?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  required = false,
  className = '',
  darkGlass = false
}) => {
  // Parse initial value if present
  const parseInitialValue = () => {
    if (!value) return { country: COUNTRY_CODES[0], raw: '' };
    for (const c of COUNTRY_CODES) {
      if (value.startsWith(c.dialCode)) {
        const raw = value.slice(c.dialCode.length).trim().replace(/\D/g, '');
        return { country: c, raw };
      }
    }
    return { country: COUNTRY_CODES[0], raw: value.replace(/\D/g, '') };
  };

  const initial = parseInitialValue();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initial.country);
  const [phoneNumber, setPhoneNumber] = useState<string>(initial.raw);
  const [touched, setTouched] = useState(false);

  // Sync state if value prop changes externally
  useEffect(() => {
    const parsed = parseInitialValue();
    setSelectedCountry(parsed.country);
    setPhoneNumber(parsed.raw);
  }, [value]);

  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const isValid = cleanDigits.length === 0 ? !required : selectedCountry.pattern.test(cleanDigits);

  const handleCountryChange = (c: CountryCode) => {
    setSelectedCountry(c);
    const clean = phoneNumber.replace(/\D/g, '');
    const valid = clean.length === 0 ? !required : c.pattern.test(clean);
    const full = clean ? `${c.dialCode} ${clean}` : '';
    onChange(full, valid);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const clean = rawVal.replace(/\D/g, '').slice(0, selectedCountry.maxLength);
    setPhoneNumber(clean);
    setTouched(true);
    const valid = clean.length === 0 ? !required : selectedCountry.pattern.test(clean);
    const full = clean ? `${selectedCountry.dialCode} ${clean}` : '';
    onChange(full, valid);
  };

  return (
    <div className="space-y-1.5">
      <div className={`flex items-center rounded-xl border transition-all overflow-hidden ${
        darkGlass
          ? 'bg-white/10 border-white/20 text-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/40 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20'
      } ${className}`}>
        
        {/* Country Selector Dropdown */}
        <div className="relative border-r border-slate-200/50 dark:border-slate-700/50 shrink-0">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = COUNTRY_CODES.find(c => c.code === e.target.value);
              if (country) handleCountryChange(country);
            }}
            className={`appearance-none bg-transparent pl-3 pr-7 py-2.5 text-xs font-semibold cursor-pointer outline-none ${
              darkGlass ? 'text-white option:text-slate-900' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-slate-900 text-white dark:bg-slate-800">
                {c.flag} {c.dialCode} ({c.code})
              </option>
            ))}
          </select>
          <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-3 pointer-events-none ${
            darkGlass ? 'text-purple-300' : 'text-slate-400'
          }`} />
        </div>

        {/* Input field */}
        <div className="relative flex-1 flex items-center">
          <Phone className={`w-4 h-4 ml-3 shrink-0 ${
            darkGlass ? 'text-purple-300' : 'text-slate-400 dark:text-slate-500'
          }`} />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleNumberChange}
            onBlur={() => setTouched(true)}
            placeholder={selectedCountry.placeholder}
            className={`w-full py-2.5 pl-2 pr-8 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400 ${
              darkGlass ? 'text-white placeholder:text-purple-200/50' : 'text-slate-900 dark:text-white'
            }`}
          />
          {cleanDigits.length > 0 && (
            <div className="absolute right-2.5">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Helper / Validation error text */}
      {touched && cleanDigits.length > 0 && !isValid && (
        <p className="text-[11px] text-rose-400 dark:text-rose-300 font-medium flex items-center gap-1 pl-1">
          <AlertCircle className="w-3 h-3" />
          <span>Invalid number format for {selectedCountry.country}. ({selectedCountry.formatHelp})</span>
        </p>
      )}
    </div>
  );
};