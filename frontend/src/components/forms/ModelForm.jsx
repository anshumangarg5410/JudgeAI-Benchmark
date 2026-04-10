import { useState } from 'react';

/**
 * ModelForm — Form for registering a new model in the registry
 */
export default function ModelForm({ existingIds = [], onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    id: '',
    provider: '',
    type: 'base',
    endpoint: '',
    apiKeyVar: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Display name is required';
    if (!form.id.trim()) errs.id = 'Model ID is required';
    else if (existingIds.includes(form.id))
      errs.id = `Model ID "${form.id}" already exists`;
    if (!form.provider.trim()) errs.provider = 'Provider is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm({ name: '', id: '', provider: '', type: 'base', endpoint: '', apiKeyVar: '', notes: '' });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-3" style={{ marginBottom: '0.8rem' }}>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input
            className="form-input"
            placeholder="My-GPT-4o-FT"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Model ID / Slug</label>
          <input
            className="form-input"
            placeholder="my-gpt4o-ft-v1"
            value={form.id}
            onChange={set('id')}
          />
          {errors.id && <div className="form-error">{errors.id}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Provider</label>
          <input
            className="form-input"
            placeholder="OpenAI"
            value={form.provider}
            onChange={set('provider')}
          />
          {errors.provider && <div className="form-error">{errors.provider}</div>}
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '0.8rem' }}>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={set('type')}>
            <option value="base">Base</option>
            <option value="fine-tuned">Fine-tuned</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">API Endpoint</label>
          <input
            className="form-input"
            placeholder="https://api.openai.com/v1"
            value={form.endpoint}
            onChange={set('endpoint')}
          />
        </div>
        <div className="form-group">
          <label className="form-label">API Key Env Var</label>
          <input
            className="form-input"
            placeholder="OPENAI_API_KEY"
            value={form.apiKeyVar}
            onChange={set('apiKeyVar')}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label className="form-label">Training Instructions / Personality (Live Training)</label>
        <textarea
          className="form-textarea"
          placeholder="Describe how this model was 'trained' or define its personality (e.g. 'You are a sarcastic legal expert'). These instructions will be used in benchmarks..."
          value={form.notes}
          onChange={set('notes')}
          style={{ minHeight: '100px' }}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Registering…' : 'Register Model'}
      </button>
    </form>
  );
}
