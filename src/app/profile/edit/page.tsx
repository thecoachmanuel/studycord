'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Smartphone, Tag, Check, Lock } from 'lucide-react';
import { QAppBar } from '../../../components/common/QAppBar';
import { QImage } from '../../../components/common/QImage';
import { QButton } from '../../../components/common/QButton';
import { CountryCodePicker, COUNTRIES, CountryInfo } from '../../../components/common/CountryCodePicker';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { soundManager } from '../../../lib/sound';
import { tr } from '../../../lib/translations';

const AVATARS = [
  '/assets/config/profile/1.svg',
  '/assets/config/profile/2.svg',
  '/assets/config/profile/3.svg',
  '/assets/config/profile/4.svg',
  '/assets/config/profile/5.svg',
  '/assets/config/profile/6.svg',
  '/assets/config/profile/7.svg',
  '/assets/config/profile/8.svg',
  '/assets/config/profile/9.svg',
  '/assets/config/profile/10.svg',
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, updateUser, openLoginModal } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/profile/edit', 'Please sign in to edit your profile, choose avatars, and sync your details.');
    }
  }, [isInitialized, user, isGuest]);

  const initialCountry = () => {
    if (!user?.mobile) return COUNTRIES[0];
    const match = COUNTRIES.find((c) => user.mobile?.startsWith(c.dialCode));
    return match || COUNTRIES[0];
  };

  const initialNumber = () => {
    if (!user?.mobile) return '';
    const match = COUNTRIES.find((c) => user.mobile?.startsWith(c.dialCode));
    if (match) {
      return user.mobile.slice(match.dialCode.length).trim();
    }
    return user.mobile.replace(/[^0-9]/g, '');
  };

  const [name, setName] = useState(user?.name || 'Tawaab');
  const [email] = useState(user?.email || 'tawaab@studycord.app');
  const [country, setCountry] = useState<CountryInfo>(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profileUrl || AVATARS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    const formattedMobile = phoneNumber.trim() ? `${country.dialCode} ${phoneNumber.trim()}` : '';
    updateUser({
      name,
      mobile: formattedMobile,
      profileUrl: selectedAvatar,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/?tab=profile');
    }, 1000);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const inputBg = isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar
        title={tr('editProfile')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-5">
        {isGuest ? (
          <div className={`w-full ${surfaceBg} rounded-[20px] p-8 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-100'} flex flex-col items-center justify-center text-center space-y-4 my-8`}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to Edit Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts use default avatars and settings. Sign in to your StudyCord account to personalize your profile, choose avatars, and track your achievements!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/profile/edit')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Selected Avatar Preview */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="relative w-24 h-24 rounded-full border-4 border-[#ef5388] p-1 bg-white overflow-hidden shadow-md">
                <QImage imageUrl={selectedAvatar} width={88} height={88} circular alt="Avatar" />
              </div>
          <span className="text-xs font-semibold text-slate-400">Choose an Avatar</span>
        </div>

        {/* 10 Avatar Choices Grid */}
        <div className={`${surfaceBg} rounded-[10px] p-4 shadow-sm border border-black/5 dark:border-white/5`}>
          <div className="grid grid-cols-5 gap-3">
            {AVATARS.map((av, idx) => {
              const isSelected = selectedAvatar === av;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedAvatar(av);
                  }}
                  className={`relative aspect-square rounded-full p-1 border-2 transition-all ${
                    isSelected
                      ? 'border-[#ef5388] scale-110 shadow-md bg-white'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <QImage imageUrl={av} width={42} height={42} circular alt={`Avatar ${idx + 1}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className={`${surfaceBg} rounded-[10px] p-5 shadow-sm border border-black/5 dark:border-white/5 space-y-4`}>
          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs rounded-lg flex items-center justify-center space-x-1.5 font-bold">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-11 pl-10 pr-3 rounded-[8px] text-sm font-medium border border-slate-300 dark:border-slate-600 ${inputBg} ${textColor} outline-none focus:border-[#ef5388]`}
                required
              />
            </div>
          </div>

          {/* Email (Non-Editable) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Cannot be changed
              </span>
            </div>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                disabled
                className={`w-full h-11 pl-10 pr-9 rounded-[8px] text-sm font-medium border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 ${textColor} opacity-75 cursor-not-allowed outline-none`}
              />
              <Lock className="absolute right-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Phone with Country Code */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Phone Number</label>
            <div className={`relative flex items-center h-11 rounded-[8px] overflow-hidden border border-slate-300 dark:border-slate-600 focus-within:border-[#ef5388] ${inputBg}`}>
              <CountryCodePicker
                selectedCountry={country}
                onSelectCountry={setCountry}
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Phone Number (e.g. 801 234 5678)"
                className={`flex-1 h-full px-3 text-sm font-medium ${inputBg} ${textColor} outline-none`}
              />
            </div>
          </div>

          <div className="pt-2">
            <QButton type="submit" size="md">
              {tr('saveChanges')}
            </QButton>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}
