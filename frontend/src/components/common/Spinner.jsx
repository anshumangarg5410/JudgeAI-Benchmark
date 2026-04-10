/**
 * Spinner — Loading indicator with optional text message
 */
export default function Spinner({ text = 'Loading…', size = 'md' }) {
  const sizes = {
    sm: { spinner: 20, border: 2, font: '0.78rem' },
    md: { spinner: 32, border: 3, font: '0.85rem' },
    lg: { spinner: 48, border: 4, font: '0.95rem' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '3rem 2rem',
      }}
    >
      <div
        style={{
          width: s.spinner,
          height: s.spinner,
          border: `${s.border}px solid var(--border-primary)`,
          borderTopColor: 'var(--accent-sky)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <div
          style={{
            fontSize: s.font,
            color: 'var(--text-dim)',
            fontWeight: 500,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
