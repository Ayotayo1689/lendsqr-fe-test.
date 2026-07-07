import { AlertCircle } from 'lucide-react';
import type { UserStatus } from '../types';

interface ConfirmModalProps {
  status: Extract<UserStatus, 'Active' | 'Inactive' | 'Blacklisted'>;
  userName: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ status, userName, loading = false, onCancel, onConfirm }: ConfirmModalProps) {
  const isBlacklist = status === 'Blacklisted';
  const isDeactivate = status === 'Inactive';
  const title = isBlacklist ? 'Blacklist user?' : isDeactivate ? 'Deactivate user?' : 'Activate user?';
  const message = isBlacklist
    ? `This will blacklist ${userName} and restrict their access.`
    : isDeactivate
      ? `This will deactivate ${userName} and mark their account as inactive.`
      : `This will activate ${userName} and mark their account as active.`;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className={`confirm-modal__icon ${isBlacklist ? 'confirm-modal__icon--danger' : ''}`}>
          <AlertCircle size={28} />
        </span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm-modal__actions">
          <button type="button" className="button button--ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className={`button ${isBlacklist ? 'button--danger-filled' : 'button--primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </section>
    </div>
  );
}
