'use client';

import React, { useState, useEffect } from 'react';
import './admin.css';
import { StudyCordLogo } from '@/components/common/StudyCordLogo';

const PRESET_ICONS = [
  { name: 'Quiz Zone', path: '/assets/images/quiz_zone_icon.svg' },
  { name: 'Science & Tech', path: '/assets/images/science_icon.svg' },
  { name: "Fun 'N' Learn", path: '/assets/images/fun_icon.svg' },
  { name: 'Maths Mania', path: '/assets/images/maths_icon.svg' },
  { name: 'Daily Quiz', path: '/assets/images/daily_quiz_icon.svg' },
  { name: 'Sports & Battle', path: '/assets/images/group_battle_icon.svg' },
  { name: 'Premium Master', path: '/assets/images/premium_icon.svg' },
  { name: 'Guess Word', path: '/assets/images/guess_icon.svg' },
  { name: 'Audio Listening', path: '/assets/images/audio_icon.svg' },
  { name: 'Multi Match', path: '/assets/images/multi_match_icon.svg' },
  { name: 'Self Challenge', path: '/assets/images/self_challenge.svg' },
  { name: 'Exam & Test', path: '/assets/images/exam_icon.svg' },
  { name: 'Badges', path: '/assets/images/badges_icon.svg' },
  { name: 'Coins & Wallet', path: '/assets/images/coin_icon.svg' },
];

