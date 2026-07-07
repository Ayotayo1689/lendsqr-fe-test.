import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'lendsqr-authenticated';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(STORAGE_KEY) === 'true',
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      async login(email, password) {
        await new Promise((resolve) => window.setTimeout(resolve, 600));

        if (!email.includes('@') || password.trim().length < 6) {
          throw new Error('Enter a valid email and at least 6 password characters.');
        }

        window.localStorage.setItem(STORAGE_KEY, 'true');
        setIsAuthenticated(true);
      },
      logout() {
        window.localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
