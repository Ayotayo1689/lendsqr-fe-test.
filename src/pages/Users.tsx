import { EmptyState, ErrorState, TableSkeleton } from '../components/StateViews';
import { Pagination } from '../components/Pagination';
import { StatCard } from '../components/StatCard';
import { UsersTable } from '../components/UsersTable';
import { useUsers } from '../context/UsersContext';
import { DashboardActiveUsers, DashboardUsers, DashboardUsersWithLoans, DashboardUsersWithSavings } from '../components/icons';

export function Users() {
  const { users, total, stats, page, pageSize, loading, error, refresh, setPage, setPageSize } = useUsers();

  return (
    <section className="page">
      <div className="page__header">
        <h1>Users</h1>
      </div>

      <div className="stats-grid">
        <StatCard label="Users" value={stats.users.toLocaleString()} icon={DashboardUsers}   />
        <StatCard label="Active Users" value={stats.activeUsers.toLocaleString()} icon={DashboardActiveUsers}   />
        <StatCard label="Users with Loans" value={stats.usersWithLoans.toLocaleString()} icon={DashboardUsersWithLoans}   />
        <StatCard label="Users with Savings" value={stats.usersWithSavings.toLocaleString()} icon={DashboardUsersWithSavings}   />
      </div>

      {loading && <TableSkeleton rows={pageSize} />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && users.length === 0 && (
        <EmptyState title="No users found" message="Try resetting the filters or changing your search criteria." />
      )}
      {!loading && !error && users.length > 0 && (
        <>
          <UsersTable users={users} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </section>
  );
}
