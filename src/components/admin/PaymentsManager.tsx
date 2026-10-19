'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Search, Clock } from 'lucide-react';

interface PaymentsManagerProps {
  payments: any[];
  onActionPayment: (id: string, status: string) => void;
}

export function PaymentsManager({ payments, onActionPayment }: PaymentsManagerProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = payments.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      (p.payment_address && p.payment_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.payment_type && p.payment_type.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Payment Requests & Withdrawals</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and disburse player coin redemption payouts via PayPal, Paytm, or UPI.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 bg-[#151f32] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#151f32] border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="0">Pending</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-[#151f32] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Payment Address</th>
                <th className="px-5 py-3.5">Coins Redeemed</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Request Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No payment requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{p.payment_type}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-300">{p.payment_address}</td>
                    <td className="px-5 py-3.5 font-bold text-amber-400">{p.coin_used} Coins</td>
                    <td className="px-5 py-3.5 font-black text-emerald-400">
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">{p.request_date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === '1'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : p.status === '2'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {p.status === '1' ? 'Approved' : p.status === '2' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status === '0' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onActionPayment(p.id, '1')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs inline-flex items-center space-x-1"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onActionPayment(p.id, '2')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold text-xs inline-flex items-center space-x-1"
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
