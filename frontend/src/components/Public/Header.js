import React from 'react';
import './Header.css';

const Header = () => {
  // Logo URL for नगर पंचायत कोरची
  const logoUrl = 'https://image.winudf.com/v2/image1/Y29tLmFwcHluaXR0eS5rb3JjaGlfbnBfaWNvbl8xNTg5MjY3NzU3XzA1MQ/icon.webp?w=140&fakeurl=1&type=.webp';

  return (
    <header className="public-header">
      <div className="header-logo-container">
        <img 
          src={logoUrl} 
          alt="नगर पंचायत कोरची Logo" 
          className="header-logo"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <svg 
          className="header-logo-fallback" 
          width="80" 
          height="80" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'none' }}
        >
          <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.2)" stroke="white" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">नगर</text>
          <text x="50" y="70" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">पंचायत</text>
        </svg>
      </div>
      <div className="header-village-sketch">
        <svg 
          viewBox="0 0 200 150" 
          xmlns="http://www.w3.org/2000/svg"
          className="village-illustration"
        >
          {/* Hills in background */}
          <path d="M0,120 Q50,80 100,100 T200,120 L200,150 L0,150 Z" fill="rgba(34, 139, 34, 0.3)" />
          <path d="M0,130 Q60,90 120,110 T200,130 L200,150 L0,150 Z" fill="rgba(46, 125, 50, 0.25)" />
          
          {/* Trees */}
          <path d="M30,100 L30,80 L25,85 L30,80 L35,85 Z" fill="rgba(34, 139, 34, 0.4)" stroke="rgba(34, 139, 34, 0.6)" strokeWidth="1.5" />
          <circle cx="30" cy="75" r="8" fill="rgba(34, 139, 34, 0.4)" />
          
          <path d="M50,105 L50,85 L45,90 L50,85 L55,90 Z" fill="rgba(34, 139, 34, 0.4)" stroke="rgba(34, 139, 34, 0.6)" strokeWidth="1.5" />
          <circle cx="50" cy="80" r="10" fill="rgba(34, 139, 34, 0.4)" />
          
          <path d="M170,110 L170,90 L165,95 L170,90 L175,95 Z" fill="rgba(34, 139, 34, 0.4)" stroke="rgba(34, 139, 34, 0.6)" strokeWidth="1.5" />
          <circle cx="170" cy="85" r="9" fill="rgba(34, 139, 34, 0.4)" />
          
          {/* Houses */}
          {/* House 1 */}
          <rect x="60" y="100" width="25" height="25" fill="rgba(139, 69, 19, 0.5)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1.5" />
          <polygon points="60,100 72.5,85 85,100" fill="rgba(184, 134, 11, 0.5)" stroke="rgba(184, 134, 11, 0.7)" strokeWidth="1.5" />
          <rect x="67" y="110" width="6" height="8" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1" />
          <rect x="72" y="110" width="6" height="8" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1" />
          
          {/* House 2 */}
          <rect x="95" y="95" width="30" height="30" fill="rgba(139, 69, 19, 0.5)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1.5" />
          <polygon points="95,95 110,78 125,95" fill="rgba(184, 134, 11, 0.5)" stroke="rgba(184, 134, 11, 0.7)" strokeWidth="1.5" />
          <rect x="103" y="108" width="7" height="10" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1" />
          <rect x="113" y="108" width="7" height="10" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1" />
          <circle cx="118" cy="100" r="2" fill="rgba(255, 200, 0, 0.6)" />
          
          {/* House 3 */}
          <rect x="135" y="102" width="22" height="23" fill="rgba(139, 69, 19, 0.5)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1.5" />
          <polygon points="135,102 146,88 157,102" fill="rgba(184, 134, 11, 0.5)" stroke="rgba(184, 134, 11, 0.7)" strokeWidth="1.5" />
          <rect x="141" y="112" width="6" height="8" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(139, 69, 19, 0.7)" strokeWidth="1" />
          
          {/* Sun */}
          <circle cx="175" cy="25" r="12" fill="rgba(255, 215, 0, 0.4)" stroke="rgba(255, 215, 0, 0.6)" strokeWidth="1.5" />
          <path d="M175,10 L175,5 M175,40 L175,45 M160,25 L155,25 M190,25 L195,25 M165,15 L162,12 M185,15 L188,12 M165,35 L162,38 M185,35 L188,38" 
                stroke="rgba(255, 215, 0, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="header-content">
        <h1 className="header-title">नगर पंचायत कोरची</h1>
        <p className="header-quote">स्वच्छ कोरची, सुंदर कोरची</p>
      </div>
    </header>
  );
};

export default Header;

