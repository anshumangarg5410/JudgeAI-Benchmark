import { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import HeroBanner from '../components/Layout/HeroBanner';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import './HistoryPage.css';

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const { runs } = useAppState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      [...runs]
        .reverse()
        .filter(
          (h) =>
            h.base?.toLowerCase().includes(search.toLowerCase()) ||
            h.ft?.toLowerCase().includes(search.toLowerCase()) ||
            h.categories?.toLowerCase().includes(search.toLowerCase())
        ),
    [runs, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="page-enter">
      <HeroBanner
        badge="📋 Run History"
        title="Previous Evaluations"
        subtitle="All evaluation runs in this session"
      />

      {runs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No runs yet. Head to Run Tests to get started."
        />
      ) : (
        <>
          <div className="history-controls">
            <input
              className="form-input"
              placeholder="Search by model name or category…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              {filtered.length} run{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="history-table-wrap">
            <table className="reg-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>Base</th>
                  <th>Fine-tuned</th>
                  <th>Categories</th>
                  <th>Mode</th>
                  <th>Tests</th>
                  <th>Regressions</th>
                  <th>Avg Δ</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((h, i) => {
                  const idx = runs.length - ((page - 1) * PAGE_SIZE + i);
                  return (
                    <tr key={h.id || i}>
                      <td
                        style={{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.77rem',
                        }}
                      >
                        #{idx}
                      </td>
                      <td
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.77rem',
                          color: '#475569',
                        }}
                      >
                        {h.time}
                      </td>
                      <td>{h.base}</td>
                      <td>{h.ft}</td>
                      <td
                        style={{
                          fontSize: '0.77rem',
                          color: 'var(--text-muted)',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h.categories}
                      </td>
                      <td>
                        <Badge variant="base">{h.mode}</Badge>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {h.tests}
                      </td>
                      <td
                        style={{
                          color:
                            h.regressions > 0
                              ? 'var(--color-error)'
                              : 'var(--color-success)',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {h.regressions}
                      </td>
                      <td
                        style={{
                          color:
                            h.avgDelta < 0
                              ? 'var(--color-error)'
                              : 'var(--color-success)',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {h.avgDelta > 0 ? '+' : ''}
                        {h.avgDelta}%
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      No runs match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="history-pagination">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
