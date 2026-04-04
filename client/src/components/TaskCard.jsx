import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function TaskCard({ task, onAccepted, onDeleted }) {
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

  const handleDelete = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${task._id}`);
      showToast('Task deleted', 'success');
      onDeleted?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const isOwn = user?._id === (task.createdBy?._id || task.createdBy);
  const canDelete = user && (user.role === 'admin' || isOwn);

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 'auto', gap: 10, flexWrap: 'wrap' }}>
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

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {task.status === 'open' && !isOwn && (
            <button
              onClick={handleAccept}
              style={{
                fontFamily: 'var(--fb)', fontSize: 13, fontWeight: 600,
                color: 'var(--sky)', background: 'var(--sky-pale)',
                border: '1px solid var(--border-sky)', borderRadius: 8,
                padding: '8px 16px', cursor: 'pointer', transition: 'all .18s',
              }}
            >
              Accept →
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{ padding: '8px 14px', borderRadius: 8 }}
            >
              Delete
            </button>
          )}
          {task.status === 'open' && isOwn && !canDelete && (
            <span style={{ fontSize: 11.5, color: 'var(--ink4)', fontStyle: 'italic' }}>Your task</span>
          )}
        </div>
      </div>
    </div>
  );
}
