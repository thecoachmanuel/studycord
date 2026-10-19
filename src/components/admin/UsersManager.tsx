'use client';

import React, { useState } from 'react';
import { Users, Search, Coins, ShieldAlert, ShieldCheck, PlusCircle } from 'lucide-react';

interface UsersManagerProps {
  users: any[];
  onRefresh: () => void;
}

export function UsersManager({ users, onRefresh }: UsersManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [coinAdjustment, setCoinAdjustment] = useState(50);
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === '1' ? '0' : '1';
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  const handleAdjustCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);

    const newCoins = Math.max(0, Number(selectedUser.coins || 0) + Number(coinAdjustment));
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser.id, coins: newCoins }),
      });
      setSelectedUser(null);
      onRefresh();
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Player Accounts Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit player profiles, manage coin balances, and enforce account suspensions.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151f32] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-[#151f32] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Player Details</th>
                <th className="px-5 py-3.5">Coins</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Refer Code</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No players found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-slate-400 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-amber-400 flex items-center space-x-1">
                        <Coins size={14} />
                        <span>{user.coins}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-300">
                      {user.score} pts
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {user.refer_code || '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.status === '1'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {user.status === '1' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold text-[11px] inline-flex items-center space-x-1"
                      >
                        <PlusCircle size={13} />
                        <span>Coins</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] inline-flex items-center space-x-1 ${
                          user.status === '1'
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {user.status === '1' ? (
                          <>
                            <ShieldAlert size={13} />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={13} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coin Adjustment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Adjust Player Coins</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedUser.name} (Current: {selectedUser.coins} coins)</p>

            <form onSubmit={handleAdjustCoins} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Coin Offset (Positive to add, Negative to deduct)</label>
                <input
                  type="number"
                  value={coinAdjustment}
                  onChange={(e) => setCoinAdjustment(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold"
                >
                  {loading ? 'Saving...' : 'Apply Coins'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
