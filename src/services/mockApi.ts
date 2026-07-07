import { usersSeed } from '../data/users';
import type { User, UsersQuery, UsersResponse } from '../types';

const NETWORK_DELAY = 450;
const USERS_STORAGE_KEY = 'lendsqr-users';

const wait = (ms = NETWORK_DELAY) => new Promise((resolve) => window.setTimeout(resolve, ms));

const matches = (value: string, query: string) =>
  !query || value.toLowerCase().includes(query.trim().toLowerCase());

function readUsers(): User[] {
  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersSeed));
      return [...usersSeed];
    }

    return JSON.parse(storedUsers) as User[];
  } catch {
    return [...usersSeed];
  }
}

function writeUsers(users: User[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function applyFilters(data: User[], query: UsersQuery) {
  const { filters } = query;

  return data.filter((user) => {
    const dateMatch =
      !filters.date || new Date(user.dateJoined).toISOString().slice(0, 10) === filters.date;

    return (
      matches(user.organization, filters.organization) &&
      matches(user.username, filters.username) &&
      matches(user.email, filters.email) &&
      matches(user.phoneNumber, filters.phoneNumber) &&
      (!filters.status || user.status === filters.status) &&
      dateMatch
    );
  });
}

export const mockApi = {
  async getUsers(query: UsersQuery): Promise<UsersResponse> {
    await wait();
    const users = readUsers();
    const filtered = applyFilters(users, query);
    const start = (query.page - 1) * query.pageSize;

    return {
      users: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
    };
  },

  async getUser(id: string): Promise<User> {
    await wait(300);
    const users = readUsers();
    const user = users.find((item) => item.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async updateUserStatus(id: string, status: User['status']): Promise<User> {
    await wait(250);
    const users = readUsers();
    const userIndex = users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...users[userIndex], status };
    const nextUsers = [...users];
    nextUsers[userIndex] = updatedUser;
    writeUsers(nextUsers);

    return updatedUser;
  },

  async getDashboardStats() {
    await wait(250);
    const users = readUsers();

    return {
      users: users.length,
      activeUsers: users.filter((user) => user.status === 'Active').length,
      usersWithLoans: users.filter((user) => user.hasLoan).length,
      usersWithSavings: users.filter((user) => user.hasSavings).length,
    };
  },
};
