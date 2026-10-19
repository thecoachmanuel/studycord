'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Smartphone } from 'lucide-react';

export default function OtpPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, login } = useAuth();
  const { isDark } = useTheme();

  // Automatically take already signed-in users to homepage
  useEffect(() => {
    if (isInitialized && user && !isGuest) {
      router.replace('/');
    }
  }, [isInitialized, user, isGuest, router]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'code' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendCode = () => {
    if (!phoneNumber.trim()) return;
    setStep('code');
    setTimer(60);
  };

  const handleVerify = async () => {
    setLoading(true);
    await login(`${phoneNumber}@phone.com`, 'password');
    setLoading(false);
    router.replace('/');
  };

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const inputBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col`}>
      <QAppBar title="Phone Verification" />

      <div className="flex-1 max-w-sm w-full mx-auto px-6 py-10 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#ef5388]/15 flex items-center justify-center mb-6 text-[#ef5388] dark:text-[#f279a2]">
          <Smartphone className="w-8 h-8" />
        </div>

        {step === 'phone' ? (
          <div className="w-full space-y-5">
            <div className="text-center">
              <h2 className={`text-xl font-bold ${textColor} mb-1`}>Enter Your Phone Number</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We will send an SMS verification code to verify your phone number.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`h-12 px-3 rounded-[10px] ${inputBg} ${textColor} flex items-center font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700`}>
                +1
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Mobile number"
                className={`flex-1 h-12 px-4 rounded-[10px] text-sm font-medium ${inputBg} ${textColor} border border-slate-200 dark:border-slate-700 outline-none shadow-sm focus:border-[#ef5388]`}
              />
            </div>

            <QButton onClick={handleSendCode} size="md">
              Send Code
            </QButton>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className={`text-xl font-bold ${textColor} mb-1`}>Verification Code</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>

            {/* 6 OTP boxes */}
            <div className="flex justify-between space-x-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className={`w-11 h-14 text-center text-xl font-bold rounded-[10px] ${inputBg} ${textColor} border border-slate-200 dark:border-slate-700 outline-none focus:border-[#ef5388] shadow-sm`}
                />
              ))}
            </div>

            <QButton onClick={handleVerify} loading={loading} size="md">
              Verify & Proceed
            </QButton>

            <div className="text-center">
              {timer > 0 ? (
                <span className="text-xs text-slate-400">Resend code in {timer}s</span>
              ) : (
                <button
                  onClick={() => setTimer(60)}
                  className="text-xs font-bold text-[#ef5388] dark:text-[#f279a2] hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
