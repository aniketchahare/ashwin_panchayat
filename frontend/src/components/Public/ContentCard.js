import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUrl';
import './ContentCard.css';

// Default placeholder image (SVG data URL)
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='300'/%3E%3Ctext fill='white' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

const ContentCard = ({ item }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const maxDescriptionLength = 150;

  const hasMultipleImages = item.media && item.media.length > 1;

  // Auto-rotate images at constant interval
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % item.media.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [hasMultipleImages, item.media]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const displayDescription =
    item.description.length > maxDescriptionLength && !showFullDescription
      ? `${item.description.substring(0, maxDescriptionLength)}...`
      : item.description;

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get background image - use first image from media array or default
  const getBackgroundImage = () => {
    if (item.media && item.media.length > 0) {
      const currentImage = item.media[currentImageIndex];
      return currentImage?.url ? getImageUrl(currentImage.url) : DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  };

  return (
    <div 
      className="content-card"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
      }}
    >

      {/* Gradient overlay at bottom */}
      <div className="card-gradient-overlay"></div>

      {/* Content overlay at bottom */}
      <div className="card-content-overlay">
        <h3 className="card-title">{item.title}</h3>
        
        {item.type === 'EVENT' && item.startDate && item.endDate && (
          <div className="event-date-range">
            <span className="date-icon">📅</span>
            <div>
              <strong>Event Dates:</strong>
              <div className="date-range">
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </div>
            </div>
          </div>
        )}
        
        <div className="card-description">
          <p>{displayDescription}</p>
          {item.description.length > maxDescriptionLength && (
            <button className="read-more-btn" onClick={toggleDescription}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        
        <div className="card-footer">
          <div className="card-date">
            <span className="date-icon">📆</span>
            <span>Posted: {new Date(item.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
