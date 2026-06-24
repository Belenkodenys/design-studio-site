import { useState, useRef } from 'react';
import './Admin.css';

export default function ImageUploader({ onUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size: 5MB');
      return;
    }

    setError('');
    setUploading(true);

    // Show local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const response = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type
        },
        body: file,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        setError(data.error || 'Upload failed');
        setPreview(currentImage || '');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="file-input"
        id="image-upload"
      />

      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
          <div className="image-actions">
            <label htmlFor="image-upload" className="admin-btn admin-btn-small">
              {uploading ? 'Uploading...' : 'Change'}
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="admin-btn admin-btn-small admin-btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label htmlFor="image-upload" className="upload-area">
          {uploading ? (
            <div className="upload-loading">
              <div className="admin-spinner" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <span className="upload-icon">+</span>
              <span>Click to upload image</span>
              <span className="upload-hint">JPEG, PNG, GIF, WebP (max 5MB)</span>
            </>
          )}
        </label>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
