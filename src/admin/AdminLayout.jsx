import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import './Admin.css';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        setAuthenticated(true);
      } else {
        navigate('/admin/login');
      }
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      // Ignore errors
    }
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/">Belenko Studio</Link>
        </div>
        <nav className="admin-nav">
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/posts"
            className={location.pathname.startsWith('/admin/posts') ? 'active' : ''}
          >
            Posts
          </Link>
          <Link
            to="/admin/posts/new"
            className={location.pathname === '/admin/posts/new' ? 'active' : ''}
          >
            + New Post
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
