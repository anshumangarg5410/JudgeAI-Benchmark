import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppState } from '../context/AppContext';
import HeroBanner from '../components/Layout/HeroBanner';
import EmptyState from '../components/common/EmptyState';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const { runs } = useAppState();

  const chartData = useMemo(
    () =>
      runs.map((h) => ({
        time: h.time,
        avgDelta: h.avgDelta,
        regressions: h.regressions,
      })),
    [runs]
  );

  return (
    <div className="page-enter">
      <HeroBanner
        badge="📊 Analytics"
        title="Trend Analytics"
        subtitle="Track model performance over time across evaluation runs"
      />

      {runs.length < 2 ? (
        <EmptyState
          icon="📊"
          title="Run at least 2 evaluations to see trend charts."
          description="Historical charts, regression trend lines, and heatmaps will appear here."
        />
      ) : (
        <>
          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#181f2e"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: 'Avg Δ (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#64748b', fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{
                    value: 'Regressions',
                    angle: 90,
                    position: 'insideRight',
                    style: { fill: '#64748b', fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f131e',
                    border: '1px solid #181f2e',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgDelta"
                  name="Avg Δ Acc (%)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#38bdf8' }}
                  activeDot={{ r: 6 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="regressions"
                  name="Regressions"
                  fill="#f87171"
                  opacity={0.45}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="dot" /> All Runs
            </div>
          </div>

          <div className="analytics-table-wrap">
            <table className="reg-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Base</th>
                  <th>Fine-tuned</th>
                  <th>Mode</th>
                  <th>Tests</th>
                  <th>Regressions</th>
                  <th>Avg Δ</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((h, i) => (
                  <tr key={h.id || i}>
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
                    <td>{h.mode}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
