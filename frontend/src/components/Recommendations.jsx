import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Heart, Wind, Zap, Clock, Play, CheckCircle, X } from 'lucide-react';

export function Recommendations({ userMoodData }) {
  const [completedActivities, setCompletedActivities] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);

  const recommendations = [
    {
      id: '1',
      title: '4-7-8 Breathing Exercise',
      description: 'A calming breathing technique to reduce anxiety and promote relaxation.',
      category: 'breathing',
      duration: '5 min',
      difficulty: 'easy',
      icon: <Wind className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Start Breathing',
      benefits: ['Reduces anxiety', 'Improves focus', 'Better sleep'],
      reasoning: 'Your recent entries show elevated stress levels. This breathing exercise can help you find calm.'
    },
    {
      id: '2',
      title: 'Mindful Nature Walk',
      description: 'Take a slow, mindful walk while observing your surroundings.',
      category: 'movement',
      duration: '15 min',
      difficulty: 'easy',
      icon: <Heart className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Plan Walk',
      benefits: ['Boosts mood', 'Increases creativity', 'Reduces rumination'],
      reasoning: 'Based on your journal patterns, gentle movement combined with nature exposure could lift your spirits.'
    },
    {
      id: '3',
      title: 'Gratitude Meditation',
      description: 'Focus on three things you\'re grateful for with guided reflection.',
      category: 'mindfulness',
      duration: '10 min',
      difficulty: 'easy',
      icon: <Sparkles className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Begin Session',
      benefits: ['Increases positivity', 'Reduces stress', 'Improves perspective'],
      reasoning: 'Your entries show you benefit from reflection. This practice can amplify positive emotions.'
    },
    {
      id: '4',
      title: 'Creative Writing Prompt',
      description: 'Explore your thoughts through a guided creative writing exercise.',
      category: 'creativity',
      duration: '20 min',
      difficulty: 'medium',
      icon: <Zap className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Start Writing',
      benefits: ['Processes emotions', 'Sparks creativity', 'Builds self-awareness'],
      reasoning: 'Your thoughtful journal entries suggest you\'d enjoy exploring creative expression further.'
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax muscle groups to release physical stress.',
      category: 'mindfulness',
      duration: '12 min',
      difficulty: 'easy',
      icon: <Heart className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Try Now',
      benefits: ['Reduces tension', 'Improves sleep', 'Increases body awareness'],
      reasoning: 'Recent stress patterns suggest your body could benefit from intentional relaxation.'
    },
    {
      id: '6',
      title: 'Energizing Movement',
      description: 'Quick energizing exercises to boost mood and vitality.',
      category: 'movement',
      duration: '8 min',
      difficulty: 'medium',
      icon: <Zap className="w-5 h-5 text-[#3BE1FF] animate-pulse" />,
      actionText: 'Get Moving',
      benefits: ['Increases energy', 'Improves mood', 'Reduces fatigue'],
      reasoning: 'Your mood data indicates you could benefit from activities that boost physical energy.'
    }
  ];

  const getCategoryColor = (category) => 'bg-[#1A2B22] text-[#3BE1FF]';
  const getDifficultyColor = (difficulty) =>
    difficulty === 'easy' ? 'bg-[#1A2B22] text-green-400' : 'bg-[#1A2B22] text-yellow-400';

  const startActivity = (rec) => {
    const minutes = parseInt(rec.duration.replace(/\D/g, ''), 10);
    setActiveTimer({ id: rec.id, seconds: minutes * 60 });
  };

  useEffect(() => {
    if (!activeTimer) return;
    if (activeTimer.seconds <= 0) {
      setCompletedActivities((prev) => [...prev, activeTimer.id]);
      setActiveTimer(null);
      return;
    }
    const interval = setInterval(() => {
      setActiveTimer((prev) => (prev ? { ...prev, seconds: prev.seconds - 1 } : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isCompleted = (id) => completedActivities.includes(id);

  return (
    <div className="space-y-6 bg-[#0B1210] min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Recommendations</h2>
        
      </div>

      {/* Grid with 2 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`bg-[#0D1F1C] border border-[#0D1F1C]/50 rounded-xl p-6 relative hover:border-[#3bff58] transition-all ${
              isCompleted(rec.id) ? 'border-bg-green-500' : ''
            }`}
          >
            {isCompleted(rec.id) && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-6 h-6 text-[#3eff3b]" />
              </div>
            )}
            <CardHeader className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0B1210]/50 flex items-center justify-center">
                  {rec.icon}
                </div>
                <CardTitle className="text-white text-xl md:text-2xl font-semibold">{rec.title}</CardTitle>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <Badge className={getCategoryColor(rec.category)}>{rec.category}</Badge>
                <Badge className={getDifficultyColor(rec.difficulty)}>{rec.difficulty}</Badge>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-4 h-4 text-[#3BE1FF]" />
                  <span className="text-sm md:text-base text-gray-400">{rec.duration}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300 text-base md:text-lg">{rec.description}</CardDescription>
              <div className="bg-[#0B1210] border border-[#0D1F1C] rounded-lg p-3">
                <p className="text-sm md:text-base text-white">
                  <strong className='text-[#3BE1FF]'>Why this helps:</strong> {rec.reasoning}
                </p>
              </div>
              <div>
                <p className="text-sm md:text-base text-gray-400 mb-2">Benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {rec.benefits.map((b, i) => (
                    <Badge
                      key={i}
                      className="text-sm md:text-base bg-[#0B1210]/50 text-[#c9fdc6] border border-[#3BE1FF]/30"
                    >
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => startActivity(rec)}
                className={`w-full py-3 mt-2 text-base md:text-lg ${
                  isCompleted(rec.id)
                    ? 'bg-[#0D1F1C]/70 text-white border border-[#3BE1FF]/50'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Play className="w-5 h-5 mr-2 text-white" />
                {isCompleted(rec.id) ? 'Completed' : rec.actionText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeTimer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0D1F1C] rounded-2xl p-6 w-80 flex flex-col items-center space-y-4 shadow-lg glass-card animate-scaleUp">
            <div className="flex justify-end w-full">
              <Button
                variant="ghost"
                onClick={() => setActiveTimer(null)}
                className="text-gray-400 hover:text-[#3BE1FF]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <h2 className="text-[#3bff5f] text-xl md:text-2xl font-bold">Activity in Progress</h2>
            <p className="text-gray-400 text-base md:text-lg">Focus and complete your activity</p>
            <div className="text-5xl md:text-6xl text-[#ffffff] font-mono">{formatTime(activeTimer.seconds)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
