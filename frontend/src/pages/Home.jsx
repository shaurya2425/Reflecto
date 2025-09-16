import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ onPageChange, onAuthClick, user }) {

  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Sentiment Tracking",
      description: "AI that understands your emotions and tracks patterns over time.",
      action: () => onPageChange('sentiment')
    },
    {
      icon: BookOpen,
      title: "Guided Journaling",
      description: "Write with prompts and clarity to explore your inner world.",
      action: () => onPageChange('journal')
    },
    {
      icon: MessageCircle,
      title: "Companion Chatbot",
      description: "Talk freely, anytime with an AI companion that listens.",
      action: () => onPageChange('chatbot')
    }
  ];

  return (
    <div className="min-h-screen bg-black/80 text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-teal-500/20 to-green-500/20 blur-3xl animate-pulse-slower"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 glow-green">
            Reflect. Grow. Heal.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your calm space to journal and understand yourself. Track emotions, explore thoughts, 
            and grow with AI-powered insights.
          </p>
          <Button
            onClick={() => {
              if (user) {
                navigate('/journal');
              } else {
                navigate('/signup');
              }
            }}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-8 py-4 text-lg rounded-full glow-green-hover border border-green-400 shadow-lg"
          >
            {user ? 'Go to Journal' : 'Get Started'}
          </Button>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-green">
              Your Digital Wellness Companion
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover tools designed to help you understand yourself better and build lasting mental wellness habits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card hover:glow-green-hover transition-all duration-300 cursor-pointer group"
                onClick={feature.action}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <feature.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-green-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-green-500 glow-green flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="text-xl font-semibold">Reflecto</span>
            </div>
            
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">About</a>
              <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-500">
            <p>&copy; 2024 Reflecto. Your journey to self-discovery starts here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
