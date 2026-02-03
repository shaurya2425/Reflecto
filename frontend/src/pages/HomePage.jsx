import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Heart,
  Smile,
  BarChart3,
  Brain,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data (fallback/demo)
const reflectionPrompts = [
  "What’s one thing you learned about yourself today?",
  "What emotion stood out most today and why?",
  "What made you feel grateful recently?",
  "How did you show kindness to yourself?",
];
const mockSentimentData = [
  { day: "Mon", mood: 6.5 },
  { day: "Tue", mood: 7.2 },
  { day: "Wed", mood: 6.8 },
  { day: "Thu", mood: 7.8 },
  { day: "Fri", mood: 8.2 },
  { day: "Sat", mood: 7.5 },
  { day: "Sun", mood: 8.0 },
];
const mockTopEmotions = [
  { name: "Calm", emoji: "😌", percentage: 45, color: "#22C55E" },
  { name: "Creative", emoji: "✨", percentage: 30, color: "#0F766E" },
  { name: "Hopeful", emoji: "🌱", percentage: 25, color: "#10b981" },
];

// ───────────────────────────────────────────────────────────────
// 🧠 Logged-in Dashboard
function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPrompt, setCurrentPrompt] = useState("");
  const [aiSummary, setAiSummary] = useState(
    "Your emotional landscape is mostly calm with emerging creativity. Keep journaling to sustain clarity."
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const hour = new Date(now).getHours();
    let greet =
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const name = user?.displayName || user?.email?.split("@")[0] || "friend";
    setGreeting(`${greet}, ${name} 🌿`);
    setCurrentPrompt(
      reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
    );
  }, [user]);

  const handleStartWriting = () => {
    console.log("Navigating to journal..."); // test log
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      navigate("/journal");
    }, 1000);
  };

  console.log("Current pathname:", window.location.pathname);

  return (
    <div
      className="min-h-screen pb-16"
      style={{
        background: "linear-gradient(135deg, #0B1210 0%, #101C18 100%)",
      }}
    >
      {/* 🎉 Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background:
                    i % 3 === 0
                      ? "#22C55E"
                      : i % 3 === 1
                        ? "#0F766E"
                        : "#10b981",
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: 0,
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 pt-24 space-y-10">
        {/* Reflection Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-[#0D1F1C]/90 backdrop-blur-lg p-8 rounded-[20px] border border-green-500/40 relative overflow-hidden group hover:border-green-500/60 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              className="absolute top-6 right-6 text-green-400"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>

            <h2 className="text-3xl text-white mb-4">{greeting}</h2>
            <motion.p
              key={currentPrompt}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl text-gray-300 italic mb-6"
            >
              "{currentPrompt}"
            </motion.p>

            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault(); // ensure no event swallowing
                handleStartWriting();
              }}
              className="relative z-20 bg-gradient-to-r from-green-500 to-green-600 
             hover:from-green-600 hover:to-green-700 text-white 
             px-6 py-6 rounded-[20px] border border-green-400/50 
             flex items-center gap-2 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" /> Start Writing
            </Button>
          </Card>
        </motion.div>

        {/* Snapshot Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-400" />
            Your Emotional Snapshot
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Trend */}
            <Card className="bg-[#0D1F1C]/90 p-6 rounded-[20px] border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400">7-Day Mood Trend</h4>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={mockSentimentData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(13, 31, 28, 0.9)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      borderRadius: "12px",
                      color: "#E5E7EB",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#22C55E"
                    strokeWidth={2}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Emotions */}
            <Card className="bg-[#0D1F1C]/90 p-6 rounded-[20px] border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400">Top Emotions</h4>
              </div>
              {mockTopEmotions.map((emotion, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-gray-300">
                    <span>
                      {emotion.emoji} {emotion.name}
                    </span>
                    <span className="text-green-400">
                      {emotion.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#0B1210] rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: emotion.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.percentage}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </Card>

            {/* AI Summary */}
            <Card className="bg-[#0D1F1C]/90 p-6 rounded-[20px] border border-green-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <h4 className="text-green-400">AI Wellness Insight</h4>
                </div>
                <p className="text-gray-300 italic">"{aiSummary}"</p>
              </div>
              <p className="text-xs text-gray-500 mt-4 border-t border-green-500/20 pt-2">
                Powered by AI
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Chatbot Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <Card
            className="bg-[#0D1F1C]/90 backdrop-blur-lg p-6 rounded-[20px] border border-green-500/40 max-w-2xl w-full cursor-pointer hover:border-green-500/60 transition-all duration-300"
            onClick={() => navigate("/chatbot")}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center glow-green">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">
                  Hey {user?.displayName || "friend"} 👋 Want to talk about your
                  day?
                </p>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 rounded-[20px] border border-green-400/50 flex items-center gap-2">
                <Smile className="w-5 h-5" /> Open Chat
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 🌿 Landing Page (unauthenticated)
function LandingPage({ onAuthClick }) {
  const features = [
    {
      icon: Brain,
      title: "AI Sentiment Analysis",
      description:
        "Advanced emotional intelligence tracking that understands your mental patterns over time.",
    },
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description:
        "AI-powered prompts and guided reflections to help you explore your inner world deeply.",
    },
    {
      icon: MessageCircle,
      title: "24/7 Companion",
      description:
        "Talk freely anytime with an empathetic AI companion that truly listens and supports you.",
    },
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #0B1210 0%, #101C18 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0D1F1C]/60 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-5">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="text-xl font-semibold text-white">Reflecto</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Sign In */}
            <Button
              variant="ghost"
              onClick={() => onAuthClick("login")}
              className="text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-400/40 bg-transparent hover:bg-green-500/10 transition-all duration-300 rounded-[12px] px-5 py-2"
            >
              Sign In
            </Button>

            {/* Get Started */}
            <Button
              onClick={() => onAuthClick("signup")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[12px] px-6 py-2 border border-green-400/50 hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-28 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 text-glow">
            Reflect. Grow. Heal.
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Your calm space to journal, track emotions, and find clarity through
            AI.
          </p>
          <Button
            onClick={() => onAuthClick("login")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-6 rounded-[20px] border border-green-400/50 shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
        </motion.div>
      </section>

      {/* See Your Emotional Journey */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Card className="bg-[#0D1F1C]/80 p-10 rounded-[20px] border border-green-500/30 backdrop-blur-lg">
            <h2 className="text-4xl mb-10 text-white">
              See Your Emotional Journey
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Chart */}
              <Card className="bg-[#0B1210]/60 p-6 rounded-[20px] border border-green-500/20">
                <h4 className="text-green-400 mb-4 flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Mood Tracking
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mockSentimentData}>
                    <defs>
                      <linearGradient
                        id="demoGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22C55E"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22C55E"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#22C55E"
                      strokeWidth={2}
                      fill="url(#demoGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Emotions */}
              <Card className="bg-[#0B1210]/60 p-6 rounded-[20px] border border-green-500/20">
                <h4 className="text-green-400 mb-4 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" /> Emotion Insights
                </h4>
                {mockTopEmotions.map((e) => (
                  <div key={e.name} className="mb-3">
                    <div className="flex justify-between text-gray-300">
                      <span>
                        {e.emoji} {e.name}
                      </span>
                      <span className="text-green-400">
                        {e.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#0B1210] rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          background: e.color,
                          width: `${e.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <div className="text-center mt-10">
              <p className="text-gray-400 mb-4">
                Sign up to start tracking your emotional wellness journey
              </p>
              <Button
                onClick={() => onAuthClick("signup")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-[20px] glow-green-hover border border-green-400/50"
              >
                Get Started Free
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Your Digital Wellness Companion */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            Your Digital Wellness Companion
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover powerful tools designed to help you understand yourself
            better and build lasting mental wellness habits.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`bg-[#0D1F1C]/90 p-8 rounded-[20px] border border-green-500/20 hover:border-green-500/40 transition-all h-full ${f.title === "AI Sentiment Analysis"
                  ? "md:scale-105"
                  : "md:scale-100"
                  }`}
              >
                <f.icon className="w-12 h-12 text-green-400 mb-6 mx-auto" />
                <h3 className="text-2xl text-center mb-4 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {f.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-green-500/20 text-center text-gray-400">
        <p>&copy; 2024 Reflecto. Your journey to self-discovery starts here.</p>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 🌿 Main Export
export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <UserDashboard />;
  return <LandingPage onAuthClick={(type) => navigate(`/${type}`)} />;
}
