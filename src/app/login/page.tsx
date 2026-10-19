'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { StudyCordLogo } from '../../components/common/StudyCordLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';
  const { user, isGuest, isInitialized, login, loginAsGuest } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  // Already signed-in users are automatically taken to the destination / homepage
  useEffect(() => {
    if (isInitialized && user && !isGuest) {
      router.replace(redirectTarget);
    }
  }, [isInitialized, user, isGuest, router, redirectTarget]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    soundManager.playClick();
    setLoading(true);
    setError('');
    await login(email, password);
    setLoading(false);
    router.replace(redirectTarget);
  };

  const handleGuest = () => {
    soundManager.playClick();
    loginAsGuest();
    router.replace('/');
  };

  const inputBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const placeholderColor = isDark ? 'placeholder-slate-400' : 'placeholder-slate-400';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-center items-center px-6 py-10 transition-colors select-none`}>
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Logo - using current StudyCordLogo */}
        <div className="mb-8 flex justify-center">
          <StudyCordLogo size="xl" isDark={isDark} />
        </div>

        {/* Form Container */}
        <form onSubmit={handleSignIn} className="w-full space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg text-center">
              {error}
            </div>
          )}

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

          {/* Forgot Password link */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-[#ef5388] dark:text-[#f279a2] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In button */}
          <div className="pt-2">
            <QButton type="submit" loading={loading} size="md">
              {tr('loginLbl')}
            </QButton>
          </div>
        </form>

        {/* Go to Sign Up */}
        <div className="mt-4 text-center">
          <span className={`text-xs ${textColor} opacity-80`}>
            Don't have an account?{' '}
          </span>
          <Link
            href="/sign-up"
            className="text-xs font-bold text-[#ef5388] dark:text-[#f279a2] hover:underline"
          >
            Sign Up
          </Link>
        </div>

        {/* OR Divider */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="px-3 text-xs uppercase font-medium text-slate-400">
            {tr('orLbl')}
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Social Media Login Methods (Visible but Grayed Out by Default) */}
        <div className="w-full flex flex-col items-center mb-5">
          <div className="flex justify-center space-x-4 mb-2">
            {/* Google (Grayed Out) */}
            <div
              className={`w-12 h-12 rounded-[10px] ${inputBg} border border-slate-300/40 dark:border-slate-700/40 shadow-sm flex items-center justify-center opacity-40 grayscale cursor-not-allowed select-none`}
              title="Google Sign In (Coming Soon)"
            >
              <QImage imageUrl="/assets/images/google_icon.svg" width={24} height={24} />
            </div>

            {/* Apple (Grayed Out) */}
            <div
              className={`w-12 h-12 rounded-[10px] ${inputBg} border border-slate-300/40 dark:border-slate-700/40 shadow-sm flex items-center justify-center opacity-40 grayscale cursor-not-allowed select-none`}
              title="Apple Sign In (Coming Soon)"
            >
              <QImage imageUrl="/assets/images/appleicon.svg" width={24} height={24} />
            </div>

            {/* Phone (Grayed Out) */}
            <div
              className={`w-12 h-12 rounded-[10px] ${inputBg} border border-slate-300/40 dark:border-slate-700/40 shadow-sm flex items-center justify-center opacity-40 grayscale cursor-not-allowed select-none text-slate-400`}
              title="Phone SMS Sign In (Coming Soon)"
            >
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            Social & Phone Sign-in coming soon
          </span>
        </div>

        {/* Guest Mode Button */}
        <button
          onClick={handleGuest}
          className="text-xs font-semibold text-slate-500 hover:text-[#ef5388] dark:text-slate-400 transition-colors py-2"
        >
          {tr('continueAsGuest')}
        </button>

        {/* Terms footer */}
        <p className="mt-8 text-[11px] text-center text-slate-400 max-w-xs leading-relaxed">
          {tr('agreeTerms')}
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${inputBg} rounded-[20px] p-6 shadow-xl`}>
            <h3 className={`text-lg font-bold ${textColor} mb-2`}>Reset Password</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            {forgotSent ? (
              <div className="text-center py-4">
                <span className="text-sm font-semibold text-green-600">
                  Password reset link sent! Check your inbox.
                </span>
                <div className="mt-4">
                  <QButton
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    size="sm"
                  >
                    Done
                  </QButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full h-11 px-4 rounded-[10px] text-sm border border-slate-300 dark:border-slate-600 ${inputBg} ${textColor} outline-none`}
                />
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
                  >
                    Cancel
                  </button>
                  <QButton
                    onClick={() => {
                      if (forgotEmail) setForgotSent(true);
                    }}
                    size="sm"
                    className="flex-1"
                  >
                    Send
                  </QButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#ef5388] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading...</span>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
