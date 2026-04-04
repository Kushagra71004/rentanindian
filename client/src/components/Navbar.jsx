import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `nl${isActive ? ' active-page' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav id="gnav">
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        rentanindian<span>.ai</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/tasks" className={navClass}>
          Tasks
        </NavLink>
        <NavLink to="/create-task" className={navClass}>
          Request a task
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
      </div>

      <div className="nav-r">
        {user ? (
          <>
            <button className="btn-ghost" onClick={handleLogout}>
              Sign out
            </button>
            <button className="btn-cta" onClick={() => navigate('/profile')}>
              {user.name ? user.name.split(' ')[0] : 'Profile'}
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => navigate('/auth')}>
              Sign in
            </button>
            <button className="btn-cta" onClick={() => navigate('/auth?mode=register')}>
              Get started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}