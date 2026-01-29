import React from 'react';
import './ContentList.css';

const ContentList = ({ contents, onEdit, onDelete }) => {
  if (contents.length === 0) {
    return (
      <div className="empty-list">
        <p>No items yet. Click "Create New" to add your first item.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isEventExpired = (content) => {
    if (content.type !== 'EVENT' || !content.endDate) return false;
    return new Date(content.endDate) < new Date();
  };

  return (
    <div className="content-list">
      {contents.map((content) => (
        <div key={content._id} className={`content-item ${!content.isActive ? 'inactive' : ''}`}>
          <div className="item-content">
            <div className="item-header">
              <h3 className="item-title">{content.title}</h3>
              <div className="status-badges">
                {!content.isActive && (
                  <span className="status-badge inactive-badge">Inactive</span>
                )}
                {content.isActive && (
                  <span className="status-badge active-badge">Active</span>
                )}
                {content.type === 'EVENT' && isEventExpired(content) && (
                  <span className="status-badge expired-badge">Expired</span>
                )}
              </div>
            </div>
            <p className="item-description">
              {content.description.length > 100
                ? `${content.description.substring(0, 100)}...`
                : content.description}
            </p>
            {content.type === 'EVENT' && content.startDate && content.endDate && (
              <div className="event-dates">
                <strong>Event Dates:</strong>{' '}
                {formatDate(content.startDate)} - {formatDate(content.endDate)}
              </div>
            )}
            <div className="item-meta">
              <span className="media-count">
                {content.media?.length || 0} media file(s)
              </span>
              <span className="item-date">
                Created: {new Date(content.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="item-actions">
            <button className="edit-btn" onClick={() => onEdit(content)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => onDelete(content._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;

