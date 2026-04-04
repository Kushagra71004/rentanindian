import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';
import api from '../utils/api';

const STAT_COLORS = ['var(--sky)', 'var(--green)', 'var(--orange)', '#7C3AED'];

export default function Admin() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Task form state
  const [taskForm, setTaskForm] = useState({ title: '', description: '', budget: '', type: 'remote', deadline: '', status: 'open' });
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, t] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/tasks'),
      ]);
      setUsers(u.data);
      setTasks(t.data);
    } catch (e) { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const setF = (k, v) => setTaskForm(f => ({ ...f, [k]: v }));

  const handleSaveTask = async () => {
    if (!taskForm.title || !taskForm.description || !taskForm.budget) {
      showToast('Fill in all required fields', 'error'); return;
    }
    setSaving(true);
    try {
      if (editingTask) {
        await api.put(`/api/admin/tasks/${editingTask._id}`, { ...taskForm, budget: Number(taskForm.budget) });
        showToast('Task updated!', 'success');
      } else {
        await api.post('/api/admin/tasks', { ...taskForm, budget: Number(taskForm.budget) });
        showToast('Task added!', 'success');
      }
      setTaskForm({ title: '', description: '', budget: '', type: 'remote', deadline: '', status: 'open' });
      setEditingTask(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description, budget: task.budget, type: task.type, deadline: task.deadline?.slice(0, 10) || '', status: task.status });
    setTab('add-task');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/admin/tasks/${id}`);
      showToast('Task deleted', 'success');
      fetchData();
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/admin/tasks/${id}/status`, { status });
      showToast('Status updated', 'success');
      fetchData();
    } catch { showToast('Update failed', 'error'); }
  };

  const stats = [
    { label: 'Total Users', val: users.length, icon: '👥' },
    { label: 'Total Tasks', val: tasks.length, icon: '📋' },
    { label: 'Open Tasks', val: tasks.filter(t => t.status === 'open').length, icon: '🟢' },
    { label: 'Accepted Tasks', val: tasks.filter(t => t.status === 'accepted').length, icon: '✅' },
  ];

  const TABS = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'tasks', label: `📋 Tasks (${tasks.length})` },
    { key: 'users', label: `👥 Users (${users.length})` },
    { key: 'add-task', label: editingTask ? '✏️ Edit Task' : '➕ Add Task' },
  ];

  return (
    <div>
      <div className="page-hero">
        <h1>Admin Dashboard</h1>
        <p>Manage all tasks and users from a single control panel.</p>
      </div>

      <section style={{ background: 'var(--sky-tint)', flex: 1, padding: '40px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Tab nav */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); if (t.key !== 'add-task') { setEditingTask(null); setTaskForm({ title:'',description:'',budget:'',type:'remote',deadline:'',status:'open' }); } }} style={{
                fontFamily: 'var(--fb)', fontSize: 13.5, fontWeight: 600,
                padding: '9px 18px', borderRadius: 10, border: '1.5px solid',
                cursor: 'pointer', transition: 'all .18s',
                background: tab === t.key ? 'var(--sky)' : '#fff',
                color: tab === t.key ? '#fff' : 'var(--ink3)',
                borderColor: tab === t.key ? 'var(--sky)' : 'var(--border)',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18, marginBottom: 36 }}>
                    {stats.map((s, i) => (
                      <div key={s.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: '28px 24px', transition: 'all .2s', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--sh-sky)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: STAT_COLORS[i], opacity: .07 }} />
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                        <div style={{ fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 800, color: STAT_COLORS[i], lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink3)', fontWeight: 500 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Recent tasks preview */}
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Recent Tasks</span>
                      <button onClick={() => setTab('tasks')} className="btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }}>View all</button>
                    </div>
                    {tasks.slice(0, 5).map(task => (
                      <div key={task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--border)', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink4)' }}>by {task.createdBy?.name || 'Admin'}</div>
                        </div>
                        <span className={`badge badge-${task.status}`}>{task.status}</span>
                        <span style={{ fontFamily: 'var(--fd)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>₹{task.budget?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {tab === 'tasks' && (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700 }}>All Tasks</span>
                    <button onClick={() => setTab('add-task')} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>+ Add Task</button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                      <thead>
                        <tr style={{ background: 'var(--sky-tint)', textAlign: 'left' }}>
                          {['Title', 'Budget', 'Type', 'Status', 'Posted by', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink3)', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => (
                          <tr key={task._id} style={{ borderBottom: '1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-tint)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '14px 16px', maxWidth: 220 }}>
                              <div style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontFamily: 'var(--fd)', fontWeight: 700, color: 'var(--ink)' }}>₹{task.budget?.toLocaleString()}</td>
                            <td style={{ padding: '14px 16px' }}><span className={`badge badge-${task.type === 'remote' ? 'remote' : 'on-ground'}`}>{task.type}</span></td>
                            <td style={{ padding: '14px 16px' }}>
                              <select value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}
                                style={{ fontFamily: 'var(--fb)', fontSize: 12, border: '1px solid var(--border)', borderRadius: 7, padding: '4px 8px', background: '#fff', cursor: 'pointer', color: 'var(--ink)' }}>
                                <option value="open">Open</option>
                                <option value="accepted">Accepted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--ink3)' }}>{task.createdBy?.name || 'Admin'}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleEdit(task)} className="btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="btn-danger" style={{ fontSize: 12, padding: '5px 10px' }}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {tasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink4)' }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                        No tasks yet. Add the first one!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {tab === 'users' && (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700 }}>All Users ({users.length})</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                      <thead>
                        <tr style={{ background: 'var(--sky-tint)', textAlign: 'left' }}>
                          {['User', 'Email', 'Role', 'Joined'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ink3)', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-tint)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--sky),var(--sky-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                  {u.name?.[0]?.toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--ink3)' }}>{u.email}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.role === 'admin' ? 'rgba(124,58,237,.1)' : 'rgba(46,140,232,.1)', color: u.role === 'admin' ? '#7C3AED' : 'var(--sky-d)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--ink4)', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADD / EDIT TASK */}
              {tab === 'add-task' && (
                <div style={{ maxWidth: 560, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--rx)', padding: '40px', boxShadow: 'var(--sh)' }}>
                  <h2 style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 800, color: 'var(--ink)', marginBottom: 28, letterSpacing: '-.025em' }}>
                    {editingTask ? '✏️ Edit Task' : '➕ Add New Task'}
                  </h2>

                  <div style={{ marginBottom: 18 }}>
                    <label className="form-label">Title *</label>
                    <input className="form-input" type="text" placeholder="Task title" value={taskForm.title} onChange={e => setF('title', e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label className="form-label">Description *</label>
                    <textarea className="form-textarea" placeholder="Full task description…" value={taskForm.description} onChange={e => setF('description', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                    <div>
                      <label className="form-label">Budget (₹) *</label>
                      <input className="form-input" type="number" placeholder="500" value={taskForm.budget} onChange={e => setF('budget', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Deadline</label>
                      <input className="form-input" type="date" value={taskForm.deadline} onChange={e => setF('deadline', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                    <div>
                      <label className="form-label">Type</label>
                      <select className="form-select" value={taskForm.type} onChange={e => setF('type', e.target.value)}>
                        <option value="remote">Remote</option>
                        <option value="on-ground">On-ground</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Status</label>
                      <select className="form-select" value={taskForm.status} onChange={e => setF('status', e.target.value)}>
                        <option value="open">Open</option>
                        <option value="accepted">Accepted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSaveTask} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 14, padding: '12px', opacity: saving ? .7 : 1 }}>
                      {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                    {editingTask && (
                      <button onClick={() => { setEditingTask(null); setTaskForm({ title:'',description:'',budget:'',type:'remote',deadline:'',status:'open' }); }} className="btn-ghost" style={{ fontSize: 14 }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
