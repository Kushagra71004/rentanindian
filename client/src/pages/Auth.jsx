import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { showToast('Please fill all fields', 'error'); return; }
    if (mode === 'register' && !form.name) { showToast('Name is required', 'error'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const u = await login(form.email, form.password);
        showToast(`Welcome back, ${u.name}!`, 'success');
        navigate(u.role === 'admin' ? '/admin' : '/profile');
      } else {
        const u = await register(form.name, form.email, form.password);
        showToast(`Welcome to rentanindian.ai, ${u.name}!`, 'success');
        navigate(u.role === 'admin' ? '/admin' : '/profile');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-outer" style={{ background: 'linear-gradient(158deg,#0C52A0 0%,#1568BF 25%,#2E8CE8 55%,#EBF5FF 100%)' }}>
      <div className="signin-box" style={{ animation: 'fadeUp .45s ease forwards' }}>
        <div className="signin-logo">rentanindian<span>.ai</span></div>
        <div className="signin-tag">From AI to reality — tasks executed.</div>

        <div style={{ display: 'flex', background: 'var(--sky-tint)', borderRadius: 10, padding: 4, marginBottom: 28, marginTop: 24 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fb)', fontSize: 13.5, fontWeight: 600, transition: 'all .18s',
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? 'var(--sky)' : 'var(--ink3)',
              boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
            }}>
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        <div style={{ marginBottom: mode === 'register' ? 16 : 24 }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {mode === 'register' && (
          <div style={{ fontSize: 12.5, color: 'var(--ink4)', marginBottom: 24, lineHeight: 1.6, textAlign: 'left' }}>
            New accounts are created as user accounts. Admin access is reserved for the single configured admin id.
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px', borderRadius: 11, opacity: loading ? .7 : 1 }}>
          {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : mode === 'login' ? 'Sign in →' : 'Create account →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--ink4)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--sky)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--ink4)', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
