'use client';

import React, { createContext, useContext, useState } from 'react';
import { SystemConfig } from '../types';
import { APP_NAME, PANEL_URL } from '../lib/constants';

const DEFAULT_CONFIG: SystemConfig = {
  appName: APP_NAME,
  panelUrl: PANEL_URL,
  isContestEnabled: true,
  isDailyQuizEnabled: true,
  isFunNLearnEnabled: true,
  isGuessTheWordEnabled: true,
  isAudioQuizEnabled: true,
  isMathQuizEnabled: true,
  isTrueFalseQuizEnabled: true,
  isMultiMatchQuizEnabled: true,
  isSelfChallengeEnabled: true,
  isExamEnabled: true,
  isPaymentRequestEnabled: true,
  isCoinStoreEnabled: true,
  isLanguageModeEnabled: true,
  isAdsEnable: true,
  isDailyAdsEnabled: true,
  refereeEarnCoin: '50',
  referrerEarnCoin: '100',
  appUrl: 'https://studycord.app',
  reviewAnswersDeductCoins: 5,
  fiftyFiftyLifelineCoins: 4,
  audiencePollLifelineCoins: 4,
  resetTimeLifelineCoins: 4,
  skipLifelineCoins: 4,
};

const SystemConfigContext = createContext<SystemConfig>(DEFAULT_CONFIG);

export const SystemConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config] = useState<SystemConfig>(DEFAULT_CONFIG);

  return (
    <SystemConfigContext.Provider value={config}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = () => useContext(SystemConfigContext);
