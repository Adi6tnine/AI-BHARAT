import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { Sparkles } from 'lucide-react';
import './LoadingScreen.css';

const TRANSLATIONS = {
  en: {
    checking: "Checking your eligibility...",
    step1: "Analyzing land ownership",
    step2: "Verifying farmer category",
    step3: "Generating personalized guidance",
    subtext: "AI is preparing a personalized explanation for you"
  },
  hi: {
    checking: "आपकी पात्रता जाँची जा रही है...",
    step1: "भूमि स्वामित्व का विश्लेषण",
    step2: "किसान श्रेणी सत्यापित कर रहे हैं",
    step3: "व्यक्तिगत मार्गदर्शन तैयार कर रहे हैं",
    subtext: "AI आपके लिए व्यक्तिगत स्पष्टीकरण तैयार कर रहा है"
  },
  kn: {
    checking: "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    step1: "ಭೂಮಿ ಮಾಲೀಕತ್ವವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ",
    step2: "ರೈತ ವರ್ಗವನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ",
    step3: "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ",
    subtext: "AI ನಿಮ್ಮ ಫಲಿತಾಂಶಗಳನ್ನು ತಯಾರಿಸುತ್ತಿದೆ"
  },
  te: {
    checking: "మీ అర్హతను తనిఖీ చేస్తున్నాము...",
    step1: "భూమి యాజమాన్యాన్ని విశ్లేషిస్తోంది",
    step2: "రైతు వర్గాన్ని ధృవీకరిస్తోంది",
    step3: "వ్యక్తిగత మార్గదర్శకత్వాన్ని రూపొందిస్తోంది",
    subtext: "AI మీ ఫలితాలను సిద్ధం చేస్తోంది"
  },
  ta: {
    checking: "உங்கள் தகுதியை சரிபார்க்கிறது...",
    step1: "நில உரிமையை பகுப்பாய்வு செய்கிறது",
    step2: "விவசாயி வகையை சரிபார்க்கிறது",
    step3: "தனிப்பயன் வழிகாட்டுதலை உருவாக்குகிறது",
    subtext: "AI உங்கள் முடிவுகளை தயாரிக்கிறது"
  },
  mr: {
    checking: "तुमची पात्रता तपासत आहे...",
    step1: "जमीन मालकीचे विश्लेषण करत आहे",
    step2: "शेतकरी श्रेणी सत्यापित करत आहे",
    step3: "वैयक्तिक मार्गदर्शन तयार करत आहे",
    subtext: "AI तुमचे परिणाम तयार करत आहे"
  }
};

function LoadingScreen() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [step, setStep] = useState(1);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 800);
    const timer2 = setTimeout(() => setStep(3), 1600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const checkForResult = setInterval(() => {
      const result = sessionStorage.getItem('eligibilityResult');
      if (result) {
        clearInterval(checkForResult);
        navigate('/results');
      }
    }, 500);

    return () => clearInterval(checkForResult);
  }, [navigate]);

  return (
    <div className="loading-screen-modern">
      <div className="loading-content-modern">
        {/* Animated Icon */}
        <div className="loading-icon-modern">
          <div className="wheat-circle">
            <span className="wheat-emoji">🌾</span>
          </div>
          <div className="loading-ring"></div>
        </div>

        {/* Title */}
        <h2 className="loading-title-modern">{t.checking}</h2>

        {/* Steps Checklist */}
        <div className="loading-checklist">
          <div className={`checklist-item ${step >= 1 ? 'active' : ''}`}>
            <div className="checklist-icon">
              {step >= 2 ? '✓' : <div className="mini-spinner"></div>}
            </div>
            <span>{t.step1}</span>
          </div>
          
          <div className={`checklist-item ${step >= 2 ? 'active' : ''}`}>
            <div className="checklist-icon">
              {step >= 3 ? '✓' : step >= 2 ? <div className="mini-spinner"></div> : '○'}
            </div>
            <span>{t.step2}</span>
          </div>
          
          <div className={`checklist-item ${step >= 3 ? 'active' : ''}`}>
            <div className="checklist-icon">
              {step >= 3 ? <div className="mini-spinner"></div> : '○'}
            </div>
            <span>{t.step3}</span>
          </div>
        </div>

        {/* Subtext */}
        <p className="loading-subtext">
          <Sparkles size={14} />
          {t.subtext}
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
