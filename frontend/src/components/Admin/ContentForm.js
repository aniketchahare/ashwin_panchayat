import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { getImageUrl } from '../../utils/imageUrl';
import './ContentForm.css';

const ContentForm = ({ type, content, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [existingMedia, setExistingMedia] = useState([]); // Media already in DB
  const [newFiles, setNewFiles] = useState([]); // New files selected: [{file, preview, type}, ...]
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (content) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      setFormData({
        title: content.title || '',
        description: content.description || '',
        startDate: formatDate(content.startDate),
        endDate: formatDate(content.endDate),
        isActive: content.isActive !== undefined ? content.isActive : true,
      });
      setExistingMedia(content.media || []);
      setNewFiles([]);
    } else {
      // Reset form for new content
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
      setExistingMedia([]);
      setNewFiles([]);
    }
  }, [content]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Process each file and create preview (only images allowed)
    files.forEach((file) => {
      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed. Please select image files only.');
        return;
      }

      const fileWithPreview = { file, preview: null, type: 'image' };
      const reader = new FileReader();
      reader.onload = (event) => {
        fileWithPreview.preview = event.target.result;
        setNewFiles((prev) => [...prev, fileWithPreview]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = '';
  };

  const removeExistingMedia = (index) => {
    setExistingMedia(existingMedia.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    const fileItem = newFiles[index];
    if (fileItem && fileItem.preview && fileItem.preview.startsWith('blob:')) {
      URL.revokeObjectURL(fileItem.preview);
    }
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate event dates
      if (type === 'EVENT') {
        if (!formData.startDate || !formData.endDate) {
          setError('Start date and end date are required for events');
          setSaving(false);
          return;
        }
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) {
          setError('End date must be after or equal to start date');
          setSaving(false);
          return;
        }
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('type', type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isActive', formData.isActive);

      // Add date fields for events
      if (type === 'EVENT') {
        formDataToSend.append('startDate', formData.startDate);
        formDataToSend.append('endDate', formData.endDate);
      }

      // Add existing media as JSON string
      if (existingMedia.length > 0) {
        formDataToSend.append('existingMedia', JSON.stringify(existingMedia));
      }

      // Add new files
      newFiles.forEach((fileItem) => {
        formDataToSend.append('files', fileItem.file);
      });

      // Send request with FormData (Content-Type will be set automatically by axios)
      if (content) {
        await api.put(`/content/${content._id}`, formDataToSend);
      } else {
        await api.post('/content', formDataToSend);
      }

      // Clean up preview URLs
      newFiles.forEach((fileItem) => {
        if (fileItem.preview && fileItem.preview.startsWith('blob:')) {
          URL.revokeObjectURL(fileItem.preview);
        }
      });

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to save. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-modal">
      <div className="form-container">
        <div className="form-header">
          <h2>{content ? 'Edit' : 'Create'} {type === 'EVENT' ? 'Event' : type === 'ACHIEVEMENT' ? 'Achievement' : 'Work Done'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="content-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title <span className="required-asterisk">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="required-asterisk">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Enter description"
            />
          </div>

          {type === 'EVENT' && (
            <>
              <div className="form-group">
                <label htmlFor="startDate">Start Date <span className="required-asterisk">*</span></label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date <span className="required-asterisk">*</span></label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span style={{ marginLeft: '0.5rem' }}>Active (Visible on public website)</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="media">Image Files</label>
            <input
              type="file"
              id="media"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
            <p className="file-hint">Only image files are allowed (JPEG, PNG, GIF, WebP, etc.)</p>
          </div>

          {(existingMedia.length > 0 || newFiles.length > 0) && (
            <div className="media-preview">
              <label>Media Preview:</label>
              <div className="media-grid">
                {/* Existing media from DB */}
                {existingMedia.map((item, index) => {
                  const imageUrl = getImageUrl(item.url);
                  return (
                    <div key={`existing-${index}`} className="media-item">
                      {item.type === 'image' ? (
                        <img src={imageUrl} alt={`Media ${index + 1}`} />
                      ) : (
                        <video src={imageUrl} muted />
                      )}
                      <button
                        type="button"
                        className="remove-media-btn"
                        onClick={() => removeExistingMedia(index)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                {/* New files selected (only images allowed) */}
                {newFiles.map((fileItem, index) => (
                  <div key={`new-${index}`} className="media-item">
                    {fileItem.preview ? (
                      <img src={fileItem.preview} alt={`New ${index + 1}`} />
                    ) : (
                      <div className="file-placeholder">Processing...</div>
                    )}
                    <button
                      type="button"
                      className="remove-media-btn"
                      onClick={() => removeNewFile(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : content ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm;

