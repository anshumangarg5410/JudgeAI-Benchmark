import './HeroBanner.css';

/**
 * HeroBanner — Page header with badge, gradient title, and optional user pill.
 * @param {string} badge - Small uppercase label (e.g. "⚡ Dashboard")
 * @param {string} title - Large gradient heading
 * @param {string} subtitle - Description text
 * @param {object} [user] - Optional user object { name }
 * @param {React.ReactNode} [children] - Extra content in the right side
 */
export default function HeroBanner({ badge, title, subtitle, user, children }) {
  const initials = user
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : null;

  return (
    <div className="hero-banner">
      <div className="hero-inner">
        <div>
          <div className="hero-badge">{badge}</div>
          <div className="hero-title">{title}</div>
          <div className="hero-sub">{subtitle}</div>
        </div>
        <div>
          {user && (
            <div className="hero-user">
              <div className="hero-avatar">{initials}</div>
              {user.name}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
