import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Brain, TrendingUp, AlertCircle } from 'lucide-react';

export function SentimentModal({ isOpen, onClose, entry }) {
  if (!entry) return null;

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'negative': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'neutral': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSentimentIcon = (type) => {
    switch (type) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-green-500/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Brain className="w-5 h-5 text-green-400" />
            <span>Sentiment Analysis: {entry.title}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{entry.date} • {entry.time}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Sentiment Score */}
          <Card className="bg-[#0D1F1C] glass border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Overall Sentiment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getSentimentIcon(entry.sentiment.overall >= 6 ? 'positive' : entry.sentiment.overall >= 4 ? 'neutral' : 'negative')}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Mood Score</span>
                    <span className="text-green-400 font-semibold">{entry.sentiment.overall}/10</span>
                  </div>
                  <Progress value={entry.sentiment.overall * 10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">
            {['positive', 'neutral', 'negative'].map((type) => (
              <Card
                key={type}
                className={`bg-[#0D1F1C] glass border ${getSentimentColor(type)}`}
              >
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${getSentimentColor(type).split(' ')[0]}`}>
                    <span>{type === 'positive' ? '😊' : type === 'neutral' ? '😐' : '😔'}</span>
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getSentimentColor(type).split(' ')[0]}`}>
                    {entry.sentiment[type]}%
                  </div>
                  <Progress value={entry.sentiment[type]} className="h-2 mb-3" />
                  <div className="space-y-1">
                    {entry.sentiment.reasons[type].map((reason, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getSentimentColor(type).split(' ')[0]} mt-2 flex-shrink-0`}></div>
                        <p className="text-sm text-gray-300">{reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Keywords & Emotions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#0D1F1C] glass border border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Key Words</CardTitle>
                <CardDescription className="text-gray-400">
                  Most impactful words in your entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {entry.sentiment.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D1F1C] glass border border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Detected Emotions</CardTitle>
                <CardDescription className="text-gray-400">
                  Emotional themes identified in your writing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {entry.sentiment.emotions.map((emotion, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journal Entry Preview */}
          <Card className="bg-[#0D1F1C] glass border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white">Journal Entry</CardTitle>
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="text-xs border-green-500/30 text-green-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-green-500/10">
                <p className="text-gray-300 leading-relaxed line-clamp-6">{entry.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-[#0D1F1C] glass border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-300">
                    This entry shows strong self-reflection and awareness of your emotional state.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-300">
                    Consider practicing gratitude exercises when experiencing similar emotions.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-300">
                    Your writing style indicates good emotional processing skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
