import { describe, expect, it } from 'vitest';
import { generateUsers } from './users';

describe('generateUsers', () => {
  it('creates the requested number of deterministic records', () => {
    const users = generateUsers(500);

    expect(users).toHaveLength(500);
    expect(users[0]).toMatchObject({
      id: 'user-001',
      organization: 'Lendsqr',
      status: 'Inactive',
    });
    expect(users[499].id).toBe('user-500');
  });

  it('includes detail fields needed by the user details page', () => {
    const [user] = generateUsers(1);

    expect(user.education.monthlyIncome).toHaveLength(2);
    expect(user.guarantors.length).toBeGreaterThan(0);
    expect(user.socials.twitter).toContain('@');
  });
});
