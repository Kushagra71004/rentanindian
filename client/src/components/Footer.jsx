import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#07090F', color: 'rgba(255,255,255,.4)', padding: '56px 40px 0', fontSize: 13 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, paddingBottom: 48 }}>
        <div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>
            rentanindian.ai
          </div>
          <div style={{ fontSize: 12.5, marginTop: 6, color: 'rgba(255,255,255,.28)', fontStyle: 'italic' }}>
            From AI to reality — tasks executed.
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 14 }}>Platform</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/tasks" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: 13 }}>Browse Tasks</Link>
            <Link to="/create-task" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: 13 }}>Post a Task</Link>
            <Link to="/auth" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: 13 }}>Sign In</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 0 36px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>rentanindian.ai</div>
        <div style={{ fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,.26)', letterSpacing: '.01em' }}>
          Execution, powered by India <span style={{ color: '#C84040', fontStyle: 'normal' }}>❤</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,.22)', fontSize: 12 }}>© 2025</div>
      </div>
    </footer>
  );
}
