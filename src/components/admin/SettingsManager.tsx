'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Coins, Timer, Swords, FileText, AlertCircle } from 'lucide-react';

interface SettingsManagerProps {
  settings: any;
  onRefresh: () => void;
}

export function SettingsManager({ settings, onRefresh }: SettingsManagerProps) {
  const [formData, setFormData] = useState({
    app_name: settings?.app_name || 'Elite Quiz',
    currency_symbol: settings?.currency_symbol || '$',
    
    // Quiz & Lifelines Economics
    correct_answer_coins: settings?.correct_answer_coins ?? 4,
    wrong_penalty_coins: settings?.wrong_penalty_coins ?? 2,
    lifeline_cost: settings?.lifeline_cost ?? 4,
    review_answers_deduct_coin: settings?.review_answers_deduct_coin ?? 5,
    quiz_retake_deduct_coin: settings?.quiz_retake_deduct_coin ?? 5,
    guess_the_word_hint_deduct_coin: settings?.guess_the_word_hint_deduct_coin ?? 5,

    // Battle Zone Economics & House Margins
    battle_mode_one_entry_coin: settings?.battle_mode_one_entry_coin ?? 20,
    battle_1v1_winner_reward: settings?.battle_1v1_winner_reward ?? 35,
    battle_mode_group_entry_coin: settings?.battle_mode_group_entry_coin ?? 20,
    battle_group_1st_reward: settings?.battle_group_1st_reward ?? 45,
    battle_group_2nd_reward: settings?.battle_group_2nd_reward ?? 20,
    battle_random_entry_coin: settings?.battle_random_entry_coin ?? 20,

    // Wallet & Redemption
    min_withdrawal_coins: settings?.min_withdrawal_coins ?? 200,
    coin_value_in_currency: settings?.coin_value_in_currency ?? 0.05,
    quiz_winning_percentage: settings?.quiz_winning_percentage ?? 60,

    // Game Timers (seconds)
    quiz_zone_duration: settings?.quiz_zone_duration ?? 30,
    battle_mode_one_in_seconds: settings?.battle_mode_one_in_seconds ?? 25,
    battle_mode_group_in_seconds: settings?.battle_mode_group_in_seconds ?? 25,
    true_false_quiz_in_seconds: settings?.true_false_quiz_in_seconds ?? 20,
    guess_the_word_seconds: settings?.guess_the_word_seconds ?? 45,
    maths_quiz_seconds: settings?.maths_quiz_seconds ?? 40,

    // Content & Policies
    about_us: settings?.about_us || 'Elite Quiz is the world premier multi-disciplinary trivia platform powered by modern web technologies.',
    privacy_policy: settings?.privacy_policy || 'Your privacy is paramount. We do not sell or disclose your personal data to any third party advertisers.',
    terms_conditions: settings?.terms_conditions || 'By participating in quizzes and contests, you agree to fair-play rules and zero cheating tolerances.',
    instructions: settings?.instructions || 'Answer each question within the countdown timer. Use lifelines wisely at the cost of coins each.',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        onRefresh();
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const pot1v1 = formData.battle_mode_one_entry_coin * 2;
  const margin1v1 = pot1v1 - formData.battle_1v1_winner_reward;
  const pct1v1 = pot1v1 > 0 ? ((margin1v1 / pot1v1) * 100).toFixed(1) : '0';

  const potGroup = formData.battle_mode_group_entry_coin * 4;
  const totalGroupPayout = formData.battle_group_1st_reward + formData.battle_group_2nd_reward;
  const marginGroup = potGroup - totalGroupPayout;
  const pctGroup = potGroup > 0 ? ((marginGroup / potGroup) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">System Configurations & Platform Economics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Control platform coin deductions, battle margins, review fees, and game duration parameters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedSuccess && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
              <CheckCircle2 size={15} />
              <span>Settings Saved!</span>
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#8a33f6] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <Save size={15} />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Admin Commission Margins Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Platform Profit & Margin Safeguard</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin keeps <strong className="text-amber-400">{margin1v1} Coins ({pct1v1}%)</strong> per 1v1 battle, and <strong className="text-amber-400">{marginGroup} Coins ({pctGroup}%)</strong> per Group battle.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-black/30 px-3.5 py-2 rounded-xl border border-white/5">
            <span>Retake Fee: +{formData.quiz_retake_deduct_coin} Coins</span>
            <span>&bull;</span>
            <span>Review Fee: +{formData.review_answers_deduct_coin} Coins</span>
          </div>
        </div>

        {/* Battle Economics Section */}
        <div className="bg-[#151f32] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Swords size={16} className="text-[#ef5388]" />
            <span>Battle Zone Wagers & Margins (Flutter battle_room)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">1v1 Battle Entry Fee (Coins)</label>
              <input
                type="number"
                value={formData.battle_mode_one_entry_coin}
                onChange={(e) => setFormData({ ...formData, battle_mode_one_entry_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">1v1 Winner Reward (Coins)</label>
              <input
                type="number"
                value={formData.battle_1v1_winner_reward}
                onChange={(e) => setFormData({ ...formData, battle_1v1_winner_reward: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Random Battle Entry (Coins)</label>
              <input
                type="number"
                value={formData.battle_random_entry_coin}
                onChange={(e) => setFormData({ ...formData, battle_random_entry_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Group Battle Entry (Coins / player)</label>
              <input
                type="number"
                value={formData.battle_mode_group_entry_coin}
                onChange={(e) => setFormData({ ...formData, battle_mode_group_entry_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Group 1st Place Prize (Coins)</label>
              <input
                type="number"
                value={formData.battle_group_1st_reward}
                onChange={(e) => setFormData({ ...formData, battle_group_1st_reward: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Group 2nd Place Prize (Coins)</label>
              <input
                type="number"
                value={formData.battle_group_2nd_reward}
                onChange={(e) => setFormData({ ...formData, battle_group_2nd_reward: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>
          </div>
        </div>

        {/* Quiz & Lifeline Economics Card */}
        <div className="bg-[#151f32] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Coins size={16} className="text-amber-400" />
            <span>Quiz Deductions & Lifelines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Lifeline Cost (Coins each)</label>
              <input
                type="number"
                value={formData.lifeline_cost}
                onChange={(e) => setFormData({ ...formData, lifeline_cost: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Review Answers Fee (Coins)</label>
              <input
                type="number"
                value={formData.review_answers_deduct_coin}
                onChange={(e) => setFormData({ ...formData, review_answers_deduct_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Quiz Retake Fee (Coins)</label>
              <input
                type="number"
                value={formData.quiz_retake_deduct_coin}
                onChange={(e) => setFormData({ ...formData, quiz_retake_deduct_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Guess The Word Hint Fee (Coins)</label>
              <input
                type="number"
                value={formData.guess_the_word_hint_deduct_coin}
                onChange={(e) => setFormData({ ...formData, guess_the_word_hint_deduct_coin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Correct Answer Coins</label>
              <input
                type="number"
                value={formData.correct_answer_coins}
                onChange={(e) => setFormData({ ...formData, correct_answer_coins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Wrong Penalty Coins</label>
              <input
                type="number"
                value={formData.wrong_penalty_coins}
                onChange={(e) => setFormData({ ...formData, wrong_penalty_coins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>
          </div>
        </div>

        {/* Timers & Durations Card */}
        <div className="bg-[#151f32] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Timer size={16} className="text-blue-400" />
            <span>Game Timers & Durations (Seconds)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Quiz Zone Timer (s)</label>
              <input
                type="number"
                value={formData.quiz_zone_duration}
                onChange={(e) => setFormData({ ...formData, quiz_zone_duration: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">1v1 Battle Timer (s)</label>
              <input
                type="number"
                value={formData.battle_mode_one_in_seconds}
                onChange={(e) => setFormData({ ...formData, battle_mode_one_in_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Group Battle Timer (s)</label>
              <input
                type="number"
                value={formData.battle_mode_group_in_seconds}
                onChange={(e) => setFormData({ ...formData, battle_mode_group_in_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">True / False Timer (s)</label>
              <input
                type="number"
                value={formData.true_false_quiz_in_seconds}
                onChange={(e) => setFormData({ ...formData, true_false_quiz_in_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Guess The Word Timer (s)</label>
              <input
                type="number"
                value={formData.guess_the_word_seconds}
                onChange={(e) => setFormData({ ...formData, guess_the_word_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Math Quiz Timer (s)</label>
              <input
                type="number"
                value={formData.maths_quiz_seconds}
                onChange={(e) => setFormData({ ...formData, maths_quiz_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>
          </div>
        </div>

        {/* Wallet & Monetization Card */}
        <div className="bg-[#151f32] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Wallet Redemption & Currency Exchange
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Min Withdrawal Coins</label>
              <input
                type="number"
                value={formData.min_withdrawal_coins}
                onChange={(e) => setFormData({ ...formData, min_withdrawal_coins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Value of 1 Coin ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.coin_value_in_currency}
                onChange={(e) => setFormData({ ...formData, coin_value_in_currency: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currency_symbol}
                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Pass Requirement (%)</label>
              <input
                type="number"
                value={formData.quiz_winning_percentage}
                onChange={(e) => setFormData({ ...formData, quiz_winning_percentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>
          </div>
        </div>

        {/* Content & Policy Card */}
        <div className="bg-[#151f32] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <FileText size={16} className="text-purple-400" />
            <span>Content & Policy Declarations</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">App Brand Name</label>
              <input
                type="text"
                value={formData.app_name}
                onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">How To Play & Instructions</label>
              <textarea
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">About Us</label>
              <textarea
                rows={3}
                value={formData.about_us}
                onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Privacy Policy</label>
              <textarea
                rows={3}
                value={formData.privacy_policy}
                onChange={(e) => setFormData({ ...formData, privacy_policy: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-[#ef5388]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Terms & Conditions</label>
              <textarea
                rows={3}
                value={formData.terms_conditions}
                onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-[#ef5388]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#8a33f6] text-white text-xs font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            <span>{loading ? 'Saving Changes...' : 'Save All Configurations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
