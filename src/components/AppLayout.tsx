import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Gauge,
  HandCoins,
  Landmark,
  LogOut,
  Menu,
  PiggyBank,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import {
  Audit,
  BellIcon,
  Dashboard,
  DecisionMaking,
  Fees,
  FeesAndPricing,
  Guarantor,
  Karma,
  Loan,
  LoanRequest,
  Organization,
  PointDownIcon,
  Preference,
  Reports,
  Savings,
  SavingsProduct,
  ServiceAccount,
  Services,
  Settlement,
  SystemMessage,
  Transactions,
  UsersIcon,
  WhiteList,
} from "./icons";
import UserImage from "../assets/userimage.png";

const navGroups = [
  {
    title: "",
    items: [{ label: "Dashboard", path: "/dashboard", icon: Dashboard }],
  },
  {
    title: "Customers",
    items: [
      { label: "Users", path: "/users", icon: UsersIcon },
      { label: "Guarantors", path: "/dashboard", icon: Guarantor },
      { label: "Loans", path: "/dashboard", icon: Loan },
      { label: "Decision Models", path: "/dashboard", icon: DecisionMaking },
      { label: "Savings", path: "/dashboard", icon: Savings },
      { label: "Loan Requests", path: "/dashboard", icon: LoanRequest },
      { label: "Whitelist", path: "/dashboard", icon: WhiteList },
      { label: "Karma", path: "/dashboard", icon: Karma },
    ],
  },
  {
    title: "Businesses",
    items: [
      { label: "Organization", path: "/dashboard", icon: Organization },
      { label: "Loan Products", path: "/dashboard", icon: Loan },
      { label: "Savings Products", path: "/dashboard", icon: SavingsProduct },
      { label: "Fees and Charges", path: "/dashboard", icon: Fees },
      { label: "Transactions", path: "/dashboard", icon: Transactions },
      { label: "Services", path: "/dashboard", icon: Services },
      { label: "Service Account", path: "/dashboard", icon: ServiceAccount },
      { label: "Settlements", path: "/dashboard", icon: Settlement },
      { label: "Reports", path: "/dashboard", icon: Reports },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Preferences", path: "/dashboard", icon: Preference },
      { label: "Fees and Pricing", path: "/dashboard", icon: FeesAndPricing },
      { label: "Audit Logs", path: "/dashboard", icon: Audit },
      { label: "Systems Messages", path: "/dashboard", icon: SystemMessage },
    ],
  },
];

export function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="icon-button topbar__menu"
          aria-label="Open navigation"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <Logo />
        <form className="topbar__search" role="search">
          <input
            type="search"
            placeholder="Search for anything"
            aria-label="Search"
          />
          <button type="submit" aria-label="Search">
            <Search size={16} />
          </button>
        </form>
        <a
          className="topbar__docs"
          href="https://docs.lendsqr.com"
          target="_blank"
          rel="noreferrer"
        >
          Docs
        </a>
        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
        <div className="profile-chip">
          <img src={UserImage} alt="Profile" />
          <div className="username">Adedeji</div>
          <PointDownIcon />
        </div>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar__mobile-head">
          <Logo />
          <button
            type="button"
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <button type="button" className="sidebar__switch">
          <Organization />
          Switch Organization
          <ChevronDown size={14} />
        </button>

        <nav aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.title || "root"}>
              {group.title && <p>{group.title}</p>}
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={label}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
        <small>v1.2.0</small>
      </aside>

      {isSidebarOpen && (
        <button
          className="scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
