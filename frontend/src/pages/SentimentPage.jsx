import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SentimentModal } from "@/components/SentimentModal";
import { Recommendations } from "@/components/Recommendations";
import { serverUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { TrendingUp, Calendar, Brain, Smile } from "lucide-react";

export function SentimentPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [series, setSeries] = useState([]);
  const [formattedSeries, setFormattedSeries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showSentimentModal, setShowSentimentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const baseUrl = serverUrl.BASE_URL.replace(/\/+$/, "");

      const trendsRes = await fetch(
        `${baseUrl}/api/analytics/trends?user_uid=${user.uid}&date_range=${timeRange}`
      );
      const trends = await trendsRes.json();

      const summaryRes = await fetch(
        `${baseUrl}/api/analytics/summary?user_uid=${user.uid}&date_range=${timeRange}`
      );
      const summaryJson = await summaryRes.json();

      setSeries(trends.series || []);
      setSummary(summaryJson || {});
    } catch (e) {
      console.error("Error fetching analytics:", e);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAnalytics();
  }, [user?.uid, timeRange]);

  useEffect(() => {
    setFormattedSeries(formatSeries(series));
  }, [series, timeRange]);

  const formatSeries = (seriesData) => {
    if (!Array.isArray(seriesData) || !seriesData.length) return [];

    // 🗓️ 7-Day View: Day-level
    if (timeRange === "7d") {
      return seriesData.map((item) => ({
        ...item,
        label: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }), // ex: Mon, Tue
      }));
    }

    // 📅 30-Day View: Weekly Bins
    if (timeRange === "30d") {
      const weeks = [];
      let week = 1;
      const chunkSize = 7; // per week
      for (let i = 0; i < seriesData.length; i += chunkSize) {
        const chunk = seriesData.slice(i, i + chunkSize);
        const avgOverall =
          chunk.reduce((sum, d) => sum + d.combined_avg, 0) / chunk.length || 0;

        weeks.push({
          label: `Week ${week}`,
          combined_avg: parseFloat(avgOverall.toFixed(1)),
        });
        week++;
      }
      return weeks;
    }

    // 📊 6-Month or 1-Year View: Monthly Bins
    if (timeRange === "6mo" || timeRange === "1y") {
      const monthlyData = {};

      seriesData.forEach((item) => {
        const month = new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          year: timeRange === "1y" ? "2-digit" : undefined,
        });
        if (!monthlyData[month]) {
          monthlyData[month] = [];
        }
        monthlyData[month].push(item.combined_avg);
      });

      return Object.entries(monthlyData).map(([month, values]) => ({
        label: month,
        combined_avg: parseFloat(
          (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(1)
        ),
      }));
    }

    return seriesData;
  };

  const handleEntryClick = (entry) => {
    const modalData = {
      ...entry,
      sentiment: {
        overall: entry.combined_avg,
        positive: entry.sentiment_counts?.positive,
        negative: entry.sentiment_counts?.negative,
        neutral: entry.sentiment_counts?.neutral,
        sentiment_score: entry.sentiment_score ?? 0,
        energy_score: entry.energy_score ?? 0,
        keywords: [],
        emotions: [],
      },
    };
    setSelectedEntry(modalData);
    setShowSentimentModal(true);
  };

  const getSentimentReflection = () => {
    if (!summary?.averages) return "Emotional reflection loading...";

    const combinedAvg = summary.averages?.combined ?? 0;
    const positivePct = summary.sentiment_pct?.positive ?? 0;

    const trend =
      positivePct > 60 ? "positive" : positivePct > 40 ? "balanced" : "challenging";

    let reflection = `Over this period, your emotional trend was ${trend} (${positivePct}% positivity) with an average score of ${combinedAvg}/10. `;
    reflection +=
      trend === "positive"
        ? "You've enjoyed uplifting moments and shown strong emotional resilience. "
        : trend === "balanced"
          ? "You've maintained balance between reflection and positivity. "
          : "Challenges were present, but you’ve shown courage in processing them. ";
    reflection += summary.streaks?.current > 0
      ? `You’re on a ${summary.streaks.current}-day streak of positive entries!`
      : "Consider small steps to rebuild positive momentum.";
    return reflection;
  };

  const latestEntry = series[series.length - 1];

  return (
    <div className="min-h-screen p-6 bg-[#0B1210] text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Emotional Trends</h1>
        <p className="text-gray-300 mb-6">
          Track and understand your emotional patterns over time
        </p>

        {/* Time Range Toggle */}
        <div className="flex space-x-2 mb-8">
          {["7d", "30d", "6mo", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className={
                timeRange === range
                  ? "bg-green-500 hover:bg-green-600 border-green-400 text-white"
                  : "border-green-500/30 text-black hover:text-green-400 hover:border-green-400"
              }
            >
              {range === "7d"
                ? "7 Days"
                : range === "30d"
                  ? "30 Days"
                  : range === "6mo"
                    ? "6 Months"
                    : "1 Year"}
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
                <CardDescription className="text-gray-300">
                  Your emotional journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                      data={formattedSeries}
                      onClick={(e) =>
                        e?.activePayload && handleEntryClick(e.activePayload[0].payload)
                      }
                    >
                      <defs>
                        <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                      <XAxis dataKey="label" stroke="#E5E7EB" fontSize={12} />
                      <YAxis stroke="#E5E7EB" fontSize={12} domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{
                          background: "#0D1F1C",
                          border: "1px solid #22C55E",
                          color: "#FFF",
                        }}
                        itemStyle={{ color: "#FFF" }}
                        labelStyle={{ color: "#FFF" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="combined_avg"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fill="url(#overallGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="space-y-6">
              <Card className="glass-card bg-[#0D1F1C]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Smile className="w-5 h-5 text-green-400" />
                    <span>Average Mood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {summary.averages?.combined ?? "--"}/10
                  </div>
                  <p className="text-gray-300 text-sm">
                    {(summary.averages?.combined ?? 0) >= 7
                      ? "Feeling great!"
                      : (summary.averages?.combined ?? 0) >= 5
                        ? "Doing okay"
                        : "Needs attention"}
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
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {summary.streaks?.best ?? "--"} days
                  </div>
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
                    <p>📈 Avg mood: {summary.averages?.combined ?? "--"}/10</p>
                    <p>⚡ Avg energy: {summary.averages?.energy ?? "--"}/10</p>
                    <p>📊 Positivity: {summary.sentiment_pct?.positive ?? "--"}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
          {latestEntry && (
            <Recommendations
              userMoodData={{
                recentMood: latestEntry.combined_avg,
                energyLevel: latestEntry.energy_score,
                stressLevel: latestEntry.sentiment_counts?.negative,
                challenges: ["work stress", "overwhelm", "time management"],
              }}
            />
          )}
        </div>
      </div>

      <SentimentModal
        isOpen={showSentimentModal}
        onClose={() => setShowSentimentModal(false)}
        entry={selectedEntry}
      />
    </div>
  );
}
