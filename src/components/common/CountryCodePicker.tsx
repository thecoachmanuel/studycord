'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';

export interface CountryInfo {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: CountryInfo[] = [
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼' },
  { name: 'Cameroon', code: 'CM', dialCode: '+237', flag: '🇨🇲' },
  { name: 'Ivory Coast', code: 'CI', dialCode: '+225', flag: '🇨🇮' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
  { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪' },
];

interface CountryCodePickerProps {
  selectedCountry: CountryInfo;
  onSelectCountry: (country: CountryInfo) => void;
  disabled?: boolean;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  selectedCountry,
  onSelectCountry,
  disabled = false,
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const inputBg = isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-200';

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          soundManager.playClick();
          setIsOpen(true);
        }}
        className={`h-full px-2.5 sm:px-3 flex items-center gap-1.5 border-r border-slate-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span className={`text-xs font-bold ${textColor}`}>
          {selectedCountry.dialCode}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
          <div
            className={`w-full max-w-sm rounded-[16px] ${surfaceBg} border ${cardBorder} shadow-2xl flex flex-col max-h-[80vh] overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <h3 className={`text-base font-bold ${textColor}`}>
                Select Country Code
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-black/5 dark:border-white/5">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code..."
                  className={`w-full h-10 pl-9 pr-3 rounded-[8px] text-xs font-medium ${inputBg} ${textColor} outline-none border border-transparent focus:border-[#ef5388]`}
                  autoFocus
                />
              </div>
            </div>

            {/* Country List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 py-1">
              {filteredCountries.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No countries matching "{search}"
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onSelectCountry(c);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left ${
                        isSelected ? 'bg-[#ef5388]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <span className={`text-xs font-bold block ${textColor}`}>
                            {c.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.code}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${textColor}`}>
                          {c.dialCode}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#ef5388]" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
