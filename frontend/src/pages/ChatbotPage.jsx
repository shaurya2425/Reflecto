import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Clock, FileText, Sparkles } from 'lucide-react';

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
  const [attachEntries, setAttachEntries] = useState(false);
  const [selectedSession, setSelectedSession] = useState('current');
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "I'm feeling anxious",
    "I had a great day",
    "I need some motivation",
    "Help me process my thoughts",
    "I'm struggling with something"
  ];

  const chatSessions = [
    {
      id: 'current',
      title: "Today's Chat",
      lastMessage: "Hello! I'm here to listen and support you.",
      timestamp: new Date(),
      messageCount: 1
    },
    {
      id: '2',
      title: 'Anxiety Discussion',
      lastMessage: "Remember, it's okay to feel anxious sometimes...",
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 12
    },
    {
      id: '3',
      title: 'Goal Setting',
      lastMessage: "Breaking down your goals into smaller steps...",
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 8
    },
    {
      id: '4',
      title: 'Gratitude Practice',
      lastMessage: "What are three things you're grateful for?",
      timestamp: new Date(Date.now() - 259200000),
      messageCount: 15
    }
  ];

  const botResponses = [
    "I understand how you're feeling. It's completely valid to experience these emotions.",
    "Thank you for sharing that with me. Can you tell me more about what's on your mind?",
    "That sounds challenging. How do you typically cope when you feel this way?",
    "I'm here to listen without judgment. Take your time to express what you're feeling.",
    "It's wonderful that you're taking time to reflect. Self-awareness is a powerful tool.",
    "Based on what you've shared, it sounds like you're being really thoughtful about this situation.",
    "Remember, every feeling is temporary. You've overcome difficulties before, and you can do it again.",
    "What would you say to a good friend who was experiencing something similar?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateBotTyping = () => {
    setIsTyping(true);
    const randomDelay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const newMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        content: randomResponse,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, randomDelay);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    simulateBotTyping();
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Companion</h1>
          <p className="text-gray-400">A safe space to share your thoughts and feelings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Chat History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0D1F1C] glass-card h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span>Chat History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSession === session.id
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white text-sm font-medium truncate">{session.title}</h4>
                      <span className="text-xs text-gray-400">{formatRelativeTime(session.timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-2">{session.lastMessage}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
                        {session.messageCount} messages
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-green-500/30 text-green-400 hover:bg-green-500/10"
                  onClick={() => {
                    const newSessionId = Date.now().toString();
                    setSelectedSession(newSessionId);
                    setMessages([{
                      id: '1',
                      sender: 'bot',
                      content: "Hello! I'm here to listen and support you. How are you feeling today?",
                      timestamp: new Date(),
                      type: 'text'
                    }]);
                  }}
                >
                  New Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-[#0D1F1C] glass-card h-full flex flex-col">
              <CardHeader className="border-b border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">AI Companion</CardTitle>
                      <p className="text-xs text-gray-400">Always here to listen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Attach last 3 entries</span>
                      <Switch 
                        checked={attachEntries}
                        onCheckedChange={setAttachEntries}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-blue-500/20' 
                          : 'bg-green-500/20'
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
                        <p className="text-white text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
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

              {/* Quick Replies */}
              {messages.length <= 2 && (
                <div className="px-6 py-2 border-t border-green-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Quick replies:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-sm text-green-400 hover:bg-green-500/20 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-6 border-t border-green-500/20">
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Share what's on your mind..."
                    className="flex-1 glass border-green-500/30 focus:border-green-400 text-white placeholder-gray-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-green-500 hover:bg-green-600 text-white glow-green-hover"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {attachEntries && (
                  <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                    <FileText className="w-3 h-3" />
                    <span>Last 3 journal entries will be shared with AI for context</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
