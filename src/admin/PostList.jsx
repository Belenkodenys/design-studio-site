import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-posts">
      <div className="admin-header">
        <h1>Posts</h1>
        <Link to="/admin/posts/new" className="admin-btn admin-btn-primary">
          + New Post
        </Link>
      </div>

      <div className="admin-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({posts.length})
        </button>
        <button
          className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published ({posts.filter(p => p.status === 'published').length})
        </button>
        <button
          className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Drafts ({posts.filter(p => p.status === 'draft').length})
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="admin-empty">
          <p>No posts found.</p>
          <Link to="/admin/posts/new" className="admin-btn admin-btn-secondary">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/admin/posts/${post.id}`}>
                      {post.translations?.en?.title || post.translations?.ru?.title || 'Untitled'}
                    </Link>
                    <div className="post-slug">/{post.slug}</div>
                  </td>
                  <td>{post.category || '-'}</td>
                  <td>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/posts/${post.id}`}
                        className="admin-btn admin-btn-small"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(
                          post.id,
                          post.translations?.en?.title || post.translations?.ru?.title || 'Untitled'
                        )}
                        className="admin-btn admin-btn-small admin-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
