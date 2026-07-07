import type { UserStatus } from '../types';

export function StatusBadge({ status }: { status: UserStatus }) {
  return <span className={`status status--${status.toLowerCase()}`}>{status}</span>;
}
