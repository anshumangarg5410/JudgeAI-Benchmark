/**
 * Badge — Type badges used for model types and status indicators
 * Variants: base, fine-tuned, custom, reg (regression)
 */

const BADGE_STYLES = {
  base: {
    background: 'rgba(56, 189, 248, 0.1)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.2)',
  },
  'fine-tuned': {
    background: 'rgba(167, 139, 250, 0.1)',
    color: '#a78bfa',
    border: '1px solid rgba(167, 139, 250, 0.2)',
  },
  custom: {
    background: 'rgba(251, 191, 36, 0.1)',
    color: '#fbbf24',
    border: '1px solid rgba(251, 191, 36, 0.2)',
  },
  reg: {
    background: 'rgba(248, 113, 113, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(248, 113, 113, 0.2)',
  },
};

export default function Badge({ variant = 'base', children }) {
  const style = BADGE_STYLES[variant] || BADGE_STYLES.base;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '2px 8px',
        borderRadius: '4px',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
