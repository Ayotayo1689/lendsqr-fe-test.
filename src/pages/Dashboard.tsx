import { useEffect, useState } from "react";
import { LoadingState, ErrorState } from "../components/StateViews";
import { StatCard } from "../components/StatCard";
import { mockApi } from "../services/mockApi";
import {
  DashboardActiveUsers,
  DashboardUsers,
  DashboardUsersWithLoans,
  DashboardUsersWithSavings,
} from "../components/icons";

interface DashboardStats {
  users: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      setStats(await mockApi.getDashboardStats());
    } catch {
      setError("Unable to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={loadStats} />;

  return (
    <section className="page">
      <div className="page__header">
        <h1>Dashboard</h1>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Users"
          value={String(stats?.users ?? 0)}
          icon={DashboardUsers}
        />
        <StatCard
          label="Active Users"
          value={String(stats?.activeUsers ?? 0)}
          icon={DashboardActiveUsers}
        />
        <StatCard
          label="Users with Loans"
          value={String(stats?.usersWithLoans ?? 0)}
          icon={DashboardUsersWithLoans}
        />
        <StatCard
          label="Users with Savings"
          value={String(stats?.usersWithSavings ?? 0)}
          icon={DashboardUsersWithSavings}
        />
      </div>
    </section>
  );
}
