'use client';

import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, Clock, Award } from 'lucide-react';

interface ExamsManagerProps {
  exams: any[];
  onRefresh: () => void;
}

export function ExamsManager({ exams, onRefresh }: ExamsManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [passPercentage, setPassPercentage] = useState(70);
  const [totalMarks, setTotalMarks] = useState(100);
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          duration,
          pass_percentage: passPercentage,
          total_marks: totalMarks,
          rules,
        }),
      });
      if (res.ok) {
        setTitle('');
        setRules('');
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
    if (!confirm('Are you sure you want to delete this exam module?')) return;
    try {
      await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Exam Module Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure formal timed examinations with passing thresholds and rules.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>New Exam</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full bg-[#151f32] p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
            No exams configured yet.
          </div>
        ) : (
          exams.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#151f32] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <GraduationCap size={20} />
                  </div>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="font-bold text-white text-base mt-3">{ex.title}</h3>
                {ex.rules && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ex.rules}</p>}

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock size={14} className="text-blue-400" />
                      <span>Duration:</span>
                    </span>
                    <strong className="text-white">{ex.duration} Minutes</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Award size={14} className="text-emerald-400" />
                      <span>Passing Score:</span>
                    </span>
                    <strong className="text-emerald-400">{ex.pass_percentage}%</strong>
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
            <h3 className="text-lg font-bold text-white mb-4">Create Exam Module</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Science & Logic Certification"
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Pass Mark (%)</label>
                  <input
                    type="number"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Exam Instructions / Rules</label>
                <textarea
                  rows={2}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Enter examination rules..."
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white"
                />
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  {loading ? 'Creating...' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
