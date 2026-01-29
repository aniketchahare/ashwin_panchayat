import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentManager from './ContentManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('EVENT');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const sections = [
    { id: 'EVENT', label: 'Manage Events' },
    { id: 'ACHIEVEMENT', label: 'Manage Achievements' },
    { id: 'WORK', label: 'Manage Work Done' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>नगर पंचायत कोरची</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`dashboard-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <ContentManager type={activeSection} />
      </div>
    </div>
  );
};

export default AdminDashboard;

