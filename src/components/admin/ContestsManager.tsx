'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Trophy, Calendar, Coins } from 'lucide-react';

interface ContestsManagerProps {
  contests: any[];
  onRefresh: () => void;
}

export function ContestsManager({ contests, onRefresh }: ContestsManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entryCoin, setEntryCoin] = useState(20);
  const [prizePool, setPrizePool] = useState(5000);
  const [questionSource, setQuestionSource] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          start_date: startDate,
          end_date: endDate,
          entry_coin: entryCoin,
          prize_pool: prizePool,
          category: questionSource,
        }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        setShowModal(false);
        onRefresh();
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;
    try {
      await fetch(`/api/contests?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Contest Zone Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Host live seasonal competitions, manage entry stakes and reward prize pools.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>New Contest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.length === 0 ? (
          <div className="col-span-full bg-[#151f32] p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
            No active contests. Click New Contest to create one!
          </div>
        ) : (
          contests.map((c) => (
            <div
              key={c.id}
              className="bg-[#151f32] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy size={20} />
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="font-bold text-white text-base mt-3">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Coins size={14} className="text-amber-400" />
                      <span>Entry Fee:</span>
                    </span>
                    <strong className="text-amber-400">{c.entry_coin} Coins</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Prize Pool:</span>
                    <strong className="text-emerald-400">{c.prize_pool} Coins</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{c.start_date} to {c.end_date}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Live Contest</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contest Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Science Bowl Summer Cup"
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contest description..."
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Question Source / Category</label>
                <select
                  value={questionSource}
                  onChange={(e) => setQuestionSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="">All Categories (Balanced General Trivia)</option>
                  <option value="1">1 - General Knowledge</option>
                  <option value="2">2 - Science & Technology</option>
                  <option value="3">3 - Mathematics & Logic</option>
                  <option value="4">4 - History & Geography</option>
                  <option value="5">5 - Sports & Games</option>
                  <option value="6">6 - Elite Premium Masterclass</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Entry Coins</label>
                  <input
                    type="number"
                    value={entryCoin}
                    onChange={(e) => setEntryCoin(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Prize Pool</label>
                  <input
                    type="number"
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                >
                  {loading ? 'Creating...' : 'Create Contest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
