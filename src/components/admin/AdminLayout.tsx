'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  HelpCircle,
  Trophy,
  GraduationCap,
  Users,
  CreditCard,
  Flag,
  Award,
  Settings,
  LogOut,
  Database,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StudyCordLogo } from '../common/StudyCordLogo';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  adminEmail: string;
  children: React.ReactNode;
}

export function AdminLayout({
  currentTab,
  onTabChange,
  onLogout,
  adminEmail,
  children,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories & Subcategories', icon: Layers },
    { id: 'questions', label: 'Questions Bank', icon: HelpCircle },
    { id: 'contests', label: 'Contest Zone', icon: Trophy },
    { id: 'exams', label: 'Exam Module', icon: GraduationCap },
    { id: 'users', label: 'Player Accounts', icon: Users },
    { id: 'payments', label: 'Payment Requests', icon: CreditCard },
    { id: 'reports', label: 'Question Reports', icon: Flag },
    { id: 'badges', label: 'Badges Management', icon: Award },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#151f32] border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <StudyCordLogo size="sm" isDark={true} />
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">v1.0.0</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#151f32] border-r border-slate-800 flex-shrink-0 flex flex-col justify-between p-4 md:h-screen md:sticky md:top-0 z-40 overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="hidden md:flex flex-col space-y-1 px-2 py-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <StudyCordLogo size="md" isDark={true} />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">v1.0.0</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1 font-medium mt-1">
              <Database size={11} />
              <span>MongoDB Connected</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ef5388] to-[#d63384] text-white shadow-md shadow-pink-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-70" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 mt-6">
          <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{adminEmail}</p>
              <p className="text-[10px] text-slate-400 font-mono">Super Administrator</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold border border-rose-500/20 transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
