import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>
          <div className="foot-logo">rentanindian.ai</div>
          <div className="foot-tag">From AI to reality — tasks executed.</div>
        </div>
        <div>
          <div className="foot-col-title">Platform</div>
          <div className="foot-links">
            <Link to="/tasks">Browse Tasks</Link>
            <Link to="/create-task">Post a Task</Link>
            <Link to="/auth">Sign In</Link>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="foot-built">Built in public</div>
        <div className="foot-sig">Execution, powered by India <span className="foot-hrt">❤</span></div>
        <div>© 2026</div>
      </div>
    </footer>
  );
}
