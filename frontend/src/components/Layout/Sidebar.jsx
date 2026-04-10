import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/run-tests', icon: '▶️', label: 'Run Tests' },
  { path: '/models', icon: '🧩', label: 'Model Registry' },
  { path: '/history', icon: '📋', label: 'Run History' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { models, runs } = useAppState();
  const navigate = useNavigate();

  const initials = user
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : '??';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">⚖️</span>
        JudgeAI-Benchmark
      </div>

      <div className="sidebar-section">Navigation</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section">Workspace</div>
      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <div className="sidebar-stat-value">{runs.length}</div>
          <div className="sidebar-stat-label">Runs</div>
        </div>
        <div className="sidebar-stat">
          <div className="sidebar-stat-value">{models.length}</div>
          <div className="sidebar-stat-label">Models</div>
        </div>
      </div>

      <div className="sidebar-bottom">
        {user && (
          <>
            <div className="sidebar-section">Account</div>
            <div className="sidebar-user">
              <div className="sidebar-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-full sidebar-signout"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
