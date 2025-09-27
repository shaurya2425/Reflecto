import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Brain, TrendingUp, AlertCircle, Heart, Wind, Sparkles, Play } from 'lucide-react';

export function EntryAnalysisModal({ isOpen, onClose, entry }) {
  if (!entry) return null;

  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    const { sentiment } = entry;
    const stressKeywords = ['stress', 'overwhelm', 'difficult', 'challenging', 'anxious', 'worried'];
    const sadnessKeywords = ['sad', 'down', 'disappointed', 'upset', 'lonely'];

    const hasStress = sentiment.keywords.some(k => stressKeywords.includes(k.toLowerCase()));
    const hasSadness = sentiment.negative > 30 || sadnessKeywords.some(k => sentiment.keywords.includes(k));
    const lowProductivity = entry.content.toLowerCase().includes('unproductive') || entry.content.toLowerCase().includes('stuck');

    if (hasStress) {
      recommendations.push({
        id: 'breathing',
        title: '4-7-8 Breathing Exercise',
        description: 'A proven technique to reduce stress and activate your parasympathetic nervous system.',
        category: 'breathing',
        duration: '5 min',
        icon: <Wind className="w-4 h-4" />,
        actionText: 'Start Breathing',
        reason: 'Detected stress-related language in your entry. Deep breathing can help regulate your nervous system.'
      });
    }

    if (hasSadness) {
      recommendations.push({
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for to shift your perspective.',
        category: 'gratitude',
        duration: '10 min',
        icon: <Sparkles className="w-4 h-4" />,
        actionText: 'Practice Gratitude',
        reason: 'Your entry shows some difficult emotions. Gratitude practice can help balance your perspective.'
      });
    }

    if (lowProductivity || sentiment.overall < 5) {
      recommendations.push({
        id: 'movement',
        title: 'Energizing Walk',
        description: 'A short walk outside to boost your mood and energy levels.',
        category: 'movement',
        duration: '15 min',
        icon: <Heart className="w-4 h-4" />,
        actionText: 'Take a Walk',
        reason: 'Movement can help increase energy and improve mood, especially during challenging times.'
      });
    }

    // Always add a mindfulness option
    recommendations.push({
      id: 'mindfulness',
      title: 'Mindful Moment',
      description: 'A brief meditation to center yourself and process your emotions.',
      category: 'mindfulness',
      duration: '8 min',
      icon: <Brain className="w-4 h-4" />,
      actionText: 'Be Mindful',
      reason: 'Your thoughtful reflection shows good self-awareness. Mindfulness can deepen this quality.'
    });

    return recommendations.slice(0, 3); // Top 3
  };

  const getSentimentIcon = (type) => {
    switch (type) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-green-500/20 max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          {/* Left Side - Journal Entry */}
          <div className="p-8 border-r border-green-500/20">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-white flex items-center space-x-2 text-2xl">
                <Brain className="w-6 h-6 text-green-400" />
                <span>{entry.title}</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{entry.date} • {entry.time}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Journal Entry Text */}
            <Card className="glass border border-green-500/20 mb-6">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-green-500/30 text-green-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800/30 rounded-lg p-6 border border-green-500/10 max-h-96 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                </div>
              </CardContent>
            </Card>

            {/* Overall Mood Score */}
            <Card className="glass border border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>Overall Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">{getSentimentIcon(entry.sentiment.overall >= 6 ? 'positive' : entry.sentiment.overall >= 4 ? 'neutral' : 'negative')}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-lg">Mood Score</span>
                      <span className="text-green-400 font-bold text-2xl">{entry.sentiment.overall}/10</span>
                    </div>
                    <Progress value={entry.sentiment.overall * 10} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Analysis & Recommendations */}
          <div className="p-8 space-y-6">
            {/* Sentiment Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Sentiment Analysis</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{entry.sentiment.positive}%</div>
                  <div className="text-sm text-gray-400 mb-2">Positive</div>
                  <Progress value={entry.sentiment.positive} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{entry.sentiment.neutral}%</div>
                  <div className="text-sm text-gray-400 mb-2">Neutral</div>
                  <Progress value={entry.sentiment.neutral} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{entry.sentiment.negative}%</div>
                  <div className="text-sm text-gray-400 mb-2">Negative</div>
                  <Progress value={entry.sentiment.negative} className="h-2" />
                </div>
              </div>
            </div>

            {/* Keywords & Emotions */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-3">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.sentiment.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Emotions Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.sentiment.emotions.map((emotion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <Card className="glass border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.sentiment.reasons.positive.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">{entry.sentiment.reasons.positive[0]}</p>
                    </div>
                  )}
                  {entry.sentiment.reasons.negative.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">{entry.sentiment.reasons.negative[0]}</p>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-300">
                      Your writing shows strong emotional awareness and reflection skills.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Recommended Activities</h3>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="glass border border-green-500/20 hover:glow-green-hover transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            {rec.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{rec.title}</h4>
                            <p className="text-xs text-gray-400">{rec.duration}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white glow-orange-hover"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {rec.actionText}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
                      <p className="text-xs text-blue-300 italic">{rec.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
