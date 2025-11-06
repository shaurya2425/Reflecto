import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bot, User, Clock, Send, Plus } from 'lucide-react';

export function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      content: "Hello! I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef(null);

  const API_BASE = import.meta.env?.VITE_API_BASE || 'http://127.0.0.1:8000';
  const USER_ID = 'user_webapp';

  async function sendToBackend(userId, text, sessionId) {
    const payload = {
      user_id: userId,
      session_id: sessionId,
      message: text
    };

    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let detail = 'Unknown error';
      try {
        const errJson = await res.json();
        detail = errJson?.detail || detail;
      } catch (_) {}
      throw new Error(detail);
    }

    const data = await res.json();
    const answer =
      typeof data?.answer === 'string'
        ? data.answer
        : (data?.answer?.content ?? 'Sorry, I couldn\'t generate a response.');

    return {
      answer,
      crisis: !!data?.crisis,
      num_docs: typeof data?.num_docs === 'number' ? data.num_docs : 0,
    };
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackendReply = async (userMessageText) => {
    try {
      setIsTyping(true);
      const { answer, crisis, num_docs } = await sendToBackend(USER_ID, userMessageText, sessionId);

      const newBotMsg = {
        id: `${Date.now()}-bot`,
        sender: 'bot',
        content: answer,
        timestamp: new Date(),
        type: 'text',
        crisis,
        num_docs
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
      const fallback = {
        id: `${Date.now()}-err`,
        sender: 'bot',
        content: `Sorry, I couldn't process that right now. ${err?.message ? `(${err.message})` : ''}`,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;

    const text = inputMessage.trim();
    const userMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    handleBackendReply(text);
  };

  const handleNewChat = () => {
    setSessionId(`session-${Date.now()}`);
    setMessages([
      {
        id: '1',
        sender: 'bot',
        content: "Hello! I'm here to listen and support you. How are you feeling today?",
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-[calc(100vh-80px)] bg-[#0C1815] flex flex-col w-full overflow-hidden">

      <style>{`
        body { overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(16, 31, 28, 0.5); border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3); border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
      
      <div className="max-w-5xl mx-auto w-full h-full flex flex-col px-4 pt-4 pb-4 overflow-hidden">
        <Card className="bg-[#0D1F1C] glass-card flex flex-col flex-1 overflow-hidden">

          <CardHeader className="border-b border-green-500/20 flex-shrink-0 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">AI Companion</CardTitle>
                <p className="text-xs text-gray-400">Always here to listen</p>
              </div>
            </div>
            <Button
              onClick={handleNewChat}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> New Chat
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-blue-500/20' : 'bg-green-500/20'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  <div className={`rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-green-500/10 border border-green-500/20'
                  }`}>
                    <p className="text-white text-base leading-relaxed">{message.content}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                      {message.sender === 'bot' && message?.crisis && (
                        <span className="ml-2 text-xs text-red-400">• crisis</span>
                      )}
                      {message.sender === 'bot' && typeof message?.num_docs === 'number' && (
                        <span className="ml-2 text-xs text-gray-500">• ctx {message.num_docs}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-6 border-t border-green-500/20 flex-shrink-0">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Share what's on your mind..."
                className="flex-1 glass border border-green-500/30 focus:border-green-400 text-white placeholder-gray-500 rounded-lg p-3 resize-none h-[64px] overflow-y-auto focus:outline-none"
                disabled={isTyping}
              />

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-green-500 hover:bg-green-600 text-white glow-green-hover h-[64px] w-[64px] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

        </Card>
      </div>
    </div>
  );
}
