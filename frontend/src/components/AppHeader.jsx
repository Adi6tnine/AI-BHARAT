import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppHeader.css';

function AppHeader({ onBack, language, showLanguageBadge = true }) {
  const navigate = useNavigate();

  const languageBadges = {
    en: 'EN',
    hi: 'हि',
    kn: 'ಕ',
    te: 'తె'
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="app-header">
      <button className="back-button" onClick={handleBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="header-center">
        <span className="wheat-icon">🌾</span>
        <span className="app-name">SahayakAI</span>
      </div>
      
      {showLanguageBadge && (
        <div className="language-badge">
          {languageBadges[language] || 'EN'}
        </div>
      )}
    </header>
  );
}

export default AppHeader;
