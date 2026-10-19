'use client';

import React from 'react';
import { Flag, CheckCircle2, Clock } from 'lucide-react';

interface ReportsManagerProps {
  reports: any[];
  onRefresh: () => void;
}

export function ReportsManager({ reports, onRefresh }: ReportsManagerProps) {
  const handleResolve = async (id: string) => {
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: '1' }),
      });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Reported Questions</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review feedback and correction flags submitted by users from the answer review screen.
        </p>
      </div>

      <div className="bg-[#151f32] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Question ID</th>
                <th className="px-5 py-3.5">Reporter User</th>
                <th className="px-5 py-3.5">Report Reason / Message</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No open question reports.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-pink-400">#{r.question_id}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-300">User #{r.user_id}</td>
                    <td className="px-5 py-3.5 text-slate-200">{r.message}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">{r.date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === '1'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {r.status === '1' ? 'Resolved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {r.status === '0' ? (
                        <button
                          onClick={() => handleResolve(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs inline-flex items-center space-x-1"
                        >
                          <CheckCircle2 size={14} />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Completed</span>
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
