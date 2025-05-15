import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaExpand, FaCompress } from 'react-icons/fa';
import axios from 'axios';
import api from '../utils/api';
import DOMPurify from 'dompurify';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your CRM assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  // Utility to convert **text** to <b>text</b> for bot messages
  function renderBotMessage(text) {
    if (!text) return '';
    // Replace **something** with <b>something</b>
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
        message: userMessage
      });

      setMessages(prev => [...prev, { type: 'bot', text: response.data.data.response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
        aria-label="Toggle chat"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
      </button>

      {/* Chat window */}
      <div className={`fixed bottom-24 right-6 ${isMaximized ? 'w-[90vw] h-[90vh] max-w-5xl' : 'w-96'} bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'} z-50 flex flex-col`} style={{ top: 24, maxHeight: isMaximized ? 'calc(100vh - 48px)' : 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <FaRobot size={24} className="mr-2" />
            <div>
              <h3 className="font-semibold">CRM Assistant</h3>
              <p className="text-sm opacity-90">Ask me anything about our CRM!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMaximized(m => !m)}
              className="hover:bg-orange-600 rounded-full p-1 focus:outline-none"
              title={isMaximized ? 'Minimize' : 'Maximize'}
            >
              {isMaximized ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-600 rounded-full p-1 focus:outline-none"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={`overflow-y-auto p-4 space-y-4 flex-1 ${isMaximized ? 'h-[calc(90vh-120px)]' : ''}`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
              >
                {message.type === 'bot' ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderBotMessage(message.text)) }}
                  />
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                <FaSpinner className="animate-spin text-orange-500" />
                <span className="text-gray-800 dark:text-gray-200">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
