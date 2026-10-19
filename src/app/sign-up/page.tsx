'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Tag, Gift } from 'lucide-react';
import { StudyCordLogo } from '../../components/common/StudyCordLogo';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isGuest, isInitialized, login, updateUser } = useAuth();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referCode, setReferCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill referral code from URL if present (?ref=CODE or ?referCode=CODE)
  useEffect(() => {
    const refParam = searchParams.get('ref') || searchParams.get('referCode');
    if (refParam) {
      setReferCode(refParam.trim().toUpperCase());
    }
  }, [searchParams]);

  // Automatically take already signed-in users to homepage
  useEffect(() => {
    if (isInitialized && user && !isGuest) {
      router.replace('/');
    }
  }, [isInitialized, user, isGuest, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    soundManager.playClick();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: '',
          referCode: referCode.trim(),
          coins: 250,
          score: 0,
          payout_eligible: false,
        }),
      });
      const data = await res.json();
      if (!res.ok && data.message && data.message !== 'User already exists') {
        throw new Error(data.message);
      }

      await login(email, password);
      if (data.user) {
        updateUser({
          userId: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          coins: String(data.user.coins),
          allTimeScore: String(data.user.score || 0),
          referCode: data.user.refer_code,
        });
      }

      try {
        localStorage.setItem('studycord_show_welcome_modal', 'true');
        localStorage.setItem('studycord_welcome_coins', String(data.welcomeCoins || (referCode ? 300 : 250)));
      } catch {}

      setLoading(false);
      router.replace('/profile/edit');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  const inputBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const placeholderColor = isDark ? 'placeholder-slate-400' : 'placeholder-slate-400';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-center items-center px-6 py-10 transition-colors select-none`}>
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Logo */}
        <div className="mb-4 flex justify-center">
          <StudyCordLogo size="xl" isDark={isDark} />
        </div>

        <h2 className={`text-xl font-bold ${textColor} mb-3 tracking-tight`}>
          Create New Account
        </h2>

        {/* Welcome Offer Banner */}
        <div className="w-full mb-5 p-3.5 rounded-[14px] bg-gradient-to-r from-pink-500/15 via-[#ef5388]/10 to-amber-500/15 border border-[#ef5388]/30 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ef5388] to-[#f279a2] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#ef5388] text-white">
                Welcome Offer
              </span>
              <span className="text-xs font-black text-amber-500">
                {referCode ? '+300 Free Coins' : '+250 Free Coins'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-tight mt-1">
              {referCode
                ? '250 Welcome Pack + 50 Referral Bonus automatically applied!'
                : 'Sign up now and receive 250 free starter coins to play all games!'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSignUp} className="w-full space-y-3.5">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Name input */}
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={`w-full h-12 pl-11 pr-4 rounded-[10px] text-sm font-medium ${inputBg} ${textColor} ${placeholderColor} border border-transparent focus:border-[#ef5388] outline-none shadow-sm transition-all`}
              required
            />
          </div>

          {/* Email input */}
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full h-12 pl-11 pr-4 rounded-[10px] text-sm font-medium ${inputBg} ${textColor} ${placeholderColor} border border-transparent focus:border-[#ef5388] outline-none shadow-sm transition-all`}
              required
            />
          </div>

          {/* Password input */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full h-12 pl-11 pr-11 rounded-[10px] text-sm font-medium ${inputBg} ${textColor} ${placeholderColor} border border-transparent focus:border-[#ef5388] outline-none shadow-sm transition-all`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password input */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full h-12 pl-11 pr-4 rounded-[10px] text-sm font-medium ${inputBg} ${textColor} ${placeholderColor} border border-transparent focus:border-[#ef5388] outline-none shadow-sm transition-all`}
              required
            />
          </div>

          {/* Referral Code (Optional) */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <Tag className="absolute left-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={referCode}
                onChange={(e) => setReferCode(e.target.value.toUpperCase())}
                placeholder="Referral Code (Optional)"
                className={`w-full h-12 pl-11 pr-4 rounded-[10px] text-sm font-medium tracking-wide uppercase ${inputBg} ${textColor} ${placeholderColor} border border-transparent focus:border-[#ef5388] outline-none shadow-sm transition-all`}
              />
            </div>
            {referCode && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-[#ef5388]/20 text-[#ef5388] text-[11px] font-semibold animate-in fade-in duration-200">
                <Gift className="w-3.5 h-3.5 shrink-0" />
                <span>Referral invite code active: +50 Bonus Coins on signup!</span>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <QButton type="submit" loading={loading} size="md">
              {tr('signUpLbl')}
            </QButton>
          </div>
        </form>

        {/* Back to Login link */}
        <div className="mt-5 text-center">
          <span className={`text-xs ${textColor} opacity-80`}>
            Already have an account?{' '}
          </span>
          <Link
            href="/login"
            className="text-xs font-bold text-[#ef5388] dark:text-[#f279a2] hover:underline"
          >
            Login
          </Link>
        </div>

        {/* Terms footer */}
        <p className="mt-8 text-[11px] text-center text-slate-400 max-w-xs leading-relaxed">
          {tr('agreeTerms')}
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#233354] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#ef5388] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
