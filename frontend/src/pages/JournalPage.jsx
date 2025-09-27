import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { PenTool, Save, Clock, Smile, Meh, Frown, Tag, Lightbulb, Edit, Brain, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';
import { SentimentModal } from '@/components/SentimentModal';
import { EntryAnalysisModal } from '@/components/EntryAnalysisModal';
import { PostSubmissionCard } from '@/components/PostSubmissionCard';

export function JournalPage() {
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 5,
    productivity: 50,
    tags: [] ,
  });
  const [newTag, setNewTag] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showSentimentModal, setShowSentimentModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showPostSubmission, setShowPostSubmission] = useState(false);
  const [guidedResponses, setGuidedResponses] = useState({});
  const [openQuestions, setOpenQuestions] = useState([]);

  // Guided reflection questions
  const guidedQuestions = [
    {
      id: 'emotions',
      prompt: 'What emotions did you experience today?',
      placeholder: 'I felt... The strongest emotion was... This came up when...',
      category: 'emotions',
      icon: '💭'
    },
    {
      id: 'productivity',
      prompt: 'What did you accomplish that made you feel productive?',
      placeholder: 'Today I completed... I felt productive when... I made progress on...',
      category: 'productivity',
      icon: '🎯'
    },
    {
      id: 'joy',
      prompt: 'What brought you joy or made you smile?',
      placeholder: 'I smiled when... Something that brought me joy was... I felt happy because...',
      category: 'joy',
      icon: '😊'
    },
    {
      id: 'learning',
      prompt: 'What did you learn or discover today?',
      placeholder: 'I learned that... I discovered... Something new I realized...',
      category: 'learning',
      icon: '📚'
    },
    {
      id: 'challenges',
      prompt: 'What challenged or upset you, and how did you handle it?',
      placeholder: 'I was challenged by... I handled this by... Next time I might...',
      category: 'challenges',
      icon: '⚡'
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'emotions': return 'border-red-500/30 bg-red-500/5';
      case 'productivity': return 'border-blue-500/30 bg-blue-500/5';
      case 'joy': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'learning': return 'border-purple-500/30 bg-purple-500/5';
      case 'challenges': return 'border-orange-500/30 bg-orange-500/5';
      default: return 'border-green-500/30 bg-green-500/5';
    }
  };

  // Mock journal entries with detailed sentiment data
  const entries = [
    {
      id: 1,
      title: "Morning Reflections",
      content: "Started the day with meditation and felt really centered. The sunrise was beautiful and I'm grateful for these quiet moments. Sometimes I worry about work deadlines, but I'm learning to stay present.",
      date: "2024-12-08",
      time: "8:30 AM",
      mood: 8,
      productivity: 70,
      tags: ["meditation", "gratitude", "morning"],
      sentiment: {
        positive: 75,
        neutral: 15,
        negative: 10,
        overall: 7.5,
        keywords: ["meditation", "centered", "grateful", "beautiful", "peaceful"],
        emotions: ["gratitude", "peace", "mindfulness", "contentment"],
        reasons: {
          positive: [
            "Expressed gratitude for quiet moments",
            "Described feeling centered and peaceful",
            "Positive language about meditation practice"
          ],
          negative: [
            "Mentioned worry about work deadlines"
          ],
          neutral: [
            "Factual description of morning routine"
          ]
        }
      }
    },
    {
      id: 2,
      title: "Challenging Day at Work",
      content: "Had a difficult conversation with my manager today. Feeling a bit overwhelmed but trying to stay positive. I know I can learn from this experience and grow stronger.",
      date: "2024-12-07",
      time: "6:45 PM",
      mood: 4,
      productivity: 45,
      tags: ["work", "stress", "growth"],
      sentiment: {
        positive: 25,
        neutral: 35,
        negative: 40,
        overall: 4.2,
        keywords: ["difficult", "overwhelming", "positive", "learn", "grow"],
        emotions: ["stress", "determination", "resilience", "hope"],
        reasons: {
          positive: [
            "Shows resilience and growth mindset",
            "Attempting to stay positive despite challenges"
          ],
          negative: [
            "Described conversation as difficult",
            "Feeling overwhelmed by situation"
          ],
          neutral: [
            "Factual description of work interaction"
          ]
        }
      }
    },
    {
      id: 3,
      title: "Weekend Plans",
      content: "Excited about the weekend! Planning to visit the art museum and try that new restaurant downtown. Looking forward to some quality time with friends.",
      date: "2024-12-06",
      time: "2:15 PM",
      mood: 7,
      productivity: 60,
      tags: ["weekend", "art", "food", "friends"],
      sentiment: {
        positive: 85,
        neutral: 15,
        negative: 0,
        overall: 8.2,
        keywords: ["excited", "planning", "museum", "restaurant", "friends"],
        emotions: ["excitement", "anticipation", "social connection", "joy"],
        reasons: {
          positive: [
            "High energy and excitement about plans",
            "Looking forward to social activities",
            "Positive anticipation for cultural activities"
          ],
          negative: [],
          neutral: [
            "Factual planning details"
          ]
        }
      }
    },
  ];

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Meh' },
    { value: 4, emoji: '🙂', label: 'Okay' },
    { value: 5, emoji: '😊', label: 'Good' },
    { value: 6, emoji: '😄', label: 'Happy' },
    { value: 7, emoji: '😁', label: 'Very Happy' },
    { value: 8, emoji: '🤩', label: 'Excited' },
    { value: 9, emoji: '🥰', label: 'Blissful' },
    { value: 10, emoji: '🌟', label: 'Amazing' },
  ];

  const suggestedTags = ['work', 'family', 'health', 'goals', 'creativity', 'stress', 'gratitude', 'learning'];

  const aiPrompts = [
    "What was the highlight of your day?",
    "How are you feeling right now and why?",
    "What are you grateful for today?",
    "What challenge did you overcome recently?",
    "Describe a moment that made you smile today.",
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !currentEntry.tags.includes(newTag.trim())) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCurrentMoodEmoji = () => {
    const moodData = moodEmojis.find(m => m.value === Math.round(currentEntry.mood));
    return moodData || moodEmojis[4];
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-400" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-400" />;
      default: return <Meh className="w-4 h-4 text-yellow-400" />;
    }
  };

  const simulateAutoSave = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowSentimentModal(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      productivity: entry.productivity,
      tags: entry.tags
    });
  };

  const handleSaveEntry = () => {
    // Combine free-form content with guided responses
    let finalContent = currentEntry.content;
    
    if (Object.keys(guidedResponses).some(key => guidedResponses[key].trim())) {
      const guidedContent = Object.entries(guidedResponses)
        .filter(([_, response]) => response.trim())
        .map(([questionId, response]) => {
          const questionTitles = {
            emotions: 'Emotions I Experienced',
            productivity: 'What I Accomplished',
            joy: 'Moments of Joy',
            learning: 'What I Learned',
            challenges: 'Challenges I Faced'
          };
          return `${questionTitles[questionId] || questionId}:\n${response}`;
        })
        .join('\n\n');
      
      if (finalContent && guidedContent) {
        finalContent = `${finalContent}\n\n--- Guided Reflection ---\n\n${guidedContent}`;
      } else if (guidedContent) {
        finalContent = guidedContent;
      }
    }

    // Create sentiment data (mock analysis)
    const mockSentimentData = {
      positive: Math.floor(Math.random() * 40) + 40, // 40-80%
      neutral: Math.floor(Math.random() * 30) + 10,  // 10-40%
      negative: Math.floor(Math.random() * 30) + 5,  // 5-35%
      overall: currentEntry.mood,
      keywords: ['reflection', 'growth', 'mindfulness', 'awareness', 'journey'],
      emotions: ['contemplative', 'introspective', 'peaceful', 'thoughtful']
    };
    
    // Adjust percentages to sum to 100
    const total = mockSentimentData.positive + mockSentimentData.neutral + mockSentimentData.negative;
    if (total !== 100) {
      const diff = 100 - total;
      mockSentimentData.positive += diff;
    }

    console.log('Saving entry:', { ...currentEntry, content: finalContent });
    
    // Show post-submission card with mock data
    setSelectedEntry({
      ...currentEntry,
      id: Date.now(),
      content: finalContent,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: {
        ...mockSentimentData,
        reasons: {
          positive: ['Shows self-reflection and mindfulness'],
          negative: ['Some areas of concern noted'],
          neutral: ['Factual observations recorded']
        }
      }
    });
    setShowPostSubmission(true);
    
    // Reset form after successful save
    setCurrentEntry({
      title: '',
      content: '',
      mood: 5,
      productivity: 50,
      tags: [],
    });
    setGuidedResponses({});
    setOpenQuestions([]);
  };

  const handleViewFullAnalysis = () => {
    setShowPostSubmission(false);
    setShowAnalysisModal(true);
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleGuidedResponseChange = (questionId, response) => {
    setGuidedResponses(prev => ({ ...prev, [questionId]: response }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
          <p className="text-gray-400">Express yourself freely and track your thoughts</p>
        </div>

        <Tabs defaultValue="new-entry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-green-500/10 border border-green-500/20">
            <TabsTrigger 
              value="new-entry" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-gray-300"
            >
              New Entry
            </TabsTrigger>
            <TabsTrigger 
              value="past-entries"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-gray-300"
            >
              Past Entries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-entry">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Journal Composer */}
              <div className="lg:col-span-2 space-y-6">
                {/* Your Thoughts Section */}
                <Card className="bg-[#0D1F1C] glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <PenTool className="w-5 h-5 text-green-400" />
                      <span>Your Thoughts</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Write freely about your day, thoughts, or feelings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Title</label>
                      <Input
                        placeholder="Give your entry a title..."
                        value={currentEntry.title}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                        className="glass border-green-500/30 focus:border-green-400 text-white placeholder-gray-500"
                        onInput={simulateAutoSave}
                      />
                    </div>

                    {/* Free-form Content */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Your thoughts</label>
                      <Textarea
                        placeholder="Write freely about your day, feelings, or experiences..."
                        value={currentEntry.content}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                        className="glass border-green-500/30 focus:border-green-400 text-white placeholder-gray-500 min-h-[200px] resize-none"
                        onInput={simulateAutoSave}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Guided Reflection Questions */}
                <Card className="bg-[#0D1F1C] glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-green-400" />
                      <span>Guided Reflection (Optional)</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Answer any questions that resonate with you today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {guidedQuestions.map((question) => {
                      const isOpen = openQuestions.includes(question.id);
                      const hasResponse = guidedResponses[question.id]?.trim().length > 0;

                      return (
                        <Collapsible
                          key={question.id}
                          open={isOpen}
                          onOpenChange={() => toggleQuestion(question.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Card className={`cursor-pointer transition-all duration-200 mb-3 border ${getCategoryColor(question.category)} hover:scale-[1.01]`}>
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                                      {question.icon}
                                    </div>
                                    <span className="text-white text-sm font-medium">{question.prompt}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {hasResponse && (
                                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    )}
                                    {isOpen ? (
                                      <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="mb-4">
                            <div className="ml-8">
                              <Textarea
                                placeholder={question.placeholder}
                                value={guidedResponses[question.id] || ''}
                                onChange={(e) => handleGuidedResponseChange(question.id, e.target.value)}
                                className="glass border-green-500/30 focus:border-green-400 text-white placeholder-gray-500 min-h-[100px] resize-none"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Mood and Tags Section */}
                <Card className="bg-[#0D1F1C] glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Mood & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                {/* Mood Picker */}
                <div>
                  <label className="text-sm text-gray-300 mb-4 block">Current Mood</label>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getCurrentMoodEmoji().emoji}</div>
                    <div className="flex-1">
                      <Slider
                        value={[currentEntry.mood]}
                        onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mood: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-gray-400 min-w-[80px]">
                      {getCurrentMoodEmoji().label}
                    </span>
                  </div>
                </div>

                {/* Productivity Slider */}
                <div>
                  <label className="text-sm text-gray-300 mb-4 block">Productivity Level</label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">0%</span>
                    <Slider
                      value={[currentEntry.productivity]}
                      onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, productivity: value[0] }))}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400">100%</span>
                    <span className="text-sm text-green-400 min-w-[40px]">
                      {currentEntry.productivity}%
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentEntry.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-green-500/20 text-green-400 border-green-500/30 cursor-pointer hover:bg-green-500/30"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="glass border-green-500/30 focus:border-green-400 text-white placeholder-gray-500"
                    />
                    <Button
                      onClick={handleAddTag}
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedTags.filter(tag => !currentEntry.tags.includes(tag)).slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setCurrentEntry(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                        className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center space-x-2 text-sm">
                        {isDraftSaved && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            <span>Draft saved</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={handleSaveEntry}
                        className="bg-orange-500 hover:bg-orange-600 text-white glow-orange-hover"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
            {/* AI Prompts */}
            <Card className="bg-[#0D1F1C] glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <span>Writing Prompts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentEntry(prev => ({ ...prev, content: prompt + ' ' }))}
                      className="w-full text-left p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-sm text-gray-300 hover:text-green-400 transition-colors border border-green-500/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-[#0D1F1C] glass-card">
              <CardHeader>
                <CardTitle className="text-white">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entries</span>
                    <span className="text-white">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Mood</span>
                    <span className="text-green-400">7.2/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Streak</span>
                    <span className="text-green-400">12 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          </TabsContent>



          <TabsContent value="past-entries">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Your Journal Entries</h2>
                <p className="text-gray-400">Click any entry to view detailed sentiment analysis</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry) => (
                  <Card 
                    key={entry.id} 
                    className="bg-[#0D1F1C] glass-card transition-all duration-300 group cursor-pointer hover:glow-green-hover"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowAnalysisModal(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">{entry.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{entry.date} • {entry.time}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEntry(entry);
                            }}
                            className="text-blue-400 hover:text-blue-300 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEntry(entry);
                              setShowAnalysisModal(true);
                            }}
                            className="text-green-400 hover:text-green-300 p-1"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {entry.content}
                      </p>
                      
                      {/* Inline Sentiment Preview */}
                      <div className="space-y-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-green-400" />
                            <span className="text-gray-400">Sentiment</span>
                          </div>
                          <span className="text-green-400 font-semibold">{entry.sentiment.overall}/10</span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <div className="flex-1 bg-green-500/20 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-green-500 h-full transition-all duration-300"
                              style={{ width: `${entry.sentiment.positive}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-yellow-500/20 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-yellow-500 h-full transition-all duration-300"
                              style={{ width: `${entry.sentiment.neutral}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-red-500/20 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-red-500 h-full transition-all duration-300"
                              style={{ width: `${entry.sentiment.negative}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {entry.sentiment.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                            >
                              {keyword}
                            </Badge>
                          ))}
                          {entry.sentiment.keywords.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                              +{entry.sentiment.keywords.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {entry.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                              +{entry.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">
                            {moodEmojis.find(m => m.value === entry.mood)?.emoji}
                          </span>
                          <span className="text-xs text-gray-400">{entry.mood}/10</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Post Submission Card */}
      {selectedEntry && (
        <PostSubmissionCard
          isVisible={showPostSubmission}
          onClose={() => setShowPostSubmission(false)}
          onViewFullAnalysis={handleViewFullAnalysis}
          sentimentData={selectedEntry.sentiment}
          entryTitle={selectedEntry.title || 'New Entry'}
        />
      )}

      {/* Full Analysis Modal */}
      <EntryAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        entry={selectedEntry}
      />

      {/* Sentiment Analysis Modal */}
      <SentimentModal
        isOpen={showSentimentModal}
        onClose={() => setShowSentimentModal(false)}
        entry={selectedEntry}
      />
    </div>
  );
}