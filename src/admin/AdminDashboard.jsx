import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.posts) {
        const posts = data.posts;
        setStats({
          total: posts.length,
          published: posts.filter(p => p.status === 'published').length,
          drafts: posts.filter(p => p.status === 'draft').length
        });
        setRecentPosts(posts.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <Link to="/admin/posts/new" className="admin-btn admin-btn-primary">
          + New Post
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-value">{stats.drafts}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Posts</h2>
        {recentPosts.length === 0 ? (
          <div className="admin-empty">
            <p>No posts yet. Create your first post!</p>
            <Link to="/admin/posts/new" className="admin-btn admin-btn-secondary">
              Create Post
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <Link to={`/admin/posts/${post.id}`}>
                        {post.translations?.en?.title || post.translations?.ru?.title || 'Untitled'}
                      </Link>
                    </td>
                    <td>
                      <span className={`status-badge status-${post.status}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link
                        to={`/admin/posts/${post.id}`}
                        className="admin-btn admin-btn-small"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
