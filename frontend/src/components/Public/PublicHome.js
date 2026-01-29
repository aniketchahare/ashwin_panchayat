import React, { useState, useEffect } from 'react';
import Header from './Header';
import SectionCarousel from './SectionCarousel';
import publicApi from '../../config/publicApi';
import './PublicHome.css';

const PublicHome = () => {
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [workDone, setWorkDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsRes, achievementsRes, workRes] = await Promise.all([
        publicApi.get('/content?type=EVENT'),
        publicApi.get('/content?type=ACHIEVEMENT'),
        publicApi.get('/content?type=WORK'),
      ]);

      setEvents(eventsRes.data);
      setAchievements(achievementsRes.data);
      setWorkDone(workRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-home">
      <Header />
      <div className="container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchAllContent} className="retry-btn">
              Retry
            </button>
          </div>
        ) : (
          <div className="sections-vertical">
            <SectionCarousel
              title="Upcoming Events"
              content={events}
              type="EVENT"
            />
            <SectionCarousel
              title="Achievements"
              content={achievements}
              type="ACHIEVEMENT"
            />
            <SectionCarousel
              title="Work Done"
              content={workDone}
              type="WORK"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHome;

