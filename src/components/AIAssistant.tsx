import React, { useState } from 'react';
import ChatInterface from './LLM/ChatInterface';
import './AIAssistant.css';

interface AIAssistantProps {
  activeNoteContent?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ activeNoteContent }) => {
  // We can use activeNoteContent later to enhance the AI with note context
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`ai-assistant ${isOpen ? 'open' : ''}`}>
      <button 
        className="ai-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? '✕' : '🤖'}
      </button>
      
      {isOpen && (
        <div className="ai-content">
          <h3>AI Assistant</h3>
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default AIAssistant;