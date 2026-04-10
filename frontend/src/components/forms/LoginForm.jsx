import { useState } from 'react';

/**
 * LoginForm — Email + password login with validation
 */
export default function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Sign in to your workspace
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '0.8rem' }}>
        <label className="form-label" htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          className="form-input"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-group" style={{ marginBottom: '0.8rem' }}>
        <label className="form-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>

      <label className="form-checkbox-group" style={{ marginBottom: '0.8rem' }}>
        <input type="checkbox" defaultChecked />
        Keep me signed in
      </label>

      <button
        className="btn btn-primary btn-full"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Signing In…' : 'Sign In →'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.78rem', color: '#334155' }}>
        <a href="#" style={{ color: 'var(--accent-sky)' }}>Forgot password?</a>
        &nbsp;·&nbsp;
        <span style={{ color: 'var(--text-faint)' }}>SSO coming soon</span>
      </div>

      <div
        style={{
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          borderRadius: '8px',
          padding: '0.7rem 1rem',
          marginTop: '1rem',
          fontSize: '0.77rem',
          color: 'var(--text-dim)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--accent-sky)' }}>Demo</strong>&nbsp;
        demo@judgeai.io &nbsp;/&nbsp; demo1234
      </div>
    </form>
  );
}
