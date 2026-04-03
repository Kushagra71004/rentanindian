import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';
import api from '../utils/api';

const FILTERS = ['All', 'Remote', 'On-ground', 'Open', 'Accepted'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/api/tasks');
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filtered = tasks.filter(t => {
    const matchFilter =
      filter === 'All' ? true :
      filter === 'Remote' ? t.type === 'remote' :
      filter === 'On-ground' ? t.type === 'on-ground' :
      filter === 'Open' ? t.status === 'open' :
      filter === 'Accepted' ? t.status === 'accepted' : true;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <div className="page-hero">
        <h1>Browse Tasks</h1>
        <p>Find tasks that match your skills. Remote or on-ground, small or large — there's work waiting for you.</p>
      </div>

      <section style={{ background: 'var(--sky-tint)', padding: '48px 40px', flex: 1 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
              <input
                className="form-input" type="text" placeholder="Search tasks…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  fontFamily: 'var(--fb)', fontSize: 13, fontWeight: 600, padding: '7px 14px',
                  borderRadius: 100, border: '1.5px solid', cursor: 'pointer', transition: 'all .18s',
                  background: filter === f ? 'var(--sky)' : '#fff',
                  color: filter === f ? '#fff' : 'var(--ink3)',
                  borderColor: filter === f ? 'var(--sky)' : 'var(--border)',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px rgba(34,197,94,.7)', animation: 'pdot 1.6s ease-in-out infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {filtered.length} task{filtered.length !== 1 ? 's' : ''} live
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink4)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8 }}>No tasks found</div>
              <p style={{ fontSize: 14, color: 'var(--ink4)' }}>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map(task => (
                <TaskCard key={task._id} task={task} onAccepted={fetchTasks} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
