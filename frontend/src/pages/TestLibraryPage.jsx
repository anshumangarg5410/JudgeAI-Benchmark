import { useState, useEffect, useMemo } from 'react';
import HeroBanner from '../components/Layout/HeroBanner';
import { useAuth } from '../context/AuthContext';
import { testApi } from '../services/api';
import './TestLibraryPage.css';

export default function TestLibraryPage() {
  const { user } = useAuth();
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    expected: '',
    difficulty: 'medium',
    evaluationCriteria: ''
  });

  // AI Gen State
  const [genData, setGenData] = useState({
    category: 'General',
    count: 3
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const data = await testApi.getTestcases();
      setTestCases(data);
    } catch (err) {
      setError('Failed to load benchmarks library.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) return;
    try {
      await testApi.deleteTestcase(id);
      setTestCases(prev => prev.filter(tc => tc._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        evaluationCriteria: formData.evaluationCriteria.split(',').map(s => s.trim())
      };

      if (editingCase) {
        const updated = await testApi.updateTestcase(editingCase._id, payload);
        setTestCases(prev => prev.map(tc => tc._id === updated._id ? updated : tc));
      } else {
        const created = await testApi.createTestcase(payload);
        setTestCases(prev => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleAIByClick = async () => {
    try {
      setIsGenerating(true);
      const newCases = await testApi.generateTestcases(genData.category, genData.count);
      setTestCases(prev => [...newCases, ...prev]);
      setIsGenModalOpen(false);
      alert(`Successfully generated ${newCases.length} new ${genData.category} cases!`);
    } catch (err) {
      alert('AI Generation failed. Check if AI service is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openModal = (tc = null) => {
    if (tc) {
      setEditingCase(tc);
      setFormData({
        category: tc.category,
        question: tc.question,
        expected: tc.expected,
        difficulty: tc.difficulty || 'medium',
        evaluationCriteria: (tc.evaluationCriteria || []).join(', ')
      });
    } else {
      setEditingCase(null);
      setFormData({
        category: '',
        question: '',
        expected: '',
        difficulty: 'medium',
        evaluationCriteria: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const filteredTests = useMemo(() => {
    return testCases.filter(tc => {
      const matchesSearch = tc.question.toLowerCase().includes(search.toLowerCase()) || 
                             tc.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || tc.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [testCases, search, categoryFilter]);

  const categories = ['All', ...new Set(testCases.map(tc => tc.category))];

  return (
    <div className="page-enter">
      <HeroBanner
        badge="📚 Benchmark Library"
        title="Test Library Management"
        subtitle="Full CRUD control over your evaluation dataset. Add, edit, or generate benchmarks with AI."
        user={user}
      />

      <div className="library-controls card">
        <div className="flex flex-between flex-center">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search benchmarks..." 
              className="lib-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="lib-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => setIsGenModalOpen(true)}>✨ Generate with AI</button>
            <button className="btn-primary" onClick={() => openModal()}>➕ Add Manually</button>
          </div>
        </div>
      </div>

      <div className="library-content">
        {loading ? (
          <div className="text-center p-10">
            <div className="spinner"></div>
            <p className="mt-4">Loading Library...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="card text-center p-10 mt-4">
            <h3 style={{color: 'var(--text-dim)'}}>No test cases found. Try adding some or click "Generate with AI"!</h3>
          </div>
        ) : (
          <div className="card lib-table-wrapper animate-fade-up">
            <table className="reg-table lib-table">
              <thead>
                <tr>
                  <th width="15%">Category</th>
                  <th width="40%">Question</th>
                  <th width="10%">Difficulty</th>
                  <th width="20%">Criteria</th>
                  <th width="15%" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((tc) => (
                  <tr key={tc._id}>
                    <td><span className="cat-pill">{tc.category}</span></td>
                    <td className="prompt-cell">
                      <div className="tc-question">{tc.question}</div>
                      <div className="tc-expected"><strong>Expected:</strong> {tc.expected}</div>
                    </td>
                    <td>
                      <span className={`diff-badge diff-${tc.difficulty}`}>
                        {tc.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="criteria-list">
                        {(tc.evaluationCriteria || []).slice(0, 2).map((c, i) => (
                          <span key={i} className="criteria-item">{c}</span>
                        ))}
                        {tc.evaluationCriteria?.length > 2 && <span className="criteria-more">+{tc.evaluationCriteria.length - 2}</span>}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex flex-end gap-2">
                        <button className="btn-icon-bg" onClick={() => openModal(tc)}>✏️</button>
                        <button className="btn-icon-bg btn-delete" onClick={() => handleDelete(tc._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANUAL MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content lib-modal animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCase ? '📝 Edit Test Case' : '➕ Add New Test Case'}</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body custom-scrollbar">
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g. Legal, Medical..."
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    value={formData.difficulty} 
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Question / Prompt</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.question} 
                  onChange={e => setFormData({...formData, question: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Expected Response</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.expected} 
                  onChange={e => setFormData({...formData, expected: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Evaluation Criteria (comma separated)</label>
                <input 
                  value={formData.evaluationCriteria} 
                  onChange={e => setFormData({...formData, evaluationCriteria: e.target.value})}
                  placeholder="Factuality, Professional Tone, Specific naming..."
                />
              </div>
              <div className="modal-actions flex flex-end gap-3 mt-4">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI GENERATOR MODAL */}
      {isGenModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsGenModalOpen(false)}>
          <div className="modal-content gen-modal animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✨ One-Click AI Benchmark Generator</h2>
              <button className="btn-close" onClick={() => setIsGenModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{color: 'var(--text-dim)', marginBottom: '1.5rem'}}>
                Use the **Judge AI** intelligence to automatically grow your dataset. The AI will create high-quality benchmarks following our professional format.
              </p>
              
              <div className="form-group">
                <label>Choose Category</label>
                <select 
                  value={genData.category}
                  onChange={e => setGenData({...genData, category: e.target.value})}
                  className="lib-select w-full"
                >
                  <option value="Legal Cases">Legal Cases</option>
                  <option value="Medical Care">Medical Care</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Logic Puzzles">Logic Puzzles</option>
                  <option value="Coding">Coding</option>
                </select>
              </div>

              <div className="form-group mt-4">
                <label>How many to generate?</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={genData.count}
                  onChange={e => setGenData({...genData, count: parseInt(e.target.value)})}
                />
              </div>

              <div className="mt-8">
                <button 
                  className="btn-primary w-full py-4 text-lg" 
                  onClick={handleAIByClick}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex flex-center gap-2">
                      <div className="spinner spinner-white"></div>
                      Generating Benchmarks...
                    </div>
                  ) : (
                    <>🚀 Generate {genData.count} New Test Cases</>
                  )}
                </button>
              </div>
            </div>
            <div className="modal-footer text-center" style={{paddingTop: '0'}}>
              <span style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>
                Powered by JudgeAI-Intelligence (Ollama)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
