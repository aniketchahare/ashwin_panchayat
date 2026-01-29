import React, { useState, useRef, useEffect } from 'react';
import ContentCard from './ContentCard';
import './SectionCarousel.css';

const SectionCarousel = ({ title, content, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const autoPlayIntervalRef = useRef(null);

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [content, currentIndex]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!content || content.length <= 1 || isHovered) {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      return;
    }

    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % content.length;
        // Use setTimeout to ensure state update happens before scroll
        setTimeout(() => {
          scrollToIndex(nextIndex);
        }, 0);
        return nextIndex;
      });
    }, 5000); // Auto-rotate every 5 seconds

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [content, isHovered, content.length]);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container || !cardRefs.current[index]) return;

    const card = cardRefs.current[index];
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (containerRect.width / 2) + (cardRect.width / 2);

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  const scrollNext = () => {
    if (currentIndex < content.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollToIndex(nextIndex);
      setCurrentIndex(nextIndex);
    } else {
      // Loop back to first item
      scrollToIndex(0);
      setCurrentIndex(0);
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollToIndex(prevIndex);
      setCurrentIndex(prevIndex);
    } else {
      // Loop to last item
      const lastIndex = content.length - 1;
      scrollToIndex(lastIndex);
      setCurrentIndex(lastIndex);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = cardRefs.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex && closestIndex >= 0 && closestIndex < content.length) {
      setCurrentIndex(closestIndex);
    }
    updateScrollButtons();
  };

  if (!content || content.length === 0) {
    return (
      <div className={`section-carousel-container ${type?.toLowerCase()}-section`}>
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <div className="section-count">0 items</div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No {title.toLowerCase()} available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`section-carousel-container ${type?.toLowerCase()}-section`}>
      <div className="section-header">
        <div className="section-title-wrapper">
          <h2 className="section-title">{title}</h2>
          {content.length > 0 && (
            <span className="section-total-count">({content.length} {content.length === 1 ? 'item' : 'items'})</span>
          )}
        </div>
        <div className="section-count">
          {content.length > 1 ? `${currentIndex + 1} / ${content.length}` : '1 item'}
        </div>
      </div>

      <div 
        className="carousel-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content.length > 1 && (
          <>
            <button
              className={`carousel-nav-btn carousel-nav-left ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={scrollPrev}
              aria-label="Previous"
              disabled={!canScrollLeft}
            >
              ‹
            </button>

            <div
              className="carousel-scroll-container"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              <div className="carousel-content">
                {content.map((item, index) => (
                  <div
                    key={item._id}
                    ref={(el) => (cardRefs.current[index] = el)}
                    className="carousel-card-wrapper"
                  >
                    <ContentCard item={item} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`carousel-nav-btn carousel-nav-right ${!canScrollRight ? 'disabled' : ''}`}
              onClick={scrollNext}
              aria-label="Next"
              disabled={!canScrollRight}
            >
              ›
            </button>
          </>
        )}
        {content.length === 1 && (
          <div
            className="carousel-scroll-container"
            ref={scrollContainerRef}
          >
            <div className="carousel-content">
              <div
                ref={(el) => (cardRefs.current[0] = el)}
                className="carousel-card-wrapper"
              >
                <ContentCard item={content[0]} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dots indicator */}
      {content.length > 1 && (
        <div className="carousel-dots">
          {content.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionCarousel;

