import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';
import api from '../utils/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState({ user: null, createdTasks: [], acceptedTasks: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('created');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });

  const fetchProfile = async () => {
    try {
      const { data: d } = await api.get('/api/users/profile');
      setData(d);
      setForm({ name: d.user.name, bio: d.user.bio || '' });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    try {
      await api.put('/api/users/profile', form);
      showToast('Profile updated!', 'success');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const u = data.user || user;
  const displayTasks = tab === 'created' ? data.createdTasks : data.acceptedTasks;

  return (
    <div>
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(158deg,#0C52A0 0%,#1568BF 25%,#2E8CE8 55%,#EBF5FF 100%)', padding: '110px 40px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom,transparent,var(--sky-tint))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.15))', border: '3px solid rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {u?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-.03em', marginBottom: 6 }}>{u?.name}</h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, background: 'rgba(255,255,255,.18)', color: 'rgba(255,255,255,.9)', border: '1px solid rgba(255,255,255,.25)' }}>
                {u?.role === 'admin' ? '🛡 Admin' : '👤 User'}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                ✉ {u?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section style={{ background: 'var(--sky-tint)', padding: '32px 40px 64px', flex: 1 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile card */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 24 }}>
              {editing ? (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label className="form-label">Name</label>
                    <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Bio</label>
                    <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Tell us about yourself…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '9px 14px' }}>Save</button>
                    <button onClick={() => setEditing(false)} className="btn-ghost" style={{ flex: 1, fontSize: 13 }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {u?.bio && <p style={{ fontSize: 13.5, color: 'var(--ink3)', lineHeight: 1.7, marginBottom: 16 }}>{u.bio}</p>}
                  <button onClick={() => setEditing(true)} className="btn-ghost" style={{ width: '100%', fontSize: 13 }}>✏️ Edit Profile</button>
                </>
              )}
            </div>

            {/* Stats */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 24 }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-.01em' }}>Your Stats</div>
              {[
                { label: 'Tasks Posted', val: data.createdTasks.length, color: 'var(--sky)' },
                { label: 'Tasks Accepted', val: data.acceptedTasks.length, color: 'var(--green)' },
                { label: 'Member since', val: new Date(u?.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }), color: 'var(--ink3)', small: true },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink3)' }}>{s.label}</span>
                  <span style={{ fontFamily: s.small ? 'var(--fb)' : 'var(--fd)', fontSize: s.small ? 13 : 18, fontWeight: 800, color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/create-task" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center', fontSize: 14, padding: '11px' }}>
                + Post New Task
              </Link>
              <Link to="/tasks" className="btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center', fontSize: 14, padding: '11px' }}>
                Browse Tasks
              </Link>
              {u?.role === 'admin' && (
                <Link to="/admin" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', fontSize: 14, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,var(--ink),var(--ink2))', color: '#fff', fontWeight: 700, fontFamily: 'var(--fb)' }}>
                  🛡 Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
              {[
                { key: 'created', label: `Posted (${data.createdTasks.length})` },
                { key: 'accepted', label: `Accepted (${data.acceptedTasks.length})` },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  fontFamily: 'var(--fb)', fontSize: 13.5, fontWeight: 600, padding: '8px 20px',
                  borderRadius: 9, border: 'none', cursor: 'pointer', transition: 'all .18s',
                  background: tab === t.key ? 'var(--sky)' : 'transparent',
                  color: tab === t.key ? '#fff' : 'var(--ink3)',
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {displayTasks.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{tab === 'created' ? '📋' : '✅'}</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 16, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8 }}>
                  {tab === 'created' ? 'No tasks posted yet' : 'No tasks accepted yet'}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--ink4)', marginBottom: 20 }}>
                  {tab === 'created' ? 'Post your first task and get it done fast.' : 'Browse available tasks and start earning.'}
                </p>
                <Link to={tab === 'created' ? '/create-task' : '/tasks'} className="btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '10px 22px' }}>
                  {tab === 'created' ? 'Post a Task' : 'Browse Tasks'}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
                {displayTasks.map(task => (
                  <TaskCard key={task._id} task={task} onAccepted={fetchProfile} onDeleted={fetchProfile} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
