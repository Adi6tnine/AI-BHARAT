import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { checkEligibility } from '../utils/api';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, XCircle, Info, ArrowRight } from 'lucide-react';
import './EligibilityForm.css';

const TRANSLATIONS = {
  en: {
    title: "Check Eligibility",
    fastPromise: "Takes less than 30 seconds",
    aiTip: "SahayakAI explains government rules in simple language. We don't decide eligibility.",
    continue: "Continue",
    landOwnership: "Do you own agricultural land?",
    yes: "Yes",
    no: "No",
    landSize: "Land size (hectares)",
    landHelper: "1 acre = 0.40 hectares",
    farmerCategory: "Your farmer category",
    categoryMarginal: "Marginal Farmer (up to 1 hectare)",
    categorySmall: "Small Farmer (up to 2 hectares)",
    categoryOther: "Other / Not sure",
    govEmployee: "Are you or your spouse a government employee?",
    incomeTax: "Did you or your spouse pay income tax last year?",
    institutional: "Is your land owned by an institution?",
    institutionalInfo: "(e.g., owned by a company, trust, or NGO)",
    fillAll: "Please complete all fields"
  },
  hi: {
    title: "पात्रता जांचें",
    fastPromise: "30 सेकंड से कम समय लगता है",
    aiTip: "SahayakAI सरकारी नियमों को सरल भाषा में समझाता है। हम पात्रता तय नहीं करते।",
    continue: "जारी रखें",
    landOwnership: "क्या आपके पास कृषि भूमि है?",
    yes: "हाँ",
    no: "नहीं",
    landSize: "भूमि का क्षेत्रफल (हेक्टेयर)",
    landHelper: "1 एकड़ = 0.40 हेक्टेयर",
    farmerCategory: "आपकी किसान श्रेणी",
    categoryMarginal: "सीमांत किसान (1 हेक्टेयर तक)",
    categorySmall: "छोटे किसान (2 हेक्टेयर तक)",
    categoryOther: "अन्य / निश्चित नहीं",
    govEmployee: "क्या आप या आपके पति/पत्नी सरकारी कर्मचारी हैं?",
    incomeTax: "क्या आपने या आपके पति/पत्नी ने पिछले वर्ष आयकर भरा?",
    institutional: "क्या आपकी ज़मीन किसी संस्था की है?",
    institutionalInfo: "(जैसे कंपनी, ट्रस्ट या एनजीओ के स्वामित्व में)",
    fillAll: "कृपया सभी फ़ील्ड पूरे करें"
  },
  kn: {
    title: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
    fastPromise: "30 ಸೆಕೆಂಡುಗಳಿಗಿಂತ ಕಡಿಮೆ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ",
    aiTip: "ನಿಖರವಾದ ವಿವರಗಳನ್ನು ನೀಡಿ. ನಾವು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    continue: "ಮುಂದುವರಿಸಿ",
    landOwnership: "ನಿಮ್ಮ ಬಳಿ ಕೃಷಿ ಭೂಮಿ ಇದೆಯೇ?",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    landSize: "ಭೂಮಿ ಗಾತ್ರ (ಹೆಕ್ಟೇರ್)",
    landHelper: "1 ಎಕರೆ = 0.40 ಹೆಕ್ಟೇರ್",
    farmerCategory: "ನಿಮ್ಮ ರೈತ ವರ್ಗ",
    categoryMarginal: "ಸೀಮಾಂತ ರೈತ (1 ಹೆಕ್ಟೇರ್ ವರೆಗೆ)",
    categorySmall: "ಸಣ್ಣ ರೈತ (2 ಹೆಕ್ಟೇರ್ ವರೆಗೆ)",
    categoryOther: "ಇತರೆ / ಖಚಿತವಿಲ್ಲ",
    govEmployee: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಸರ್ಕಾರಿ ನೌಕರರೇ?",
    incomeTax: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಕಳೆದ ವರ್ಷ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿಸಿದ್ದೀರಾ?",
    institutional: "ನಿಮ್ಮ ಭೂಮಿ ಸಂಸ್ಥೆಯ ಮಾಲೀಕತ್ವದಲ್ಲಿದೆಯೇ?",
    institutionalInfo: "(ಉದಾ: ಕಂಪನಿ, ಟ್ರಸ್ಟ್ ಅಥವಾ ಎನ್‌ಜಿಒ ಮಾಲೀಕತ್ವ)",
    fillAll: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ"
  },
  te: {
    title: "అర్హత తనిఖీ చేయండి",
    fastPromise: "30 సెకన్ల కంటే తక్కువ సమయం పడుతుంది",
    aiTip: "ఖచ్చితమైన వివరాలు ఇవ్వండి. మేము మీ సమాచారాన్ని నిల్వ చేయము.",
    continue: "కొనసాగించు",
    landOwnership: "మీకు వ్యవసాయ భూమి ఉందా?",
    yes: "అవును",
    no: "లేదు",
    landSize: "భూమి పరిమాణం (హెక్టార్లు)",
    landHelper: "1 ఎకరం = 0.40 హెక్టార్లు",
    farmerCategory: "మీ రైతు వర్గం",
    categoryMarginal: "సరిహద్దు రైతు (1 హెక్టార్ వరకు)",
    categorySmall: "చిన్న రైతు (2 హెక్టార్ల వరకు)",
    categoryOther: "ఇతర / ఖచ్చితంగా తెలియదు",
    govEmployee: "మీరు లేదా మీ జీవిత భాగస్వామి ప్రభుత్వ ఉద్యోగి కారా?",
    incomeTax: "మీరు లేదా మీ జీవిత భాగస్వామి గత సంవత్సరం ఆదాయపు పన్ను చెల్లించారా?",
    institutional: "మీ భూమి సంస్థ యాజమాన్యంలో ఉందా?",
    institutionalInfo: "(ఉదా: కంపెనీ, ట్రస్ట్ లేదా ఎన్జిఓ యాజమాన్యం)",
    fillAll: "దయచేసి అన్ని ఫీల్డ్‌లను పూర్తి చేయండి"
  },
  ta: {
    title: "தகுதியை சரிபார்க்கவும்",
    fastPromise: "30 விநாடிகளுக்கும் குறைவான நேரம் எடுக்கும்",
    aiTip: "துல்லியமான விவரங்களை வழங்கவும். நாங்கள் உங்கள் தகவலை சேமிப்பதில்லை.",
    continue: "தொடரவும்",
    landOwnership: "உங்களிடம் விவசாய நிலம் உள்ளதா?",
    yes: "ஆம்",
    no: "இல்லை",
    landSize: "நில அளவு (ஹெக்டேர்)",
    landHelper: "1 ஏக்கர் = 0.40 ஹெக்டேர்",
    farmerCategory: "உங்கள் விவசாயி வகை",
    categoryMarginal: "குறு விவசாயி (1 ஹெக்டேர் வரை)",
    categorySmall: "சிறு விவசாயி (2 ஹெக்டேர் வரை)",
    categoryOther: "மற்றவை / உறுதியாக தெரியவில்லை",
    govEmployee: "நீங்கள் அல்லது உங்கள் வாழ்க்கைத் துணை அரசு ஊழியரா?",
    incomeTax: "நீங்கள் அல்லது உங்கள் வாழ்க்கைத் துணை கடந்த ஆண்டு வருமான வரி செலுத்தினீர்களா?",
    institutional: "உங்கள் நிலம் நிறுவன உரிமையில் உள்ளதா?",
    institutionalInfo: "(எ.கா: நிறுவனம், அறக்கட்டளை அல்லது என்ஜிஓ உரிமை)",
    fillAll: "தயவுசெய்து அனைத்து புலங்களையும் பூர்த்தி செய்யவும்"
  },
  mr: {
    title: "पात्रता तपासा",
    fastPromise: "30 सेकंदांपेक्षा कमी वेळ लागतो",
    aiTip: "अचूक तपशील द्या. आम्ही तुमची माहिती संग्रहित करत नाही.",
    continue: "सुरू ठेवा",
    landOwnership: "तुमच्याकडे शेती जमीन आहे का?",
    yes: "होय",
    no: "नाही",
    landSize: "जमिनीचे क्षेत्रफळ (हेक्टर)",
    landHelper: "1 एकर = 0.40 हेक्टर",
    farmerCategory: "तुमची शेतकरी श्रेणी",
    categoryMarginal: "सीमांत शेतकरी (1 हेक्टरपर्यंत)",
    categorySmall: "लहान शेतकरी (2 हेक्टरपर्यंत)",
    categoryOther: "इतर / खात्री नाही",
    govEmployee: "तुम्ही किंवा तुमचा जोडीदार सरकारी कर्मचारी आहात का?",
    incomeTax: "तुम्ही किंवा तुमच्या जोडीदाराने गेल्या वर्षी आयकर भरला होता का?",
    institutional: "तुमची जमीन संस्थेच्या मालकीची आहे का?",
    institutionalInfo: "(उदा: कंपनी, ट्रस्ट किंवा एनजीओ मालकी)",
    fillAll: "कृपया सर्व फील्ड पूर्ण करा"
  }
};

