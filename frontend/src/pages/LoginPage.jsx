import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';
import './LoginPage.css';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try demo@judgeai.io / demo1234');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(data);
      setSuccess('Account created! Please sign in.');
      setTab('login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-logo">⚡</span>
          <div className="login-brand">JudgeAI-Benchmark</div>
          <div className="login-tagline">
            AI Model Regression Testing Platform
          </div>
        </div>

        <div className="login-tab-row">
          <button
            className={`btn ${tab === 'login' ? 'btn-primary' : 'btn-secondary'} btn-full`}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
          >
            Sign In
          </button>
          <button
            className={`btn ${tab === 'register' ? 'btn-primary' : 'btn-secondary'} btn-full`}
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="login-alert login-alert-error">{error}</div>
        )}
        {success && (
          <div className="login-alert login-alert-success">{success}</div>
        )}

        {tab === 'login' ? (
          <LoginForm onSubmit={handleLogin} loading={loading} />
        ) : (
          <RegisterForm onSubmit={handleRegister} loading={loading} />
        )}

        <div className="login-footer">
          © 2026 JudgeAI-Benchmark · <a href="#">Privacy</a> · <a href="#">Terms</a>
        </div>
      </div>
    </div>
  );
}
