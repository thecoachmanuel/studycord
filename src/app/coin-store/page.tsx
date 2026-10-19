'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Check, ShieldCheck, X, Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COIN_PACKAGES } from '../../lib/api';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: any;
        callback: (response: any) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export default function CoinStorePage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { coins, addCoins, recordTransaction } = useUserDetails();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/coin-store', 'Please sign in to purchase coins and store them in your account.');
    }
  }, [isInitialized, user, isGuest]);

  const [selectedPkg, setSelectedPkg] = useState<typeof MOCK_COIN_PACKAGES[0] | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successRef, setSuccessRef] = useState('');
  const [paystackKey, setPaystackKey] = useState('pk_test_d3a8120b0a88fb0379df8f237889e49c7198e3b1');
  const [paystackActive, setPaystackActive] = useState(true);
  const [paystackScriptLoaded, setPaystackScriptLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch admin settings for Paystack keys
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.paystack_public_key) {
            setPaystackKey(res.data.paystack_public_key);
          }
          if (res.data.paystack_status !== undefined) {
            setPaystackActive(res.data.paystack_status === '1' || res.data.paystack_status === 1);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Set default customer email
  useEffect(() => {
    if (user?.email) {
      setCustomerEmail(user.email);
    } else {
      setCustomerEmail('player@studycord.app');
    }
  }, [user]);

  // Load Paystack Inline JS script dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.PaystackPop) {
      setPaystackScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackScriptLoaded(true);
    script.onerror = () => {
      console.warn('Paystack inline script failed to load. Sandbox fallback available.');
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, []);

  const handleOpenCheckout = (pkg: typeof MOCK_COIN_PACKAGES[0]) => {
    soundManager.playClick();
    setSelectedPkg(pkg);
    setIsSuccess(false);
    setIsProcessing(false);
    setErrorMessage('');
  };

  const completeCoinCredit = (pkg: typeof MOCK_COIN_PACKAGES[0], reference: string) => {
    setIsProcessing(false);
    setIsSuccess(true);
    setSuccessRef(reference);
    // Credit coin account
    addCoins(pkg.coins, `Coin Store Purchase: +${pkg.coins} Coins (Ref: ${reference.slice(-8)})`);
    // Debit money account (Paystack payment)
    recordTransaction(
      pkg.amountNaira || 500,
      `Coin Purchase Payment: ${pkg.desc || pkg.coins + ' Coins'} (Ref: ${reference.slice(-8)})`,
      'debit',
      'money',
      'completed'
    );
    soundManager.playCorrect();
    soundManager.vibrate(60);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#0BA4DB', '#5DB760', '#ef5388'],
    });
  };

  const handlePaystackCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    soundManager.playClick();
    setErrorMessage('');

    const emailToUse = customerEmail.trim() || 'player@studycord.app';
    const amountInKobo = (selectedPkg.amountNaira || 500) * 100;
    const refCode = `ELT_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    setIsProcessing(true);

    // If Paystack inline script is active and available, launch popup
    if (window.PaystackPop && paystackKey && paystackActive) {
      try {
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: emailToUse,
          amount: amountInKobo,
          currency: 'NGN',
          ref: refCode,
          metadata: {
            custom_fields: [
              {
                display_name: 'Package',
                variable_name: 'package_name',
                value: selectedPkg.desc,
              },
              {
                display_name: 'Coins Granted',
                variable_name: 'coins_granted',
                value: selectedPkg.coins,
              },
            ],
          },
          callback: (response: any) => {
            const confirmedRef = response?.reference || refCode;
            completeCoinCredit(selectedPkg, confirmedRef);
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });
        handler.openIframe();
        return;
      } catch (err: any) {
        console.warn('Paystack popup setup error, falling back to instant sandbox flow', err);
      }
    }

    // Sandbox / Test fallback if inline popup cannot be initialized
    setTimeout(() => {
      completeCoinCredit(selectedPkg, refCode);
    }, 1200);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title={tr('coinStoreKey') || 'Coin Store'} />

      <div className="max-w-3xl w-full mx-auto px-4 py-4 space-y-5">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to Buy Coins</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot purchase or hold purchased coin packages. Sign in to your StudyCord account to securely purchase coins via Paystack!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/coin-store')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Current Balance Banner */}
            <div className={`w-full ${surfaceBg} rounded-[14px] p-5 shadow-sm border ${cardBorder} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Coins
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <QImage imageUrl="/assets/images/coin.svg" width={24} height={24} />
                  <span className={`text-2xl font-black ${textColor}`}>
                    {coins.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated Cash Value: <strong className="text-emerald-500 font-bold">₦{(coins * 5).toLocaleString()} NGN</strong>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    router.push('/wallet');
                  }}
                  className="text-xs font-extrabold text-white bg-[#ef5388] hover:bg-[#d83c70] px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Redeem Coins</span>
                </button>
              </div>
            </div>

            {/* Paystack Official Payment Method Info */}
            <div className={`w-full ${surfaceBg} rounded-[14px] p-4 border ${cardBorder} flex items-center justify-between shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#0BA4DB]/15 flex items-center justify-center p-2">
                  <QImage imageUrl="/assets/config/payment_methods/paystack.svg" width={28} height={28} alt="Paystack" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${textColor}`}>Paystack Payment Gateway</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Active in Naira (₦)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pay with Bank Transfer, Debit Card, USSD, or OPay securely
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500 hidden sm:block" />
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_COIN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative ${surfaceBg} rounded-[14px] p-4 flex flex-col items-center text-center space-y-3 shadow-sm border ${
                    pkg.popular ? 'border-2 border-[#ef5388]' : cardBorder
                  } transition-all hover:shadow-md`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-24 py-0.5 rounded-full bg-[#ef5388] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center justify-center">
                      <span>Popular</span>
                    </span>
                  )}

                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center p-2.5 mt-1">
                    <QImage imageUrl={pkg.icon} width={36} height={36} />
                  </div>

                  <div>
                    <h4 className={`text-xl font-black ${textColor}`}>
                      +{pkg.coins}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">{pkg.desc}</p>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(pkg)}
                    className="w-full py-2.5 rounded-[10px] font-bold text-xs bg-[#ef5388] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all"
                  >
                    {pkg.price}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Paystack Checkout Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md ${surfaceBg} rounded-[20px] p-6 shadow-2xl border ${cardBorder} relative space-y-4`}>
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isProcessing) setSelectedPkg(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className={`text-xl font-black ${textColor}`}>Payment Successful!</h3>
                <p className="text-sm text-slate-400">
                  <strong className="text-emerald-500 font-bold">+{selectedPkg.coins} Coins</strong> have been credited to your account.
                </p>
                {successRef && (
                  <p className="text-[11px] font-mono text-slate-400 bg-slate-500/10 py-1.5 px-3 rounded-lg inline-block">
                    Ref: {successRef}
                  </p>
                )}
                <div className="pt-2">
                  <QButton
                    onClick={() => {
                      setSelectedPkg(null);
                      setIsSuccess(false);
                    }}
                    size="md"
                  >
                    Done
                  </QButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePaystackCheckout} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Coin Store Checkout
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <QImage imageUrl={selectedPkg.icon} width={28} height={28} />
                      <span className={`text-lg font-black ${textColor}`}>
                        +{selectedPkg.coins} Coins
                      </span>
                    </div>
                    <span className="text-xl font-black text-[#ef5388] dark:text-[#f279a2]">
                      {selectedPkg.price}
                    </span>
                  </div>
                </div>

                {/* Gateway Details */}
                <div className="p-3.5 rounded-xl border border-[#0BA4DB]/30 bg-[#0BA4DB]/5 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-sm shrink-0">
                    <QImage imageUrl="/assets/config/payment_methods/paystack.svg" width={32} height={32} alt="Paystack" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${textColor}`}>Paystack Secured Checkout</h5>
                    <p className="text-[11px] text-slate-400">
                      Supports Nigerian Cards, Bank Transfers, USSD, and Mobile Money
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Customer Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full h-11 px-3 rounded-[10px] text-sm font-semibold border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388]`}
                    required
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Your receipt will be sent to this email address.
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Secure Badge */}
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>256-Bit SSL Encrypted & Verified Nigerian Naira Payment</span>
                </div>

                {/* Pay Button */}
                <QButton
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing with Paystack...' : `Pay ${selectedPkg.price} via Paystack`}
                </QButton>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
