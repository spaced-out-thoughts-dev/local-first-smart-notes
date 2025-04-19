import React, { useState, useEffect } from 'react';
import { llmService, ChatMessage, LLMConfig } from '../../api/llm';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [config, setConfig] = useState<LLMConfig>({
    model: 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    temperature: 0.7,
    maxTokens: 512,
    systemPrompt: 'You are a helpful assistant integrated into a local-first note taking app. Help the user organize their thoughts and provide insights when asked.'
  });

  useEffect(() => {
    const initLLM = async () => {
      try {
        const success = await llmService.loadModel(config);
        setIsModelLoaded(success);
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };

    initLLM();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const newMessages = [...messages, userMessage];
      const response = await llmService.chat(newMessages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="model-status">
        {isModelLoaded ? 'Model loaded!' : 'Loading model...'}
      </div>

      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI assistant..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!isModelLoaded || isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={!isModelLoaded || isLoading || !input.trim()}
        >
          Send
        </button>
      </div>

      <div className="model-settings">
        <select 
          value={config.model}
          onChange={(e) => setConfig({...config, model: e.target.value})}
          disabled={isLoading}
        >
          <option value="tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf">TinyLlama 1.1B (Q4)</option>
          <option value="phi-2.Q4_K_M.gguf">Phi-2 (Q4)</option>
        </select>
        
        <label>
          Temperature:
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
            disabled={isLoading}
          />
          {config.temperature}
        </label>
      </div>
    </div>
  );
};

export default ChatInterface;