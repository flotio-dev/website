'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface User {
  Keycloak: {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username: string;
    email?: string;
    email_verified?: boolean;
    // Legacy support
    username?: string;
    token?: string;
  }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh-token');
      if (!storedRefreshToken) {
        return false;
      }

      const res = await fetch('/api/proxy/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!res.ok) {
        // Refresh token invalid or expired
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        setUser(null);
        setToken(null);
        return false;
      }

      const data = await res.json();
      const newToken = data.access_token || data.token;

      if (newToken) {
        localStorage.setItem('auth-token', newToken);
        setToken(newToken);

        if (data.refresh_token) {
          localStorage.setItem('refresh-token', data.refresh_token);
        }

        // Schedule next refresh (refresh 30 seconds before expiry)
        const expiresIn = data.expires_in || 300; // default 5 minutes
        scheduleTokenRefresh(expiresIn);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };

  const scheduleTokenRefresh = (expiresIn: number) => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh 30 seconds before expiry (or at half-time if expires_in < 60s)
    const refreshTime = expiresIn > 60 ? (expiresIn - 30) * 1000 : (expiresIn / 2) * 1000;

    refreshTimerRef.current = setTimeout(async () => {
      const success = await refreshToken();
      if (!success) {
        // If refresh fails, logout
        logout();
      }
    }, refreshTime);
  };

  const fetchUser = async () => {
    try {
      const storedToken = localStorage.getItem('auth-token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      // Optionally verify token with backend
      const res = await fetch('/api/proxy/auth/@me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser({
          ...userData,
          username: userData.preferred_username, // for legacy support
        });
      } else {
        // Token invalid, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          localStorage.removeItem('auth-token');
          setUser(null);
          setToken(null);
        } else {
          // Retry fetching user with new token
          await fetchUser();
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch('/api/proxy/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await res.json();

    // Store token in localStorage (handle both 'token' and 'access_token')
    const token = data.access_token || data.token;
    if (token) {
      localStorage.setItem('auth-token', token);
      setToken(token);

      // Also store refresh_token if available
      if (data.refresh_token) {
        localStorage.setItem('refresh-token', data.refresh_token);
      }

      // Schedule token refresh
      const expiresIn = data.expires_in || 300;
      scheduleTokenRefresh(expiresIn);
    }

    await fetchUser();
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch('/api/proxy/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || error.error || 'Registration failed');
    }

    const data = await res.json();

    // Store token if returned (handle both 'token' and 'access_token')
    const token = data.access_token || data.token;
    if (token) {
      localStorage.setItem('auth-token', token);
      setToken(token);

      // Also store refresh_token if available
      if (data.refresh_token) {
        localStorage.setItem('refresh-token', data.refresh_token);
      }

      // Schedule token refresh
      const expiresIn = data.expires_in || 300;
      scheduleTokenRefresh(expiresIn);

      await fetchUser();
    } else {
      // If no token returned, login with the credentials
      await login(username, password);
    }
  };

  const logout = () => {
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
