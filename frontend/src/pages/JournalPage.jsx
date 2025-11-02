import React, { useState } from 'react';
import { BookOpen, TrendingUp, CheckCircle, BarChart3, Sparkles, X } from 'lucide-react';

export function JournalPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState(5);
  const [productivity, setProductivity] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showPastEntryModal, setShowPastEntryModal] = useState(false);
  const [showPastEntryAnalyticsModal, setShowPastEntryAnalyticsModal] = useState(false);

  const pastEntries = [
    {
      title: 'Refreshed and Productive',
      date: 'October 26, 2025',
      mood: 8,
      productivity: 9,
      description: 'Felt motivated today and got most of my work done ahead of time.',
    },
    {
      title: 'Calm Evening',
      date: 'October 25, 2025',
      mood: 7,
      productivity: 6,
      description: 'Spent a peaceful day reading and reflecting. Low work but high contentment.',
    },
    {
      title: 'Tough Day',
      date: 'October 24, 2025',
      mood: 4,
      productivity: 5,
      description: 'Felt tired and distracted. Trying to accept slow days as part of growth.',
    },
    {
      title: 'Energetic Morning Routine',
      date: 'October 23, 2025',
      mood: 9,
      productivity: 8,
      description: 'Started the day with a jog and a healthy breakfast. Great mental clarity.',
    },
  ];

  const handleViewPastEntry = (entry) => {
    setSelectedEntry(entry);
    setShowPastEntryModal(true);
  };

  const handleSave = () => {
    if (title.trim() && description.trim()) setShowSuccessModal(true);
  };

  const handleContinueWriting = () => {
    setTitle('');
    setDescription('');
    setMood(5);
    setProductivity(5);
    setShowSuccessModal(false);
  };

  const generateAnalysis = (mood, productivity) => {
    const sentiment = mood >= 7 ? 'positive' : mood >= 4 ? 'neutral' : 'negative';
    const polarityScore = (mood - 5) / 5;

    return {
      sentiment,
      polarity_score: polarityScore.toFixed(2),
      emotional_summary: `You seem to be experiencing ${sentiment} emotions with a general sense of ${productivity >= 7 ? 'accomplishment' : productivity >= 4 ? 'balance' : 'low energy'}.`,
      reflection: `Your mood of ${mood}/10 and productivity of ${productivity}/10 show you're reflecting consciously. Each day teaches something new—keep journaling your growth.`,
      suggestions: [
        'Write three things you are grateful for daily.',
        'Set one small goal for tomorrow to stay consistent.',
        'Take mindful breaks to reflect during the day.',
      ],
    };
  };

  const handleViewAnalytics = () => {
    const data = generateAnalysis(mood, productivity);
    setAnalyticsData(data);
    setShowSuccessModal(false);
    setShowAnalyticsModal(true);
  };

  const handleViewPastEntryAnalytics = () => {
    const data = generateAnalysis(selectedEntry.mood, selectedEntry.productivity);
    setAnalyticsData(data);
    setShowPastEntryAnalyticsModal(true);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setMood(5);
    setProductivity(5);
    setShowSuccessModal(false);
    setShowAnalyticsModal(false);
    setShowPastEntryModal(false);
    setShowPastEntryAnalyticsModal(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #0B1210 0%, #101C18 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-2 text-3xl font-bold">My Journal</h1>
          <p className="text-gray-400">Track your thoughts, moods, and productivity</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['new', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 px-6 rounded-2xl transition-all backdrop-blur-sm"
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, #22C55E, #0F766E)' : 'rgba(13,31,28,0.4)',
                color: activeTab === tab ? '#0D1F1C' : '#E5E7EB',
                border: activeTab === tab ? 'none' : '1px solid rgba(34,197,94,0.3)',
                boxShadow: activeTab === tab ? '0 0 20px rgba(34,197,94,0.4)' : 'none',
                fontWeight: '600',
              }}
            >
              {tab === 'new' ? (
                <>
                  <BookOpen className="inline mr-2" size={20} /> New Entry
                </>
              ) : (
                <>
                  <TrendingUp className="inline mr-2" size={20} /> Past Entries
                </>
              )}
            </button>
          ))}
        </div>

        {/* New Entry */}
        {activeTab === 'new' && (
          <div
            className="rounded-2xl p-6 md:p-8 backdrop-blur-lg"
            style={{
              background: 'rgba(13, 31, 28, 0.6)',
              border: '1px solid rgba(34,197,94,0.2)',
              boxShadow: '0 0 30px rgba(34,197,94,0.15)',
            }}
          >
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-white mb-3 text-xl font-semibold">Journal Title</h2>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full px-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(13,31,28,0.8)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#FFFFFF',
                  caretColor: '#22C55E',
                }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-white mb-3 text-xl font-semibold">Description of the Day</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How was your day? What happened? How do you feel?"
                rows={8}
                className="w-full px-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none resize-none transition-all"
                style={{
                  background: 'rgba(13,31,28,0.8)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#FFFFFF',
                  caretColor: '#22C55E',
                }}
              />
            </div>

            {/* Mood */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white text-xl font-semibold">Mood Level</h2>
                <span className="text-green-400 font-bold text-xl">{mood}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-mood"
                style={{
                  background: `linear-gradient(to right, #22C55E ${(mood - 1) * 11.11}%, rgba(255,255,255,0.1) ${(mood - 1) * 11.11}%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-gray-400 text-sm">
                <span>😔 Low</span>
                <span>😊 High</span>
              </div>
            </div>

            {/* Productivity */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white text-xl font-semibold">Productivity Level</h2>
                <span className="text-teal-400 font-bold text-xl">{productivity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={productivity}
                onChange={(e) => setProductivity(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-productivity"
                style={{
                  background: `linear-gradient(to right, #0F766E ${(productivity - 1) * 11.11}%, rgba(255,255,255,0.1) ${(productivity - 1) * 11.11}%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-gray-400 text-sm">
                <span>📉 Low</span>
                <span>📈 High</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={!title.trim() || !description.trim()}
                className="py-3 px-8 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#fff',
                  boxShadow: '0 0 25px rgba(249,115,22,0.4)',
                  fontWeight: '600',
                }}
              >
                Save Journal Entry
              </button>
            </div>
          </div>
        )}

        {/* Past Entries */}
        {activeTab === 'past' && (
          <div
            className="rounded-2xl p-6 md:p-8 backdrop-blur-lg"
            style={{
              background: 'rgba(13, 31, 28, 0.6)',
              border: '1px solid rgba(34,197,94,0.2)',
              boxShadow: '0 0 30px rgba(34,197,94,0.15)',
            }}
          >
            <h2 className="text-white mb-6 text-xl font-semibold">Your Past Entries</h2>

            <div className="grid gap-4">
              {pastEntries.map((entry, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 relative backdrop-blur-sm transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(13, 31, 28, 0.8)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-green-400 font-semibold text-lg">{entry.title}</h3>
                      <span className="text-gray-400 text-sm">{entry.date}</span>
                    </div>
                    <button
                      onClick={() => handleViewPastEntry(entry)}
                      className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        boxShadow: '0 0 10px rgba(249,115,22,0.4)',
                      }}
                    >
                      View
                    </button>
                  </div>

                  <p className="text-gray-300 mb-3 line-clamp-2">{entry.description}</p>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>😊 Mood: <b className="text-green-400">{entry.mood}/10</b></span>
                    <span>💼 Productivity: <b className="text-teal-400">{entry.productivity}/10</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(11, 18, 16, 0.95) 0%, rgba(16, 28, 24, 0.95) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div 
              className="rounded-2xl p-8 max-w-md w-full backdrop-blur-xl relative"
              style={{
                background: 'rgba(13, 31, 28, 0.95)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleContinueWriting}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-all hover:bg-green-500/20"
                style={{
                  color: '#9CA3AF'
                }}
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6 mt-2">
                <div className="mx-auto mb-4 inline-block" style={{
                  color: '#22C55E',
                  filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))'
                }}>
                  <CheckCircle size={64} />
                </div>
                <h3 className="text-white mb-2" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
                  Journal Created Successfully!
                </h3>
                <p className="text-gray-400">Your entry has been saved</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinueWriting}
                  className="w-full py-3 rounded-xl transition-all backdrop-blur-sm hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
                    color: '#0D1F1C',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
                    fontWeight: '600'
                  }}
                >
                  Continue Writing
                </button>
                <button
                  onClick={handleViewAnalytics}
                  className="w-full py-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
                    fontWeight: '600'
                  }}
                >
                  <BarChart3 className="inline mr-2" size={20} />
                  See Full Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalyticsModal && analyticsData && (
          <div
            className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto"
            style={{
              background: 'rgba(13,31,28,0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="rounded-2xl p-8 max-w-2xl w-full my-8 relative"
              style={{
                background: 'rgba(13,31,28,0.95)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 0 40px rgba(34,197,94,0.3)',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="mr-3" size={28} style={{ color: '#22C55E' }} />
                <h3 className="text-white font-bold text-2xl">Journal Analytics</h3>
                <Sparkles className="ml-3" size={28} style={{ color: '#22C55E' }} />
              </div>

              <div className="text-gray-300 space-y-6">
                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">Sentiment Analysis</h4>
                  <p><b>Sentiment:</b> {analyticsData.sentiment}</p>
                  <p><b>Polarity Score:</b> {analyticsData.polarity_score}</p>
                </div>

                <div>
                  <h4 className="text-teal-400 font-semibold text-lg mb-2">🩵 Emotional Summary</h4>
                  <p>{analyticsData.emotional_summary}</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">💬 Reflection</h4>
                  <p>{analyticsData.reflection}</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">🌱 Suggestions</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    {analyticsData.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleReset}
                  className="py-3 px-8 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    boxShadow: '0 0 25px rgba(249,115,22,0.4)',
                    fontWeight: '600',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Past Entry Modal */}
        {showPastEntryModal && selectedEntry && (
          <div
            className="fixed inset-0 flex items-center justify-center z-[120] p-4 overflow-y-auto"
            style={{
              background: 'rgba(13,31,28,0.9)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="rounded-2xl p-8 max-w-xl w-full relative"
              style={{
                background: 'rgba(13,31,28,0.95)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 0 40px rgba(34,197,94,0.3)',
              }}
            >
              <h3 className="text-green-400 font-bold text-2xl mb-3">{selectedEntry.title}</h3>
              <p className="text-gray-400 mb-5">{selectedEntry.date}</p>
              <p className="text-gray-200 mb-6 whitespace-pre-wrap">{selectedEntry.description}</p>

              <div className="flex justify-between text-gray-400 mb-8">
                <span>😊 Mood: <b className="text-green-400">{selectedEntry.mood}/10</b></span>
                <span>💼 Productivity: <b className="text-teal-400">{selectedEntry.productivity}/10</b></span>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowPastEntryModal(false)}
                  className="py-3 px-8 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  Close
                </button>

                <button
                  onClick={handleViewPastEntryAnalytics}
                  className="py-3 px-8 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(249,115,22,0.4)',
                    fontWeight: '600',
                  }}
                >
                  <BarChart3 className="inline mr-2" size={20} />
                  View Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Past Entry Analytics Modal */}
        {showPastEntryAnalyticsModal && analyticsData && (
          <div
            className="fixed inset-0 flex items-center justify-center z-[130] p-4 overflow-y-auto"
            style={{
              background: 'rgba(13,31,28,0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="rounded-2xl p-8 max-w-2xl w-full my-8 relative"
              style={{
                background: 'rgba(13,31,28,0.95)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 0 40px rgba(34,197,94,0.3)',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="mr-3" size={28} style={{ color: '#22C55E' }} />
                <h3 className="text-white font-bold text-2xl">Journal Analytics</h3>
                <Sparkles className="ml-3" size={28} style={{ color: '#22C55E' }} />
              </div>

              <div className="text-gray-300 space-y-6">
                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">Sentiment Analysis</h4>
                  <p><b>Sentiment:</b> {analyticsData.sentiment}</p>
                  <p><b>Polarity Score:</b> {analyticsData.polarity_score}</p>
                </div>

                <div>
                  <h4 className="text-teal-400 font-semibold text-lg mb-2">🩵 Emotional Summary</h4>
                  <p>{analyticsData.emotional_summary}</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">💬 Reflection</h4>
                  <p>{analyticsData.reflection}</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-2">🌱 Suggestions</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    {analyticsData.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleReset}
                  className="py-3 px-8 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    boxShadow: '0 0 25px rgba(249,115,22,0.4)',
                    fontWeight: '600',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slider Styling */}
      <style>{`
        .slider-mood::-webkit-slider-thumb,
        .slider-productivity::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider-mood::-webkit-slider-thumb {
          background: linear-gradient(135deg, #22C55E, #0F766E);
          box-shadow: 0 0 12px rgba(34,197,94,0.6);
        }

        .slider-productivity::-webkit-slider-thumb {
          background: linear-gradient(135deg, #0F766E, #22C55E);
          box-shadow: 0 0 12px rgba(15,118,110,0.6);
        }

        .slider-mood::-webkit-slider-thumb:hover,
        .slider-productivity::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}