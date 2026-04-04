import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';
import api from '../utils/api';

export default function CreateTask() {
  const [form, setForm] = useState({ title: '', description: '', budget: '', type: 'remote', deadline: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.budget) {
      showToast('Please fill in all required fields', 'error'); return;
    }
    setLoading(true);
    try {
      await api.post('/api/tasks', { ...form, budget: Number(form.budget) });
      showToast('Task posted successfully!', 'success');
      navigate('/tasks');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>Post a Task</h1>
        <p>Describe what you need done. Our network will get it executed — remote or on-ground.</p>
      </div>

      <section style={{ background: 'var(--sky-tint)', padding: '64px 40px', flex: 1 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rx)', padding: '48px', boxShadow: 'var(--sh)', animation: 'fadeUp .4s ease forwards' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 28, letterSpacing: '-.025em' }}>Task Details</h2>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Task Title *</label>
            <input className="form-input" type="text" placeholder="e.g. Scrape 200 LinkedIn profiles into CSV" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="Describe the task in detail. Include any specific requirements, formats, or deadlines." value={form.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 130 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label className="form-label">Budget (₹) *</label>
              <input className="form-input" type="number" placeholder="500" min="1" value={form.budget} onChange={e => set('budget', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input className="form-input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label className="form-label">Task Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { val: 'remote', label: '🌐 Remote', desc: 'Digital / online work' },
                { val: 'on-ground', label: '📍 On-ground', desc: 'Physical presence needed' }
              ].map(t => (
                <div key={t.val} onClick={() => set('type', t.val)} style={{
                  border: `1.5px solid ${form.type === t.val ? 'var(--sky)' : 'var(--border)'}`,
                  borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .18s',
                  background: form.type === t.val ? 'var(--sky-pale)' : '#fff',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: form.type === t.val ? 'var(--sky)' : 'var(--ink)', marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink4)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', borderRadius: 11, opacity: loading ? .7 : 1 }}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Post Task →'}
          </button>

          <p style={{ fontSize: 12, color: 'var(--ink4)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            Tasks are reviewed and live within 30 minutes. You'll be notified when someone accepts.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
