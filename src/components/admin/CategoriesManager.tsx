'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, FolderPlus, Layers, Search } from 'lucide-react';

interface CategoriesManagerProps {
  categories: any[];
  subcategories: any[];
  onRefresh: () => void;
}

export function CategoriesManager({ categories, subcategories, onRefresh }: CategoriesManagerProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showAddSubcatModal, setShowAddSubcatModal] = useState(false);

  // Form states
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('1');
  const [catImage, setCatImage] = useState('/assets/images/science.svg');

  const [subcatName, setSubcatName] = useState('');
  const [subcatParent, setSubcatParent] = useState('');
  const [loading, setLoading] = useState(false);

  const quizTypes: Record<string, string> = {
    '1': 'Quiz Zone',
    '2': 'Fun & Learn',
    '3': 'Guess The Word',
    '4': 'Audio Question',
    '5': 'Maths Lab',
    '6': 'Multi Match',
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesType = selectedType === 'all' || cat.type === selectedType;
    const matchesSearch = cat.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: catName,
          type: catType,
          image: catImage,
        }),
      });
      if (res.ok) {
        setCatName('');
        setShowAddCatModal(false);
        onRefresh();
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcatName.trim() || !subcatParent) return;
    setLoading(true);

    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maincat_id: subcatParent,
          subcategory_name: subcatName,
        }),
      });
      if (res.ok) {
        setSubcatName('');
        setShowAddSubcatModal(false);
        onRefresh();
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await fetch(`/api/subcategories?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Categories & Subcategories</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize content across Quiz Zone, Fun & Learn, Guess Word, Audio, Maths, and Multi Match.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddCatModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#d63384] text-white text-xs font-bold hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            <span>New Category</span>
          </button>
          <button
            onClick={() => {
              if (categories.length > 0) setSubcatParent(categories[0].id);
              setShowAddSubcatModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <FolderPlus size={16} />
            <span>New Subcategory</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151f32] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-[#151f32] border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Quiz Zones</option>
          {Object.entries(quizTypes).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const subs = subcategories.filter((s) => s.maincat_id === String(cat.id));
          return (
            <div
              key={cat.id}
              className="bg-[#151f32] p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{cat.category_name}</h3>
                      <span className="text-[10px] text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                        {quizTypes[cat.type] || 'General'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Subcategories List */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Subcategories ({subs.length})</span>
                  </div>
                  {subs.length === 0 ? (
                    <p className="text-[11px] text-slate-600 italic">No subcategories assigned.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {subs.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          <span>{s.subcategory_name}</span>
                          <button
                            onClick={() => handleDeleteSubcategory(s.id)}
                            className="hover:text-rose-400 ml-1 text-slate-500"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Astronomy & Space"
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Quiz Zone</label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  {Object.entries(quizTypes).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ef5388] to-[#d63384] text-white text-xs font-bold shadow-md hover:shadow-pink-500/25"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#151f32] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Subcategory</h3>
            <form onSubmit={handleAddSubcategory} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Parent Category</label>
                <select
                  value={subcatParent}
                  onChange={(e) => setSubcatParent(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_name} ({quizTypes[c.type] || 'Quiz Zone'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Subcategory Name</label>
                <input
                  type="text"
                  required
                  value={subcatName}
                  onChange={(e) => setSubcatName(e.target.value)}
                  placeholder="e.g. Quantum Physics"
                  className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubcatModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
                >
                  {loading ? 'Saving...' : 'Save Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
