import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage({ onPageChange, onAuthClick, user }) {

    const navigate = useNavigate();
  const features = [
    {
      icon: Brain,
      title: "Sentiment Tracking",
      description:
        "AI that understands your emotions and tracks patterns over time.",
      action: () => onPageChange("sentiment"),
    },
    {
      icon: BookOpen,
      title: "Guided Journaling",
      description:
        "Write with prompts and clarity to explore your inner world.",
      action: () => onPageChange("journal"),
    },
    {
      icon: MessageCircle,
      title: "Companion Chatbot",
      description: "Talk freely, anytime with an AI companion that listens.",
      action: () => onPageChange("chatbot"),
    },
  ];

  const isUserLoggedIn = user && Object.keys(user).length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10"></div>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="mesh-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0F766E" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M0,300 Q250,200 500,300 T1000,300 L1000,600 Q750,500 500,600 T0,600 Z"
              fill="url(#mesh-gradient)"
            />
            <path
              d="M0,600 Q250,700 500,600 T1000,600 L1000,900 Q750,800 500,900 T0,900 Z"
              fill="url(#mesh-gradient)"
            />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-glow">
            Reflect. Grow. Heal.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your calm space to journal and understand yourself. Track emotions,
            explore thoughts, and grow with AI-powered insights.
          </p>
          <Button
            onClick={()=> navigate('/journal')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-full glow-green-hover border border-green-400 shadow-lg"
          >
            {isUserLoggedIn ? "Get Started" : "Go to Journal"}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Digital Wellness Companion
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover tools designed to help you understand yourself better and
              build lasting mental wellness habits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                onClick={feature.action}
                className="bg-[#0D1F1C] transition-all duration-300 cursor-pointer group"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/40 transition-colors">
                    <feature.icon className="w-8 h-8 text-green-400 group-hover:text-green-200 transition-colors" />
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
              <span className="text-xl font-semibold text-white">Reflecto</span>
            </div>

            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-500">
            <p>
              &copy; 2024 Reflecto. Your journey to self-discovery starts here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
