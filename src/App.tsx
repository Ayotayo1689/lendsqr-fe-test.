import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { UserDetails } from './pages/UserDetails';
import { Users } from './pages/Users';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}
