import './MetricCard.css';

/**
 * MetricCard — A stat card with colored accent bar, value, and delta indicator.
 */
export function MetricCard({ label, value, delta, negative, accent = 'var(--accent-sky)' }) {
  const cls = negative ? 'delta-down' : 'delta-up';
  const arrow = negative ? '▼' : '▲';

  return (
    <div className="metric-card" style={{ '--accent': accent }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" dangerouslySetInnerHTML={{ __html: value }} />
      <div className={`metric-delta ${cls}`}>
        {arrow} {delta}
      </div>
    </div>
  );
}

/**
 * MetricGrid — Responsive container for MetricCards.
 */
export function MetricGrid({ children }) {
  return <div className="metric-grid">{children}</div>;
}
