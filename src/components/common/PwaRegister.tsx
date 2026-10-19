'use client';

import { useEffect } from 'react';

export const PwaRegister = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('PWA ServiceWorker registered successfully with scope: ', reg.scope);
            })
            .catch((err) => {
              console.warn('PWA ServiceWorker registration failed: ', err);
            });
        });
      } else {
        // In local development, unregister service workers to prevent stale Next.js chunk caching & hydration errors
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
      }
    }
  }, []);

  return null;
};
