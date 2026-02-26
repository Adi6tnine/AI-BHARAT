import React, { useState } from 'react';
import { Home, LayoutGrid, MessageSquare, Bell, User } from 'lucide-react';
import ChatAssistant from './ChatAssistant';
import './BottomNav.css';

function BottomNav({ language }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="bottom-nav">
        <button className="nav-item active">
          <Home size={24} />
          <span className="nav-label">Home</span>
        </button>
        
        <button className="nav-item">
          <LayoutGrid size={24} />
          <span className="nav-label">Categories</span>
        </button>
        
        <div className="nav-fab-container">
          <button 
            className="nav-fab"
            onClick={() => setShowChat(true)}
          >
            <MessageSquare size={28} />
          </button>
        </div>
        
        <button className="nav-item">
          <Bell size={24} />
          <span className="nav-label">Updates</span>
        </button>
        
        <button className="nav-item">
          <User size={24} />
          <span className="nav-label">Profile</span>
        </button>
      </div>

      {showChat && (
        <ChatAssistant 
          language={language} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </>
  );
}

export default BottomNav;
