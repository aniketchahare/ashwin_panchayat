import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUrl';
import './ImageCarousel.css';

// Default placeholder image (SVG data URL)
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [fade, setFade] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 150);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [autoPlay, images]);

  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div className="carousel-image-container">
          <img src={DEFAULT_IMAGE} alt={title || 'No image'} className="carousel-image" />
        </div>
      </div>
    );
  }

  const changeSlide = (newIndex) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(true);
    }, 150);
    setAutoPlay(false);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    changeSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    changeSlide(newIndex);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      changeSlide(index);
    }
  };

  const currentImage = images[currentIndex];
  const imageUrl = currentImage?.url ? getImageUrl(currentImage.url) : DEFAULT_IMAGE;

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <div className="carousel-image-container">
          <img 
            src={imageUrl} 
            alt={title || `Image ${currentIndex + 1}`} 
            className={`carousel-image ${fade ? 'fade-in' : 'fade-out'}`}
          />
          {images.length > 1 && (
            <>
              <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious}>
                ‹
              </button>
              <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
                ›
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;

