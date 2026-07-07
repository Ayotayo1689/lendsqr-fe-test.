import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import loginIllustration from '../assets/illustration.svg';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('candidate@lendsqr.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/users', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-page__brand" aria-label="Lendsqr welcome artwork">
        <Logo />
        <img className="login-page__illustration" src={loginIllustration} alt="" />
      </section>

      <section className="login-page__form" aria-labelledby="login-title">
        <form onSubmit={handleSubmit}>
          <h1 id="login-title">Welcome!</h1>
          <p>Enter details to login.</p>

          {error && <div className="form-error">{error}</div>}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              placeholder="Email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                 <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
          </label>

          <a href="#">Forgot password?</a>
          <button type="submit" className="button button--primary login-page__submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  );
}
