import { useState } from 'react';

/**
 * RegisterForm — Account creation with validation
 */
export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    org: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.agree) errs.agree = 'Please agree to the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name: form.name, email: form.email, password: form.password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Create your account
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '0.7rem' }}>
        <label className="form-label" htmlFor="reg-name">Full name</label>
        <input
          id="reg-name"
          className="form-input"
          placeholder="Jane Smith"
          value={form.name}
          onChange={set('name')}
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-group" style={{ marginBottom: '0.7rem' }}>
        <label className="form-label" htmlFor="reg-email">Work email</label>
        <input
          id="reg-email"
          className="form-input"
          type="email"
          placeholder="jane@company.com"
          value={form.email}
          onChange={set('email')}
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-group" style={{ marginBottom: '0.7rem' }}>
        <label className="form-label" htmlFor="reg-org">Organisation</label>
        <input
          id="reg-org"
          className="form-input"
          placeholder="Acme Corp"
          value={form.org}
          onChange={set('org')}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '0.7rem' }}>
        <label className="form-label" htmlFor="reg-pw">Password</label>
        <input
          id="reg-pw"
          className="form-input"
          type="password"
          placeholder="Min 8 chars"
          value={form.password}
          onChange={set('password')}
        />
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>

      <div className="form-group" style={{ marginBottom: '0.7rem' }}>
        <label className="form-label" htmlFor="reg-pw2">Confirm password</label>
        <input
          id="reg-pw2"
          className="form-input"
          type="password"
          placeholder="Re-enter"
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
        />
        {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
      </div>

      <label className="form-checkbox-group" style={{ marginBottom: '0.8rem' }}>
        <input type="checkbox" checked={form.agree} onChange={set('agree')} />
        I agree to the Terms of Service and Privacy Policy
      </label>
      {errors.agree && <div className="form-error">{errors.agree}</div>}

      <div style={{ height: '0.3rem' }} />

      <button
        className="btn btn-primary btn-full"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating Account…' : 'Create Account →'}
      </button>
    </form>
  );
}
