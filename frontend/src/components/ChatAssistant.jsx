import React, { useState } from 'react';
import { MessageSquare, ArrowLeft, Mic, ArrowRight } from 'lucide-react';
import './ChatAssistant.css';

const TRANSLATIONS = {
  en: {
    title: "AI Sahayak",
    status: "Online | Powered by AI for Bharat",
    welcome: "Namaste! How can I help you discover welfare schemes today? You can type or speak in your native language.",
    placeholder: "Ask anything..."
  },
  hi: {
    title: "AI सहायक",
    status: "ऑनलाइन | AI for Bharat द्वारा संचालित",
    welcome: "नमस्ते! मैं आज आपको कल्याण योजनाओं की खोज में कैसे मदद कर सकता हूं? आप अपनी मातृभाषा में टाइप या बोल सकते हैं।",
    placeholder: "कुछ भी पूछें..."
  },
  kn: {
    title: "AI ಸಹಾಯಕ",
    status: "ಆನ್‌ಲೈನ್ | AI for Bharat ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ",
    welcome: "ನಮಸ್ತೆ! ಇಂದು ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ನೀವು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಬಹುದು ಅಥವಾ ಮಾತನಾಡಬಹುದು।",
    placeholder: "ಏನನ್ನಾದರೂ ಕೇಳಿ..."
  },
  te: {
    title: "AI సహాయకుడు",
    status: "ఆన్‌లైన్ | AI for Bharat ద్వారా శక్తివంతం",
    welcome: "నమస్తే! ఈరోజు సంక్షేమ పథకాలను కనుగొనడంలో నేను మీకు ఎలా సహాయం చేయగలను? మీరు మీ మాతృభాషలో టైప్ చేయవచ్చు లేదా మాట్లాడవచ్చు।",
    placeholder: "ఏదైనా అడగండి..."
  },
  ta: {
    title: "AI உதவியாளர்",
    status: "ஆன்லைன் | AI for Bharat மூலம் இயக்கப்படுகிறது",
    welcome: "நமஸ்தே! இன்று நலத் திட்டங்களைக் கண்டறிய நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் உங்கள் தாய்மொழியில் தட்டச்சு செய்யலாம் அல்லது பேசலாம்।",
    placeholder: "எதையும் கேளுங்கள்..."
  },
  mr: {
    title: "AI सहाय्यक",
    status: "ऑनलाइन | AI for Bharat द्वारे समर्थित",
    welcome: "नमस्ते! आज कल्याण योजना शोधण्यात मी तुम्हाला कशी मदत करू शकतो? तुम्ही तुमच्या मातृभाषेत टाइप करू शकता किंवा बोलू शकता।",
    placeholder: "काहीही विचारा..."
  }
};

function ChatAssistant({ language, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', text: input }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: 'I understand you\'re looking for information. Let me help you with that...' 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="chat-overlay animate-slide-up">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-avatar">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="chat-title">{t.title}</h3>
              <p className="chat-status">{t.status}</p>
            </div>
          </div>
          <button onClick={onClose} className="chat-close">
            <ArrowLeft className="rotate-icon" />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          <div className="message-ai">
            <div className="message-avatar">AI</div>
            <div className="message-bubble">
              <p>{t.welcome}</p>
            </div>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`message-${msg.type}`}>
              {msg.type === 'ai' && <div className="message-avatar">AI</div>}
              <div className="message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              className="chat-input"
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="chat-actions">
              <button className="chat-mic-btn">
                <Mic size={20} />
              </button>
              <button className="chat-send-btn" onClick={handleSend}>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatAssistant;
