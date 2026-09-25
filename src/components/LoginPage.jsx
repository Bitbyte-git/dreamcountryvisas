import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { setAdminToken } from '../utils/adminAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Always shows the sign-in form — a direct visit (or reload) never
  // auto-skips to the dashboard, even right after logging in elsewhere
  // in this tab. Only a successful submit below moves to /admin.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setAdminToken(json.token);
        navigate('/admin', { replace: true });
      } else {
        setError(json.error || 'Invalid email or password.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" translate="no">
      <div className="login-brand-panel">
        <div className="login-brand-glow" />
        <div className="login-brand-mark">
          <span className="login-brand-mark-letters">DC</span>
          <span className="login-brand-mark-name">Dream Country Visas</span>
        </div>
        <h2>Admin Access</h2>
        <p>Sign in to review every enquiry submitted across the site — in real time, filtered your way.</p>
        <ul className="login-brand-points">
          <li><Icon name="check" size={15} /> Every contact &amp; consultation submission</li>
          <li><Icon name="check" size={15} /> Filter by day, week, month or a custom range</li>
          <li><Icon name="check" size={15} /> Search and sort in one place</li>
        </ul>
      </div>

      <div className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-badge">
            <Icon name="lock" size={20} />
          </div>
          <h1>Welcome Back</h1>
          <p className="login-sub">Sign in with your admin credentials to continue.</p>

          <label className="field-label">Email</label>
          <div className="login-input-wrap">
            <Icon name="mail" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </div>

          <label className="field-label">Password</label>
          <div className="login-input-wrap">
            <Icon name="lock" size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
