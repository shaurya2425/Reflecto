import { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';


export function Navbar({ currentPage, onPageChange, user, onAuthClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'journal', label: 'Journal' },
    { id: 'chatbot', label: 'Chatbot' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 glow-green flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            </div>
            <span className="text-xl font-semibold text-white">Reflecto</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-green-400 bg-green-500/10 glow-green'
                    : 'text-gray-300 hover:text-green-400 hover:bg-green-500/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-300">Hi, {user.name || 'User'}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="text-gray-300 hover:text-red-400 border border-red-500/30 hover:border-red-400 rounded-full"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('login')}
                  className="text-gray-300 hover:text-green-400 border border-green-500/30 hover:border-green-400 rounded-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('signup')}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 glow-green-hover border border-green-400"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-green-400 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-500/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    currentPage === item.id
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-gray-300 hover:text-green-400 hover:bg-green-500/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-green-500/20">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-gray-300 text-sm">Hi, {user.name || 'User'}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={onLogout}
                      className="justify-start text-gray-300 hover:text-red-400"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => onAuthClick('signin')}
                      className="justify-start text-gray-300 hover:text-green-400"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => onAuthClick('signup')}
                      className="justify-start bg-green-500 hover:bg-green-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}