import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 64, padding: '0 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,.95)',
      backdropFilter: 'blur(20px) saturate(1.6)',
      borderBottom: '1px solid rgba(220,230,242,.7)',
      transition: 'box-shadow .25s',
      boxShadow: scrolled ? '0 2px 32px rgba(0,0,0,.1)' : 'none',
    }}>
      {/* Logo */}
      <Link to="/" style={{ fontFamily: 'var(--fd)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-.02em' }}>
        rentanindian<span style={{ color: 'var(--sky)' }}>.ai</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
        <Link to="/tasks" className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}>Browse Tasks</Link>
        <Link to="/create-task" className={`nav-link ${isActive('/create-task') ? 'active' : ''}`}>Post a Task</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sky), var(--sky-d))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'var(--fd)',
                flexShrink: 0,
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink2)' }} className="hidden md:block">
                {user.name?.split(' ')[0]}
              </span>
            </Link>
            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn-ghost" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '7px 16px', borderRadius: 9, fontFamily: 'var(--fb)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink2)', border: '1.5px solid var(--border)' }}>
              Log in
            </Link>
            <Link to="/auth?mode=register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 13.5 }}>
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
