'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Coins, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_TRANSACTIONS } from '../../lib/api';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';

interface CoinTransaction {
  id: string;
  date: string;
  title: string;
  coins?: string;
  amount?: string;
  numericAmount?: number;
  type: string;
  account?: string;
}

export default function CoinHistoryPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const [transactions, setTransactions] = useState<CoinTransaction[]>(MOCK_TRANSACTIONS);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/coin-history', 'Please sign in to view your coin transaction history.');
    }
  }, [isInitialized, user, isGuest]);

  useEffect(() => {
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
  }, []);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  // Only coin transactions in coin history or all
  const coinTransactions = transactions.filter((tx) => (tx.account || 'coin') === 'coin');

  const totalCredits = coinTransactions
    .filter((tx) => tx.type === 'credit')
    .reduce((acc, tx) => acc + (tx.numericAmount || parseInt(String(tx.coins || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);

  const totalDebits = coinTransactions
    .filter((tx) => tx.type === 'debit')
    .reduce((acc, tx) => acc + (tx.numericAmount || parseInt(String(tx.coins || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);

  const filtered = coinTransactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar
        title={tr('coinHistory')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-3.5">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to View Coin History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts do not have persistent coin transaction history. Sign in to your StudyCord account to track your earned and spent coins!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/coin-history')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Debit & Credit Summary Header */}
            <div className={`w-full ${surfaceBg} rounded-[14px] p-4 border ${cardBorder} shadow-sm grid grid-cols-2 gap-3`}>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Coins Earned (Credits)
                </span>
                <div className="flex items-center space-x-1 font-black text-emerald-500 text-lg">
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                  <span>+{totalCredits.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Coins Spent (Debits)
                </span>
                <div className="flex items-center justify-end space-x-1 font-black text-rose-500 text-lg">
                  <ArrowDownRight className="w-4 h-4 shrink-0" />
                  <span>-{totalDebits.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Filter:</span>
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'credit', label: '🟢 Credits (+)' },
                { id: 'debit', label: '🔴 Debits (-)' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setFilterType(pill.id as any);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                    filterType === pill.id
                      ? 'border-[#ef5388] bg-[#ef5388]/10 text-[#ef5388]'
                      : isDark
                      ? 'border-slate-700 text-slate-400 hover:border-slate-500'
                      : 'border-slate-200 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Coins className="w-8 h-8" />
                </div>
                <p className={`text-base font-semibold ${textColor}`}>No Coin Transactions</p>
                <p className="text-xs text-slate-400">
                  No {filterType === 'all' ? '' : filterType} records found.
                </p>
              </div>
            ) : (
              filtered.map((tx) => {
                const isDeduction = tx.type === 'debit';
                const pointsRaw =
                  tx.numericAmount !== undefined
                    ? tx.numericAmount
                    : parseInt(String(tx.coins || '0').replace(/[^0-9]/g, ''), 10) || 0;
                const displayPoints = isDeduction ? `-${pointsRaw}` : `+${pointsRaw}`;

                return (
                  <div
                    key={tx.id}
                    className={`w-full ${surfaceBg} rounded-[12px] px-4 py-3.5 flex items-center justify-between border ${cardBorder} shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
                  >
                    {/* Left: Transaction Details */}
                    <div className="flex-1 pr-3">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            !isDeduction
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {!isDeduction ? 'CREDIT (+)' : 'DEBIT (-)'}
                        </span>
                      </div>
                      <h4 className={`font-semibold text-sm leading-snug line-clamp-1 ${textColor}`}>
                        {tx.title}
                      </h4>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-[#fefefe]/50' : 'text-[#45536d]/50'}`} />
                        <span className={`text-xs ${isDark ? 'text-[#fefefe]/50' : 'text-[#45536d]/50'}`}>
                          {tx.date}
                        </span>
                      </div>
                    </div>

                    {/* Right: Flutter _CoinBadge (gradient pill with glow shadow) */}
                    <div
                      className={`px-3 py-1.5 rounded-[8px] text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center shrink-0 ${
                        isDeduction
                          ? 'bg-gradient-to-br from-[#FF6169]/90 to-[#FF6169] shadow-[0_2px_8px_rgba(255,97,105,0.25)]'
                          : 'bg-gradient-to-br from-[#5DB760]/90 to-[#5DB760] shadow-[0_2px_8px_rgba(93,183,96,0.25)]'
                      }`}
                    >
                      {displayPoints}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
