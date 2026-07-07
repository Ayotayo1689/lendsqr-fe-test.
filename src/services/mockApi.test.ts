import { describe, expect, it } from 'vitest';
import { mockApi } from './mockApi';

const emptyFilters = {
  organization: '',
  username: '',
  email: '',
  phoneNumber: '',
  date: '',
  status: '',
};

describe('mockApi', () => {
  it('paginates users', async () => {
    const response = await mockApi.getUsers({ page: 2, pageSize: 25, filters: emptyFilters });

    expect(response.total).toBe(500);
    expect(response.users).toHaveLength(25);
    expect(response.users[0].id).toBe('user-026');
  });

  it('filters by status and returns an empty state payload when there are no matches', async () => {
    const active = await mockApi.getUsers({
      page: 1,
      pageSize: 100,
      filters: { ...emptyFilters, status: 'Active' },
    });
    const empty = await mockApi.getUsers({
      page: 1,
      pageSize: 100,
      filters: { ...emptyFilters, username: 'not-a-real-user' },
    });

    expect(active.users.every((user) => user.status === 'Active')).toBe(true);
    expect(empty.total).toBe(0);
    expect(empty.users).toEqual([]);
  });
});
