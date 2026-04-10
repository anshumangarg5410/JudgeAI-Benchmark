/**
 * StatusBar — Shows suite completion status with pass/fail counts.
 */
export default function StatusBar({ total, passed, failed, baseName, ftName }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '0.7rem 1.2rem',
        marginBottom: '1.4rem',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--color-success)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--color-success)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        Suite Complete
      </span>
      <span>
        Tests:{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong>
      </span>
      <span style={{ color: 'var(--color-success)' }}>
        ✓ Passed: <strong>{passed}</strong>
      </span>
      <span style={{ color: 'var(--color-error)' }}>
        ✗ Regressed: <strong>{failed}</strong>
      </span>
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
        }}
      >
        {baseName} &nbsp;vs&nbsp; {ftName}
      </span>
    </div>
  );
}
