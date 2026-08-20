'use client';

import { useState, useEffect } from 'react';

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const cookies = document.cookie || '';
      const hasCookie =
        cookies.includes('flotio_logged_in=1') ||
        cookies.includes('refresh_token=') ||
        cookies.includes('accessToken=');

      const hasLocalStorage =
        Boolean(localStorage.getItem('accessToken')) ||
        Boolean(localStorage.getItem('user'));

      setIsLoggedIn(hasCookie || hasLocalStorage);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { isLoggedIn: mounted ? isLoggedIn : false };
}
