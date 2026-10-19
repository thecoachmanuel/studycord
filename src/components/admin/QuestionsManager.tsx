'use client';

import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Search, Filter, CheckCircle2 } from 'lucide-react';
import { formatQuestionText } from '../../lib/quizEngine';

interface QuestionsManagerProps {
  questions: any[];
  categories: any[];
  subcategories: any[];
  onRefresh: () => void;
}

export function QuestionsManager({
  questions,
  categories,
  subcategories,
  onRefresh,
}: QuestionsManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState(categories[0]?.id || '1');
  const [qSubcategory, setQSubcategory] = useState('');
  const [qLevel, setQLevel] = useState('1');
  const [qType, setQType] = useState('1'); // 1: 4 options, 2: True/False
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [qAnswer, setQAnswer] = useState('a');
  const [qNote, setQNote] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || q.level === selectedLevel;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesLevel && matchesSearch;
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qText,
          category: qCategory,
          subcategory: qSubcategory,
          level: qLevel,
          question_type: qType,
          optiona: optA,
          optionb: optB,
          optionc: optC,
          optiond: optD,
          answer: qAnswer,
          note: qNote,
        }),
      });

      if (res.ok) {
        setQText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        setQNote('');
        setShowAddModal(false);
        onRefresh();
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Questions Bank</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, manage, and audit questions across all quiz levels and categories.
          </p>
        </div>

        <button
          onClick={() => {
            if (categories.length > 0) setQCategory(categories[0].id);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#d63384] text-white text-xs font-bold hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>New Question</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151f32] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#151f32] border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-[#151f32] border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Levels</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
            <option key={l} value={String(l)}>
              Level {l}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-[#151f32] p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
            No questions found matching criteria.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const cat = categories.find((c) => c.id === String(q.category));
            return (
              <div
                key={q.id}
                className="bg-[#151f32] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {cat?.category_name || `Category #${q.category}`}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-400">
                        Level {q.level || '1'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {q.question_type === '2' ? 'True / False' : 'Multiple Choice'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white pt-1">{formatQuestionText(q.question)}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Options display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                  {['a', 'b', 'c', 'd'].map((opt) => {
                    const optVal = q[`option${opt}`];
                    if (!optVal && q.question_type === '2' && (opt === 'c' || opt === 'd')) return null;
                    const isCorrect = q.answer === opt;
                    return (
                      <div
                        key={opt}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate">
                          <strong className="uppercase mr-1.5">{opt}:</strong> {optVal || '-'}
                        </span>
                        {isCorrect && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 ml-1" />}
                      </div>
                    );
                  })}
                </div>

                {q.note && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                    <strong>Explanation:</strong> {q.note}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-white mb-4">Add New Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Question Content</label>
                <textarea
                  required
                  rows={2}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter the question text..."
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Level</label>
                  <select
                    value={qLevel}
                    onChange={(e) => setQLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                      <option key={l} value={String(l)}>
                        Level {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Question Format</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="qtype"
                      checked={qType === '1'}
                      onChange={() => setQType('1')}
                    />
                    <span>Multiple Choice (4 Options)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="qtype"
                      checked={qType === '2'}
                      onChange={() => setQType('2')}
                    />
                    <span>True / False (2 Options)</span>
                  </label>
                </div>
              </div>

              {qType === '1' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Option A</label>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Option B</label>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Option C</label>
                    <input
                      type="text"
                      required
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Option D</label>
                    <input
                      type="text"
                      required
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Correct Answer</label>
                <select
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="a">Option A {qType === '2' ? '(True)' : ''}</option>
                  <option value="b">Option B {qType === '2' ? '(False)' : ''}</option>
                  {qType === '1' && <option value="c">Option C</option>}
                  {qType === '1' && <option value="d">Option D</option>}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Note / Explanation</label>
                <input
                  type="text"
                  value={qNote}
                  onChange={(e) => setQNote(e.target.value)}
                  placeholder="Optional context shown in review answers..."
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#d63384] text-white text-xs font-bold shadow-md hover:shadow-pink-500/25"
                >
                  {loading ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
