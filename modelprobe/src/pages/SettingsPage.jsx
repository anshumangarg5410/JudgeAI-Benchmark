import { useState, useEffect } from 'react';
import { settingsApi } from '../services/api';
import HeroBanner from '../components/Layout/HeroBanner';
import Spinner from '../components/common/Spinner';

const SCORERS = ['LLM-as-Judge', 'Exact Match', 'Embedding Similarity', 'ROUGE', 'Human Review'];
const LANGUAGES = ['Python', 'TypeScript', 'Auto-detect'];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    settingsApi
      .get()
      .then(setSettings)
      .catch(() => {
        // Fallback defaults if JSON Server doesn't have settings
        setSettings({
          backendUrl: 'http://localhost:8000',
          authToken: '',
          evalEndpoint: '/api/evaluate',
          modelsEndpoint: '/api/models',
          regressionThreshold: 3,
          latencyWarning: 0.4,
          errorSpikeThreshold: 2,
          defaultScorer: 'LLM-as-Judge',
          judgeModel: 'gpt-4o',
          evalLanguage: 'Python',
          asyncBatch: true,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'range'
          ? Number(e.target.value)
          : e.target.value;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      setToast({ type: 'success', text: '✅ Settings saved!' });
    } catch {
      setToast({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <Spinner text="Loading settings…" />;

  return (
    <div className="page-enter">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.text}</div>
      )}

      <HeroBanner
        badge="⚙️ Settings"
        title="Platform Configuration"
        subtitle="Backend connection, thresholds, and evaluation preferences"
      />

      {/* Backend API Connection */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Backend API Connection
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.2rem' }}>
        <div className="form-group">
          <label className="form-label">Backend API URL</label>
          <input
            className="form-input"
            value={settings.backendUrl}
            onChange={update('backendUrl')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Auth Token</label>
          <input
            className="form-input"
            type="password"
            placeholder="Bearer token"
            value={settings.authToken}
            onChange={update('authToken')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Evaluation Endpoint</label>
          <input
            className="form-input"
            value={settings.evalEndpoint}
            onChange={update('evalEndpoint')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Models Endpoint</label>
          <input
            className="form-input"
            value={settings.modelsEndpoint}
            onChange={update('modelsEndpoint')}
          />
        </div>
      </div>

      {/* Evaluation Thresholds */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Evaluation Thresholds
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.2rem' }}>
        <div className="form-group">
          <label className="form-label">
            Regression threshold: {settings.regressionThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={settings.regressionThreshold}
            onChange={update('regressionThreshold')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Latency warning: {settings.latencyWarning}s
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={settings.latencyWarning}
            onChange={update('latencyWarning')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Error spike threshold: {settings.errorSpikeThreshold}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={settings.errorSpikeThreshold}
            onChange={update('errorSpikeThreshold')}
          />
        </div>
      </div>

      {/* Scoring Method */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Scoring Method
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.2rem' }}>
        <div>
          <div className="form-group" style={{ marginBottom: '0.8rem' }}>
            <label className="form-label">Default Scorer</label>
            <select
              className="form-select"
              value={settings.defaultScorer}
              onChange={update('defaultScorer')}
            >
              {SCORERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Judge Model</label>
            <input
              className="form-input"
              value={settings.judgeModel}
              onChange={update('judgeModel')}
            />
          </div>
        </div>
        <div>
          <div className="form-group" style={{ marginBottom: '0.8rem' }}>
            <label className="form-label">Evaluation Language</label>
            <select
              className="form-select"
              value={settings.evalLanguage}
              onChange={update('evalLanguage')}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <label className="form-checkbox-group">
            <input
              type="checkbox"
              checked={settings.asyncBatch}
              onChange={update('asyncBatch')}
            />
            Enable async batch evaluation
          </label>
        </div>
      </div>

      <div style={{ height: '0.4rem' }} />

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
}
