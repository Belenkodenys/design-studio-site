import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import './Admin.css';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Russian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'es', name: 'Spanish' }
];

const CATEGORIES = [
  'Design',
  'Interior',
  'Architecture',
  'Branding',
  'Photography',
  'News'
];

const emptyTranslations = {
  en: { title: '', content: '', excerpt: '' },
  ru: { title: '', content: '', excerpt: '' },
  uk: { title: '', content: '', excerpt: '' },
  es: { title: '', content: '', excerpt: '' }
};

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPost = id === 'new';

  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [translations, setTranslations] = useState(emptyTranslations);

  const [activeTab, setActiveTab] = useState('en');
  const [showImageModal, setShowImageModal] = useState(false);
  const imageCallbackRef = useRef(null);

  useEffect(() => {
    if (!isNewPost && id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.post) {
        const post = data.post;
        setSlug(post.slug || '');
        setStatus(post.status || 'draft');
        setCategory(post.category || '');
        setImageUrl(post.imageUrl || '');
        setTranslations(post.translations || emptyTranslations);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (lang, title) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev[lang], title }
    }));

    // Auto-generate slug from English title
    if (lang === 'en' && !slug) {
      setSlug(generateSlug(title));
    }
  };

  const handleContentChange = (lang, content) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev[lang], content }
    }));
  };

  const handleExcerptChange = (lang, excerpt) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev[lang], excerpt }
    }));
  };

  const handleImageUploadRequest = (callback) => {
    imageCallbackRef.current = callback;
    setShowImageModal(true);
  };

  const handleModalImageUpload = (url) => {
    if (imageCallbackRef.current) {
      imageCallbackRef.current(url);
    }
    setShowImageModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validate
    if (!slug) {
      setError('Slug is required');
      setSaving(false);
      return;
    }

    const hasContent = LANGUAGES.some(
      lang => translations[lang.code]?.title
    );
    if (!hasContent) {
      setError('At least one language must have a title');
      setSaving(false);
      return;
    }

    try {
      const url = isNewPost
        ? '/api/admin/posts'
        : `/api/admin/posts/${id}`;

      const method = isNewPost ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slug,
          status,
          category,
          imageUrl,
          translations
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/admin/posts');
      } else {
        setError(data.error || 'Failed to save post');
      }
    } catch (err) {
      setError('Failed to save post');
    } finally {
      setSaving(false);
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
    <div className="post-editor">
      <form onSubmit={handleSubmit}>
        <div className="admin-header">
          <h1>{isNewPost ? 'New Post' : 'Edit Post'}</h1>
          <div className="header-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="editor-layout">
          <div className="editor-main">
            <div className="language-tabs">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`tab-btn ${activeTab === lang.code ? 'active' : ''}`}
                >
                  {lang.name}
                  {translations[lang.code]?.title && (
                    <span className="tab-indicator" />
                  )}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {LANGUAGES.map(lang => (
                <div
                  key={lang.code}
                  className={`tab-pane ${activeTab === lang.code ? 'active' : ''}`}
                >
                  <div className="form-group">
                    <label>Title ({lang.name})</label>
                    <input
                      type="text"
                      value={translations[lang.code]?.title || ''}
                      onChange={(e) => handleTitleChange(lang.code, e.target.value)}
                      placeholder={`Enter title in ${lang.name}`}
                    />
                  </div>

                  <div className="form-group">
                    <label>Excerpt ({lang.name})</label>
                    <textarea
                      value={translations[lang.code]?.excerpt || ''}
                      onChange={(e) => handleExcerptChange(lang.code, e.target.value)}
                      placeholder={`Short description in ${lang.name}`}
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Content ({lang.name})</label>
                    <RichTextEditor
                      content={translations[lang.code]?.content || ''}
                      onChange={(content) => handleContentChange(lang.code, content)}
                      onImageUpload={handleImageUploadRequest}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-sidebar">
            <div className="sidebar-section">
              <h3>Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="sidebar-section">
              <h3>Slug</h3>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
              />
            </div>

            <div className="sidebar-section">
              <h3>Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sidebar-section">
              <h3>Featured Image</h3>
              <ImageUploader
                onUpload={setImageUrl}
                currentImage={imageUrl}
              />
            </div>
          </div>
        </div>
      </form>

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Upload Image</h2>
            <ImageUploader
              onUpload={handleModalImageUpload}
              currentImage=""
            />
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="admin-btn admin-btn-secondary modal-close"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
