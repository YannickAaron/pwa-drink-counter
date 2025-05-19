'use client';

import { useEffect } from 'react';

export function PWAProvider() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Dynamically load the service worker script
      const script = document.createElement('script');
      script.innerHTML = `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/js/sw.js')
              .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
              })
              .catch(function(error) {
                console.error('Service Worker registration failed:', error);
              });
          });
        }
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}