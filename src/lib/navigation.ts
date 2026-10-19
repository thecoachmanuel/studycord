'use client';

import { soundManager } from './sound';

const NAV_STORAGE_KEY = 'studycord_nav_history';
const MAX_HISTORY = 30;

export function recordNavVisit(url: string) {
  if (typeof window === 'undefined' || !url) return;
  try {
    const raw = sessionStorage.getItem(NAV_STORAGE_KEY);
    let stack: string[] = raw ? JSON.parse(raw) : [];
    // Ignore exact duplicate of current top
    if (stack.length > 0 && stack[stack.length - 1] === url) {
      return;
    }
    stack.push(url);
    if (stack.length > MAX_HISTORY) {
      stack = stack.slice(stack.length - MAX_HISTORY);
    }
    sessionStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(stack));
  } catch {}
}

export function smartBack(router: any, fallbackRoute: string = '/') {
  soundManager.playClick();
  if (typeof window === 'undefined') {
    router.push(fallbackRoute);
    return;
  }

  try {
    const currentFull = window.location.pathname + window.location.search;
    const raw = sessionStorage.getItem(NAV_STORAGE_KEY);
    let stack: string[] = raw ? JSON.parse(raw) : [];

    // Remove any trailing references to current URL
    while (stack.length > 0 && stack[stack.length - 1] === currentFull) {
      stack.pop();
    }

    if (stack.length > 0) {
      const prevUrl = stack.pop();
      sessionStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(stack));
      if (prevUrl && prevUrl !== currentFull) {
        router.push(prevUrl);
        return;
      }
    }
  } catch {}

  // Fallback to browser history if within site
  if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
    router.back();
  } else {
    router.push(fallbackRoute || '/');
  }
}
