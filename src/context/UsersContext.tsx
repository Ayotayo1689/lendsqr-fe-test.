import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mockApi } from '../services/mockApi';
import type { User, UserFilters, UsersQuery } from '../types';

const USER_CACHE_KEY = 'lendsqr-user-cache';

const defaultFilters: UserFilters = {
  organization: '',
  username: '',
  email: '',
  phoneNumber: '',
  date: '',
  status: '',
};

interface UsersContextValue {
  users: User[];
  total: number;
  stats: UsersStats;
  page: number;
  pageSize: number;
  filters: UserFilters;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: UserFilters) => void;
  resetFilters: () => void;
  refresh: () => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  updateUserStatus: (id: string, status: User['status']) => Promise<User>;
}

interface UsersStats {
  users: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

function readCache(): Record<string, User> {
  try {
    return JSON.parse(window.localStorage.getItem(USER_CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, User>) {
  window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache));
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UsersStats>({
    users: 0,
    activeUsers: 0,
    usersWithLoans: 0,
    usersWithSavings: 0,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [filters, setFiltersState] = useState<UserFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, User>>(readCache);

  const query = useMemo<UsersQuery>(() => ({ page, pageSize, filters }), [page, pageSize, filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [response, nextStats] = await Promise.all([mockApi.getUsers(query), mockApi.getDashboardStats()]);
      setUsers(response.users);
      setTotal(response.total);
      setStats(nextStats);
    } catch {
      setError('We could not load users. Please try again.');
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setFilters = (nextFilters: UserFilters) => {
    setPage(1);
    setFiltersState(nextFilters);
  };

  const setPageSize = (nextPageSize: number) => {
    setPage(1);
    setPageSizeState(nextPageSize);
  };

  const rememberUser = (user: User) => {
    setCache((current) => {
      const next = { ...current, [user.id]: user };
      writeCache(next);
      return next;
    });
  };

  const getUserById = async (id: string) => {
    if (cache[id]) {
      return cache[id];
    }

    const user = await mockApi.getUser(id);
    rememberUser(user);
    return user;
  };

  const updateUserStatus = async (id: string, status: User['status']) => {
    const updatedUser = await mockApi.updateUserStatus(id, status);
    const nextStats = await mockApi.getDashboardStats();

    setUsers((current) => {
      const nextUsers = current.map((user) => (user.id === id ? updatedUser : user));

      if (filters.status && filters.status !== updatedUser.status) {
        setTotal((currentTotal) => Math.max(0, currentTotal - 1));
        return nextUsers.filter((user) => user.id !== id);
      }

      return nextUsers;
    });
    setCache((current) => {
      const next = { ...current, [id]: updatedUser };
      writeCache(next);
      return next;
    });
    setStats(nextStats);

    return updatedUser;
  };

  const value: UsersContextValue = {
    users,
    total,
    stats,
    page,
    pageSize,
    filters,
    loading,
    error,
    setPage,
    setPageSize,
    setFilters,
    resetFilters: () => setFilters(defaultFilters),
    refresh,
    getUserById,
    updateUserStatus,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error('useUsers must be used within UsersProvider');
  }

  return context;
}
