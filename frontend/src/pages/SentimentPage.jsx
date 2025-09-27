import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Brain, Smile } from "lucide-react";
import { SentimentModal } from "@/components/SentimentModal";
import { Recommendations } from "@/components/Recommendations";

export function SentimentPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showSentimentModal, setShowSentimentModal] = useState(false);

  const sentimentData = {
    "7d": [
      { date: "Mon", positive: 65, neutral: 25, negative: 10, overall: 6.5 },
      { date: "Tue", positive: 70, neutral: 20, negative: 10, overall: 7.0 },
      { date: "Wed", positive: 55, neutral: 30, negative: 15, overall: 5.5 },
      { date: "Thu", positive: 80, neutral: 15, negative: 5, overall: 8.0 },
      { date: "Fri", positive: 75, neutral: 20, negative: 5, overall: 7.5 },
      { date: "Sat", positive: 85, neutral: 10, negative: 5, overall: 8.5 },
      { date: "Sun", positive: 78, neutral: 18, negative: 4, overall: 5.6 },
    ],
    "30d": [
      { date: "Week 1", positive: 68, neutral: 22, negative: 10, overall: 6.8 },
      { date: "Week 2", positive: 72, neutral: 20, negative: 8, overall: 7.2 },
      { date: "Week 3", positive: 65, neutral: 25, negative: 10, overall: 6.5 },
      { date: "Week 4", positive: 78, neutral: 18, negative: 4, overall: 7.8 },
    ],
    "6mo": [
      { date: "Jan", positive: 60, neutral: 30, negative: 10, overall: 6.0 },
      { date: "Feb", positive: 65, neutral: 25, negative: 10, overall: 6.5 },
      { date: "Mar", positive: 70, neutral: 22, negative: 8, overall: 7.0 },
      { date: "Apr", positive: 75, neutral: 20, negative: 5, overall: 7.5 },
      { date: "May", positive: 72, neutral: 23, negative: 5, overall: 7.2 },
      { date: "Jun", positive: 78, neutral: 18, negative: 4, overall: 4.1 },
    ],
  };

  const currentData = sentimentData[timeRange];
  const latestEntry = currentData[currentData.length - 1];

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowSentimentModal(true);
  };

  const getSentimentReflection = () => {
    const avgPositive = Math.round(currentData.reduce((sum, d) => sum + d.positive, 0) / currentData.length);
    const avgNegative = Math.round(currentData.reduce((sum, d) => sum + d.negative, 0) / currentData.length);
    const avgOverall = Math.round(currentData.reduce((sum, d) => sum + d.overall, 0) / currentData.length);

    const trend = avgPositive > 60 ? "positive" : avgPositive > 40 ? "balanced" : "challenging";

    let reflection = `Over the selected period, your mood has been ${trend} (${avgPositive}% positive) with an overall score of ${avgOverall}/10. `;
    if (trend === "positive") reflection += "You've experienced uplifting moments with meditation and social connections. ";
    else if (trend === "balanced") reflection += "Your emotional state shows balance between reflective and energizing periods. ";
    else reflection += "You've faced challenges, showing courage in processing difficult emotions. ";

    reflection += avgNegative > 25 ? "Some stress related to work or deadlines is noted." : "Good emotional regulation observed.";
    return reflection;
  };

  return (
    <div className="min-h-screen p-6 bg-[#0B1210] text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Emotional Trends</h1>
        <p className="text-gray-300 mb-6">Track and understand your emotional patterns over time</p>

        {/* Time Range Toggle */}
        <div className="flex space-x-2 mb-8">
          {["7d", "30d", "6mo"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className={timeRange === range
                ? "bg-green-500 hover:bg-green-600 border-green-400 text-white"
                : "border-green-500/30 text-black hover:text-green-400 hover:border-green-400"
              }
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "6 Months"}
            </Button>
          ))}
        </div>

        {/* Main Chart */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card h-[560px] bg-[#0D1F1C]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Sentiment Trends</span>
                </CardTitle>
                <CardDescription className="text-gray-300">Your emotional journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                    <XAxis dataKey="date" stroke="#E5E7EB" fontSize={12}/>
                    <YAxis stroke="#E5E7EB" fontSize={12} domain={[0, 10]} />
                    <Area type="monotone" dataKey="overall" stroke="#22C55E" strokeWidth={2} fill="url(#overallGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            <Card className="glass-card bg-[#0D1F1C]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Smile className="w-5 h-5 text-green-400" />
                  <span>Average Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">{latestEntry.overall}/10</div>
                <p className="text-gray-300 text-sm">
                  {latestEntry.overall >= 7 ? "Feeling great!" : latestEntry.overall >= 5 ? "Doing okay" : "Needs attention"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card bg-[#0D1F1C]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5 text-green-400" />
                  <span>Best Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">12 days</div>
                <p className="text-gray-300 text-sm">Consecutive positive entries</p>
              </CardContent>
            </Card>

            <Card className="glass-card bg-[#0D1F1C]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span>Weekly Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>📈 Mood improved by 15% this week</p>
                  <p>🌟 Most positive on weekends</p>
                  <p>💭 Gratitude practices helping</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reflection */}
        <div className="mt-12">
          <Card className="glass-card bg-[#0D1F1C]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Brain className="w-5 h-5 text-green-400" />
                <span>Your Emotional Journey</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-gray-300">
                {getSentimentReflection()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <Recommendations userMoodData={{
            recentMood: latestEntry.overall,
            stressLevel: latestEntry.negative,
            energyLevel: latestEntry.positive,
            challenges: ["work stress", "overwhelm", "time management"]
          }} />
        </div>
      </div>

      {/* Modal */}
      <SentimentModal isOpen={showSentimentModal} onClose={() => setShowSentimentModal(false)} entry={selectedEntry} />
    </div>
  );
}
