import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useTestRunner } from '../hooks/useTestRunner';
import HeroBanner from '../components/Layout/HeroBanner';
import { CATEGORIES } from '../utils/testUtils';
import './RunTestsPage.css';

const MODES = ['Standard', 'Fast', 'Deep Eval'];

export default function RunTestsPage() {
  const { models, addRun, setLastResults } = useAppState();
  const { running, progress, progressText, logs, runTests } = useTestRunner();
  const navigate = useNavigate();

  const baseModels = useMemo(
    () => models.filter((m) => m.type === 'base'),
    [models]
  );
  const ftModels = useMemo(
    () => models.filter((m) => m.type !== 'base'),
    [models]
  );
  const baseList = baseModels.length > 0 ? baseModels : models;
  const ftList = ftModels.length > 0 ? ftModels : models;

  const [baseId, setBaseId] = useState(baseList[0]?.id || '');
  const [ftId, setFtId] = useState(ftList[0]?.id || '');
  const [selectedCats, setSelectedCats] = useState([...CATEGORIES]);
  const [mode, setMode] = useState('Standard');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const toggleCategory = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const selectedBase = models.find((m) => m.id === baseId) || baseList[0];
  const selectedFt = models.find((m) => m.id === ftId) || ftList[0];

  const handleRun = async () => {
    if (selectedCats.length === 0) {
      setError('Select at least one category.');
      return;
    }
    setError('');

    try {
      const results = await runTests({
        baseModel: selectedBase,
        ftModel: selectedFt,
        categories: selectedCats,
        mode,
      });

      // Save to global state
      setLastResults(results);

      // Save run to history
      const regressions = results.rows.filter((r) => r.deltaAcc < -0.03).length;
      const avgDelta = +(
        (results.rows.reduce((s, r) => s + r.deltaAcc, 0) / results.rows.length) *
        100
      ).toFixed(1);

      await addRun({
        time: results.timestamp,
        base: selectedBase.name,
        ft: selectedFt.name,
        categories: selectedCats.join(', '),
        mode,
        tests: results.rows.length,
        regressions,
        avgDelta,
      });

      // Navigate to dashboard
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-enter">
      <HeroBanner
        badge="▶️ Run Tests"
        title="Configure & Run Evaluation"
        subtitle="Select your models, categories, and evaluation mode"
      />

      <div className="card">
        <div className="card-title">
          <span className="dot" /> Test Configuration
        </div>
      </div>

      {/* Model Selection */}
      <div className="run-tests-config">
        <div className="form-group">
          <label className="form-label">Base Model</label>
          <select
            className="form-select"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
          >
            {baseList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fine-tuned Model</label>
          <select
            className="form-select"
            value={ftId}
            onChange={(e) => setFtId(e.target.value)}
          >
            {ftList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Test Categories</label>
          <div className="category-tags">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className={`category-tag ${selectedCats.includes(cat) ? 'active' : 'inactive'}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Options */}
      <div className="run-tests-options">
        <div className="form-group">
          <label className="form-label">Custom Prompt (optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Enter a prompt to evaluate, or leave blank for the built-in suite…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ minHeight: '90px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Run Mode</label>
          <select
            className="form-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Repetitions</label>
          <input
            type="range"
            min="1"
            max="5"
            defaultValue="1"
            style={{ marginTop: '0.5rem' }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '0.7rem 1rem',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Progress */}
      {running && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="progress-text">{progressText}</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Live Feed Console */}
      {(running || (logs && logs.length > 0)) && (
        <div className="card live-feed-card animate-slide-up">
          <div className="card-title">
            <span 
              className="dot" 
              style={{ background: running ? '#10b981' : '#6b7280', boxShadow: running ? '0 0 8px #10b981' : 'none' }} 
            />
            Live Evaluation Feed
          </div>
          <div className="live-feed-console">
            {logs.length === 0 && <div className="muted text-center py-4">Awaiting first results from the models...</div>}
            {logs.map((log) => (
              <div key={log.id} className="console-line">
                <div className="flex items-center gap-2 mb-1">
                  <span className="console-meta">[{log.category}]</span>
                  <span className="console-prompt">Q: {log.question.length > 80 ? log.question.slice(0, 80) + '...' : log.question}</span>
                </div>
                <div className="console-resp">
                  <span className="resp-label">Base:</span>
                  <span className={log.passed ? 'text-green-400' : ''}>
                    {log.baseActual.length > 120 ? log.baseActual.slice(0, 120) + '...' : log.baseActual}
                  </span>
                </div>
                <div className="console-resp" style={{ marginTop: '0.3rem' }}>
                  <span className="resp-label">FT:</span>
                  <span className={log.passed ? 'text-green-400' : ''}>
                    {log.ftActual.length > 120 ? log.ftActual.slice(0, 120) + '...' : log.ftActual}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run Button + Summary */}
      <div className="run-tests-footer">
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={running}
          style={{ minWidth: '160px' }}
        >
          {running ? 'Running…' : '⚡  Run Tests'}
        </button>
        <div className="run-tests-summary">
          <span>
            <strong>Base</strong>&nbsp;{selectedBase?.name || '—'}
          </span>
          <span className="run-tests-summary-sep">│</span>
          <span>
            <strong>FT</strong>&nbsp;{selectedFt?.name || '—'}
          </span>
          <span className="run-tests-summary-sep">│</span>
          <span>
            <strong>Cats</strong>&nbsp;
            {selectedCats.length > 0 ? selectedCats.join(', ') : '—'}
          </span>
          <span className="run-tests-summary-sep">│</span>
          <span>
            <strong>Mode</strong>&nbsp;{mode}
          </span>
        </div>
      </div>
    </div>
  );
}
