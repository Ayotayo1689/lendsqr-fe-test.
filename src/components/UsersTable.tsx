import { Eye, MoreVertical, UserCheck, UserMinus, UserX } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../data/users';
import { useUsers } from '../context/UsersContext';
import type { User, UserFilters, UserStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { FilterIcon } from './icons';
import { ConfirmModal } from './ConfirmModal';

const filterFields: Array<{ key: keyof UserFilters; label: string; type?: string; options?: string[] }> = [
  { key: 'organization', label: 'Organization' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'status', label: 'Status', options: ['Active', 'Inactive', 'Pending', 'Blacklisted'] },
];

type RowActionStatus = Extract<UserStatus, 'Active' | 'Inactive' | 'Blacklisted'>;

function getStatusActions(status: UserStatus): Array<{ label: string; nextStatus: RowActionStatus; icon: typeof UserCheck }> {
  if (status === 'Blacklisted') {
    return [{ label: 'Activate User', nextStatus: 'Active', icon: UserCheck }];
  }

  if (status === 'Active') {
    return [
      { label: 'Deactivate User', nextStatus: 'Inactive', icon: UserMinus },
      { label: 'Blacklist User', nextStatus: 'Blacklisted', icon: UserX },
    ];
  }

  return [
    { label: 'Blacklist User', nextStatus: 'Blacklisted', icon: UserX },
    { label: 'Activate User', nextStatus: 'Active', icon: UserCheck },
  ];
}

export function UsersTable({ users }: { users: User[] }) {
  const { filters, setFilters, resetFilters, updateUserStatus } = useUsers();
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ user: User; status: RowActionStatus } | null>(null);
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    const closeFloatingUi = (event: MouseEvent) => {
      if (!tableRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', closeFloatingUi);
    return () => document.removeEventListener('mousedown', closeFloatingUi);
  }, []);

  const updateDraft = (key: keyof UserFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const submitFilters = (event: FormEvent) => {
    event.preventDefault();
    setFilters(draftFilters);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters({
      organization: '',
      username: '',
      email: '',
      phoneNumber: '',
      date: '',
      status: '',
    });
    resetFilters();
    setFilterOpen(false);
  };

  const requestStatusChange = (
    event: ReactMouseEvent,
    user: User,
    status: RowActionStatus,
  ) => {
    event.stopPropagation();
    setOpenMenu(null);
    setPendingAction({ user, status });
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;
    setSaving(true);

    try {
      await updateUserStatus(pendingAction.user.id, pendingAction.status);
      setPendingAction(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="table-card" ref={tableRef}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {['Organization', 'Username', 'Email', 'Phone Number', 'Date Joined', 'Status'].map((heading) => (
                <th key={heading}>
                  <span>{heading}</span>
                  <button
                    type="button"
                    aria-label={`Filter by ${heading}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenu(null);
                      setFilterOpen((value) => !value);
                    }}
                  >
                    <FilterIcon />
                  </button>
                </th>
              ))}
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="users-table__row"
                tabIndex={0}
                onClick={() => navigate(`/users/${user.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/users/${user.id}`);
                  }
                }}
              >
                <td data-label="Organization">{user.organization}</td>
                <td data-label="Username">{user.username}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Phone Number">{user.phoneNumber}</td>
                <td data-label="Date Joined">{formatDate(user.dateJoined)}</td>
                <td data-label="Status">
                  <StatusBadge status={user.status} />
                </td>
                <td className="row-actions">
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Open actions for ${user.username}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setFilterOpen(false);
                      setOpenMenu((current) => (current === user.id ? null : user.id));
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === user.id && (
                    <div className="action-menu" onClick={(event) => event.stopPropagation()}>
                      <button type="button" onClick={() => navigate(`/users/${user.id}`)}>
                        <Eye size={16} />
                        View Details
                      </button>
                      {getStatusActions(user.status).map((action) => {
                        const Icon = action.icon;

                        return (
                          <button
                            type="button"
                            onClick={(event) => requestStatusChange(event, user, action.nextStatus)}
                            key={action.nextStatus}
                          >
                            <Icon size={16} />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFilterOpen && (
        <form className="filter-popover" onSubmit={submitFilters} onClick={(event) => event.stopPropagation()}>
          {filterFields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              {field.options ? (
                <select value={draftFilters[field.key]} onChange={(event) => updateDraft(field.key, event.target.value)}>
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={draftFilters[field.key]}
                  placeholder={field.label}
                  onChange={(event) => updateDraft(field.key, event.target.value)}
                />
              )}
            </label>
          ))}
          <div className="filter-popover__actions">
            <button type="button" className="button button--ghost" onClick={clearFilters}>
              Reset
            </button>
            <button type="submit" className="button button--primary">
              Filter
            </button>
          </div>
        </form>
      )}

      {pendingAction && (
        <ConfirmModal
          status={pendingAction.status}
          userName={pendingAction.user.fullName}
          loading={isSaving}
          onCancel={() => !isSaving && setPendingAction(null)}
          onConfirm={confirmStatusChange}
        />
      )}
    </div>
  );
}
