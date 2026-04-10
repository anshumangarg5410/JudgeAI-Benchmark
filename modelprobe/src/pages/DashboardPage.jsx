import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppContext';
import HeroBanner from '../components/Layout/HeroBanner';
import { MetricCard, MetricGrid } from '../components/common/MetricCard';
import StatusBar from '../components/common/StatusBar';
import SkillTable from '../components/common/SkillTable';
import InsightCard from '../components/common/InsightCard';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import AccuracyChart from '../components/charts/AccuracyChart';
import LatencyChart from '../components/charts/LatencyChart';
import RadarChart from '../components/charts/RadarChart';
import ErrorChart from '../components/charts/ErrorChart';
import { generateInsights } from '../utils/testUtils';
import './DashboardPage.css';

const CHART_TABS = [
  { key: 'accuracy', label: '📊 Accuracy' },
  { key: 'latency', label: '⏱ Latency' },
  { key: 'radar', label: '🎯 Radar' },
  { key: 'errors', label: '🐛 Errors' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { lastResults } = useAppState();
  const [chartTab, setChartTab] = useState('accuracy');
  const [showSummary, setShowSummary] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  const now = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!lastResults) {
    return (
      <div className="page-enter">
        <HeroBanner
          badge="⚡ Regression Suite v2.5"
          title="AI Model Regression Testing"
          subtitle={`Compare base vs fine-tuned model performance · ${now}`}
          user={user}
        />
        <EmptyState
          icon="⚡"
          title='No results yet — head to <strong>Run Tests</strong> to evaluate your models'
          description="Select models, categories, and click Run Tests to populate this dashboard."
        />
      </div>
    );
  }

  const { rows, summary, baseModel, ftModel } = lastResults;
  const baseName = baseModel.name;
  const ftName = ftModel.name;

  // Compute metrics
  const metrics = useMemo(() => {
    const bAccAvg = rows.reduce((s, r) => s + r.baseAcc, 0) / rows.length;
    const fAccAvg = rows.reduce((s, r) => s + r.ftAcc, 0) / rows.length;
    const dAcc = fAccAvg - bAccAvg;

    const fLatAvg = rows.reduce((s, r) => s + r.ftLat, 0) / rows.length;
    const bLatAvg = rows.reduce((s, r) => s + r.baseLat, 0) / rows.length;
    const dLat = fLatAvg - bLatAvg;

    const fErrSum = rows.reduce((s, r) => s + r.ftErr, 0);
    const bErrSum = rows.reduce((s, r) => s + r.baseErr, 0);

    const regressions = rows.filter((r) => r.deltaAcc < -0.03).length;

    return { fAccAvg, dAcc, fLatAvg, dLat, fErrSum, bErrSum, regressions };
  }, [rows]);

  const total = rows.length;
  const passed = rows.filter((r) => r.deltaAcc >= -0.01).length;
  const failed = total - passed;

  const insights = useMemo(() => generateInsights(summary), [summary]);
  const improved = summary.filter((s) => s.ftAcc > s.baseAcc).length;
  const regressed = summary.filter((s) => s.ftAcc < s.baseAcc - 0.01).length;

  return (
    <div className="page-enter">
      <HeroBanner
        badge="⚡ Regression Suite v2.5"
        title="AI Model Regression Testing"
        subtitle={
          <>
            Compare base vs fine-tuned model performance — accuracy, latency, regression
            signals.&nbsp;·&nbsp;
            <span style={{ color: '#334155', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              {now}
            </span>
          </>
        }
        user={user}
      />

      <StatusBar
        total={total}
        passed={passed}
        failed={failed}
        baseName={baseName}
        ftName={ftName}
      />

      {/* Metric Cards */}
      <MetricGrid>
        <MetricCard
          label="FT Model Accuracy"
          value={`${(metrics.fAccAvg * 100).toFixed(1)}%`}
          delta={`${Math.abs(metrics.dAcc * 100).toFixed(1)}% ${metrics.dAcc < 0 ? 'drop' : 'gain'}`}
          negative={metrics.dAcc < 0}
          accent="var(--accent-sky)"
        />
        <MetricCard
          label="Avg Latency (FT)"
          value={`${metrics.fLatAvg.toFixed(2)}s`}
          delta={`${Math.abs(metrics.dLat).toFixed(2)}s ${metrics.dLat > 0 ? 'slower' : 'faster'}`}
          negative={metrics.dLat > 0}
          accent="var(--accent-violet)"
        />
        <MetricCard
          label="Regressions"
          value={`<span style="color:var(--color-error)">${metrics.regressions}</span>`}
          delta={`of ${total} tests`}
          negative={metrics.regressions > 0}
          accent="var(--color-error)"
        />
        <MetricCard
          label="Error Delta"
          value={`${metrics.fErrSum - metrics.bErrSum > 0 ? '+' : ''}${metrics.fErrSum - metrics.bErrSum}`}
          delta={`${Math.abs(metrics.fErrSum - metrics.bErrSum)} ${metrics.fErrSum > metrics.bErrSum ? 'more' : 'fewer'}`}
          negative={metrics.fErrSum > metrics.bErrSum}
          accent="var(--color-success)"
        />
      </MetricGrid>

      {/* Charts + Skill Table */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Performance Visualisation & Skill Comparison
        </div>
      </div>

      <div className="dashboard-charts-row">
        <div>
          <div className="chart-tabs">
            {CHART_TABS.map((t) => (
              <button
                key={t.key}
                className={`chart-tab ${chartTab === t.key ? 'active' : ''}`}
                onClick={() => setChartTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {chartTab === 'accuracy' && (
            <AccuracyChart summary={summary} baseName={baseName} ftName={ftName} />
          )}
          {chartTab === 'latency' && (
            <LatencyChart summary={summary} baseName={baseName} ftName={ftName} />
          )}
          {chartTab === 'radar' && (
            <RadarChart summary={summary} baseName={baseName} ftName={ftName} />
          )}
          {chartTab === 'errors' && (
            <ErrorChart summary={summary} baseName={baseName} ftName={ftName} />
          )}
        </div>

        <div>
          <div className="card-title" style={{ marginBottom: '0.7rem' }}>
            <span className="dot" /> Skill Comparison
          </div>
          <SkillTable summary={summary} baseName={baseName} ftName={ftName} />
          <div className="skill-badges">
            <Badge variant="base">{summary.length} categories</Badge>
            <Badge variant="fine-tuned">▲ {improved} improved</Badge>
            {regressed > 0 && (
              <Badge variant="reg">▼ {regressed} regressed</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="dashboard-tables-row">
        <div className="data-table-section">
          <div
            className="data-table-header"
            onClick={() => setShowSummary(!showSummary)}
          >
            <span className="data-table-header-title">
              📋 Category Summary
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              {showSummary ? '▼' : '▶'}
            </span>
          </div>
          {showSummary && (
            <div className="data-table-content">
              <table className="reg-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{baseName.slice(0, 10)} Acc</th>
                    <th>{ftName.slice(0, 10)} Acc</th>
                    <th>Δ Acc</th>
                    <th>Tests</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((s) => (
                    <tr key={s.category}>
                      <td style={{ fontWeight: 500 }}>{s.category}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {(s.baseAcc * 100).toFixed(1)}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {(s.ftAcc * 100).toFixed(1)}%
                      </td>
                      <td
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color:
                            s.ftAcc - s.baseAcc >= 0
                              ? 'var(--color-success)'
                              : 'var(--color-error)',
                        }}
                      >
                        {((s.ftAcc - s.baseAcc) * 100).toFixed(1)}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {s.tests}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="data-table-section">
          <div
            className="data-table-header"
            onClick={() => setShowRaw(!showRaw)}
          >
            <span className="data-table-header-title">
              🔍 Full Test Results
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              {showRaw ? '▼' : '▶'}
            </span>
          </div>
          {showRaw && (
            <div className="data-table-content">
              <table className="reg-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Test #</th>
                    <th>Δ Acc</th>
                    <th>Base</th>
                    <th>FT</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.category}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {r.testId}
                      </td>
                      <td
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color:
                            r.deltaAcc >= 0
                              ? 'var(--color-success)'
                              : 'var(--color-error)',
                        }}
                      >
                        {(r.deltaAcc * 100).toFixed(1)}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {(r.baseAcc * 100).toFixed(1)}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {(r.ftAcc * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Automated Insights
        </div>
      </div>
      {insights.map((ins, i) => (
        <InsightCard key={i} type={ins.type} icon={ins.icon} text={ins.text} />
      ))}
    </div>
  );
}
