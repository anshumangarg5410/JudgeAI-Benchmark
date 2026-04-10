import { useState } from 'react';
import { useAppState } from '../context/AppContext';
import HeroBanner from '../components/Layout/HeroBanner';
import ModelForm from '../components/forms/ModelForm';
import Badge from '../components/common/Badge';
import './ModelRegistryPage.css';

export default function ModelRegistryPage() {
  const { models, addModel, removeModel } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (model) => {
    setLoading(true);
    try {
      await addModel(model);
      setToast({ type: 'success', text: `✅ "${model.name}" registered!` });
      setShowForm(false);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete model "${name}"?`)) return;
    try {
      await removeModel(id);
      setToast({ type: 'success', text: `Model "${name}" removed.` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', text: err.message });
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="page-enter">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.text}</div>
      )}

      <HeroBanner
        badge="🧩 Model Registry"
        title="Manage Your Models"
        subtitle="Register base and fine-tuned models with their API endpoints"
      />

      {/* Add Model Expander */}
      <div className="expander">
        <div
          className="expander-header"
          onClick={() => setShowForm(!showForm)}
        >
          <span>➕ Register a New Model</span>
          <span style={{ fontSize: '0.75rem' }}>{showForm ? '▼' : '▶'}</span>
        </div>
        {showForm && (
          <div className="expander-content">
            <ModelForm
              existingIds={models.map((m) => m.id)}
              onSubmit={handleAdd}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Search + Table */}
      <div className="card">
        <div className="card-title">
          <span className="dot" /> Registered Models
        </div>
      </div>

      <div className="model-registry-search">
        <input
          className="form-input"
          placeholder="Search models by name, provider, or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="model-registry-table-wrap">
        <table className="reg-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID / Slug</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Endpoint</th>
              <th>API Key Var</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {m.name}
                  </strong>
                </td>
                <td>
                  <code className="model-id-code">{m.id}</code>
                </td>
                <td>{m.provider}</td>
                <td>
                  <Badge variant={m.type}>{m.type}</Badge>
                </td>
                <td>
                  <span className="model-endpoint">
                    {m.endpoint || '—'}
                  </span>
                </td>
                <td>
                  <span className="model-apikey">
                    {m.apiKeyVar || '—'}
                  </span>
                </td>
                <td>
                  <div className="model-actions">
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.72rem' }}
                      onClick={() => handleDelete(m.id, m.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  {search ? 'No models match your search.' : 'No models registered.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="footnote">
        🔒 API keys are never stored here — only the env variable name. Set
        keys in your server environment.
      </p>
    </div>
  );
}