const SelectionCard = ({ label, isSelected, onClick, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`selection-card ${isSelected ? 'selected' : ''}`}
  >
    {Icon && <Icon size={24} className="selection-icon" />}
    <span className="selection-label">{label}</span>
  </button>
);

function EligibilityForm() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  
  const [formData, setFormData] = useState({
    hasLand: null,
    landSizeHectares: '',
    farmerCategory: '',
    isGovtEmployee: null,
    isTaxPayer: null,
    isInstitutionalHolder: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    let filled = 0;
    let total = 5;
    
    if (formData.hasLand !== null) filled++;
    if (formData.hasLand && formData.landSizeHectares) filled++;
    if (formData.farmerCategory) filled++;
    if (formData.isGovtEmployee !== null) filled++;
    if (formData.isTaxPayer !== null) filled++;
    if (formData.isInstitutionalHolder !== null) filled++;
    
    setProgress(Math.round((filled / total) * 100));
  }, [formData]);

  const isFormValid = () => {
    if (formData.hasLand === null) return false;
    if (formData.hasLand && (!formData.landSizeHectares || formData.landSizeHectares <= 0)) return false;
    if (!formData.farmerCategory) return false;
    if (formData.isGovtEmployee === null) return false;
    if (formData.isTaxPayer === null) return false;
    if (formData.isInstitutionalHolder === null) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert(t.fillAll);
      return;
    }

    setIsSubmitting(true);

    const userInputs = {
      hasLand: formData.hasLand,
      farmerCategory: formData.farmerCategory,
      isGovtEmployee: formData.isGovtEmployee,
      isTaxPayer: formData.isTaxPayer,
      isInstitutionalHolder: formData.isInstitutionalHolder
    };

    if (formData.hasLand) {
      userInputs.landSizeHectares = parseFloat(formData.landSizeHectares);
    }

    navigate('/loading');

    const result = await checkEligibility(userInputs, language);
    
    if (result) {
      sessionStorage.setItem('eligibilityResult', JSON.stringify(result));
      navigate('/results');
    } else {
      alert('Failed to check eligibility. Please try again.');
      navigate('/form');
    }
  };

  const handleBack = () => {
    navigate('/scheme');
  };

  return (
    <div className="eligibility-form-modern animate-fade-in">
      <div className="form-container-modern">
        {/* Header */}
        <header className="form-header-modern">
          <button onClick={handleBack} className="back-button-modern">
            <ArrowLeft size={24} />
          </button>
          <div className="header-center-modern">
            <div className="header-brand">
              <Sparkles size={18} />
              <span>SahayakAI</span>
            </div>
            <span className="header-subtitle">{t.fastPromise}</span>
          </div>
          <div className="language-badge-modern">
            {language.toUpperCase()}
          </div>
        </header>

        {/* Progress Bar */}
        <div className="progress-bar-modern">
          <div 
            className="progress-fill-modern" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* AI Tip */}
        <div className="ai-tip-modern">
          <div className="ai-tip-icon">
            <ShieldCheck size={18} />
          </div>
          <p className="ai-tip-text">
            <span className="font-bold">AI Tip:</span> {t.aiTip}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-questions">
          {/* Question 1: Land Ownership */}
          <section className="question-section">
            <h3 className="question-title">{t.landOwnership}</h3>
            <div className="selection-grid">
              <SelectionCard
                label={t.yes}
                isSelected={formData.hasLand === true}
                onClick={() => setFormData({...formData, hasLand: true})}
                icon={CheckCircle2}
              />
              <SelectionCard
                label={t.no}
                isSelected={formData.hasLand === false}
                onClick={() => setFormData({...formData, hasLand: false})}
                icon={XCircle}
              />
            </div>
          </section>

          {/* Question 2: Land Size (conditional) */}
          {formData.hasLand && (
            <section className="question-section animate-slide-up">
              <h3 className="question-title">{t.landSize}</h3>
              <input
                type="number"
                className="land-input-modern"
                value={formData.landSizeHectares}
                onChange={(e) => setFormData({...formData, landSizeHectares: e.target.value})}
                min="0.1"
                step="0.1"
                placeholder="0.0"
              />
              <p className="input-helper">{t.landHelper}</p>
            </section>
          )}

          {/* Question 3: Farmer Category */}
          {formData.hasLand && (
            <section className="question-section animate-slide-up">
              <h3 className="question-title">{t.farmerCategory}</h3>
              <div className="category-grid">
                {[
                  { id: 'marginal', label: t.categoryMarginal },
                  { id: 'small', label: t.categorySmall },
                  { id: 'all', label: t.categoryOther }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, farmerCategory: cat.id})}
                    className={`category-button ${formData.farmerCategory === cat.id ? 'selected' : ''}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Question 4: Government Employee */}
          <section className="question-section">
            <h3 className="question-title">{t.govEmployee}</h3>
            <div className="selection-grid">
              <SelectionCard
                label={t.yes}
                isSelected={formData.isGovtEmployee === true}
                onClick={() => setFormData({...formData, isGovtEmployee: true})}
              />
              <SelectionCard
                label={t.no}
                isSelected={formData.isGovtEmployee === false}
                onClick={() => setFormData({...formData, isGovtEmployee: false})}
              />
            </div>
          </section>

          {/* Question 5: Income Tax */}
          <section className="question-section">
            <h3 className="question-title">{t.incomeTax}</h3>
            <div className="selection-grid">
              <SelectionCard
                label={t.yes}
                isSelected={formData.isTaxPayer === true}
                onClick={() => setFormData({...formData, isTaxPayer: true})}
              />
              <SelectionCard
                label={t.no}
                isSelected={formData.isTaxPayer === false}
                onClick={() => setFormData({...formData, isTaxPayer: false})}
              />
            </div>
          </section>

          {/* Question 6: Institutional Land */}
          <section className="question-section">
            <div className="question-title-with-info">
              <h3 className="question-title">{t.institutional}</h3>
              <Info size={18} className="info-icon-modern" />
            </div>
            <p className="question-subtitle">{t.institutionalInfo}</p>
            <div className="selection-grid">
              <SelectionCard
                label={t.yes}
                isSelected={formData.isInstitutionalHolder === true}
                onClick={() => setFormData({...formData, isInstitutionalHolder: true})}
              />
              <SelectionCard
                label={t.no}
                isSelected={formData.isInstitutionalHolder === false}
                onClick={() => setFormData({...formData, isInstitutionalHolder: false})}
              />
            </div>
          </section>

          {/* Submit Button */}
          <footer className="form-footer-modern">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`submit-button-modern ${isFormValid() ? 'enabled' : 'disabled'}`}
            >
              {t.continue}
              <ArrowRight size={24} />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default EligibilityForm;
