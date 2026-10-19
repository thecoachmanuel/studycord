'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { DEFAULT_USER } from '../lib/api';
import { LoginRequiredModal } from '../components/common/LoginRequiredModal';
import { soundManager } from '../lib/sound';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isInitialized: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUser: (fields: Partial<UserProfile>) => void;
  showLoginModal: boolean;
  openLoginModal: (redirectUrl?: string, customMessage?: string) => void;
  closeLoginModal: () => void;
  requireAuth: (callback: () => void, redirectUrl?: string, customMessage?: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isInitialized: false,
  login: async () => false,
  loginAsGuest: () => {},
  logout: () => {},
  updateUser: () => {},
  showLoginModal: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  requireAuth: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const guestFlag = localStorage.getItem('is_guest');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsGuest(false);
        // Fete/Fetch latest user profile details on app re-entry
        if (parsed?.email) {
          fetch(`/api/users?search=${encodeURIComponent(parsed.email)}`)
            .then((r) => r.json())
            .then((res) => {
              if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                const dbUser = res.data.find(
                  (u: any) => u.email?.toLowerCase() === parsed.email.toLowerCase()
                );
                if (dbUser) {
                  const refreshed: UserProfile = {
                    ...parsed,
                    userId: String(dbUser.id || parsed.userId || '101'),
                    name: dbUser.name || parsed.name,
                    coins: String(dbUser.coins ?? parsed.coins),
                    allTimeScore: String(dbUser.score ?? parsed.allTimeScore),
                    mobile: dbUser.mobile || parsed.mobile,
                    profileUrl: dbUser.profile || parsed.profileUrl,
                    referCode: dbUser.refer_code || dbUser.referCode || parsed.referCode || 'STUDY99',
                  };
                  setUser(refreshed);
                  localStorage.setItem('auth_user', JSON.stringify(refreshed));
                }
              }
            })
            .catch(() => {});
        }
      } catch {
        setUser(null);
        setIsGuest(false);
      }
    } else if (guestFlag === 'true') {
      setIsGuest(true);
      setUser(null);
    } else {
      // First visit: not authenticated, not guest -> will be routed to login screen
      setUser(null);
      setIsGuest(false);
    }
    setIsInitialized(true);
  }, []);

  const openLoginModal = (redirectUrl?: string, customMessage?: string) => {
    setPendingRedirect(redirectUrl);
    setModalMessage(customMessage);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setPendingRedirect(undefined);
    setModalMessage(undefined);
  };

  const requireAuth = (callback: () => void, redirectUrl?: string, customMessage?: string): boolean => {
    if (user && !isGuest) {
      callback();
      return true;
    }
    soundManager.playClick();
    openLoginModal(redirectUrl, customMessage);
    return false;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    let dbUserData: any = null;
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(cleanEmail)}`);
      const resJson = await res.json();
      if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
        dbUserData = resJson.data.find((u: any) => u.email?.toLowerCase() === cleanEmail);
      }
    } catch {}

    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      userId: dbUserData?.id ? String(dbUserData.id) : DEFAULT_USER.userId,
      email: cleanEmail || DEFAULT_USER.email,
      name: dbUserData?.name || (cleanEmail ? cleanEmail.split('@')[0] : DEFAULT_USER.name),
      coins: String(dbUserData?.coins ?? DEFAULT_USER.coins),
      allTimeScore: String(dbUserData?.score ?? DEFAULT_USER.allTimeScore),
      profileUrl: dbUserData?.profile || DEFAULT_USER.profileUrl,
      mobile: dbUserData?.mobile || DEFAULT_USER.mobile,
      referCode: dbUserData?.refer_code || dbUserData?.referCode || DEFAULT_USER.referCode,
    };
    setUser(loggedUser);
    setIsGuest(false);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
    localStorage.removeItem('is_guest');
    closeLoginModal();
    return true;
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.setItem('is_guest', 'true');
    closeLoginModal();
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('auth_user');
    localStorage.setItem('is_guest', 'true');
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !isGuest,
        isGuest,
        isInitialized,
        login,
        loginAsGuest,
        logout,
        updateUser,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        requireAuth,
      }}
    >
      {children}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        redirectUrl={pendingRedirect}
        message={modalMessage}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
