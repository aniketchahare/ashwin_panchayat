import React from 'react';
import ContentCard from './ContentCard';
import './ContentSection.css';

const ContentSection = ({ title, content, type }) => {
  const getSectionColor = () => {
    switch (type) {
      case 'EVENT':
        return 'event-section';
      case 'ACHIEVEMENT':
        return 'achievement-section';
      case 'WORK':
        return 'work-section';
      default:
        return '';
    }
  };

  if (!content || content.length === 0) {
    return (
      <div className={`content-section ${getSectionColor()}`}>
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No {title.toLowerCase()} available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`content-section ${getSectionColor()}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-count">{content.length} {content.length === 1 ? 'item' : 'items'}</div>
      </div>
      <div className="content-list">
        {content.map((item) => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ContentSection;

