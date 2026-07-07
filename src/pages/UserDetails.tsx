import { MoveLeft, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState, UserDetailsSkeleton } from '../components/StateViews';
import { formatCurrency } from '../data/users';
import { useUsers } from '../context/UsersContext';
import type { User, UserStatus } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import { StarFillIcon, StarIcon } from '../components/icons';

type DetailActionStatus = Extract<UserStatus, 'Active' | 'Inactive' | 'Blacklisted'>;

function getStatusActions(status: UserStatus): Array<{ label: string; nextStatus: DetailActionStatus; className: string }> {
  if (status === 'Blacklisted') {
    return [{ label: 'Activate User', nextStatus: 'Active', className: 'button button--outline' }];
  }

  if (status === 'Active') {
    return [
      { label: 'Deactivate User', nextStatus: 'Inactive', className: 'button button--outline' },
      { label: 'Blacklist User', nextStatus: 'Blacklisted', className: 'button button--danger' },
    ];
  }

  return [
    { label: 'Blacklist User', nextStatus: 'Blacklisted', className: 'button button--danger' },
    { label: 'Activate User', nextStatus: 'Active', className: 'button button--outline' },
  ];
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function UserDetails() {
  const { id } = useParams();
  const { getUserById, updateUserStatus } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState<DetailActionStatus | null>(null);
  const [isSaving, setSaving] = useState(false);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      setUser(await getUserById(id));
    } catch {
      setError('We could not find this user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUser();
  }, [id]);

  const changeStatus = async () => {
    if (!user || !pendingStatus) return;
    setSaving(true);

    try {
      const updatedUser = await updateUserStatus(user.id, pendingStatus);
      setUser(updatedUser);
      setPendingStatus(null);
    } finally {
      setSaving(false);
    }
  };

  const requestStatusChange = (status: DetailActionStatus) => {
    if (!user) return;
    setPendingStatus(status);
  };

  if (loading) return <UserDetailsSkeleton />;
  if (error || !user) return <ErrorState message={error || 'User unavailable.'} onRetry={loadUser} />;

  const statusActions = getStatusActions(user.status);

  return (
    <section className="page user-details">
      <Link className="back-link" to="/users">
        <MoveLeft size={18} />
        Back to Users
      </Link>

      <div className="details-heading">
        <h1>User Details</h1>
        <div>
          {statusActions.map((action) => (
            <button
              type="button"
              className={action.className}
              onClick={() => requestStatusChange(action.nextStatus)}
              key={action.nextStatus}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <article className="profile-card">
        <div className="profile-card__summary">
          <span className="profile-card__avatar">
            <UserRound size={34} />
          </span>
          <div>
            <h2>{user.fullName}</h2>
            <p>{user.id.toUpperCase()}</p>
          </div>
          <div className="profile-card__tier">
            <span>User's Tier</span>
            <div className='star' aria-label={`${user.tier} star user tier`}>
              {Array.from({ length: 3 }, (_, index) => (
                index < user.tier ? <StarFillIcon key={index} /> : <StarIcon key={index} />
              ))}
            </div>
          </div>
          <div>
            <h2>{formatCurrency(user.balance)}</h2>
            <p>
              {user.accountNumber}/{user.bankName}
            </p>
          </div>
        </div>
        <nav className="details-tabs" aria-label="User details sections">
          {['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'].map((tab, index) => (
            <button type="button" className={index === 0 ? 'is-active' : ''} key={tab}>
              {tab}
            </button>
          ))}
        </nav>
      </article>

      <article className="details-card">
        <section>
          <h2>Personal Information</h2>
          <div className="details-grid">
            <DetailItem label="Full Name" value={user.fullName} />
            <DetailItem label="Phone Number" value={user.phoneNumber} />
            <DetailItem label="Email Address" value={user.email} />
            <DetailItem label="BVN" value={user.bvn} />
            <DetailItem label="Gender" value={user.gender} />
            <DetailItem label="Marital Status" value={user.maritalStatus} />
            <DetailItem label="Children" value={user.children} />
            <DetailItem label="Type of Residence" value={user.residence} />
          </div>
        </section>
        <section>
          <h2>Education and Employment</h2>
          <div className="details-grid">
            <DetailItem label="Level of Education" value={user.education.level} />
            <DetailItem label="Employment Status" value={user.education.employmentStatus} />
            <DetailItem label="Sector of Employment" value={user.education.sector} />
            <DetailItem label="Duration of Employment" value={user.education.duration} />
            <DetailItem label="Office Email" value={user.education.officeEmail} />
            <DetailItem
              label="Monthly Income"
              value={`${formatCurrency(user.education.monthlyIncome[0])} - ${formatCurrency(user.education.monthlyIncome[1])}`}
            />
            <DetailItem label="Loan Repayment" value={formatCurrency(user.education.loanRepayment)} />
          </div>
        </section>
        <section>
          <h2>Socials</h2>
          <div className="details-grid">
            <DetailItem label="Twitter" value={user.socials.twitter} />
            <DetailItem label="Facebook" value={user.socials.facebook} />
            <DetailItem label="Instagram" value={user.socials.instagram} />
          </div>
        </section>
        <section>
          <h2>Guarantor</h2>
          {user.guarantors.map((guarantor) => (
            <div className="details-grid" key={guarantor.email}>
              <DetailItem label="Full Name" value={guarantor.fullName} />
              <DetailItem label="Phone Number" value={guarantor.phoneNumber} />
              <DetailItem label="Email Address" value={guarantor.email} />
              <DetailItem label="Relationship" value={guarantor.relationship} />
            </div>
          ))}
        </section>
      </article>

      {pendingStatus && (
        <ConfirmModal
          status={pendingStatus}
          userName={user.fullName}
          loading={isSaving}
          onCancel={() => !isSaving && setPendingStatus(null)}
          onConfirm={changeStatus}
        />
      )}
    </section>
  );
}