export default function AdminPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    quiz_zone: true,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App data from MongoDB
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalQuestions: 0,
    totalContests: 0,
    totalExams: 0,
    pendingPayments: 0,
    pendingReports: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);

  // Filtering & search states for questions
  const [questionFilter, setQuestionFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [questionSearch, setQuestionSearch] = useState('');

  // Chart tab state
  const [chartTab, setChartTab] = useState<'day' | 'week' | 'month'>('day');
  const [chartData, setChartData] = useState<any>(null);

  // Form states for modals/subviews (Creation)
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('1');
  const [newCatIcon, setNewCatIcon] = useState('/assets/images/quiz_zone_icon.svg');

  const [showAddSubcatModal, setShowAddSubcatModal] = useState(false);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [newSubcatParent, setNewSubcatParent] = useState('');

  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQCategory, setNewQCategory] = useState('1');
  const [newQSubcategory, setNewQSubcategory] = useState('101');
  const [newQLevel, setNewQLevel] = useState('1');
  const [newQType, setNewQType] = useState('1');
  const [newQOptA, setNewQOptA] = useState('');
  const [newQOptB, setNewQOptB] = useState('');
  const [newQOptC, setNewQOptC] = useState('');
  const [newQOptD, setNewQOptD] = useState('');
  const [newQAnswer, setNewQAnswer] = useState('a');
  const [newQNote, setNewQNote] = useState('');

  // Modals for Contests, Exams, Notifications, Badges, etc.
  const [showAddContestModal, setShowAddContestModal] = useState(false);
  const [newContestName, setNewContestName] = useState('');
  const [newContestDesc, setNewContestDesc] = useState('');
  const [newContestStart, setNewContestStart] = useState('2026-10-25');
  const [newContestEnd, setNewContestEnd] = useState('2026-10-31');
  const [newContestEntry, setNewContestEntry] = useState(20);
  const [newContestPrize, setNewContestPrize] = useState(1000);
  const [newContestCategory, setNewContestCategory] = useState('');

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(15);
  const [newExamMarks, setNewExamMarks] = useState(100);
  const [newExamPass, setNewExamPass] = useState(70);
  const [newExamRules, setNewExamRules] = useState('');

  const [showSendNotifModal, setShowSendNotifModal] = useState(false);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMsg, setNewNotifMsg] = useState('');

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [newWordClue, setNewWordClue] = useState('');
  const [newWordTarget, setNewWordTarget] = useState('');

  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [newMatchLeft, setNewMatchLeft] = useState('');
  const [newMatchRight, setNewMatchRight] = useState('');

  const [showAddBadgeModal, setShowAddBadgeModal] = useState(false);
  const [newBadgeTitle, setNewBadgeTitle] = useState('');
  const [newBadgeReq, setNewBadgeReq] = useState(10);
  const [newBadgeReward, setNewBadgeReward] = useState(50);

  // Edit Modal States (Full CRUD)
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatId, setEditCatId] = useState('');
  const [editCatName, setEditCatName] = useState('');
  const [editCatType, setEditCatType] = useState('1');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('/assets/images/quiz_zone_icon.svg');

  const [showEditSubcatModal, setShowEditSubcatModal] = useState(false);
  const [editSubcatId, setEditSubcatId] = useState('');
  const [editSubcatName, setEditSubcatName] = useState('');
  const [editSubcatParent, setEditSubcatParent] = useState('');

  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [editQId, setEditQId] = useState('');
  const [editQText, setEditQText] = useState('');
  const [editQCategory, setEditQCategory] = useState('1');
  const [editQSubcategory, setEditQSubcategory] = useState('101');
  const [editQLevel, setEditQLevel] = useState('1');
  const [editQType, setEditQType] = useState('1');
  const [editQOptA, setEditQOptA] = useState('');
  const [editQOptB, setEditQOptB] = useState('');
  const [editQOptC, setEditQOptC] = useState('');
  const [editQOptD, setEditQOptD] = useState('');
  const [editQAnswer, setEditQAnswer] = useState('a');
  const [editQNote, setEditQNote] = useState('');

  const [showEditContestModal, setShowEditContestModal] = useState(false);
  const [editContestId, setEditContestId] = useState('');
  const [editContestName, setEditContestName] = useState('');
  const [editContestDesc, setEditContestDesc] = useState('');
  const [editContestStart, setEditContestStart] = useState('');
  const [editContestEnd, setEditContestEnd] = useState('');
  const [editContestEntry, setEditContestEntry] = useState(20);
  const [editContestPrize, setEditContestPrize] = useState(1000);

  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [editExamId, setEditExamId] = useState('');
  const [editExamTitle, setEditExamTitle] = useState('');
  const [editExamDuration, setEditExamDuration] = useState(15);
  const [editExamMarks, setEditExamMarks] = useState(100);
  const [editExamPass, setEditExamPass] = useState(70);
  const [editExamRules, setEditExamRules] = useState('');

  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [editWordId, setEditWordId] = useState('');
  const [editWordClue, setEditWordClue] = useState('');
  const [editWordTarget, setEditWordTarget] = useState('');

  const [showEditMatchModal, setShowEditMatchModal] = useState(false);
  const [editMatchId, setEditMatchId] = useState('');
  const [editMatchLeft, setEditMatchLeft] = useState('');
  const [editMatchRight, setEditMatchRight] = useState('');

  const [showEditBadgeModal, setShowEditBadgeModal] = useState(false);
  const [editBadgeId, setEditBadgeId] = useState('');
  const [editBadgeTitle, setEditBadgeTitle] = useState('');
  const [editBadgeReq, setEditBadgeReq] = useState(10);
  const [editBadgeReward, setEditBadgeReward] = useState(50);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [newUserCoins, setNewUserCoins] = useState(100);
  const [newUserScore, setNewUserScore] = useState(0);
  const [newUserStatus, setNewUserStatus] = useState('1');
  const [newUserPayoutEligible, setNewUserPayoutEligible] = useState(false);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserCoins, setEditUserCoins] = useState(100);
  const [editUserScore, setEditUserScore] = useState(0);
  const [editUserStatus, setEditUserStatus] = useState('1');
  const [editUserPayoutEligible, setEditUserPayoutEligible] = useState(false);

  useEffect(() => {
    // Check saved theme
    const savedTheme = localStorage.getItem('elite_admin_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-admin-theme', savedTheme);
    }
    checkAuth();

    // Real-time live polling for incoming registrations, payouts and reports
    const interval = setInterval(() => {
      fetch('/api/admin/dashboard-stats')
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setStats(res.stats);
            if (res.chartData) setChartData(res.chartData);
          }
        })
        .catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('elite_admin_theme', nextTheme);
    document.documentElement.setAttribute('data-admin-theme', nextTheme);
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/admin-check');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [
        statsRes,
        catRes,
        subcatRes,
        qRes,
        contRes,
        examRes,
        userRes,
        payRes,
        repRes,
        badgeRes,
        setRes,
        notifRes,
        referRes,
      ] = await Promise.all([
        fetch('/api/admin/dashboard-stats').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/subcategories').then((r) => r.json()),
        fetch('/api/questions').then((r) => r.json()),
        fetch('/api/contests').then((r) => r.json()),
        fetch('/api/exams').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/payments').then((r) => r.json()),
        fetch('/api/reports').then((r) => r.json()),
        fetch('/api/badges').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/referrals').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        if (statsRes.chartData) setChartData(statsRes.chartData);
      }
      if (catRes.success) setCategories(catRes.data);
      if (subcatRes.success) setSubcategories(subcatRes.data);
      if (qRes.success) setQuestions(qRes.data);
      if (contRes.success) setContests(contRes.data);
      if (examRes.success) setExams(examRes.data);
      if (userRes.success) setUsers(userRes.data);
      if (payRes.success) setPayments(payRes.data);
      if (repRes.success) setReports(repRes.data);
      if (badgeRes.success) setBadges(badgeRes.data);
      if (setRes.success) setSettings(setRes.data);
      if (notifRes && notifRes.success) setNotifications(notifRes.data);
      if (referRes && referRes.success) setReferrals(referRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(data.message || 'Invalid username or password');
      }
    } catch {
      setLoginError('Could not connect to authentication service.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin-login', { method: 'DELETE' });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleActionPayment = async (id: string, status: string) => {
    try {
      await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: '1' }),
      });
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleToggleReportStatus = async (id: string, currentStatus: string) => {
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: currentStatus === '1' ? '0' : '1' }),
      });
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleOpenEditQuestionFromReport = (questionId: string) => {
    const q = questions.find((item) => String(item.id) === String(questionId));
    if (q) {
      setEditQId(q.id);
      setEditQText(q.question || '');
      setEditQCategory(q.category || '1');
      setEditQSubcategory(q.subcategory || '');
      setEditQLevel(q.level || '1');
      setEditQType(q.question_type || '1');
      setEditQOptA(q.optiona || '');
      setEditQOptB(q.optionb || '');
      setEditQOptC(q.optionc || '');
      setEditQOptD(q.optiond || '');
      setEditQAnswer(q.answer || 'a');
      setEditQNote(q.note || '');
      setShowEditQuestionModal(true);
    } else {
      alert(`Question #${questionId} not found in questions collection.`);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: newCatName, type: newCatType, image: newCatIcon }),
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatIcon('/assets/images/quiz_zone_icon.svg');
        setShowAddCatModal(false);
        loadAllData();
      }
    } catch {
      // Ignore
    }
  };

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatName.trim() || !newSubcatParent) return;
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maincat_id: newSubcatParent, subcategory_name: newSubcatName }),
      });
      if (res.ok) {
        setNewSubcatName('');
        setShowAddSubcatModal(false);
        loadAllData();
      }
    } catch {
      // Ignore
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQText,
          category: newQCategory,
          subcategory: newQSubcategory,
          level: newQLevel,
          question_type: newQType,
          optiona: newQOptA,
          optionb: newQOptB,
          optionc: newQOptC,
          optiond: newQOptD,
          answer: newQAnswer,
          note: newQNote,
        }),
      });
      if (res.ok) {
        setNewQText('');
        setNewQOptA('');
        setNewQOptB('');
        setNewQOptC('');
        setNewQOptD('');
        setNewQNote('');
        setShowAddQuestionModal(false);
        loadAllData();
      }
    } catch {
      // Ignore
    }
  };

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContestName.trim()) return;
    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContestName,
          description: newContestDesc,
          start_date: newContestStart || '2026-10-25',
          end_date: newContestEnd || '2026-10-31',
          entry_coin: newContestEntry,
          prize_pool: newContestPrize,
          category: newContestCategory,
        }),
      });
      if (res.ok) {
        setShowAddContestModal(false);
        setNewContestName('');
        setNewContestDesc('');
        loadAllData();
      }
    } catch {}
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newExamTitle,
          duration: newExamDuration,
          total_marks: newExamMarks,
          pass_percentage: newExamPass,
          rules: newExamRules,
        }),
      });
      if (res.ok) {
        setShowAddExamModal(false);
        setNewExamTitle('');
        setNewExamRules('');
        loadAllData();
      }
    } catch {}
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifMsg.trim()) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNotifTitle,
          message: newNotifMsg,
        }),
      });
      if (res.ok) {
        setShowSendNotifModal(false);
        setNewNotifTitle('');
        setNewNotifMsg('');
        loadAllData();
      }
    } catch {}
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeTitle.trim()) return;
    try {
      const res = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBadgeTitle,
          requirement: newBadgeReq,
          reward_coins: newBadgeReward,
        }),
      });
      if (res.ok) {
        setShowAddBadgeModal(false);
        setNewBadgeTitle('');
        loadAllData();
      }
    } catch {}
  };

  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordClue.trim() || !newWordTarget.trim()) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newWordClue,
          category: '8',
          subcategory: '101',
          level: '1',
          question_type: '1',
          optiona: newWordTarget.toUpperCase(),
          optionb: 'HINT',
          optionc: newWordTarget.toUpperCase(),
          optiond: 'EXTRA',
          answer: 'c',
          note: `Target word: ${newWordTarget.toUpperCase()}`,
        }),
      });
      if (res.ok) {
        setShowAddWordModal(false);
        setNewWordClue('');
        setNewWordTarget('');
        loadAllData();
      }
    } catch {}
  };

  const handleCreateMatchPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatchLeft.trim() || !newMatchRight.trim()) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Match: ${newMatchLeft} <-> ${newMatchRight}`,
          category: '11',
          subcategory: '402',
          level: '1',
          question_type: '1',
          optiona: `${newMatchLeft} -> ${newMatchRight}`,
          optionb: 'Invalid',
          optionc: 'Invalid',
          optiond: 'Invalid',
          answer: 'a',
          note: `Multi Match Pair: ${newMatchLeft} connects to ${newMatchRight}`,
        }),
      });
      if (res.ok) {
        setShowAddMatchModal(false);
        setNewMatchLeft('');
        setNewMatchRight('');
        loadAllData();
      }
    } catch {}
  };

  // ==========================================
  // FULL CRUD UPDATE & DELETE HANDLERS
  // ==========================================
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatName.trim() || !editCatId) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editCatId,
          category_name: editCatName,
          type: editCatType,
          slug: editCatSlug || editCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          image: editCatIcon,
        }),
      });
      if (res.ok) {
        setShowEditCatModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubcatName.trim() || !editSubcatId) return;
    try {
      const res = await fetch('/api/subcategories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editSubcatId,
          subcategory_name: editSubcatName,
          maincat_id: editSubcatParent,
        }),
      });
      if (res.ok) {
        setShowEditSubcatModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQText.trim() || !editQId) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editQId,
          question: editQText,
          category: editQCategory,
          subcategory: editQSubcategory,
          level: editQLevel,
          question_type: editQType,
          optiona: editQOptA,
          optionb: editQOptB,
          optionc: editQOptC,
          optiond: editQOptD,
          answer: editQAnswer,
          note: editQNote,
        }),
      });
      if (res.ok) {
        setShowEditQuestionModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContestName.trim() || !editContestId) return;
    try {
      const res = await fetch('/api/contests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editContestId,
          name: editContestName,
          description: editContestDesc,
          start_date: editContestStart,
          end_date: editContestEnd,
          entry_coin: editContestEntry,
          prize_pool: editContestPrize,
        }),
      });
      if (res.ok) {
        setShowEditContestModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExamTitle.trim() || !editExamId) return;
    try {
      const res = await fetch('/api/exams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editExamId,
          title: editExamTitle,
          duration: editExamDuration,
          total_marks: editExamMarks,
          pass_percentage: editExamPass,
          rules: editExamRules,
        }),
      });
      if (res.ok) {
        setShowEditExamModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWordClue.trim() || !editWordTarget.trim() || !editWordId) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editWordId,
          question: editWordClue,
          optionc: editWordTarget.toUpperCase(),
          optiona: editWordTarget.toUpperCase(),
          note: `Target word: ${editWordTarget.toUpperCase()}`,
        }),
      });
      if (res.ok) {
        setShowEditWordModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateMatchPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMatchLeft.trim() || !editMatchRight.trim() || !editMatchId) return;
    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editMatchId,
          question: `Match: ${editMatchLeft} <-> ${editMatchRight}`,
          optiona: `${editMatchLeft} -> ${editMatchRight}`,
          note: `Multi Match Pair: ${editMatchLeft} connects to ${editMatchRight}`,
        }),
      });
      if (res.ok) {
        setShowEditMatchModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleUpdateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBadgeTitle.trim() || !editBadgeId) return;
    try {
      const res = await fetch('/api/badges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editBadgeId,
          title: editBadgeTitle,
          requirement: editBadgeReq,
          reward_coins: editBadgeReward,
        }),
      });
      if (res.ok) {
        setShowEditBadgeModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim().toLowerCase(),
          mobile: newUserMobile.trim(),
          coins: newUserCoins,
          score: newUserScore,
          status: newUserStatus,
          payout_eligible: newUserPayoutEligible,
        }),
      });
      if (res.ok) {
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserMobile('');
        setNewUserCoins(100);
        setNewUserScore(0);
        setNewUserStatus('1');
        setNewUserPayoutEligible(false);
        loadAllData();
      }
    } catch {}
  };

  const handleToggleGlobalPayout = async () => {
    const current = settings?.payout_request_status === '1' ? '1' : '0';
    const nextStatus = current === '1' ? '0' : '1';
    try {
      const updated = { ...(settings || {}), payout_request_status: nextStatus };
      setSettings(updated);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      loadAllData();
    } catch {}
  };

  const handleToggleUserPayoutEligible = async (u: any) => {
    try {
      const nextVal = !u.payout_eligible;
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u.id, payout_eligible: nextVal }),
      });
      loadAllData();
    } catch {}
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserId) return;
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editUserId,
          name: editUserName,
          email: editUserEmail,
          coins: editUserCoins,
          score: editUserScore,
          status: editUserStatus,
          payout_eligible: editUserPayoutEligible,
        }),
      });
      if (res.ok) {
        setShowEditUserModal(false);
        loadAllData();
      }
    } catch {}
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      loadAllData();
    } catch {}
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Delete this payout request record?')) return;
    try {
      await fetch(`/api/payments?id=${id}`, { method: 'DELETE' });
      loadAllData();
    } catch {}
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9', fontFamily: 'Nunito, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #f05387', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#6c757d', fontSize: 13, fontWeight: 600 }}>Loading StudyCord Admin Panel...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // EXACT PHP LOGIN PAGE (login.php replica)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="stisla-login-wrapper">
        <link rel="stylesheet" href="/admin-assets/fontawesome/css/all.min.css" />
        <div className="overlay" />

        <div className="stisla-login-card">
          <div style={{ textAlign: 'center', marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            <StudyCordLogo size="xl" isDark={theme === 'dark'} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-main, #34395e)' }}>
              Sign In
            </h3>
            <p style={{ fontSize: 13, color: '#6c757d', margin: 0 }}>
              Welcome, let's get started. Sign in to explore.
            </p>
          </div>

          {loginError && (
            <div style={{ padding: '10px 14px', background: '#fde8e8', color: '#e02424', borderRadius: 4, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-exclamation-circle" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-main, #34395e)', marginBottom: 6, textTransform: 'uppercase' }}>
                Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                style={{
                  width: '100%',
                  height: 42,
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: '1px solid #e4e6fc',
                  background: '#fdfdff',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-main, #34395e)', marginBottom: 6, textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '8px 40px 8px 14px',
                    borderRadius: 4,
                    border: '1px solid #e4e6fc',
                    background: '#fdfdff',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6c757d',
                  }}
                >
                  <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id="rememberMe" style={{ marginRight: 8, accentColor: '#f05387' }} defaultChecked />
              <label htmlFor="rememberMe" style={{ fontSize: 13, color: '#6c757d', cursor: 'pointer', margin: 0 }}>
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: '100%',
                height: 44,
                backgroundColor: '#f05387',
                borderColor: '#f05387',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(240, 83, 135, 0.4)',
              }}
            >
              {isLoggingIn ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: 25, textAlign: 'center', fontSize: 12, color: '#98a6ad', borderTop: '1px solid #eee', paddingTop: 15 }}>
            Copyright &copy; StudyCord {new Date().getFullYear()}
          </div>
        </div>
      </div>
    );
  }

  // Computed filtered questions for management tables
  const filteredQuestions = questions.filter((q) => {
    const isSameCat = (c1: string, c2: string) => {
      if (c1 === c2) return true;
      if ((c1 === '7' || c1 === 'funAndLearn') && (c2 === '7' || c2 === 'funAndLearn')) return true;
      if ((c1 === '8' || c1 === 'guess' || c1 === 'guessWord') && (c2 === '8' || c2 === 'guess' || c2 === 'guessWord')) return true;
      if ((c1 === '9' || c1 === 'audio' || c1 === 'audioQuestions') && (c2 === '9' || c2 === 'audio' || c2 === 'audioQuestions')) return true;
      if ((c1 === '10' || c1 === 'mathMania' || c1 === '3') && (c2 === '10' || c2 === 'mathMania' || c2 === '3')) return true;
      if ((c1 === '11' || c1 === 'multiMatch') && (c2 === '11' || c2 === 'multiMatch')) return true;
      return false;
    };
    const matchCat = questionFilter === 'all' || isSameCat(String(q.category), String(questionFilter));
    const matchLevel = levelFilter === 'all' || String(q.level || '1') === String(levelFilter);
    const matchSearch =
      !questionSearch.trim() ||
      (q.question && q.question.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.optiona && q.optiona.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.optionb && q.optionb.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.note && q.note.toLowerCase().includes(questionSearch.toLowerCase()));
    return matchCat && matchLevel && matchSearch;
  });

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    setMobileSidebarOpen(false);
  };

  const openEditQuestionModal = (q: any) => {
    setEditQId(q.id);
    setEditQText(q.question);
    setEditQCategory(q.category);
    setEditQSubcategory(q.subcategory || '101');
    setEditQLevel(q.level || '1');
    setEditQOptA(q.optiona || '');
    setEditQOptB(q.optionb || '');
    setEditQOptC(q.optionc || '');
    setEditQOptD(q.optiond || '');
    setEditQAnswer(q.answer || 'a');
    setEditQNote(q.note || '');
    setShowEditQuestionModal(true);
  };

  // ==========================================
  // EXACT PHP ADMIN DASHBOARD (header + views)
  // ==========================================
  return (
    <div className={`stisla-admin ${mobileSidebarOpen ? 'sidebar-mobile-open' : ''}`}>
      <link rel="stylesheet" href="/admin-assets/fontawesome/css/all.min.css" />

      {/* Navbar Background */}
      <div className="navbar-bg" />

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Top Navbar */}
      <nav className="main-navbar" style={{ left: sidebarCollapsed ? 70 : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: 20, cursor: 'pointer', marginRight: 15 }}
            title="Toggle Menu"
          >
            <i className="fas fa-bars" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: 20,
              padding: '6px 14px',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Payout & Dispute Reports Notification Bell */}
          <button
            onClick={() => handleMenuSelect('payment_requests')}
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title={`${stats.pendingPayments} Pending Payouts | ${stats.pendingReports} Question Reports`}
          >
            <i className="fas fa-bell" style={{ fontSize: 16 }} />
            {(stats.pendingPayments > 0 || stats.pendingReports > 0) && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#ff6169',
                  color: '#ffffff',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '2px 5px',
                  lineHeight: 1,
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {stats.pendingPayments + stats.pendingReports}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-language" style={{ fontSize: 16 }} />
            <span>English</span>
          </div>

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className="fa fa-user-circle" style={{ fontSize: 24 }} />
              <span>Hi, Administrator</span>
              <i className="fas fa-chevron-down" style={{ fontSize: 10 }} />
            </button>

            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 36,
                  background: 'var(--card-bg, #ffffff)',
                  borderRadius: 4,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: 160,
                  padding: '8px 0',
                  zIndex: 999,
                  border: '1px solid var(--border-color, #e4e6fc)',
                }}
              >
                <button
                  onClick={() => {
                    setActiveMenu('settings');
                    setUserDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    color: 'var(--text-main, #34395e)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <i className="fas fa-cog" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    color: '#fc544b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <i className="fas fa-sign-out-alt" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Sidebar (Exact line-for-line menu from header.php) */}
      <div className="main-sidebar" style={{ transform: sidebarCollapsed ? 'translateX(-260px)' : 'none' }}>
        <aside id="sidebar-wrapper">
          <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px 0' }}>
            <a href="javascript:void(0)" onClick={() => setActiveMenu('dashboard')} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <StudyCordLogo size="md" isDark={theme === 'dark'} />
            </a>
          </div>

          <ul className="sidebar-menu">
            {/* Dashboard */}
            <li className={activeMenu === 'dashboard' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('dashboard')}>
                <em className="fas fa-home" /> <span>Dashboard</span>
              </a>
            </li>

            {/* Quiz Zone Dropdown */}
            <li className="menu-header">Game Zones</li>
            <li className={`nav-item dropdown ${openDropdowns.quiz_zone ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('quiz_zone')}>
                <em className="fas fa-gift" />
                <span style={{ flex: 1 }}>Quiz Zone</span>
                <i className={`fas fa-chevron-${openDropdowns.quiz_zone ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.quiz_zone && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'categories' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('categories')}>Main Category</a>
                  </li>
                  <li className={activeMenu === 'subcategories' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('subcategories')}>Sub Category</a>
                  </li>
                  <li className={activeMenu === 'create_questions' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('create_questions')}>Create Questions</a>
                  </li>
                  <li className={activeMenu === 'manage_questions' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('manage_questions')}>View Questions</a>
                  </li>
                  <li className={activeMenu === 'question_reports' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('question_reports')}>Question Reports</a>
                  </li>
                </ul>
              )}
            </li>

            {/* Daily Quiz */}
            <li className={activeMenu === 'daily_quiz' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('daily_quiz')}>
                <em className="fas fa-question" /> <span>Daily Quiz</span>
              </a>
            </li>

            {/* Multi Match */}
            <li className={`nav-item dropdown ${openDropdowns.multi_match ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('multi_match')}>
                <em className="fas fa-puzzle-piece" />
                <span style={{ flex: 1 }}>Multi Match</span>
                <i className={`fas fa-chevron-${openDropdowns.multi_match ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.multi_match && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'multi_match' ? 'active' : ''}><a href="javascript:void(0)" onClick={() => handleMenuSelect('multi_match')}>Manage Pairs</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { setNewQCategory('11'); setShowAddQuestionModal(true); setMobileSidebarOpen(false); }}>Create Question</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { handleMenuSelect('manage_questions'); setQuestionFilter('11'); }}>View Questions</a></li>
                </ul>
              )}
            </li>

            {/* Contests */}
            <li className={`nav-item dropdown ${openDropdowns.contests ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('contests')}>
                <em className="fas fa-trophy" />
                <span style={{ flex: 1 }}>Contests</span>
                <i className={`fas fa-chevron-${openDropdowns.contests ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.contests && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'contests' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('contests')}>Manage Contest</a>
                  </li>
                  <li><a href="javascript:void(0)" onClick={() => { handleMenuSelect('manage_questions'); setQuestionFilter('all'); }}>Manage Questions</a></li>
                </ul>
              )}
            </li>

            {/* Fun 'N' Learn */}
            <li className={`nav-item dropdown ${openDropdowns.fun_learn ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('fun_learn')}>
                <em className="fas fa-book-open" />
                <span style={{ flex: 1 }}>Fun 'N' Learn</span>
                <i className={`fas fa-chevron-${openDropdowns.fun_learn ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.fun_learn && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'fun_learn' ? 'active' : ''}><a href="javascript:void(0)" onClick={() => handleMenuSelect('fun_learn')}>Manage Passages</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { setNewQCategory('7'); setShowAddQuestionModal(true); setMobileSidebarOpen(false); }}>Create Question</a></li>
                </ul>
              )}
            </li>

            {/* Guess The Word */}
            <li className={`nav-item dropdown ${openDropdowns.guess_word ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('guess_word')}>
                <em className="fas fa-atom" />
                <span style={{ flex: 1 }}>Guess The Word</span>
                <i className={`fas fa-chevron-${openDropdowns.guess_word ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.guess_word && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'guess_word' ? 'active' : ''}><a href="javascript:void(0)" onClick={() => handleMenuSelect('guess_word')}>Manage Words</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { setNewQCategory('8'); setShowAddQuestionModal(true); setMobileSidebarOpen(false); }}>Create Question</a></li>
                </ul>
              )}
            </li>

            {/* Audio Questions */}
            <li className={`nav-item dropdown ${openDropdowns.audio_questions ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('audio_questions')}>
                <em className="fas fa-microphone-alt" />
                <span style={{ flex: 1 }}>Audio Questions</span>
                <i className={`fas fa-chevron-${openDropdowns.audio_questions ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.audio_questions && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'audio_questions' ? 'active' : ''}><a href="javascript:void(0)" onClick={() => handleMenuSelect('audio_questions')}>Manage Audio</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { setNewQCategory('9'); setShowAddQuestionModal(true); setMobileSidebarOpen(false); }}>Create Question</a></li>
                </ul>
              )}
            </li>

            {/* Maths Quiz */}
            <li className={`nav-item dropdown ${openDropdowns.maths_quiz ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('maths_quiz')}>
                <em className="fas fa-calculator" />
                <span style={{ flex: 1 }}>Maths Quiz</span>
                <i className={`fas fa-chevron-${openDropdowns.maths_quiz ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.maths_quiz && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'maths_quiz' ? 'active' : ''}><a href="javascript:void(0)" onClick={() => handleMenuSelect('maths_quiz')}>Manage Maths</a></li>
                  <li><a href="javascript:void(0)" onClick={() => { setNewQCategory('3'); setShowAddQuestionModal(true); setMobileSidebarOpen(false); }}>Create Question</a></li>
                </ul>
              )}
            </li>

            {/* Exam Module */}
            <li className={activeMenu === 'exams' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('exams')}>
                <em className="fas fa-book" /> <span>Exam Module</span>
              </a>
            </li>

            {/* Users & Accounts */}
            <li className="menu-header">User Management</li>
            <li className={activeMenu === 'users' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('users')}>
                <em className="fas fa-users" /> <span>Users</span>
              </a>
            </li>
            <li className={activeMenu === 'referrals' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('referrals')}>
                <em className="fas fa-gift" /> <span>Referral Tracking</span>
              </a>
            </li>

            <li className={activeMenu === 'payments' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('payments')}>
                <em className="fas fa-rupee-sign" /> <span>Payment Requests</span>
              </a>
            </li>

            {/* Settings & Configuration */}
            <li className="menu-header">System & Communication</li>
            <li className={activeMenu === 'notifications' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('notifications')}>
                <em className="fas fa-bell" /> <span>Push Notifications</span>
              </a>
            </li>
            <li className={activeMenu === 'question_reports' ? 'active' : ''}>
              <a href="javascript:void(0)" onClick={() => handleMenuSelect('question_reports')}>
                <em className="fas fa-flag" /> <span>Question Reports</span>
              </a>
            </li>
            <li className={`nav-item dropdown ${openDropdowns.settings ? 'open' : ''}`}>
              <a href="javascript:void(0)" onClick={() => toggleDropdown('settings')}>
                <em className="fas fa-cog" />
                <span style={{ flex: 1 }}>Settings</span>
                <i className={`fas fa-chevron-${openDropdowns.settings ? 'down' : 'right'}`} style={{ fontSize: 10 }} />
              </a>
              {openDropdowns.settings && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, background: 'rgba(0,0,0,0.03)' }}>
                  <li className={activeMenu === 'settings' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('settings')}>System Configurations</a>
                  </li>
                  <li className={activeMenu === 'badges' ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handleMenuSelect('badges')}>Badges Settings</a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ paddingLeft: sidebarCollapsed ? 30 : undefined }}>
        {/* ======================================= */}
        {/* VIEW 1: EXACT PHP DASHBOARD (dashboard.php) */}
        {/* ======================================= */}
        {activeMenu === 'dashboard' && (
          <section className="section">
            <div className="section-header">
              <h1>Dashboard</h1>
            </div>

            <div className="section-body">
              {/* Row 1: 4 Stisla Statistic Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 20 }}>
                {/* Categories */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('categories')}>
                  <div className="card-icon bg-primary">
                    <em className="fas fa-cube" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Categories</h4>
                    </div>
                    <div className="card-body">{stats.totalCategories}</div>
                  </div>
                </div>

                {/* Sub Categories */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('subcategories')}>
                  <div className="card-icon bg-danger">
                    <em className="fas fa-cubes" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Sub Categories</h4>
                    </div>
                    <div className="card-body">{stats.totalSubcategories}</div>
                  </div>
                </div>

                {/* Questions */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('manage_questions')}>
                  <div className="card-icon bg-warning">
                    <em className="far fa-question-circle" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Questions</h4>
                    </div>
                    <div className="card-body">{stats.totalQuestions}</div>
                  </div>
                </div>

                {/* Registered Device / Users */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('users')}>
                  <div className="card-icon bg-success">
                    <em className="fas fa-users" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Registered Device</h4>
                    </div>
                    <div className="card-body">{stats.registeredDevices || stats.totalUsers || 0}</div>
                  </div>
                </div>
              </div>

              {/* Row 2: 4 Stisla Statistic Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 25 }}>
                {/* Live Contests */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('contests')}>
                  <div className="card-icon bg-success">
                    <em className="fas fa-trophy" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Live Contests</h4>
                    </div>
                    <div className="card-body">{stats.liveContests ?? stats.totalContests ?? 0}</div>
                  </div>
                </div>

                {/* Fun 'N' Learn */}
                <div className="card card-statistic-1" onClick={() => { setActiveMenu('manage_questions'); setQuestionFilter('7'); }}>
                  <div className="card-icon bg-warning">
                    <em className="fas fa-graduation-cap" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Fun 'N' Learn</h4>
                    </div>
                    <div className="card-body">{stats.funLearnCount ?? 0}</div>
                  </div>
                </div>

                {/* Guess The Word */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('guess_word')}>
                  <div className="card-icon bg-danger">
                    <em className="far fa-lightbulb" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Guess The Word</h4>
                    </div>
                    <div className="card-body">{stats.guessWordCount ?? 0}</div>
                  </div>
                </div>

                {/* System Users */}
                <div className="card card-statistic-1" onClick={() => setActiveMenu('users')}>
                  <div className="card-icon bg-primary">
                    <em className="fas fa-user-secret" />
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>System Users</h4>
                    </div>
                    <div className="card-body">{stats.systemUsers ?? 1}</div>
                  </div>
                </div>
              </div>

              {/* Chart Card: User Registration (Dynamic Live Graph) */}
              <div className="card" style={{ marginBottom: 25 }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <h6 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      User Registration
                    </h6>
                    <select className="form-control" style={{ width: 100, height: 35 }}>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>

                  {/* Day, Week, Month tabs */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {(['day', 'week', 'month'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setChartTab(tab)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          background: chartTab === tab ? '#f05387' : 'rgba(0,0,0,0.05)',
                          color: chartTab === tab ? '#ffffff' : 'var(--text-main)',
                          border: 'none',
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Real-time Dynamic Registration Chart */}
                  {(() => {
                    const chartItems = chartData?.[chartTab] || [];
                    const maxVal = Math.max(...chartItems.map((item: any) => Number(item.val) || 0), 1);

                    return (
                      <div style={{ height: 190, display: 'flex', alignItems: 'flex-end', gap: chartTab === 'month' ? 8 : 16, padding: '10px 0', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                        {chartItems.map((item: any, idx: number) => {
                          const barHeight = Number(item.val) > 0 ? Math.max(20, Math.round(((Number(item.val) || 0) / maxVal) * 135)) : 6;
                          return (
                            <div key={idx} style={{ flex: 1, minWidth: chartTab === 'month' ? 32 : 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#f05387' }}>{item.val}</span>
                              <div
                                style={{
                                  width: '100%',
                                  maxWidth: chartTab === 'month' ? 24 : 36,
                                  height: barHeight,
                                  background: 'linear-gradient(to top, #f05387, #ff8ba7)',
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.3s ease',
                                }}
                              />
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Two Column Layout: Recent Users & Pending Payments */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {/* Pending Payments Table */}
                <div className="card">
                  <div className="card-header">
                    <h4>Pending Payout Requests</h4>
                  </div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.filter((p) => p.status === '0').length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#98a6ad', padding: 20 }}>No pending requests</td></tr>
                          ) : (
                            payments.filter((p) => p.status === '0').map((p) => (
                              <tr key={p.id}>
                                <td><strong>User #{p.user_id}</strong></td>
                                <td>{p.payment_type}</td>
                                <td><strong style={{ color: '#47c363' }}>${Number(p.amount).toFixed(2)}</strong></td>
                                <td style={{ textAlign: 'right' }}>
                                  <button onClick={() => handleActionPayment(p.id, '1')} className="btn-success" style={{ marginRight: 6 }}>
                                    Approve
                                  </button>
                                  <button onClick={() => handleActionPayment(p.id, '2')} className="btn-danger">
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Question Reports */}
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Reported Questions</h4>
                    <button
                      onClick={() => setActiveMenu('question_reports')}
                      className="btn btn-sm btn-outline-primary"
                      style={{ padding: '2px 10px', fontSize: 12, borderRadius: 4 }}
                    >
                      View All
                    </button>
                  </div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Q ID</th>
                            <th>Question Preview / Issue</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.filter((r) => String(r.status) === '0').length === 0 ? (
                            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#98a6ad', padding: 20 }}>No open reports</td></tr>
                          ) : (
                            reports.filter((r) => String(r.status) === '0').map((r) => {
                              const q = questions.find((item) => String(item.id) === String(r.question_id));
                              return (
                                <tr key={r.id}>
                                  <td><strong>#{r.question_id}</strong></td>
                                  <td>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {q ? q.question : `Question #${r.question_id}`}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#dc3545', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {r.message}
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {q && (
                                      <button
                                        onClick={() => handleOpenEditQuestionFromReport(r.question_id)}
                                        className="btn-info"
                                        style={{ marginRight: 6, padding: '3px 8px', fontSize: 11 }}
                                        title="Edit Question"
                                      >
                                        <i className="fas fa-edit" />
                                      </button>
                                    )}
                                    <button onClick={() => handleResolveReport(r.id)} className="btn-success" style={{ padding: '3px 8px', fontSize: 11 }}>
                                      Resolve
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADMIN REVENUE & FINANCIAL METRICS COMMAND CENTER (Positioned below Pending Payout Requests) */}
              <div
                className="card"
                style={{
                  marginTop: 25,
                  marginBottom: 25,
                  background: 'linear-gradient(135deg, rgba(240,83,135,0.06) 0%, rgba(103,119,239,0.06) 100%)',
                  border: '1px solid rgba(240,83,135,0.25)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  borderRadius: 14,
                }}
              >
                <div
                  className="card-body"
                  style={{ padding: '20px 24px' }}
                >
                  {/* Top Bar with Title, Subtitle, and 1-Click Payout Request Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: 16,
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 800,
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <i className="fas fa-hand-holding-usd" style={{ color: '#f05387', fontSize: 20 }} />
                        <span>Financial Metrics & Admin Revenue</span>
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                        Live platform revenue, circulating coin liability, and instant payout gate control.
                      </p>
                    </div>

                    {/* Global Payout Gate Controller */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'var(--bg-card)',
                        padding: '8px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          User Payout Requests
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: settings?.payout_request_status === '1' ? '#47c363' : '#fc544b' }}>
                          {settings?.payout_request_status === '1' ? '● Active (Enabled)' : '● Disabled by Default (Locked)'}
                        </div>
                      </div>
                      <button
                        onClick={handleToggleGlobalPayout}
                        className={settings?.payout_request_status === '1' ? 'btn-danger' : 'btn-success'}
                        style={{
                          padding: '7px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                        }}
                        title={settings?.payout_request_status === '1' ? 'Click to disable payout requests globally' : 'Click to enable payout requests globally'}
                      >
                        <i className={settings?.payout_request_status === '1' ? 'fas fa-pause' : 'fas fa-play'} />
                        <span>{settings?.payout_request_status === '1' ? 'Pause Payouts' : 'Enable Payouts'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Financial Stat Widgets */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
                    {/* Gross Platform Revenue */}
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          Gross Platform Revenue
                        </span>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(71,195,99,0.12)', color: '#47c363', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-chart-line" style={{ fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#47c363' }}>
                        ₦{Number(stats.grossRevenueNaira || ((stats.totalCirculatingCoins || 0) * 5 * 1.5 + 65000)).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        Coin store purchases & battle entry pools
                      </div>
                    </div>

                    {/* Circulating Coin Liability */}
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          Coin Liability (₦)
                        </span>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,164,38,0.12)', color: '#ffa426', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-coins" style={{ fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#ffa426' }}>
                        ₦{Number(stats.coinLiabilityNaira || ((stats.totalCirculatingCoins || 0) * (Number(settings?.coin_value_in_currency) || 5))).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        {Number(stats.totalCirculatingCoins || 0).toLocaleString()} coins held across players (@ ₦{settings?.coin_value_in_currency ?? 5}/coin)
                      </div>
                    </div>

                    {/* Completed Payouts Disbursed */}
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          Paid Out Disbursed
                        </span>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(103,119,239,0.12)', color: '#6777ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-check-circle" style={{ fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>
                        ₦{Number(stats.completedPayoutsNaira || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        Successfully approved & paid out
                      </div>
                    </div>

                    {/* Pending Payout Requests */}
                    <div
                      onClick={() => setActiveMenu('payments')}
                      style={{
                        background: 'var(--bg-card)',
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          Pending Payouts
                        </span>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(252,84,75,0.12)', color: '#fc544b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-clock" style={{ fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fc544b' }}>
                        ₦{Number(stats.pendingPayoutsNaira || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        {stats.pendingPayments || 0} requests awaiting review &rarr;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 2: CATEGORIES (category.php)       */}
        {/* ======================================= */}
        {activeMenu === 'categories' && (
          <section className="section">
            <div className="section-header">
              <h1>Create and Manage Main Category</h1>
              <button onClick={() => setShowAddCatModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Category
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Categories <small>View, Update & Delete</small></h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Type</th>
                        <th>Slug</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.id}</strong></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div className="cat-icon-badge">
                                <img
                                  src={c.image || '/assets/images/quiz_zone_icon.svg'}
                                  alt={c.category_name}
                                  onError={(e: any) => {
                                    e.currentTarget.src = '/assets/images/quiz_zone_icon.svg';
                                  }}
                                />
                              </div>
                              <div>
                                <strong style={{ color: 'var(--text-main)', display: 'block' }}>{c.category_name}</strong>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.image || 'Default Icon'}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(240,83,135,0.1)', color: '#f05387', fontSize: 11, fontWeight: 700 }}>
                              {c.type === '1' ? 'Quiz Zone' : c.type === '2' ? 'Fun & Learn' : c.type === '3' ? 'Guess Word' : c.type === '4' ? 'Audio' : c.type === '5' ? 'Maths' : 'Multi Match'}
                            </span>
                          </td>
                          <td><code>{c.slug}</code></td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => {
                                setEditCatId(c.id);
                                setEditCatName(c.category_name);
                                setEditCatType(c.type || '1');
                                setEditCatIcon(c.image || '/assets/images/quiz_zone_icon.svg');
                                setShowEditCatModal(true);
                              }}
                              className="btn-primary"
                              style={{ marginRight: 6 }}
                              title="Edit Category"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete category "${c.category_name}"?`)) {
                                  await fetch(`/api/categories?id=${c.id}`, { method: 'DELETE' });
                                  loadAllData();
                                }
                              }}
                              className="btn-danger"
                              title="Delete Category"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 3: SUBCATEGORIES                   */}
        {/* ======================================= */}
        {activeMenu === 'subcategories' && (
          <section className="section">
            <div className="section-header">
              <h1>Create and Manage Sub Category</h1>
              <button
                onClick={() => {
                  if (categories.length > 0) setNewSubcatParent(categories[0].id);
                  setShowAddSubcatModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Sub Category
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Sub Categories <small>View, Update & Delete</small></h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subcategory Name</th>
                        <th>Main Category ID</th>
                        <th>Slug</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((s) => (
                        <tr key={s.id}>
                          <td><strong>{s.id}</strong></td>
                          <td><strong>{s.subcategory_name}</strong></td>
                          <td>Category #{s.maincat_id}</td>
                          <td><code>{s.slug}</code></td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => {
                                setEditSubcatId(s.id);
                                setEditSubcatName(s.subcategory_name);
                                setEditSubcatParent(s.maincat_id);
                                setShowEditSubcatModal(true);
                              }}
                              className="btn-primary"
                              style={{ marginRight: 6 }}
                              title="Edit Sub Category"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete subcategory "${s.subcategory_name}"?`)) {
                                  await fetch(`/api/subcategories?id=${s.id}`, { method: 'DELETE' });
                                  loadAllData();
                                }
                              }}
                              className="btn-danger"
                              title="Delete Sub Category"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 4: QUESTIONS (manage_questions)    */}
        {/* ======================================= */}
        {(activeMenu === 'manage_questions' || activeMenu === 'create_questions') && (
          <section className="section">
            <div className="section-header">
              <h1>Questions Management</h1>
              <button
                onClick={() => {
                  if (categories.length > 0) setNewQCategory(categories[0].id);
                  setShowAddQuestionModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Question
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Category:</label>
                    <select
                      className="form-control"
                      style={{ width: 'auto', minWidth: 160 }}
                      value={questionFilter}
                      onChange={(e) => setQuestionFilter(e.target.value)}
                    >
                      <option value="all">All Categories ({questions.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category_name} ({questions.filter((q) => String(q.category) === String(c.id)).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Level:</label>
                    <select
                      className="form-control"
                      style={{ width: 'auto', minWidth: 120 }}
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={String(l)}>Level {l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search questions or options..."
                    style={{ minWidth: 260 }}
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                  {questionSearch && (
                    <button
                      onClick={() => setQuestionSearch('')}
                      style={{ background: 'none', border: 'none', color: '#fc544b', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>
                  Questions Bank <small>Showing {filteredQuestions.length} of {questions.length}</small>
                </h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Question & Options</th>
                        <th>Category / Level</th>
                        <th>Correct Answer</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                            No questions found matching your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.map((q) => (
                          <tr key={q.id}>
                            <td><strong>#{q.id}</strong></td>
                            <td style={{ maxWidth: 360 }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{q.question}</div>
                              <div style={{ fontSize: 11, color: '#6c757d', marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                <span><strong>A:</strong> {q.optiona}</span>
                                <span><strong>B:</strong> {q.optionb}</span>
                                {q.optionc && <span><strong>C:</strong> {q.optionc}</span>}
                                {q.optiond && <span><strong>D:</strong> {q.optiond}</span>}
                              </div>
                              {q.note && (
                                <div style={{ fontSize: 11, color: '#f05387', marginTop: 4, fontStyle: 'italic' }}>
                                  Note: {q.note}
                                </div>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#f05387' }}>
                                Cat #{q.category} &bull; Lvl {q.level || '1'}
                              </span>
                            </td>
                            <td>
                              <span style={{ padding: '3px 10px', borderRadius: 4, background: '#47c363', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                                Option {q.answer}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => openEditQuestionModal(q)}
                                className="btn-primary"
                                style={{ marginRight: 6 }}
                                title="Edit Question"
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete this question permanently?')) {
                                    await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                    loadAllData();
                                  }
                                }}
                                className="btn-danger"
                                title="Delete Question"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 5: DAILY QUIZ (daily_quiz)         */}
        {/* ======================================= */}
        {activeMenu === 'daily_quiz' && (
          <section className="section">
            <div className="section-header">
              <h1>Daily Quiz Challenge Management</h1>
              <button
                onClick={() => {
                  setNewQCategory('1');
                  setShowAddQuestionModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Daily Question
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(240,83,135,0.1)', color: '#f05387', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-calendar-check" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Daily Quiz Schedule & Rotation</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Daily Quiz serves 10 curated questions per day to reward consistent learners with bonus streak points.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Daily Quiz Questions Bank</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Question</th>
                        <th>Options</th>
                        <th>Answer</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '1' || String(q.id).startsWith('dq')).map((q) => (
                        <tr key={q.id}>
                          <td><strong>#{q.id}</strong></td>
                          <td style={{ fontWeight: 700, maxWidth: 300 }}>{q.question}</td>
                          <td>
                            <span style={{ fontSize: 11, color: '#6c757d' }}>A: {q.optiona} | B: {q.optionb}</span>
                          </td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: 4, background: '#47c363', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                              Option {q.answer}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => openEditQuestionModal(q)}
                              className="btn-primary"
                              style={{ marginRight: 6 }}
                              title="Edit Daily Question"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Delete daily quiz question?')) {
                                  await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                  loadAllData();
                                }
                              }}
                              className="btn-danger"
                              title="Delete Question"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 6: MULTI MATCH (multi_match)       */}
        {/* ======================================= */}
        {activeMenu === 'multi_match' && (
          <section className="section">
            <div className="section-header">
              <h1>Multi Match Pairs Management</h1>
              <button onClick={() => setShowAddMatchModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Match Pair
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(71,195,99,0.1)', color: '#47c363', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-link" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Multi Match Interlocking Puzzles</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Players connect items in the left column with their corresponding pair in the right column.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Registered Multi Match Pairs</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Left Column Item</th>
                        <th>Target Matching Pair</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '11' || q.category === 'multiMatch').length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No match pairs created yet. Click Create Match Pair above.</td></tr>
                      ) : (
                        questions.filter((q) => q.category === '11' || q.category === 'multiMatch').map((q) => (
                          <tr key={q.id}>
                            <td><strong>#{q.id}</strong></td>
                            <td><strong style={{ color: '#f05387' }}>{q.question.replace('Match: ', '')}</strong></td>
                            <td><code style={{ background: 'rgba(71,195,99,0.1)', color: '#47c363', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>{q.optiona}</code></td>
                            <td><span style={{ padding: '2px 8px', borderRadius: 4, background: '#e4e6fc', fontSize: 11, fontWeight: 700 }}>Active</span></td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => {
                                  setEditMatchId(q.id);
                                  setEditMatchLeft(q.question.replace('Match: ', ''));
                                  setEditMatchRight(q.optiona || '');
                                  setShowEditMatchModal(true);
                                }}
                                className="btn-primary"
                                style={{ marginRight: 6 }}
                                title="Edit Match Pair"
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete this match pair?')) {
                                    await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                    loadAllData();
                                  }
                                }}
                                className="btn-danger"
                                title="Delete Match Pair"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 7: CONTESTS (contest.php)          */}
        {/* ======================================= */}
        {activeMenu === 'contests' && (
          <section className="section">
            <div className="section-header">
              <h1>Contest Zone Management</h1>
              <button onClick={() => setShowAddContestModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Contest
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {contests.map((c) => (
                <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{c.name}</h4>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: (c.status || 'live') === 'live' ? 'rgba(71,195,99,0.15)' : (c.status || 'live') === 'upcoming' ? 'rgba(255,164,38,0.15)' : 'rgba(108,117,125,0.15)',
                          color: (c.status || 'live') === 'live' ? '#47c363' : (c.status || 'live') === 'upcoming' ? '#ffa426' : '#6c757d',
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {c.status || 'live'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.description}</p>
                      <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid var(--border-color)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div><strong>Entry Coin:</strong> <span style={{ color: '#ffa426', fontWeight: 700 }}>{c.entry_coin} Coins</span></div>
                        <div><strong>Prize Pool:</strong> <span style={{ color: '#47c363', fontWeight: 700 }}>{c.prize_pool} Coins</span></div>
                        <div><strong>Schedule:</strong> {c.start_date} to {c.end_date}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => {
                        setEditContestId(c.id);
                        setEditContestName(c.name);
                        setEditContestDesc(c.description || '');
                        setEditContestStart(c.start_date || '');
                        setEditContestEnd(c.end_date || '');
                        setEditContestEntry(c.entry_coin || 10);
                        setEditContestPrize(c.prize_pool || 100);
                        setShowEditContestModal(true);
                      }}
                      className="btn-primary"
                    >
                      <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete contest "${c.name}"?`)) {
                          await fetch(`/api/contests?id=${c.id}`, { method: 'DELETE' });
                          loadAllData();
                        }
                      }}
                      className="btn-danger"
                    >
                      <i className="fas fa-trash" style={{ marginRight: 6 }} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 8: FUN 'N' LEARN (fun_n_learn.php) */}
        {/* ======================================= */}
        {activeMenu === 'fun_learn' && (
          <section className="section">
            <div className="section-header">
              <h1>Fun 'N' Learn Passages & Questions</h1>
              <button
                onClick={() => {
                  setNewQCategory('7');
                  setShowAddQuestionModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Study Question
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,164,38,0.1)', color: '#ffa426', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-book-reader" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Comprehension & Guided Learning</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Players read short informative passages or concept summaries and then answer targeted comprehension questions.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Fun 'N' Learn Questions Bank</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Passage / Question</th>
                        <th>Correct Answer</th>
                        <th>Explanation Note</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '7' || q.category === 'funAndLearn' || Boolean(q.passage)).length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No Fun 'N' Learn questions yet.</td></tr>
                      ) : (
                        questions.filter((q) => q.category === '7' || q.category === 'funAndLearn' || Boolean(q.passage)).map((q) => (
                          <tr key={q.id}>
                            <td><strong>#{q.id}</strong></td>
                            <td style={{ maxWidth: 320, fontWeight: 700 }}>{q.question}</td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: 4, background: '#47c363', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                                Option {q.answer}
                              </span>
                            </td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.note || 'None'}</td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => openEditQuestionModal(q)}
                                className="btn-primary"
                                style={{ marginRight: 6 }}
                                title="Edit Question"
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete Fun N Learn question?')) {
                                    await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                    loadAllData();
                                  }
                                }}
                                className="btn-danger"
                                title="Delete Question"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 9: GUESS THE WORD (guess_word.php) */}
        {/* ======================================= */}
        {activeMenu === 'guess_word' && (
          <section className="section">
            <div className="section-header">
              <h1>Guess The Word Management</h1>
              <button onClick={() => setShowAddWordModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Target Word
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(252,84,75,0.1)', color: '#fc544b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-spell-check" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Vocabulary & Word Guessing Mode</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Contestants are given a clue or riddle and must spell out the correct word by picking scrambled letters.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Registered Words & Riddles</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Clue / Riddle</th>
                        <th>Target Word</th>
                        <th>Length</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '8' || q.category === 'guess' || q.category === 'guessWord').length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No words registered yet. Click Add Target Word above.</td></tr>
                      ) : (
                        questions.filter((q) => q.category === '8' || q.category === 'guess' || q.category === 'guessWord').map((q) => {
                          const targetWord = (q.optionc || q.optiona || '').toUpperCase();
                          return (
                            <tr key={q.id}>
                              <td><strong>#{q.id}</strong></td>
                              <td style={{ fontWeight: 700, maxWidth: 300 }}>{q.question}</td>
                              <td>
                                <span style={{ padding: '4px 10px', borderRadius: 4, background: '#f05387', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>
                                  {targetWord}
                                </span>
                              </td>
                              <td><strong>{targetWord.length} letters</strong></td>
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <button
                                  onClick={() => {
                                    setEditWordId(q.id);
                                    setEditWordClue(q.question);
                                    setEditWordTarget((q.optionc || q.optiona || '').toUpperCase());
                                    setShowEditWordModal(true);
                                  }}
                                  className="btn-primary"
                                  style={{ marginRight: 6 }}
                                  title="Edit Word"
                                >
                                  <i className="fas fa-edit" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete word clue?')) {
                                      await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                      loadAllData();
                                    }
                                  }}
                                  className="btn-danger"
                                  title="Delete Word"
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 10: AUDIO QUESTIONS (audio.php)    */}
        {/* ======================================= */}
        {activeMenu === 'audio_questions' && (
          <section className="section">
            <div className="section-header">
              <h1>Audio Questions Management</h1>
              <button
                onClick={() => {
                  setNewQCategory('9');
                  setShowAddQuestionModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Audio Question
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(58,186,244,0.1)', color: '#3abaf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-headphones" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Audio & Sound Recognition Mode</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Listening questions where audio clips play, prompting contestants to identify instruments, languages, sounds or accents.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Registered Audio Questions</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Audio Prompt / Question</th>
                        <th>Options</th>
                        <th>Correct Answer</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '9' || q.category === 'audio' || q.category === 'audioQuestions' || Boolean(q.audio)).length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No audio questions found.</td></tr>
                      ) : (
                        questions.filter((q) => q.category === '9' || q.category === 'audio' || q.category === 'audioQuestions' || Boolean(q.audio)).map((q) => (
                          <tr key={q.id}>
                            <td><strong>#{q.id}</strong></td>
                            <td style={{ maxWidth: 300 }}>
                              <div style={{ fontWeight: 700 }}><i className="fas fa-volume-up" style={{ color: '#3abaf4', marginRight: 6 }} />{q.question}</div>
                              {q.audio && <div style={{ fontSize: 11, color: '#6c757d', marginTop: 2 }}>Clip: <code>{q.audio}</code></div>}
                            </td>
                            <td style={{ fontSize: 11, color: '#6c757d' }}>
                              A: {q.optiona} | B: {q.optionb} | C: {q.optionc} | D: {q.optiond}
                            </td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: 4, background: '#47c363', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                                Option {q.answer}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => openEditQuestionModal(q)}
                                className="btn-primary"
                                style={{ marginRight: 6 }}
                                title="Edit Audio Question"
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete audio question?')) {
                                    await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                    loadAllData();
                                  }
                                }}
                                className="btn-danger"
                                title="Delete Question"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 11: MATHS QUIZ (maths_quiz.php)    */}
        {/* ======================================= */}
        {activeMenu === 'maths_quiz' && (
          <section className="section">
            <div className="section-header">
              <h1>Maths Quiz & Maths Mania</h1>
              <button
                onClick={() => {
                  setNewQCategory('3');
                  setShowAddQuestionModal(true);
                }}
                className="btn-primary"
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Math Question
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(103,119,239,0.1)', color: '#6777ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-square-root-alt" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Equations, Calculations & Mental Arithmetic</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Presents mathematical problems, LaTeX formula representations, and arithmetic challenges with automated answer checks.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Registered Math Questions</h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Problem / Equation</th>
                        <th>Options</th>
                        <th>Correct Answer</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.filter((q) => q.category === '3' || q.category === '10' || q.category === 'mathMania' || Boolean(q.mathEquation)).map((q) => (
                        <tr key={q.id}>
                          <td><strong>#{q.id}</strong></td>
                          <td style={{ maxWidth: 300 }}>
                            <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{q.question}</div>
                          </td>
                          <td style={{ fontSize: 11, color: '#6c757d' }}>
                            A: {q.optiona} | B: {q.optionb} | C: {q.optionc} | D: {q.optiond}
                          </td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: 4, background: '#47c363', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                              Option {q.answer}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => openEditQuestionModal(q)}
                              className="btn-primary"
                              style={{ marginRight: 6 }}
                              title="Edit Math Question"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Delete math question?')) {
                                  await fetch(`/api/questions?id=${q.id}`, { method: 'DELETE' });
                                  loadAllData();
                                }
                              }}
                              className="btn-danger"
                              title="Delete Question"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 12: EXAMS (exam_module.php)        */}
        {/* ======================================= */}
        {activeMenu === 'exams' && (
          <section className="section">
            <div className="section-header">
              <h1>Exam Module Management</h1>
              <button onClick={() => setShowAddExamModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Exam
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {exams.map((e) => (
                <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{e.title}</h4>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(103,119,239,0.1)', color: '#6777ef', fontSize: 11, fontWeight: 700 }}>
                        {e.duration} Mins
                      </span>
                    </div>
                    <div className="card-body">
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{e.rules || 'Standard online assessment examination rules apply.'}</p>
                      <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid var(--border-color)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div><strong>Total Marks:</strong> <span style={{ color: '#47c363', fontWeight: 700 }}>{e.total_marks}</span></div>
                        <div><strong>Passing Mark:</strong> <span style={{ color: '#ffa426', fontWeight: 700 }}>{e.pass_percentage}%</span></div>
                        <div><strong>Status:</strong> <span style={{ color: '#47c363' }}>Active</span></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => {
                        setEditExamId(e.id);
                        setEditExamTitle(e.title);
                        setEditExamDuration(e.duration);
                        setEditExamMarks(e.total_marks);
                        setEditExamPass(e.pass_percentage);
                        setEditExamRules(e.rules || '');
                        setShowEditExamModal(true);
                      }}
                      className="btn-primary"
                    >
                      <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete exam "${e.title}"?`)) {
                          await fetch(`/api/exams?id=${e.id}`, { method: 'DELETE' });
                          loadAllData();
                        }
                      }}
                      className="btn-danger"
                    >
                      <i className="fas fa-trash" style={{ marginRight: 6 }} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 6: USERS (users.php)               */}
        {/* ======================================= */}
        {activeMenu === 'users' && (
          <section className="section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1>Registered Players & Devices</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  Monitor player coin liabilities, scores, registration status, and grant individual payout eligibility.
                </p>
              </div>
              <button
                onClick={() => {
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserMobile('');
                  setNewUserCoins(100);
                  setNewUserScore(0);
                  setNewUserStatus('1');
                  setNewUserPayoutEligible(false);
                  setShowAddUserModal(true);
                }}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 13, fontWeight: 700 }}
              >
                <i className="fas fa-user-plus" />
                <span>+ Register New Player</span>
              </button>
            </div>

            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Player Name</th>
                        <th>Email & Contact</th>
                        <th>Coins Balance</th>
                        <th>Score</th>
                        <th>Referral Info</th>
                        <th>Account Status</th>
                        <th>Payout Access</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', color: '#98a6ad', padding: 30 }}>
                            No registered players found. Click "+ Register New Player" to add one.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => {
                          const coinLiability = (Number(u.coins) || 0) * (Number(settings?.coin_value_in_currency) || 5);
                          return (
                            <tr key={u.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '50%',
                                      background: 'linear-gradient(135deg, #f05387 0%, #6777ef 100%)',
                                      color: '#fff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: 12,
                                    }}
                                  >
                                    {(u.name || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <strong>{u.name}</strong>
                                    {u.refer_code && (
                                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                        Code: <strong style={{ color: '#f05387' }}>{u.refer_code}</strong>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{u.email}</div>
                                {u.mobile && (
                                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.mobile}</div>
                                )}
                              </td>
                              <td>
                                <div>
                                  <span style={{ color: '#ffa426', fontWeight: 800 }}>{u.coins || 0} Coins</span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                  ≈ ₦{coinLiability.toLocaleString()}
                                </div>
                              </td>
                              <td><strong>{u.score || 0} pts</strong></td>
                              <td>
                                <div>
                                  <span style={{ fontWeight: 700, color: '#f05387' }}>
                                    {u.referrals_count || 0} referred
                                  </span>
                                  {Number(u.referral_coins_earned) > 0 && (
                                    <span style={{ fontSize: 11, color: '#ffa426', marginLeft: 4 }}>
                                      (+{u.referral_coins_earned} coins)
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                  {u.referred_by_name ? (
                                    <span>Invited by: <strong>{u.referred_by_name}</strong></span>
                                  ) : (
                                    <span>Direct signup</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span style={{ padding: '3px 8px', borderRadius: 4, background: u.status === '1' ? 'rgba(71,195,99,0.1)' : 'rgba(252,84,75,0.1)', color: u.status === '1' ? '#47c363' : '#fc544b', fontSize: 11, fontWeight: 700 }}>
                                  {u.status === '1' ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td>
                                <span style={{
                                  padding: '3px 9px',
                                  borderRadius: 4,
                                  background: u.payout_eligible ? 'rgba(71,195,99,0.15)' : 'rgba(255,164,38,0.15)',
                                  color: u.payout_eligible ? '#47c363' : '#ffa426',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                }}>
                                  <i className={u.payout_eligible ? 'fas fa-check-circle' : 'fas fa-lock'} />
                                  <span>{u.payout_eligible ? 'Eligible (Allowed)' : 'Locked (Default)'}</span>
                                </span>
                              </td>
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {/* Quick Payout Access Toggle Button */}
                                <button
                                  onClick={() => handleToggleUserPayoutEligible(u)}
                                  className={u.payout_eligible ? 'btn-warning' : 'btn-success'}
                                  style={{ marginRight: 6 }}
                                  title={u.payout_eligible ? 'Lock Payouts for this player' : 'Authorize Payouts for this player'}
                                >
                                  <i className={u.payout_eligible ? 'fas fa-lock' : 'fas fa-unlock'} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditUserId(u.id);
                                    setEditUserName(u.name || '');
                                    setEditUserEmail(u.email || '');
                                    setEditUserCoins(u.coins || 0);
                                    setEditUserScore(u.score || 0);
                                    setEditUserStatus(u.status || '1');
                                    setEditUserPayoutEligible(Boolean(u.payout_eligible));
                                    setShowEditUserModal(true);
                                  }}
                                  className="btn-primary"
                                  style={{ marginRight: 6 }}
                                  title="Edit User Profile & Settings"
                                >
                                  <i className="fas fa-edit" />
                                </button>
                                <button
                                  onClick={async () => {
                                    const nextStatus = u.status === '1' ? '0' : '1';
                                    await fetch('/api/users', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: u.id, status: nextStatus }),
                                    });
                                    loadAllData();
                                  }}
                                  className={u.status === '1' ? 'btn-warning' : 'btn-success'}
                                  style={{ marginRight: 6 }}
                                  title={u.status === '1' ? 'Suspend Player' : 'Activate Player'}
                                >
                                  <i className={u.status === '1' ? 'fas fa-ban' : 'fas fa-check'} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="btn-danger"
                                  title="Delete User Permanently"
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 6B: REFERRAL TRACKING              */}
        {/* ======================================= */}
        {activeMenu === 'referrals' && (
          <section className="section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1>Referral Tracking & Audit Trail</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  Monitor all platform referrals, who invited whom, bonus coins disbursed, and track top referrers.
                </p>
              </div>
              <button
                onClick={() => loadAllData()}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 13, fontWeight: 700 }}
              >
                <i className="fas fa-sync" />
                <span>Refresh Logs</span>
              </button>
            </div>

            {/* Metrics cards */}
            <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="card" style={{ padding: 18, borderLeft: '4px solid #f05387' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Total Referrals
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#f05387', marginTop: 4 }}>
                  {referrals.length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Successful player invites
                </div>
              </div>

              <div className="card" style={{ padding: 18, borderLeft: '4px solid #ffa426' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Coins Awarded to Referrers
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#ffa426', marginTop: 4 }}>
                  {(referrals.length * 100).toLocaleString()} Coins
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  +100 Coins per referral
                </div>
              </div>

              <div className="card" style={{ padding: 18, borderLeft: '4px solid #47c363' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Referee Welcome Bonuses
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#47c363', marginTop: 4 }}>
                  {(referrals.length * 50).toLocaleString()} Coins
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  +50 Coins welcome gift
                </div>
              </div>
            </div>

            {/* Referrals Table */}
            <div className="card">
              <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Complete Referral Audit Log</h4>
                <span className="badge badge-primary" style={{ padding: '4px 10px', fontSize: 12 }}>
                  {referrals.length} Total Records
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Referrer (Invited By)</th>
                        <th>Invite Code Used</th>
                        <th>New Player (Referee)</th>
                        <th>Referrer Reward</th>
                        <th>Referee Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#98a6ad', padding: 30 }}>
                            No referral records registered yet.
                          </td>
                        </tr>
                      ) : (
                        referrals.map((r: any) => (
                          <tr key={r.id}>
                            <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                              {r.date || r.created_at || 'Recently'}
                            </td>
                            <td>
                              <strong>{r.referrer_name || 'Player'}</strong>
                              {r.referrer_id && (
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {r.referrer_id}</div>
                              )}
                            </td>
                            <td>
                              <span style={{ fontWeight: 800, letterSpacing: 0.5, color: '#f05387', background: 'rgba(240,83,135,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                {r.referrer_code || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <strong>{r.referee_name || 'New Player'}</strong>
                              {r.referee_email && (
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.referee_email}</div>
                              )}
                            </td>
                            <td>
                              <span style={{ color: '#47c363', fontWeight: 800, background: 'rgba(71,195,99,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                +{r.reward_coins || 100} Coins
                              </span>
                            </td>
                            <td>
                              <span style={{ color: '#ffa426', fontWeight: 800, background: 'rgba(255,164,38,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                +{r.referee_bonus_coins || 50} Coins
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 7: PAYMENTS                        */}
        {/* ======================================= */}
        {activeMenu === 'payments' && (
          <section className="section">
            <div className="section-header">
              <h1>Payment Requests & Withdrawals</h1>
            </div>

            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Method</th>
                        <th>Account Detail</th>
                        <th>Coins Redeemed</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td><strong>User #{p.user_id}</strong></td>
                          <td>{p.payment_type}</td>
                          <td><code>{p.payment_address}</code></td>
                          <td>{p.coin_used} Coins</td>
                          <td><strong style={{ color: '#47c363' }}>${Number(p.amount).toFixed(2)}</strong></td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: 4, background: p.status === '1' ? 'rgba(71,195,99,0.1)' : p.status === '2' ? 'rgba(252,84,75,0.1)' : 'rgba(255,164,38,0.1)', color: p.status === '1' ? '#47c363' : p.status === '2' ? '#fc544b' : '#ffa426', fontSize: 11, fontWeight: 700 }}>
                              {p.status === '1' ? 'Approved' : p.status === '2' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {p.status === '0' ? (
                              <>
                                <button onClick={() => handleActionPayment(p.id, '1')} className="btn-success" style={{ marginRight: 6 }}>
                                  Approve
                                </button>
                                <button onClick={() => handleActionPayment(p.id, '2')} className="btn-danger" style={{ marginRight: 6 }}>
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>Processed</span>
                            )}
                            <button
                              onClick={() => handleDeletePayment(p.id)}
                              className="btn-danger"
                              title="Delete Payment Record"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 13: NOTIFICATIONS (send_notifications.php) */}
        {/* ======================================= */}
        {activeMenu === 'notifications' && (
          <section className="section">
            <div className="section-header">
              <h1>Push Notifications & Announcements</h1>
              <button onClick={() => setShowSendNotifModal(true)} className="btn-primary">
                <i className="fas fa-paper-plane" style={{ marginRight: 6 }} /> Send Notification
              </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(240,83,135,0.1)', color: '#f05387', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <i className="fas fa-broadcast-tower" />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Global Push Broadcasts</h6>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                    Send real-time alerts, daily quiz reminders, contest announcements, and reward messages directly to all registered users.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Broadcast History <small>Total: {notifications.length}</small></h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Notification Title</th>
                        <th>Message Content</th>
                        <th>Date Sent</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No notifications sent yet. Click Send Notification above.</td></tr>
                      ) : (
                        notifications.map((n) => (
                          <tr key={n.id}>
                            <td><strong>#{n.id}</strong></td>
                            <td><strong style={{ color: '#f05387' }}>{n.title}</strong></td>
                            <td style={{ maxWidth: 350 }}>{n.message}</td>
                            <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.date || 'Recent'}</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete notification record?')) {
                                    await fetch(`/api/notifications?id=${n.id}`, { method: 'DELETE' });
                                    loadAllData();
                                  }
                                }}
                                className="btn-danger"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 14: QUESTION REPORTS (question_reports.php) */}
        {/* ======================================= */}
        {activeMenu === 'question_reports' && (
          <section className="section">
            <div className="section-header">
              <h1>Question Reports & Dispute Resolution</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Reported Questions <small>Total: {reports.length}</small></h4>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Report ID</th>
                        <th>Question</th>
                        <th>Reported Reason / Error</th>
                        <th>Reporter</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 25, color: '#6c757d' }}>No question reports on file.</td></tr>
                      ) : (
                        reports.map((r) => {
                          const q = questions.find((item) => String(item.id) === String(r.question_id));
                          const u = users.find((item) => String(item.id) === String(r.user_id));
                          const isResolved = String(r.status) === '1';

                          return (
                            <tr key={r.id}>
                              <td><strong>#{r.id}</strong></td>
                              <td style={{ maxWidth: 300 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                  <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(103,119,239,0.1)', color: '#6777ef', fontWeight: 700, fontSize: 11 }}>
                                    Q #{r.question_id}
                                  </span>
                                  {q?.level && (
                                    <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.06)', fontSize: 10, fontWeight: 600 }}>
                                      Level {q.level}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.35 }}>
                                  {q ? q.question : `Question #${r.question_id}`}
                                </div>
                              </td>
                              <td style={{ maxWidth: 260 }}>
                                <div style={{ fontWeight: 600, color: '#dc3545', fontSize: 13, lineHeight: 1.3 }}>{r.message}</div>
                                {r.date && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.date}</div>}
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{u?.name || `User #${r.user_id}`}</div>
                                {u?.email && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>}
                              </td>
                              <td>
                                <span style={{ padding: '3px 8px', borderRadius: 4, background: isResolved ? 'rgba(71,195,99,0.1)' : 'rgba(252,84,75,0.1)', color: isResolved ? '#47c363' : '#fc544b', fontSize: 11, fontWeight: 700 }}>
                                  {isResolved ? 'Resolved' : 'Pending Review'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {q && (
                                  <button
                                    onClick={() => handleOpenEditQuestionFromReport(r.question_id)}
                                    className="btn-info"
                                    style={{ marginRight: 6, padding: '5px 10px', fontSize: 12 }}
                                    title="Edit Question Details"
                                  >
                                    <i className="fas fa-edit" style={{ marginRight: 4 }} /> Edit Question
                                  </button>
                                )}
                                <button
                                  onClick={() => handleToggleReportStatus(r.id, r.status)}
                                  className={isResolved ? 'btn-secondary' : 'btn-success'}
                                  style={{ marginRight: 6, padding: '5px 10px', fontSize: 12 }}
                                >
                                  {isResolved ? 'Reopen' : 'Resolve'}
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this report?')) {
                                      await fetch(`/api/reports?id=${r.id}`, { method: 'DELETE' });
                                      loadAllData();
                                    }
                                  }}
                                  className="btn-danger"
                                  style={{ padding: '5px 10px', fontSize: 12 }}
                                  title="Delete Report"
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 15: BADGES (badges.php)            */}
        {/* ======================================= */}
        {activeMenu === 'badges' && (
          <section className="section">
            <div className="section-header">
              <h1>Badges & Achievement System</h1>
              <button onClick={() => setShowAddBadgeModal(true)} className="btn-primary">
                <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Badge
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {badges.map((b) => {
                const bIcon = b.icon?.startsWith('/') ? b.icon : `/assets/images/${b.icon || 'badges_icon'}.svg`;
                return (
                  <div
                    key={b.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 16,
                      border: '1px solid rgba(239, 83, 136, 0.35)',
                      background: 'radial-gradient(circle at top, rgba(239, 83, 136, 0.08) 0%, var(--card-bg, #ffffff) 70%)',
                      boxShadow: '0 4px 14px rgba(239, 83, 136, 0.12)',
                    }}
                  >
                    <div>
                      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                        <div style={{ position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src="/assets/images/hexagon.svg" alt="Hexagon" style={{ width: 48, height: 48 }} />
                          <span
                            style={{
                              position: 'absolute',
                              width: 20,
                              height: 20,
                              backgroundColor: '#ffffff',
                              WebkitMask: `url("${bIcon}") no-repeat center / contain`,
                              mask: `url("${bIcon}") no-repeat center / contain`,
                            }}
                          />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, color: '#f05387', fontWeight: 800 }}>{b.title}</h4>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Type: {b.type}</span>
                        </div>
                      </div>
                      <div className="card-body" style={{ padding: '0 20px 16px' }}>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                          Required Milestone: <strong style={{ color: 'var(--text-main)' }}>{b.requirement}</strong>
                        </p>
                        <div style={{ fontSize: 13 }}>
                          <strong>Reward:</strong> <span style={{ color: '#ffa426', fontWeight: 700 }}>+{b.reward_coins} Coins</span>
                        </div>
                      </div>
                    </div>
                  <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => {
                        setEditBadgeId(b.id);
                        setEditBadgeTitle(b.title);
                        setEditBadgeReq(b.requirement);
                        setEditBadgeReward(b.reward_coins);
                        setShowEditBadgeModal(true);
                      }}
                      className="btn-primary"
                    >
                      <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete badge "${b.title}"?`)) {
                          await fetch(`/api/badges?id=${b.id}`, { method: 'DELETE' });
                          loadAllData();
                        }
                      }}
                      className="btn-danger"
                    >
                      <i className="fas fa-trash" style={{ marginRight: 6 }} /> Delete Badge
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </section>
        )}

        {/* ======================================= */}
        {/* VIEW 16: SETTINGS (system_configurations)*/}
        {/* ======================================= */}
        {activeMenu === 'settings' && (
          <section className="section">
            <div className="section-header">
              <h1>System Configurations & Settings</h1>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await fetch('/api/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(settings),
                });
                alert('System settings updated successfully!');
                loadAllData();
              }}
            >
              {/* Card 1: General & Currency Settings */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <h4><i className="fas fa-sliders-h" style={{ marginRight: 8, color: '#f05387' }} />General & Platform Economy</h4>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>App Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings?.app_name || 'StudyCord'}
                        onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Currency Symbol</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings?.currency_symbol || '₦'}
                        onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Currency Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings?.currency_code || 'NGN'}
                        onChange={(e) => setSettings({ ...settings, currency_code: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Correct Answer Coins</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.correct_answer_coins ?? 4}
                        onChange={(e) => setSettings({ ...settings, correct_answer_coins: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Lifeline Cost (Coins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.lifeline_cost ?? 4}
                        onChange={(e) => setSettings({ ...settings, lifeline_cost: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Min Withdrawal Coins</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.min_withdrawal_coins ?? 200}
                        onChange={(e) => setSettings({ ...settings, min_withdrawal_coins: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 1.5: Payout Requests & Cashout Governance */}
              <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid #f05387' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <h4><i className="fas fa-hand-holding-usd" style={{ marginRight: 8, color: '#f05387' }} />Payout Requests & Cashout Governance</h4>
                  <span style={{
                    padding: '3px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    background: settings?.payout_request_status === '1' ? 'rgba(71,195,99,0.15)' : 'rgba(252,84,75,0.15)',
                    color: settings?.payout_request_status === '1' ? '#47c363' : '#fc544b',
                  }}>
                    {settings?.payout_request_status === '1' ? '● Payouts Active' : '● Payouts Disabled by Default (Locked)'}
                  </span>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                        Global Payout Requests Status (Default: Disabled)
                      </label>
                      <select
                        className="form-control"
                        value={settings?.payout_request_status || '0'}
                        onChange={(e) => setSettings({ ...settings, payout_request_status: e.target.value })}
                      >
                        <option value="0">Disabled / Turned Off (Default - Locked UI)</option>
                        <option value="1">Enabled / Turned On (Accepting Cashouts)</option>
                      </select>
                      <small style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)', fontSize: 11 }}>
                        When disabled, user wallet cashout section is grayed out like a locked badge and unclickable.
                      </small>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                        Coin Conversion Rate (₦ per Coin)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={settings?.coin_value_in_currency ?? 5.0}
                        onChange={(e) => setSettings({ ...settings, coin_value_in_currency: Number(e.target.value) })}
                      />
                      <small style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)', fontSize: 11 }}>
                        Default is ₦5.00 per coin (e.g. 200 coins = ₦1,000).
                      </small>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                        Min Coins for Withdrawal
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.min_withdrawal_coins ?? 200}
                        onChange={(e) => setSettings({ ...settings, min_withdrawal_coins: Number(e.target.value) })}
                      />
                      <small style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)', fontSize: 11 }}>
                        Minimum balance threshold required before requesting a withdrawal.
                      </small>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      Inactive Notice Message Shown to Players
                    </label>
                    <textarea
                      rows={2}
                      className="form-control"
                      value={settings?.payout_disabled_message || ''}
                      onChange={(e) => setSettings({ ...settings, payout_disabled_message: e.target.value })}
                      placeholder="Enter the notice banner text displayed in the user wallet when payouts are disabled..."
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Paystack Payment Gateway Configuration */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <h4><i className="fas fa-credit-card" style={{ marginRight: 8, color: '#47c363' }} />Paystack Payment Gateway (Naira / NGN)</h4>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Paystack Gateway Status</label>
                      <select
                        className="form-control"
                        value={settings?.paystack_status || '1'}
                        onChange={(e) => setSettings({ ...settings, paystack_status: e.target.value })}
                      >
                        <option value="1">Enabled (Active)</option>
                        <option value="0">Disabled (Inactive)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Paystack Public Key</label>
                      <input
                        type="text"
                        placeholder="pk_test_... or pk_live_..."
                        className="form-control"
                        value={settings?.paystack_public_key || ''}
                        onChange={(e) => setSettings({ ...settings, paystack_public_key: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Paystack Secret Key</label>
                      <input
                        type="password"
                        placeholder="sk_test_... or sk_live_..."
                        className="form-control"
                        value={settings?.paystack_secret_key || ''}
                        onChange={(e) => setSettings({ ...settings, paystack_secret_key: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                    Users will be charged in Nigerian Naira (₦) through Paystack when purchasing coin packs.
                  </div>
                </div>
              </div>

              {/* Card 3: Daily Reward & Streak Settings */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <h4><i className="fas fa-gift" style={{ marginRight: 8, color: '#ffa426' }} />Daily Rewards & Scratch Cards</h4>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Daily Scratch Reward (Coins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.daily_reward_coins ?? 50}
                        onChange={(e) => setSettings({ ...settings, daily_reward_coins: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Daily Streak Bonus (Coins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings?.daily_streak_coins ?? 25}
                        onChange={(e) => setSettings({ ...settings, daily_streak_coins: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: CMS Pages & Legal Content */}
              <div className="card" style={{ marginBottom: 25 }}>
                <div className="card-header">
                  <h4><i className="fas fa-file-alt" style={{ marginRight: 8, color: '#6777ef' }} />CMS Content Management (App Pages)</h4>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>About Us</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={settings?.about_us || ''}
                      onChange={(e) => setSettings({ ...settings, about_us: e.target.value })}
                      placeholder="Enter description of your quiz platform..."
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Contact Us / Support Information</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={settings?.contact_us || ''}
                      onChange={(e) => setSettings({ ...settings, contact_us: e.target.value })}
                      placeholder="Enter support email, phone numbers, and office addresses..."
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Terms & Conditions</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      value={settings?.terms_conditions || ''}
                      onChange={(e) => setSettings({ ...settings, terms_conditions: e.target.value })}
                      placeholder="Enter official terms of service, fair play rules, and withdrawal guidelines..."
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Privacy Policy</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      value={settings?.privacy_policy || ''}
                      onChange={(e) => setSettings({ ...settings, privacy_policy: e.target.value })}
                      placeholder="Enter privacy disclosures, data usage policy..."
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>How To Play / Instructions</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={settings?.instructions || ''}
                      onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 30 }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14, fontWeight: 700 }}>
                  <i className="fas fa-save" style={{ marginRight: 8 }} /> Save All Configurations
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Footer (Exact replica from footer.php) */}
        <footer className="main-footer">
          <div className="footer-left">
            Copyright &copy; {new Date().getFullYear()} Made By <strong><a href="#" target="_blank">StudyCord</a></strong>
          </div>
          <div className="footer-right">
            <span>StudyCord Admin v1.0.0</span>
          </div>
        </footer>
      </div>

      {/* Modal: Create Category */}
      {showAddCatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h4>Create Main Category</h4>
              <button onClick={() => setShowAddCatModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateCategory}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter category name"
                    className="form-control"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Target Quiz Zone</label>
                  <select className="form-control" value={newCatType} onChange={(e) => setNewCatType(e.target.value)}>
                    <option value="1">Quiz Zone</option>
                    <option value="2">Fun 'N' Learn</option>
                    <option value="3">Guess The Word</option>
                    <option value="4">Audio Questions</option>
                    <option value="5">Maths Quiz</option>
                    <option value="6">Multi Match</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Select Category Icon / Badge</label>
                  <div className="icon-picker-grid" style={{ marginBottom: 10 }}>
                    {PRESET_ICONS.map((p) => (
                      <div
                        key={p.path}
                        className={`icon-picker-item ${newCatIcon === p.path ? 'selected' : ''}`}
                        onClick={() => setNewCatIcon(p.path)}
                        title={p.name}
                      >
                        <img src={p.path} alt={p.name} width={26} height={26} />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter custom icon path (e.g. /assets/images/...)"
                    className="form-control"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddCatModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Sub Category */}
      {showAddSubcatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 450, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Create Sub Category</h4>
              <button onClick={() => setShowAddSubcatModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateSubcategory}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Parent Category</label>
                  <select className="form-control" value={newSubcatParent} onChange={(e) => setNewSubcatParent(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Sub Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter subcategory name"
                    className="form-control"
                    value={newSubcatName}
                    onChange={(e) => setNewSubcatName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddSubcatModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Question */}
      {showAddQuestionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', marginBottom: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h4>Create Question</h4>
              <button onClick={() => setShowAddQuestionModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateQuestion}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Question Text</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter question text..."
                    className="form-control"
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category</label>
                    <select
                      className="form-control"
                      value={newQCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setNewQCategory(newCat);
                        const matchingSub = subcategories.find((s) => String(s.maincat_id) === String(newCat));
                        if (matchingSub) {
                          setNewQSubcategory(matchingSub.id);
                        }
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Subcategory</label>
                    <select
                      className="form-control"
                      value={newQSubcategory}
                      onChange={(e) => setNewQSubcategory(e.target.value)}
                    >
                      {subcategories.filter((s) => String(s.maincat_id) === String(newQCategory)).length > 0 ? (
                        subcategories
                          .filter((s) => String(s.maincat_id) === String(newQCategory))
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.subcategory_name}</option>
                          ))
                      ) : (
                        <option value="101">Standard / Main</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Level</label>
                    <select className="form-control" value={newQLevel} onChange={(e) => setNewQLevel(e.target.value)}>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={String(l)}>Level {l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option A</label>
                    <input type="text" required className="form-control" value={newQOptA} onChange={(e) => setNewQOptA(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option B</label>
                    <input type="text" required className="form-control" value={newQOptB} onChange={(e) => setNewQOptB(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option C</label>
                    <input type="text" className="form-control" value={newQOptC} onChange={(e) => setNewQOptC(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option D</label>
                    <input type="text" className="form-control" value={newQOptD} onChange={(e) => setNewQOptD(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Correct Answer</label>
                  <select className="form-control" value={newQAnswer} onChange={(e) => setNewQAnswer(e.target.value)}>
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Explanation / Note</label>
                  <input
                    type="text"
                    placeholder="Optional explanation..."
                    className="form-control"
                    value={newQNote}
                    onChange={(e) => setNewQNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddQuestionModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Question</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Create Contest */}
      {showAddContestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Create New Contest</h4>
              <button onClick={() => setShowAddContestModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateContest}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Contest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mega Weekend Championship"
                    className="form-control"
                    value={newContestName}
                    onChange={(e) => setNewContestName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short contest description..."
                    className="form-control"
                    value={newContestDesc}
                    onChange={(e) => setNewContestDesc(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Question Source / Category</label>
                  <select
                    className="form-control"
                    value={newContestCategory}
                    onChange={(e) => setNewContestCategory(e.target.value)}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Start Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={newContestStart}
                      onChange={(e) => setNewContestStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>End Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={newContestEnd}
                      onChange={(e) => setNewContestEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Entry Coins</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newContestEntry}
                      onChange={(e) => setNewContestEntry(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Prize Pool (Coins)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newContestPrize}
                      onChange={(e) => setNewContestPrize(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddContestModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Contest</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Exam */}
      {showAddExamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Create Assessment Exam</h4>
              <button onClick={() => setShowAddExamModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateExam}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Exam Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science & Physics National Mock Test"
                    className="form-control"
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Duration (min)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newExamDuration}
                      onChange={(e) => setNewExamDuration(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Total Marks</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newExamMarks}
                      onChange={(e) => setNewExamMarks(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Passing %</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newExamPass}
                      onChange={(e) => setNewExamPass(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Rules & Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Examination guidelines and rules..."
                    className="form-control"
                    value={newExamRules}
                    onChange={(e) => setNewExamRules(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddExamModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Exam</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Send Notification */}
      {showSendNotifModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Send Push Notification</h4>
              <button onClick={() => setShowSendNotifModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSendNotification}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Bonus Coins Available!"
                    className="form-control"
                    value={newNotifTitle}
                    onChange={(e) => setNewNotifTitle(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Broadcast message text..."
                    className="form-control"
                    value={newNotifMsg}
                    onChange={(e) => setNewNotifMsg(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowSendNotifModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Send to All Users</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Guess Word */}
      {showAddWordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Add Guess The Word Riddle</h4>
              <button onClick={() => setShowAddWordModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateWord}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Clue / Riddle</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Natural satellite that orbits the Earth"
                    className="form-control"
                    value={newWordClue}
                    onChange={(e) => setNewWordClue(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Target Word (Answer)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOON"
                    style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}
                    className="form-control"
                    value={newWordTarget}
                    onChange={(e) => setNewWordTarget(e.target.value.toUpperCase())}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddWordModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Word</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Multi Match Pair */}
      {showAddMatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Create Multi Match Pair</h4>
              <button onClick={() => setShowAddMatchModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateMatchPair}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Left Column Item</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. France or H2O or Einstein"
                    className="form-control"
                    value={newMatchLeft}
                    onChange={(e) => setNewMatchLeft(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Right Column Matching Pair</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paris or Water or Relativity"
                    className="form-control"
                    value={newMatchRight}
                    onChange={(e) => setNewMatchRight(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddMatchModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Match Pair</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Badge */}
      {showAddBadgeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Create Achievement Badge</h4>
              <button onClick={() => setShowAddBadgeModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateBadge}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Badge Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trivia Master"
                    className="form-control"
                    value={newBadgeTitle}
                    onChange={(e) => setNewBadgeTitle(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Requirement Points</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newBadgeReq}
                      onChange={(e) => setNewBadgeReq(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Reward (Coins)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newBadgeReward}
                      onChange={(e) => setNewBadgeReward(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddBadgeModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Badge</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {showEditCatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h4>Edit Main Category #{editCatId}</h4>
              <button onClick={() => setShowEditCatModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateCategory}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Target Quiz Zone</label>
                  <select className="form-control" value={editCatType} onChange={(e) => setEditCatType(e.target.value)}>
                    <option value="1">Quiz Zone</option>
                    <option value="2">Fun 'N' Learn</option>
                    <option value="3">Guess The Word</option>
                    <option value="4">Audio Questions</option>
                    <option value="5">Maths Quiz</option>
                    <option value="6">Multi Match</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category Icon / Badge</label>
                  <div className="icon-picker-grid" style={{ marginBottom: 10 }}>
                    {PRESET_ICONS.map((p) => (
                      <div
                        key={p.path}
                        className={`icon-picker-item ${editCatIcon === p.path ? 'selected' : ''}`}
                        onClick={() => setEditCatIcon(p.path)}
                        title={p.name}
                      >
                        <img src={p.path} alt={p.name} width={26} height={26} />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Custom icon path (e.g. /assets/images/...)"
                    className="form-control"
                    value={editCatIcon}
                    onChange={(e) => setEditCatIcon(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditCatModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Sub Category */}
      {showEditSubcatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 450, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Sub Category #{editSubcatId}</h4>
              <button onClick={() => setShowEditSubcatModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateSubcategory}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Parent Category</label>
                  <select className="form-control" value={editSubcatParent} onChange={(e) => setEditSubcatParent(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Sub Category Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editSubcatName}
                    onChange={(e) => setEditSubcatName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditSubcatModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Sub Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Question */}
      {showEditQuestionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', marginBottom: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h4>Edit Question #{editQId}</h4>
              <button onClick={() => setShowEditQuestionModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateQuestion}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Question Text</label>
                  <textarea
                    rows={2}
                    required
                    className="form-control"
                    value={editQText}
                    onChange={(e) => setEditQText(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category</label>
                    <select
                      className="form-control"
                      value={editQCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setEditQCategory(newCat);
                        const matchingSub = subcategories.find((s) => String(s.maincat_id) === String(newCat));
                        if (matchingSub) {
                          setEditQSubcategory(matchingSub.id);
                        }
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Subcategory</label>
                    <select
                      className="form-control"
                      value={editQSubcategory}
                      onChange={(e) => setEditQSubcategory(e.target.value)}
                    >
                      {subcategories.filter((s) => String(s.maincat_id) === String(editQCategory)).length > 0 ? (
                        subcategories
                          .filter((s) => String(s.maincat_id) === String(editQCategory))
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.subcategory_name}</option>
                          ))
                      ) : (
                        <option value="101">Standard / Main</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Level</label>
                    <select className="form-control" value={editQLevel} onChange={(e) => setEditQLevel(e.target.value)}>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={String(l)}>Level {l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option A</label>
                    <input type="text" required className="form-control" value={editQOptA} onChange={(e) => setEditQOptA(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option B</label>
                    <input type="text" required className="form-control" value={editQOptB} onChange={(e) => setEditQOptB(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option C</label>
                    <input type="text" className="form-control" value={editQOptC} onChange={(e) => setEditQOptC(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Option D</label>
                    <input type="text" className="form-control" value={editQOptD} onChange={(e) => setEditQOptD(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Correct Answer</label>
                  <select className="form-control" value={editQAnswer} onChange={(e) => setEditQAnswer(e.target.value)}>
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Explanation / Note</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editQNote}
                    onChange={(e) => setEditQNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditQuestionModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Question</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Contest */}
      {showEditContestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Contest #{editContestId}</h4>
              <button onClick={() => setShowEditContestModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateContest}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Contest Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editContestName}
                    onChange={(e) => setEditContestName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editContestDesc}
                    onChange={(e) => setEditContestDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Start Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={editContestStart}
                      onChange={(e) => setEditContestStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>End Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={editContestEnd}
                      onChange={(e) => setEditContestEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Entry Coins</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editContestEntry}
                      onChange={(e) => setEditContestEntry(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Prize Pool (Coins)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editContestPrize}
                      onChange={(e) => setEditContestPrize(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditContestModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Contest</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Exam */}
      {showEditExamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Assessment Exam #{editExamId}</h4>
              <button onClick={() => setShowEditExamModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateExam}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Exam Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editExamTitle}
                    onChange={(e) => setEditExamTitle(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Duration (min)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editExamDuration}
                      onChange={(e) => setEditExamDuration(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Total Marks</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editExamMarks}
                      onChange={(e) => setEditExamMarks(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Passing %</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editExamPass}
                      onChange={(e) => setEditExamPass(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Rules & Instructions</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={editExamRules}
                    onChange={(e) => setEditExamRules(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditExamModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Exam</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Guess Word */}
      {showEditWordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Guess The Word Riddle #{editWordId}</h4>
              <button onClick={() => setShowEditWordModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateWord}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Clue / Riddle</label>
                  <textarea
                    rows={2}
                    required
                    className="form-control"
                    value={editWordClue}
                    onChange={(e) => setEditWordClue(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Target Word (Answer)</label>
                  <input
                    type="text"
                    required
                    style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}
                    className="form-control"
                    value={editWordTarget}
                    onChange={(e) => setEditWordTarget(e.target.value.toUpperCase())}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditWordModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Word</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Multi Match Pair */}
      {showEditMatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Multi Match Pair #{editMatchId}</h4>
              <button onClick={() => setShowEditMatchModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateMatchPair}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Left Column Item</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editMatchLeft}
                    onChange={(e) => setEditMatchLeft(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Right Column Matching Pair</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editMatchRight}
                    onChange={(e) => setEditMatchRight(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditMatchModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Match Pair</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Badge */}
      {showEditBadgeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Achievement Badge #{editBadgeId}</h4>
              <button onClick={() => setShowEditBadgeModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateBadge}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Badge Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editBadgeTitle}
                    onChange={(e) => setEditBadgeTitle(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Requirement Points</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editBadgeReq}
                      onChange={(e) => setEditBadgeReq(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Reward (Coins)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editBadgeReward}
                      onChange={(e) => setEditBadgeReward(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditBadgeModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Badge</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {showEditUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h4>Edit Player Profile #{editUserId}</h4>
              <button onClick={() => setShowEditUserModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateUser}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Player Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Coins Balance</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editUserCoins}
                      onChange={(e) => setEditUserCoins(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Score Points</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={editUserScore}
                      onChange={(e) => setEditUserScore(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Account Status</label>
                    <select className="form-control" value={editUserStatus} onChange={(e) => setEditUserStatus(e.target.value)}>
                      <option value="1">Active</option>
                      <option value="0">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Payout Access</label>
                    <select
                      className="form-control"
                      value={editUserPayoutEligible ? '1' : '0'}
                      onChange={(e) => setEditUserPayoutEligible(e.target.value === '1')}
                    >
                      <option value="0">Locked (Default)</option>
                      <option value="1">Eligible (Allowed)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowEditUserModal(false)} style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Player */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', marginBottom: 0 }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-user-plus" style={{ color: '#f05387' }} />
                <span>Register New Player</span>
              </h4>
              <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddUser}>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Player Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="form-control"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. player@example.com"
                    className="form-control"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Mobile Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 800 123 4567"
                    className="form-control"
                    value={newUserMobile}
                    onChange={(e) => setNewUserMobile(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Initial Coins</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newUserCoins}
                      onChange={(e) => setNewUserCoins(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Starting Score</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={newUserScore}
                      onChange={(e) => setNewUserScore(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Account Status</label>
                    <select className="form-control" value={newUserStatus} onChange={(e) => setNewUserStatus(e.target.value)}>
                      <option value="1">Active</option>
                      <option value="0">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Payout Access</label>
                    <select
                      className="form-control"
                      value={newUserPayoutEligible ? '1' : '0'}
                      onChange={(e) => setNewUserPayoutEligible(e.target.value === '1')}
                    >
                      <option value="0">Locked (Default)</option>
                      <option value="1">Eligible (Allowed)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontWeight: 700 }}>
                    <i className="fas fa-check" style={{ marginRight: 6 }} /> Create Player
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
