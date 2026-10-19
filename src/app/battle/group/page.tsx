'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Copy, Check, ShieldCheck, ChevronDown } from 'lucide-react';
import { QAppBar } from '../../../components/common/QAppBar';
import { QImage } from '../../../components/common/QImage';
import { QButton } from '../../../components/common/QButton';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useUserDetails } from '../../../context/UserDetailsContext';
import { tr } from '../../../lib/translations';
import { soundManager } from '../../../lib/sound';
import { ECONOMY_RULES } from '../../../lib/quizEngine';
import { InsufficientCoinsModal } from '../../../components/common/InsufficientCoinsModal';

export default function GroupBattlePage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { coins, deductCoins } = useUserDetails();

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/battle/group', 'Please sign in to create or join group battle rooms.');
    }
  }, [isInitialized, user, isGuest]);

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [inputCode, setInputCode] = useState('');
  const [entryCoins, setEntryCoins] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [copied, setCopied] = useState(false);
  const [joiningLoading, setJoiningLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    requiredCoins: number;
    actionTitle: string;
  }>({ isOpen: false, requiredCoins: 20, actionTitle: '' });

  // 4 Player Slots in the lobby
  const [players, setPlayers] = useState<any[]>([
    {
      id: '1',
      name: user?.name || 'You (Host)',
      avatar: user?.profileUrl || '/assets/config/profile/1.svg',
      ready: true,
      isHost: true,
    },
  ]);

  // Create room on the server and poll for players in the lobby
  React.useEffect(() => {
    if (!isInitialized || !user || isGuest) return;
    let isCancelled = false;

    // Create or sync room on backend
    fetch('/api/battle/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        code: roomCode,
        entryCoins,
        category: selectedCategory,
        user: {
          userId: user.userId,
          name: user.name,
          profileUrl: user.profileUrl,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success && data.room?.players) {
          setPlayers(data.room.players);
        }
      })
      .catch(() => {});

    // Poll room status every 3 seconds to reflect newly joined players in real-time
    const pollInterval = setInterval(() => {
      fetch(`/api/battle/rooms?code=${roomCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.success && data.room?.players) {
            setPlayers(data.room.players);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
    };
  }, [roomCode, entryCoins, selectedCategory, isInitialized, user, isGuest]);

  const handleCreate = () => {
    soundManager.playClick();
    if (!deductCoins(entryCoins, 'Create Group Battle Room')) {
      setInsufficientModal({
        isOpen: true,
        requiredCoins: entryCoins,
        actionTitle: 'create a Group Battle room',
      });
      return;
    }
    soundManager.playCorrect();
    try {
      sessionStorage.setItem('group_battle_players', JSON.stringify(players));
    } catch {}
    router.push(`/quiz?quizType=groupPlay&entryCoins=${entryCoins}&title=Group%20Battle%20#${roomCode}&roomId=${roomCode}`);
  };

  const handleJoin = async () => {
    soundManager.playClick();
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setJoinError('Please enter a valid 6-digit room code.');
      return;
    }

    if (!deductCoins(entryCoins, 'Join Group Battle Room')) {
      setInsufficientModal({
        isOpen: true,
        requiredCoins: entryCoins,
        actionTitle: 'join this Group Battle room',
      });
      return;
    }

    setJoiningLoading(true);
    setJoinError('');

    try {
      const res = await fetch('/api/battle/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          code: cleanCode,
          user: {
            userId: user?.userId,
            name: user?.name,
            profileUrl: user?.profileUrl,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Room not found or full.');
      }

      soundManager.playCorrect();
      if (data.room?.players) {
        try {
          sessionStorage.setItem('group_battle_players', JSON.stringify(data.room.players));
        } catch {}
      }

      router.push(`/quiz?quizType=groupPlay&entryCoins=${entryCoins}&title=Group%20Battle%20#${cleanCode}&roomId=${cleanCode}`);
    } catch (err: any) {
      setJoinError(err?.message || 'Failed to join room. Please check the code.');
      soundManager.playWrong();
    } finally {
      setJoiningLoading(false);
    }
  };

  const copyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  const handleBack = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/battle');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title={tr('groupPlay')} onBack={handleBack} />

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-between space-y-5">
        {isGuest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In for Group Battle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot create private rooms or join multiplayer quiz battles. Sign in to your StudyCord account to host and play with friends!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/battle/group')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Toggle Mode: Create Room vs Join Room */}
            <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-full">
          <button
            onClick={() => {
              soundManager.playClick();
              setMode('create');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              mode === 'create'
                ? 'bg-[#ef5388] text-white shadow-sm'
                : 'text-slate-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setMode('join');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              mode === 'join'
                ? 'bg-[#ef5388] text-white shadow-sm'
                : 'text-slate-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Join Room
          </button>
        </div>

        {mode === 'create' ? (
          <div className="space-y-4">
            {/* Flutter BattleInviteCard Component */}
            <div className="w-full rounded-[14px] bg-gradient-to-br from-[#ef5388] via-[#e23b72] to-[#b81d52] p-5 text-white shadow-lg space-y-3.5 text-center relative overflow-hidden">
              <span className="text-xs font-medium text-white/90 block">
                Share this room code with friends & invite them to compete
              </span>

              {/* Dotted Border Code Box */}
              <div className="inline-flex items-center space-x-3 bg-white px-5 py-2 rounded-xl shadow-md border-2 border-dashed border-[#ef5388]">
                <span className="text-2xl font-black tracking-widest text-[#ef5388]">
                  {roomCode}
                </span>
                <button
                  onClick={copyCode}
                  className="p-1.5 rounded-lg bg-[#ef5388]/10 text-[#ef5388] hover:bg-[#ef5388] hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Entry Fee Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                Entry Fee : {entryCoins} Coins
              </div>

              {/* Category Strip */}
              <div className="w-full pt-2.5 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
                <span className="font-semibold">{selectedCategory}</span>
                <span className="font-bold text-amber-300">Winner: {Math.floor(entryCoins * 4 * 0.9)} Coins (10% Admin Fee)</span>
              </div>
            </div>

            {/* Entry Fee Selection Chips */}
            <div className={`${surfaceBg} rounded-[12px] p-3.5 border ${cardBorder} shadow-sm space-y-2`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Entry Fee
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[20, 40, 60, 80].map((fee) => (
                  <button
                    key={fee}
                    onClick={() => {
                      soundManager.playClick();
                      setEntryCoins(fee);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      entryCoins === fee
                        ? 'bg-[#ef5388] text-white border-[#ef5388] shadow-sm'
                        : `${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`
                    }`}
                  >
                    {fee} Coins
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Player Slots Lobby */}
            <div className={`${surfaceBg} rounded-[12px] p-4 border ${cardBorder} shadow-sm space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center space-x-1.5 text-[#ef5388]">
                  <Users className="w-4 h-4" />
                  <span>Room Lobby ({players.length}/4 Players)</span>
                </span>
                <span className="text-emerald-500 font-extrabold">All Ready</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {players.map((p) => (
                  <div key={p.id} className="flex flex-col items-center space-y-1.5 text-center">
                    <div className="relative w-14 h-14 rounded-full border-2 border-[#ef5388] p-0.5 bg-white shadow-sm overflow-hidden">
                      <QImage imageUrl={p.avatar} width={50} height={50} circular alt={p.name} />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <span className={`text-[11px] font-bold truncate max-w-[70px] ${textColor}`}>
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <QButton onClick={handleCreate} size="lg" className="w-full shadow-md">
              Start Group Battle ({entryCoins} Coins)
            </QButton>
          </div>
        ) : (
          <div className={`${surfaceBg} rounded-[14px] p-6 shadow-sm border ${cardBorder} space-y-5 text-center`}>
            <div className="w-16 h-16 rounded-full bg-[#ef5388]/15 text-[#ef5388] mx-auto flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <h3 className={`text-lg font-bold ${textColor}`}>Join Room</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 6-digit room code shared by your friend to join the competition.
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. 841920"
              className={`w-full h-14 text-center tracking-widest text-2xl font-black rounded-xl border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388] shadow-inner`}
            />

            {joinError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-bold">
                {joinError}
              </div>
            )}

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-slate-400 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Standard 20 coins entry wager applies</span>
            </div>

            <QButton onClick={handleJoin} loading={joiningLoading} size="lg" className="w-full shadow-md">
              Enter Room & Play
            </QButton>
          </div>
        )}
          </>
        )}
      </div>

      {/* Insufficient Coins Modal */}
      <InsufficientCoinsModal
        isOpen={insufficientModal.isOpen}
        onClose={() => setInsufficientModal((prev) => ({ ...prev, isOpen: false }))}
        requiredCoins={insufficientModal.requiredCoins}
        actionTitle={insufficientModal.actionTitle}
      />
    </div>
  );
}
