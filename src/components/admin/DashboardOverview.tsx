'use client';

import React from 'react';
import {
  Users,
  Layers,
  HelpCircle,
  Trophy,
  CreditCard,
  Flag,
  CheckCircle2,
  XCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalSubcategories: number;
  totalQuestions: number;
  totalContests: number;
  totalExams: number;
  pendingPayments: number;
  pendingReports: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentUsers: any[];
  recentPayments: any[];
  onActionPayment: (id: string, status: string) => void;
  onNavigateTab: (tab: string) => void;
}

export function DashboardOverview({
  stats,
  recentUsers,
  recentPayments,
  onActionPayment,
  onNavigateTab,
}: DashboardOverviewProps) {
  const statCards = [
    { title: 'Total Players', value: stats.totalUsers, icon: Users, color: 'from-blue-600 to-indigo-600', tab: 'users' },
    { title: 'Quiz Categories', value: stats.totalCategories, icon: Layers, color: 'from-emerald-600 to-teal-600', tab: 'categories' },
    { title: 'Questions Bank', value: stats.totalQuestions, icon: HelpCircle, color: 'from-purple-600 to-pink-600', tab: 'questions' },
    { title: 'Active Contests', value: stats.totalContests, icon: Trophy, color: 'from-amber-500 to-orange-600', tab: 'contests' },
    { title: 'Pending Payouts', value: stats.pendingPayments, icon: CreditCard, color: 'from-rose-600 to-red-600', tab: 'payments' },
    { title: 'Reported Questions', value: stats.pendingReports, icon: Flag, color: 'from-cyan-600 to-blue-600', tab: 'reports' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1c2942] to-[#151f32] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Admin Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time management for Elite Quiz application, questions, contests, and payouts.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
          <Database size={15} />
          <span>MongoDB Backend Active</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-[#151f32] hover:bg-[#1a273f] p-5 rounded-2xl border border-slate-800 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-white">{card.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Users & Pending Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Players */}
        <div className="bg-[#151f32] p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Users size={16} className="text-indigo-400" />
              <span>Recent Players</span>
            </h2>
            <button
              onClick={() => onNavigateTab('users')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">No player accounts recorded yet.</p>
            ) : (
              recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-400">{user.coins} Coins</div>
                    <div className="text-[11px] text-slate-500">{user.score} pts</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Withdrawal Requests */}
        <div className="bg-[#151f32] p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <CreditCard size={16} className="text-rose-400" />
              <span>Withdrawal Requests</span>
            </h2>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">No withdrawal requests.</p>
            ) : (
              recentPayments.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{p.payment_type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        p.status === '1' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.status === '2' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {p.status === '1' ? 'Approved' : p.status === '2' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{p.payment_address}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">${Number(p.amount).toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">{p.coin_used} Coins</div>
                    </div>

                    {p.status === '0' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onActionPayment(p.id, '1')}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => onActionPayment(p.id, '2')}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
