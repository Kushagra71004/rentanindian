import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function TaskCard({ task, onAccepted }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAccept = async () => {
    if (!user) { navigate('/auth'); return; }
    try {
      await api.post(`/api/tasks/${task._id}/accept`);
      showToast('Task accepted! Check your profile.', 'success');
      onAccepted?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept task', 'error');
    }
  };

  const isOwn = user?._id === (task.createdBy?._id || task.createdBy);
  const isAccepted = task.status !== 'open';

  return (
    <div className="task-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`badge badge-${task.type === 'remote' ? 'remote' : 'on-ground'}`}>
            {task.type === 'remote' ? '🌐 Remote' : '📍 On-ground'}
          </span>
          <span className={`badge badge-${task.status}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 17, fontWeight: 800, color: 'var(--ink)', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink3)', marginRight: 2 }}>₹</span>
          {task.budget?.toLocaleString()}
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
        {task.title}
      </h3>

      <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.65, flex: 1 }}>
        {task.description?.length > 120 ? task.description.slice(0, 120) + '…' : task.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div>
          {task.createdBy?.name && (
            <div style={{ fontSize: 11.5, color: 'var(--ink4)', fontWeight: 500 }}>
              by {task.createdBy.name}
            </div>
          )}
          {task.deadline && (
            <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>
              Due {new Date(task.deadline).toLocaleDateString()}
            </div>
          )}
        </div>

        {task.status === 'open' && !isOwn && (
          <button
            onClick={handleAccept}
            style={{
              fontFamily: 'var(--fb)', fontSize: 13, fontWeight: 600,
              color: 'var(--sky)', background: 'var(--sky-pale)',
              border: '1px solid var(--border-sky)', borderRadius: 8,
              padding: '8px 16px', cursor: 'pointer', transition: 'all .18s',
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--sky)'; e.target.style.color = '#fff'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--sky-pale)'; e.target.style.color = 'var(--sky)'; }}
          >
            Accept →
          </button>
        )}
        {task.status === 'open' && isOwn && (
          <span style={{ fontSize: 11.5, color: 'var(--ink4)', fontStyle: 'italic' }}>Your task</span>
        )}
      </div>
    </div>
  );
}
