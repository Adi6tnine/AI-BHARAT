import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../App';
import { Globe, ChevronRight } from 'lucide-react';
import './LanguageSelector.css';

const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' }
];

function LanguageSelector() {
  const navigate = useNavigate();
  const { setLanguage } = useContext(LanguageContext);

  const handleLanguageSelect = (langId) => {
    setLanguage(langId);
    navigate('/scheme');
  };

  return (
    <div className="language-selector-modern">
      {/* Fixed Background */}
      <div className="fixed-bg"></div>
      
      {/* Main Content */}
      <div className="language-content-modern animate-fade-in">
        <div className="language-card-container">
          {/* Logo/Emblem */}
          <div className="emblem-container">
            <div className="emblem-main">
              <div className="emblem-icon">
                <Globe size={40} />
              </div>
            </div>
            <div className="emblem-badge">
              <span>GOV</span>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="welcome-title">नमस्ते! Welcome!</h1>
          <p className="welcome-subtitle">
            Your gateway to government welfare schemes
          </p>

          {/* Divider */}
          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">CHOOSE YOUR LANGUAGE</span>
            <div className="divider-line"></div>
          </div>

          {/* Language Grid */}
          <div className="language-grid-modern">
            {LANGUAGES.map((lang, index) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.id)}
                className="language-card-modern"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="language-card-header">
                  <span className="language-code">{lang.id.toUpperCase()}</span>
                  <div className="language-arrow">
                    <ChevronRight size={18} />
                  </div>
                </div>
                <h3 className="language-native">{lang.native}</h3>
                <p className="language-name">{lang.name}</p>
              </button>
            ))}
          </div>

          {/* Footer */}
          <footer className="language-footer">
            <div className="footer-powered">
              <span className="status-dot"></span>
              Powered by <span className="footer-highlight">AWS | AI for Bharat</span>
            </div>
            <p className="footer-tagline">SAFE • SECURE • SCALABLE</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;
