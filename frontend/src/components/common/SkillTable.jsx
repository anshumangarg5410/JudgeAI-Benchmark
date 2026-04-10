/**
 * SkillTable — Category comparison table with progress bars
 */
export default function SkillTable({ summary, baseName, ftName }) {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '1.2rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '0.75rem 1.5rem',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
        }}
      >
        <div>Skill</div>
        <div>{(baseName || '').slice(0, 14)}</div>
        <div>{(ftName || '').slice(0, 14)}</div>
        <div>Change</div>
      </div>

      {/* Rows */}
      {summary.map((row) => {
        const b = row.baseAcc * 100;
        const f = row.ftAcc * 100;
        const chg = f - b;
        let cls, arrow, barColor;
        if (chg > 0) {
          cls = 'var(--color-success)';
          arrow = '↑';
          barColor = 'var(--color-success)';
        } else if (chg < 0) {
          cls = 'var(--color-error)';
          arrow = '↓';
          barColor = 'var(--color-error)';
        } else {
          cls = 'var(--text-muted)';
          arrow = '→';
          barColor = 'var(--text-muted)';
        }
        const fc = f >= b ? 'var(--color-success)' : 'var(--color-error)';
        const barWidth = Math.min((Math.abs(chg) / 50) * 100, 100);

        return (
          <div
            key={row.category}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              padding: '0.9rem 1.5rem',
              borderBottom: '1px solid var(--bg-tertiary)',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            className="skill-row-hover"
          >
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {row.category}
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {b.toFixed(0)}%
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)',
                color: fc,
              }}
            >
              {f.toFixed(0)}%
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: cls,
                }}
              >
                {arrow}
                {Math.abs(chg).toFixed(0)}%
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  background: 'var(--border-primary)',
                  borderRadius: '4px',
                  marginTop: '5px',
                }}
              >
                <div
                  style={{
                    height: '4px',
                    borderRadius: '4px',
                    width: `${barWidth}%`,
                    background: barColor,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
