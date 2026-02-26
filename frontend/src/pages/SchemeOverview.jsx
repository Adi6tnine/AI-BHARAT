import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { getSchemeData } from '../utils/api';
import { Languages, Search, User, Mic, ChevronRight, Lock } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './SchemeOverview.css';

const TRANSLATIONS = {
  en: {
    explore: "Explore Schemes",
    welcome: "Welcome back, User",
    search: "Search for schemes, subsidies, or services...",
    categories: ["All", "Agriculture", "Education", "Women", "Health"],
    benefit: "Benefit",
    comingSoon: "Coming Soon",
    mvpFocus: "MVP focuses on PM Kisan"
  },
  hi: {
    explore: "योजनाएं देखें",
    welcome: "वापस स्वागत है, उपयोगकर्ता",
    search: "योजनाओं, सब्सिडी या सेवाओं की खोज करें...",
    categories: ["सभी", "कृषि", "शिक्षा", "महिला", "स्वास्थ्य"],
    benefit: "लाभ",
    comingSoon: "जल्द आ रहा है",
    mvpFocus: "MVP PM किसान पर केंद्रित है"
  },
  kn: {
    explore: "ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    welcome: "ಮರಳಿ ಸ್ವಾಗತ, ಬಳಕೆದಾರ",
    search: "ಯೋಜನೆಗಳು, ಸಬ್ಸಿಡಿಗಳು ಅಥವಾ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ...",
    categories: ["ಎಲ್ಲಾ", "ಕೃಷಿ", "ಶಿಕ್ಷಣ", "ಮಹಿಳೆಯರು", "ಆರೋಗ್ಯ"],
    benefit: "ಲಾಭ",
    comingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ",
    mvpFocus: "MVP PM ಕಿಸಾನ್ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ"
  },
  te: {
    explore: "పథకాలను అన్వేషించండి",
    welcome: "తిరిగి స్వాగతం, వినియోగదారు",
    search: "పథకాలు, సబ్సిడీలు లేదా సేవల కోసం శోధించండి...",
    categories: ["అన్నీ", "వ్యవసాయం", "విద్య", "మహిళలు", "ఆరోగ్యం"],
    benefit: "ప్రయోజనం",
    comingSoon: "త్వరలో వస్తోంది",
    mvpFocus: "MVP PM కిసాన్‌పై దృష్టి పెడుతుంది"
  },
  ta: {
    explore: "திட்டங்களை ஆராயுங்கள்",
    welcome: "மீண்டும் வரவேற்கிறோம், பயனர்",
    search: "திட்டங்கள், மானியங்கள் அல்லது சேவைகளைத் தேடுங்கள்...",
    categories: ["அனைத்தும்", "விவசாயம்", "கல்வி", "பெண்கள்", "சுகாதாரம்"],
    benefit: "நன்மை",
    comingSoon: "விரைவில் வருகிறது",
    mvpFocus: "MVP PM கிசானில் கவனம் செலுத்துகிறது"
  },
  mr: {
    explore: "योजना पहा",
    welcome: "परत स्वागत आहे, वापरकर्ता",
    search: "योजना, अनुदान किंवा सेवा शोधा...",
    categories: ["सर्व", "शेती", "शिक्षण", "महिला", "आरोग्य"],
    benefit: "लाभ",
    comingSoon: "लवकरच येत आहे",
    mvpFocus: "MVP PM किसानवर लक्ष केंद्रित करते"
  }
};

const MOCK_SCHEMES = [
  { id: 1, title: "PM Kisan Samman Nidhi", category: "Agriculture", benefit: "₹6,000/year", icon: "🌾", available: true },
  { id: 2, title: "Ayushman Bharat", category: "Healthcare", benefit: "₹5 Lakh cover", icon: "🏥", available: false },
  { id: 3, title: "Pradhan Mantri Awas Yojana", category: "Housing", benefit: "Home subsidy", icon: "🏠", available: false },
  { id: 4, title: "Skill India Mission", category: "Education", benefit: "Free training", icon: "🎓", available: false },
];

function SchemeOverview() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [schemeData, setSchemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    loadSchemeData();
  }, [language]);

  const loadSchemeData = async () => {
    setLoading(true);
    const data = await getSchemeData('pm-kisan', language);
    if (data) {
      setSchemeData(data);
    }
    setLoading(false);
  };

  const handleSchemeClick = (scheme) => {
    if (scheme.available && scheme.id === 1) {
      navigate('/form');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-modern">
      {/* Fixed Background */}
      <div className="fixed-bg"></div>

      {/* Main Content */}
      <div className="dashboard-content animate-fade-in">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">{t.explore}</h2>
            <p className="dashboard-subtitle">{t.welcome}</p>
          </div>
          <div className="dashboard-actions">
            <button onClick={handleBack} className="icon-button">
              <Languages size={20} />
            </button>
            <div className="user-avatar">
              <User size={24} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-icon">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder={t.search}
            className="search-input"
          />
          <button className="mic-button">
            <Mic size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="categories-scroll no-scrollbar">
          {t.categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(i)}
              className={`category-pill ${i === selectedCategory ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="schemes-grid">
          {MOCK_SCHEMES.map((scheme, index) => (
            <div
              key={scheme.id}
              className={`scheme-card-modern ${!scheme.available ? 'locked' : ''}`}
              onClick={() => handleSchemeClick(scheme)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {!scheme.available && (
                <div className="coming-soon-badge">
                  <Lock size={12} />
                  <span>{t.comingSoon}</span>
                </div>
              )}
              <div className="scheme-icon-container">
                <span className="scheme-icon">{scheme.icon}</span>
                {!scheme.available && <div className="lock-overlay"><Lock size={20} /></div>}
              </div>
              <div className="scheme-content">
                <span className="scheme-category">{scheme.category}</span>
                <h4 className="scheme-title">{scheme.title}</h4>
                <div className="scheme-benefit">
                  <span className="benefit-label">{t.benefit}</span>
                  <span className="benefit-value">{scheme.benefit}</span>
                </div>
                {!scheme.available && (
                  <p className="mvp-note">{t.mvpFocus}</p>
                )}
              </div>
              <div className="scheme-arrow">
                {scheme.available ? <ChevronRight size={20} /> : <Lock size={20} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav language={language} />
    </div>
  );
}

export default SchemeOverview;
