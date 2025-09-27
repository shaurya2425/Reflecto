import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, Eye, CheckCircle, Sparkles, X } from 'lucide-react';

export function PostSubmissionCard({ 
  isVisible, 
  onClose, 
  onViewFullAnalysis, 
  sentimentData, 
  entryTitle 
}) {
  if (!isVisible) return null;

  const getSentimentIcon = () => {
    if (sentimentData.overall >= 6) return '😊';
    if (sentimentData.overall >= 4) return '😐';
    return '😔';
  };

  const getDominantSentiment = () => {
    const max = Math.max(sentimentData.positive, sentimentData.neutral, sentimentData.negative);
    if (max === sentimentData.positive) return { type: 'positive', color: 'text-green-400', label: 'Positive' };
    if (max === sentimentData.negative) return { type: 'negative', color: 'text-red-400', label: 'Challenging' };
    return { type: 'neutral', color: 'text-yellow-400', label: 'Balanced' };
  };

  const dominant = getDominantSentiment();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card border border-green-500/20 max-w-lg w-full animate-in fade-in zoom-in duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Entry Saved!</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            "{entryTitle}" has been analyzed and added to your journal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sentiment Overview */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Sentiment Analysis</span>
              </div>
              <div className="text-2xl">{getSentimentIcon()}</div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Overall Mood</span>
                  <span className="text-green-400 font-semibold">{sentimentData.overall}/10</span>
                </div>
                <Progress value={sentimentData.overall * 10} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-sm font-semibold text-green-400">{sentimentData.positive}%</div>
                <div className="text-xs text-gray-400">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-yellow-400">{sentimentData.neutral}%</div>
                <div className="text-xs text-gray-400">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-red-400">{sentimentData.negative}%</div>
                <div className="text-xs text-gray-400">Negative</div>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              Your entry shows predominantly <span className={dominant.color}>{dominant.label.toLowerCase()}</span> sentiment.
            </p>
          </div>

          {/* Key Themes */}
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span>Key Themes Detected</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {sentimentData.keywords.slice(0, 6).map((keyword, index) => (
                <Badge
                  key={index}
                  className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                >
                  {keyword}
                </Badge>
              ))}
              {sentimentData.keywords.length > 6 && (
                <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                  +{sentimentData.keywords.length - 6} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-500/30 text-gray-400 hover:text-gray-300 hover:border-gray-400"
            >
              Continue Writing
            </Button>
            <Button
              onClick={onViewFullAnalysis}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white glow-orange-hover"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
