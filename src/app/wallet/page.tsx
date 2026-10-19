'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Wallet,
  Check,
  AlertCircle,
  Clock,
  CheckCircle2,
  History,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Receipt,
  Coins,
  ArrowRightLeft,
  X,
  Sparkles,
} from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { MOCK_TRANSACTIONS } from '../../lib/api';

const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '/assets/images/wallet_icon.svg', placeholder: 'Bank Name, 10-Digit Account Number & Full Account Name' },
  { id: 'opay', name: 'OPay', icon: '/assets/images/coin.svg', placeholder: 'OPay Registered Phone Number / Account Name' },
  { id: 'palmpay', name: 'PalmPay', icon: '/assets/images/coin.svg', placeholder: 'PalmPay Registered Phone Number / Account Name' },
];

interface PayoutRequest {
  id: string;
  payment_type: string;
  payment_address: string;
  coin_used: number;
  amount: number;
  status: string; // '0': Pending, '1': Approved, '2': Rejected
  request_date: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { coins, addCoins, deductCoins, recordTransaction } = useUserDetails();

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/wallet', 'Please sign in to access your wallet, view your balances, and submit cash withdrawals.');
    }
  }, [isInitialized, user, isGuest]);

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [accountDetail, setAccountDetail] = useState('');
  const [coinsToRedeem, setCoinsToRedeem] = useState('200');
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutEnabled, setPayoutEnabled] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState('Payout requests are temporarily paused by the administrator.');
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Dual-Asset Debit & Credit Ledger state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ledgerAccount, setLedgerAccount] = useState<'all' | 'coin' | 'money'>('all');
  const [ledgerType, setLedgerType] = useState<'all' | 'credit' | 'debit'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntryAccount, setNewEntryAccount] = useState<'coin' | 'money'>('coin');
  const [newEntryType, setNewEntryType] = useState<'credit' | 'debit'>('credit');
  const [newEntryAmount, setNewEntryAmount] = useState('');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [entryError, setEntryError] = useState('');

  const minCoins = 200;
  const parsedCoins = parseInt(coinsToRedeem || '0', 10);
  const redeemAmountNaira = isNaN(parsedCoins) ? 0 : parsedCoins * 5;

  const loadTransactions = () => {
    try {
      const saved = localStorage.getItem('app_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
          return;
        }
      }
      setTransactions(MOCK_TRANSACTIONS);
      localStorage.setItem('app_transactions', JSON.stringify(MOCK_TRANSACTIONS));
    } catch {
      setTransactions(MOCK_TRANSACTIONS);
    }
  };

  // Load existing payout requests, system settings and transactions
  const fetchPayoutsAndSettings = async () => {
    try {
      const [payRes, setRes] = await Promise.all([
        fetch('/api/payments').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/settings').then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (payRes && payRes.success && Array.isArray(payRes.data)) {
        setPayoutHistory(payRes.data);
      }

      if (setRes && setRes.success && setRes.data) {
        const isEnabled = setRes.data.payout_request_status === '1';
        setPayoutEnabled(isEnabled);
        if (setRes.data.payout_disabled_message) {
          setDisabledMessage(setRes.data.payout_disabled_message);
        }
      }
    } catch {
      // Offline fallback
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchPayoutsAndSettings();
    loadTransactions();
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutEnabled) {
      setErrorMsg(disabledMessage || 'Payout requests are currently paused by the administrator.');
      return;
    }
    const amount = parseInt(coinsToRedeem, 10);
    if (isNaN(amount) || amount < minCoins) {
      setErrorMsg(`Minimum redeemable amount is ${minCoins} coins (₦${(minCoins * 5).toLocaleString()}).`);
      return;
    }
    if (!accountDetail.trim()) {
      setErrorMsg('Please enter your payout account details.');
      return;
    }

    if (coins < amount) {
      setErrorMsg(`Insufficient coin balance. You have ${coins} coins.`);
      return;
    }

    setIsSubmitting(true);
    // Deduct coins (records Coin Account Debit)
    const success = deductCoins(amount, `Coin Redemption (${selectedMethod.toUpperCase()})`);
    if (!success) {
      setErrorMsg('Insufficient coin balance.');
      setIsSubmitting(false);
      return;
    }

    // Record Money Account Outflow / Withdrawal Debit
    recordTransaction(
      amount * 5,
      `Payout Cashout (${selectedMethod.toUpperCase()} to ${accountDetail})`,
      'debit',
      'money',
      'pending'
    );

    // Refresh transactions
    setTimeout(() => {
      loadTransactions();
    }, 200);

    // Play celebration & haptic
    soundManager.playCorrect();
    soundManager.vibrate(50);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#ef5388', '#5DB760', '#FFD700'],
    });

    // Submit payment request to backend database
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: '101',
          payment_type: selectedMethod.toUpperCase(),
          payment_address: accountDetail,
          coin_used: amount,
          amount: (amount * 5).toFixed(2),
        }),
      });
      if (res.ok) {
        fetchPayoutsAndSettings();
      }
    } catch {
      // Saved in memory
    }

    setIsSubmitting(false);
    setErrorMsg('');
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setAccountDetail('');
    }, 4000);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setEntryError('');
    const amt = parseFloat(newEntryAmount);
    if (isNaN(amt) || amt <= 0) {
      setEntryError('Please enter an amount greater than 0.');
      return;
    }

    const defaultTitle =
      newEntryAccount === 'coin'
        ? newEntryType === 'credit'
          ? 'Manual Coin Credit Reward'
          : 'Manual Coin Debit Expense'
        : newEntryType === 'credit'
        ? 'Manual Money Deposit Credit'
        : 'Manual Money Withdrawal Debit';

    const finalTitle = newEntryTitle.trim() || defaultTitle;

    if (newEntryAccount === 'coin') {
      if (newEntryType === 'credit') {
        addCoins(Math.round(amt), finalTitle);
      } else {
        if (coins < amt) {
          setEntryError(`Insufficient coin balance. Current balance: ${coins} coins.`);
          return;
        }
        deductCoins(Math.round(amt), finalTitle);
      }
    } else {
      recordTransaction(amt, finalTitle, newEntryType, 'money', 'completed');
    }

    soundManager.playCorrect();
    soundManager.vibrate(50);
    setTimeout(() => {
      loadTransactions();
    }, 150);

    setShowAddModal(false);
    setNewEntryAmount('');
    setNewEntryTitle('');
  };

  // Metrics for Ledger
  const filteredTransactions = transactions.filter((tx) => {
    const matchAccount = ledgerAccount === 'all' || (tx.account || 'coin') === ledgerAccount;
    const matchType = ledgerType === 'all' || tx.type === ledgerType;
    return matchAccount && matchType;
  });

  const totalCoinCredits = transactions
    .filter((tx) => (tx.account || 'coin') === 'coin' && tx.type === 'credit')
    .reduce((acc, tx) => acc + (tx.numericAmount || parseInt(String(tx.coins).replace(/[^0-9]/g, ''), 10) || 0), 0);

  const totalCoinDebits = transactions
    .filter((tx) => (tx.account || 'coin') === 'coin' && tx.type === 'debit')
    .reduce((acc, tx) => acc + (tx.numericAmount || parseInt(String(tx.coins).replace(/[^0-9]/g, ''), 10) || 0), 0);

  const totalMoneyCredits = transactions
    .filter((tx) => tx.account === 'money' && tx.type === 'credit')
    .reduce((acc, tx) => acc + (tx.numericAmount || 0), 0);

  const totalMoneyDebits = transactions
    .filter((tx) => tx.account === 'money' && tx.type === 'debit')
    .reduce((acc, tx) => acc + (tx.numericAmount || 0), 0);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-10 select-none`}>
      <QAppBar
        title={tr('wallet')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {isGuest ? (
          <div className={`w-full ${surfaceBg} rounded-[20px] p-8 shadow-sm border ${cardBorder} flex flex-col items-center justify-center text-center space-y-4 my-8`}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to Access Your Wallet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot hold withdrawable balances or submit cash payouts. Sign in to your StudyCord account to manage your funds and request withdrawals!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/wallet')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Balance Card */}
        <div className={`w-full ${surfaceBg} rounded-[14px] p-5 shadow-sm border ${cardBorder} flex items-center justify-between`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Balance
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <QImage imageUrl="/assets/images/coin.svg" width={24} height={24} />
              <span className={`text-3xl font-black ${textColor}`}>
                {coins.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Redeemable Value: <strong className="text-emerald-500 font-bold">₦{(coins * 5).toLocaleString()} NGN</strong>
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-[#ef5388]/15 flex items-center justify-center">
            <QImage
              imageUrl="/assets/images/wallet_icon.svg"
              width={26}
              height={26}
              color={isDark ? '#f279a2' : '#ef5388'}
              alt="Wallet"
            />
          </div>
        </div>

        {/* Payout Status Banner when Disabled */}
        {!payoutEnabled && (
          <div className={`p-4 rounded-[14px] ${surfaceBg} border border-amber-500/30 text-center space-y-2 shadow-sm`}>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
              <Lock className="w-3.5 h-3.5" />
              <span>Payout Requests Inactive (Default)</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {disabledMessage}
            </p>
          </div>
        )}

        {/* Payout Methods Selector & Form Container (Grayed out and disabled when payout is toggled off) */}
        <div className={`space-y-4 ${!payoutEnabled ? 'filter grayscale contrast-75 opacity-60' : ''}`}>
          {/* Payout Methods Selector */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
              Select Payout Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((m) => {
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!payoutEnabled}
                    onClick={() => {
                      if (!payoutEnabled) return;
                      soundManager.playClick();
                      setSelectedMethod(m.id);
                    }}
                    className={`h-20 rounded-[12px] p-2 flex flex-col items-center justify-center space-y-1.5 border shadow-sm transition-all ${
                      !payoutEnabled ? 'cursor-not-allowed opacity-60' : 'active:scale-95'
                    } ${
                      isSelected
                        ? `border-2 border-[#ef5388] ${surfaceBg} shadow-md`
                        : `border ${cardBorder} ${surfaceBg} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center p-0.5 overflow-hidden">
                      <QImage imageUrl={m.icon} width={38} height={38} alt={m.name} />
                    </div>
                    <span className={`text-[12px] font-bold ${textColor}`}>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Redemption Form */}
          <form onSubmit={handleRedeem} className={`${surfaceBg} rounded-[14px] p-5 shadow-sm border ${cardBorder} space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-sm uppercase tracking-wider ${textColor}`}>
                Redeem Coins
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">100 Coins = ₦500 NGN</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Redemption request submitted! Payout will arrive in 1-3 business days.</span>
              </div>
            )}

            {/* Quick Amount Selector Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Quick Select Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '200 Coins', val: 200 },
                  { label: '500 Coins', val: 500 },
                  { label: '1,000 Coins', val: 1000 },
                  { label: 'Max Balance', val: coins },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={!payoutEnabled}
                    onClick={() => {
                      if (!payoutEnabled) return;
                      soundManager.playClick();
                      setCoinsToRedeem(String(chip.val));
                    }}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all ${
                      !payoutEnabled ? 'cursor-not-allowed opacity-60' : 'active:scale-95'
                    } ${
                      parseInt(coinsToRedeem, 10) === chip.val
                        ? 'border-[#ef5388] bg-[#ef5388]/10 text-[#ef5388]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coins input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Coins to Redeem</label>
              <input
                type="number"
                min={minCoins}
                step={50}
                disabled={!payoutEnabled}
                value={coinsToRedeem}
                onChange={(e) => setCoinsToRedeem(e.target.value)}
                className={`w-full h-11 px-3 rounded-[8px] text-sm font-semibold border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388] ${
                  !payoutEnabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''
                }`}
                required
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Cashout Payout: <strong className="text-emerald-500">₦{redeemAmountNaira.toLocaleString()} NGN</strong> (Min: 200 coins)
              </span>
            </div>

            {/* Account Details */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                {PAYMENT_METHODS.find((p) => p.id === selectedMethod)?.name} Account Details
              </label>
              <input
                type="text"
                disabled={!payoutEnabled}
                value={accountDetail}
                onChange={(e) => setAccountDetail(e.target.value)}
                placeholder={PAYMENT_METHODS.find((p) => p.id === selectedMethod)?.placeholder}
                className={`w-full h-11 px-3 rounded-[8px] text-sm font-semibold border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388] ${
                  !payoutEnabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''
                }`}
                required
              />
            </div>

            {!payoutEnabled ? (
              <button
                type="button"
                disabled
                className="w-full h-12 rounded-[10px] bg-slate-300 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed flex items-center justify-center space-x-2 border border-slate-300/60 dark:border-slate-600 select-none"
                title="Payout requests are disabled by administrator"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Request Payout (Disabled)</span>
              </button>
            ) : (
              <QButton type="submit" size="md" disabled={isSubmitting}>
                {isSubmitting ? 'Processing Request...' : `Request Payout (₦${redeemAmountNaira.toLocaleString()} NGN)`}
              </QButton>
            )}
          </form>
        </div>

        {/* Live Payout Requests History */}
        <div className={`${surfaceBg} rounded-[14px] p-5 shadow-sm border ${cardBorder} space-y-3`}>
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#ef5388]" />
            <h3 className={`font-bold text-sm uppercase tracking-wider ${textColor}`}>
              Payout Requests History
            </h3>
          </div>

          {payoutHistory.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No recent payout requests recorded. Submit your first request above!
            </p>
          ) : (
            <div className="space-y-2.5 divide-y divide-black/5 dark:divide-white/5">
              {payoutHistory.map((item) => {
                const isApproved = item.status === '1';
                const isPending = item.status === '0';
                return (
                  <div key={item.id} className="pt-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold">
                        <span className={textColor}>{item.payment_type}</span>
                        <span className="text-slate-400 font-normal">({item.payment_address})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{item.request_date}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-500 block">
                        +₦{Number(item.amount).toLocaleString()} NGN
                      </span>
                      <span className="text-[10px] flex items-center justify-end space-x-1">
                        {isApproved ? (
                          <span className="text-emerald-500 font-bold flex items-center space-x-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        ) : isPending ? (
                          <span className="text-amber-500 font-bold flex items-center space-x-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold">Rejected</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dual Account Ledger: Debit & Credit Statements */}
        <div className={`${surfaceBg} rounded-[16px] p-5 sm:p-6 shadow-sm border ${cardBorder} space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ef5388]/15 flex items-center justify-center text-[#ef5388]">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-black text-base uppercase tracking-wider ${textColor}`}>
                  Account Ledger: Debit & Credit
                </h3>
                <p className="text-xs text-slate-400">
                  Track and examine debit entries and credit entries for Coin (🪙) and Money (₦) accounts
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setEntryError('');
                setShowAddModal(true);
              }}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#f472b6] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          </div>

          {/* Dual Balance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Coin Account Card */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1b2b42] border-slate-700/70' : 'bg-slate-50/80 border-slate-200/80'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500 font-bold text-xs">
                    🪙
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
                    Coin Account
                  </span>
                </div>
                <span className="text-xs font-black text-amber-500">
                  {coins.toLocaleString()} Coins
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/5 dark:border-white/5 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Credits (+)</span>
                  <span className="font-bold text-emerald-500 flex items-center space-x-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+{totalCoinCredits.toLocaleString()}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Debits (-)</span>
                  <span className="font-bold text-rose-500 flex items-center space-x-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>-{totalCoinDebits.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Money Account Card */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1b2b42] border-slate-700/70' : 'bg-slate-50/80 border-slate-200/80'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-500 font-bold text-xs">
                    ₦
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
                    Money Account (NGN)
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-500">
                  ₦{(coins * 5).toLocaleString()} Value
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/5 dark:border-white/5 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Credits (+)</span>
                  <span className="font-bold text-emerald-500 flex items-center space-x-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+₦{totalMoneyCredits.toLocaleString()}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Debits (-)</span>
                  <span className="font-bold text-rose-500 flex items-center space-x-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>-₦{totalMoneyDebits.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters: Account Tabs & Entry Type Pills */}
          <div className="space-y-3 pt-2">
            {/* Account Selector Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Accounts' },
                { id: 'coin', label: '🪙 Coin Account' },
                { id: 'money', label: '₦ Money Account' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setLedgerAccount(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    ledgerAccount === tab.id
                      ? 'bg-[#ef5388] text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type Filter Pills: All, Credits, Debits */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Filter:
              </span>
              {[
                { id: 'all', label: 'All Entries' },
                { id: 'credit', label: '🟢 Credits (+)' },
                { id: 'debit', label: '🔴 Debits (-)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setLedgerType(filter.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all border ${
                    ledgerType === filter.id
                      ? 'border-[#ef5388] bg-[#ef5388]/10 text-[#ef5388]'
                      : isDark
                      ? 'border-slate-700 text-slate-400 hover:border-slate-500'
                      : 'border-slate-200 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger Records List */}
          <div className="space-y-2.5 pt-1">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed rounded-xl border-slate-300 dark:border-slate-700">
                <Receipt className="w-8 h-8 mx-auto text-slate-400" />
                <p className={`text-sm font-bold ${textColor}`}>No Ledger Entries Found</p>
                <p className="text-xs text-slate-400">
                  No {ledgerType === 'all' ? '' : ledgerType} entries recorded for {ledgerAccount === 'all' ? 'the selected filter' : `${ledgerAccount} account`}.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5 space-y-2">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  const isCoin = (tx.account || 'coin') === 'coin';

                  const numericVal =
                    tx.numericAmount !== undefined
                      ? tx.numericAmount
                      : parseInt(String(tx.coins || '0').replace(/[^0-9]/g, ''), 10) || 0;

                  const formattedDisplay = isCoin
                    ? `${isCredit ? '+' : '-'}${numericVal.toLocaleString()} Coins`
                    : `${isCredit ? '+' : '-'}₦${numericVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

                  return (
                    <div
                      key={tx.id}
                      className="pt-2.5 flex items-center justify-between text-xs hover:opacity-95 transition-opacity"
                    >
                      {/* Left side: Icon, title, badges, timestamp */}
                      <div className="flex items-start space-x-3 pr-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isCredit
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : 'bg-rose-500/15 text-rose-500'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 ${textColor}`}>
                            {tx.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Account Badge */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                                isCoin
                                  ? 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20'
                              }`}
                            >
                              {isCoin ? '🪙 COIN' : '₦ MONEY'}
                            </span>

                            {/* Entry Type Badge */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                isCredit
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {isCredit ? 'CREDIT (+)' : 'DEBIT (-)'}
                            </span>

                            {/* Timestamp */}
                            <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{tx.date}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Amount and status */}
                      <div className="text-right shrink-0">
                        <span
                          className={`font-black text-xs sm:text-sm block ${
                            isCredit ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {formattedDisplay}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {tx.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Manual Debit/Credit Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md ${surfaceBg} rounded-[20px] p-6 shadow-2xl border ${cardBorder} space-y-4`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-[#ef5388]" />
                <h3 className={`font-black text-base uppercase tracking-wider ${textColor}`}>
                  Add Debit / Credit Entry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {entryError && (
              <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{entryError}</span>
              </div>
            )}

            <form onSubmit={handleManualEntry} className="space-y-4">
              {/* Account selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Account
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setNewEntryAccount('coin');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      newEntryAccount === 'coin'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20'
                        : isDark
                        ? 'border-slate-700 text-slate-400'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>🪙 Coin Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setNewEntryAccount('money');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      newEntryAccount === 'money'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20'
                        : isDark
                        ? 'border-slate-700 text-slate-400'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>₦ Money Account</span>
                  </button>
                </div>
              </div>

              {/* Entry type selection: Credit (+) vs Debit (-) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Entry Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setNewEntryType('credit');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      newEntryType === 'credit'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20'
                        : isDark
                        ? 'border-slate-700 text-slate-400'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>🟢 Credit (Inflow / +)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setNewEntryType('debit');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      newEntryType === 'debit'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-500 ring-2 ring-rose-500/20'
                        : isDark
                        ? 'border-slate-700 text-slate-400'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>🔴 Debit (Outflow / -)</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Amount {newEntryAccount === 'coin' ? '(Coins)' : '(₦ NGN)'}
                </label>
                <input
                  type="number"
                  min="1"
                  step={newEntryAccount === 'coin' ? '1' : '0.01'}
                  value={newEntryAmount}
                  onChange={(e) => setNewEntryAmount(e.target.value)}
                  placeholder={newEntryAccount === 'coin' ? 'e.g. 100' : 'e.g. 1500.00'}
                  className={`w-full h-11 px-3 rounded-[10px] text-sm font-semibold border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388]`}
                  required
                />
              </div>

              {/* Title / Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Description / Reference
                </label>
                <input
                  type="text"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  placeholder={
                    newEntryAccount === 'coin'
                      ? 'e.g. Bonus Achievement Reward'
                      : 'e.g. Platform Bank Transfer Deposit'
                  }
                  className={`w-full h-11 px-3 rounded-[10px] text-sm font-semibold border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388]`}
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 h-11 rounded-[10px] border border-slate-300 dark:border-slate-600 font-bold text-xs ${textColor} hover:bg-black/5 dark:hover:bg-white/5`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-[10px] bg-[#ef5388] hover:bg-[#d83c70] text-white font-black text-xs shadow-md active:scale-95 transition-all"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
