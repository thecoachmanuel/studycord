'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundManager } from '../lib/sound';

interface SettingsContextType {
  sound: boolean;
  vibration: boolean;
  fontSize: number;
  toggleSound: () => void;
  toggleVibration: () => void;
  setFontSize: (size: number) => void;
  appLanguage: string;
  setAppLanguage: (lang: string) => void;
  quizLanguage: string;
  setQuizLanguage: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  sound: true,
  vibration: true,
  fontSize: 18,
  toggleSound: () => {},
  toggleVibration: () => {},
  setFontSize: () => {},
  appLanguage: 'en',
  setAppLanguage: () => {},
  quizLanguage: 'en',
  setQuizLanguage: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<boolean>(true);
  const [vibration, setVibration] = useState<boolean>(true);
  const [fontSize, setFontSizeState] = useState<number>(18);
  const [appLanguage, setAppLanguageState] = useState<string>('en');
  const [quizLanguage, setQuizLanguageState] = useState<string>('en');

  useEffect(() => {
    const s = localStorage.getItem('sound_enabled');
    const v = localStorage.getItem('vibration_enabled');
    const fs = localStorage.getItem('play_font_size');
    const al = localStorage.getItem('app_language');
    const ql = localStorage.getItem('quiz_language');

    if (s !== null) {
      const enabled = s === 'true';
      setSound(enabled);
      soundManager.setEnabled(enabled);
    }
    if (v !== null) {
      const enabled = v === 'true';
      setVibration(enabled);
      soundManager.setVibrationEnabled(enabled);
    }
    if (fs) setFontSizeState(parseInt(fs, 10));
    if (al) setAppLanguageState(al);
    if (ql) setQuizLanguageState(ql);
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    soundManager.setEnabled(next);
    localStorage.setItem('sound_enabled', next ? 'true' : 'false');
    if (next) {
      soundManager.playClick();
    }
  };

  const toggleVibration = () => {
    const next = !vibration;
    setVibration(next);
    soundManager.setVibrationEnabled(next);
    localStorage.setItem('vibration_enabled', next ? 'true' : 'false');
    if (next) {
      soundManager.vibrate(60);
    }
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('play_font_size', String(size));
  };

  const setAppLanguage = (lang: string) => {
    setAppLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const setQuizLanguage = (lang: string) => {
    setQuizLanguageState(lang);
    localStorage.setItem('quiz_language', lang);
  };

  return (
    <SettingsContext.Provider
      value={{
        sound,
        vibration,
        fontSize,
        toggleSound,
        toggleVibration,
        setFontSize,
        appLanguage,
        setAppLanguage,
        quizLanguage,
        setQuizLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
