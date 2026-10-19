'use client';

import React, { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Coins, Check, X } from 'lucide-react';
import { QImage } from '../common/QImage';

interface BadgesManagerProps {
  badges: any[];
  onRefresh: () => void;
}

export function BadgesManager({ badges, onRefresh }: BadgesManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('score');
  const [requirement, setRequirement] = useState(500);
  const [rewardCoins, setRewardCoins] = useState(50);
  const [icon, setIcon] = useState('/assets/images/badges_icon.svg');
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingBadge(null);
    setTitle('');
    setType('score');
    setRequirement(500);
    setRewardCoins(50);
    setIcon('/assets/images/badges_icon.svg');
    setShowModal(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBadge(b);
    setTitle(b.title || '');
    setType(b.type || 'score');
    setRequirement(b.requirement || 500);
    setRewardCoins(b.reward_coins || b.reward || 50);
    setIcon(b.icon?.startsWith('/') ? b.icon : `/assets/images/${b.icon || 'badges_icon'}.svg`);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = editingBadge ? `/api/badges/${editingBadge.id || editingBadge._id}` : '/api/badges';
      const method = editingBadge ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          requirement,
          reward_coins: rewardCoins,
          icon,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingBadge(null);
        onRefresh();
      }
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
          <h1 className="text-2xl font-black text-white">Badges & Achievements Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Replicated from Flutter badges_screen.dart. Configure player milestones, reward coin burns, and visual icons.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#8a33f6] text-white text-xs font-bold hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>New Badge</span>
        </button>
      </div>

      {/* Grid of Badges in Authentic Flutter UI Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((b) => {
          const badgeIcon = b.icon?.startsWith('/') ? b.icon : `/assets/images/${b.icon || 'badges_icon'}.svg`;
          const isUnlocked = b.status !== 'locked';

          return (
            <div
              key={b.id || b._id}
              className="relative pt-6 flex flex-col items-center group select-none"
            >
              {/* Flutter Base Card */}
              <div
                className="w-full min-h-[145px] rounded-[20px] pb-3 px-2 pt-9 flex flex-col items-center justify-between text-center bg-[#151f32] border border-[#ef5388]/30 shadow-md group-hover:border-[#ef5388]/60 transition-all"
                style={{
                  background: 'radial-gradient(circle at top, rgba(239, 83, 136, 0.16) 0%, #151f32 75%)',
                  boxShadow: '0 4px 16px -2px rgba(239, 83, 136, 0.20)',
                }}
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#f279a2] line-clamp-1 px-1">
                    {b.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    Req: <strong className="text-slate-200">{b.requirement}</strong> ({b.type})
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-between px-2 text-[11px] font-bold text-amber-400">
                  <div className="flex items-center space-x-1">
                    <Coins size={13} />
                    <span>+{b.reward_coins || b.reward} Coins</span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                    title="Edit Badge"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>

              {/* Overlapping Flutter Hexagon Graphic */}
              <div className="absolute top-0 w-14 h-14 flex items-center justify-center pointer-events-none drop-shadow-[0_4px_12px_rgba(239,83,136,0.35)]">
                <QImage
                  imageUrl="/assets/images/hexagon.svg"
                  width={52}
                  height={52}
                  alt="Hexagon"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="w-5 h-5 block select-none pointer-events-none"
                    style={{
                      backgroundColor: '#ffffff',
                      WebkitMask: `url("${badgeIcon}") no-repeat center / contain`,
                      mask: `url("${badgeIcon}") no-repeat center / contain`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingBadge ? 'Edit Achievement Badge' : 'Create New Badge'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Badge Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Strategist"
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Milestone Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
                >
                  <option value="score">Total Score Milestones</option>
                  <option value="play_count">Total Quizzes Completed</option>
                  <option value="battle_wins">Battle Zone Victories</option>
                  <option value="streak">Daily Quiz Streak Days</option>
                  <option value="speed">Speed & Accuracy (Flash Thinker)</option>
                  <option value="master">Level Progression Master</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Threshold Required</label>
                  <input
                    type="number"
                    value={requirement}
                    onChange={(e) => setRequirement(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Coin Reward Prize</label>
                  <input
                    type="number"
                    value={rewardCoins}
                    onChange={(e) => setRewardCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Badge Icon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
                >
                  <option value="/assets/images/badges_icon.svg">Quiz Maestro (Trophy)</option>
                  <option value="/assets/images/daily_quiz_icon.svg">Daily Calendar (Streak)</option>
                  <option value="/assets/images/one_vs_one_icon.svg">Swords (Battle)</option>
                  <option value="/assets/images/lifeline_resettime.svg">Timer (Speed)</option>
                  <option value="/assets/images/score.svg">Score Star (Scholar)</option>
                  <option value="/assets/images/coin.svg">Coin (Tycoon)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#8a33f6] text-white text-xs font-bold hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingBadge ? 'Update Badge' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
