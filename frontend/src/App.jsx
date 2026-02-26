import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from './pages/LanguageSelector';
import SchemeOverview from './pages/SchemeOverview';
import EligibilityForm from './pages/EligibilityForm';
import LoadingScreen from './pages/LoadingScreen';
import ResultsScreen from './pages/ResultsScreen';

// Language Context
export const LanguageContext = createContext();

function App() {
  const [language, setLanguage] = useState('en');

  // Load language from sessionStorage on init
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to sessionStorage when it changes
  const updateLanguage = (lang) => {
    setLanguage(lang);
    sessionStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      <Router>
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/scheme" element={<SchemeOverview />} />
          <Route path="/form" element={<EligibilityForm />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
