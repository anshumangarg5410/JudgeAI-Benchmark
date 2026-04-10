/**
 * InsightCard — Color-coded insight message with icon
 * Types: error, warn, ok, info
 */

const STYLES = {
  error: {
    background: 'rgba(248, 113, 113, 0.06)',
    border: '1px solid rgba(248, 113, 113, 0.2)',
    color: '#fca5a5',
  },
  warn: {
    background: 'rgba(251, 191, 36, 0.06)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    color: '#fde68a',
  },
  ok: {
    background: 'rgba(52, 211, 153, 0.06)',
    border: '1px solid rgba(52, 211, 153, 0.2)',
    color: '#6ee7b7',
  },
  info: {
    background: 'rgba(56, 189, 248, 0.06)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    color: '#7dd3fc',
  },
};

export default function InsightCard({ type = 'info', icon, text }) {
  const style = STYLES[type] || STYLES.info;

  return (
    <div
      style={{
        borderRadius: '10px',
        padding: '0.95rem 1.2rem',
        marginBottom: '0.7rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
        fontSize: '0.84rem',
        fontWeight: 400,
        lineHeight: 1.55,
        animation: 'fadeUp 0.3s ease',
        ...style,
      }}
    >
      <span style={{ fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>
        {icon}
      </span>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
