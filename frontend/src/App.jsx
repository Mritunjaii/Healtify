import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HealtifyScoreGauge } from './components/HealtifyScoreGauge';
import { CategoryCards } from './components/CategoryCards';
import { QuickHabitLogger } from './components/QuickHabitLogger';
import { TrendCharts } from './components/TrendCharts';
import { AttentionAreas } from './components/AttentionAreas';
import { GoalsTracker } from './components/GoalsTracker';
import { GeminiCompanionCard } from './components/GeminiCompanionCard';
import { AuthModal } from './components/AuthModal';
import { QuillSketch, BookmarkSketch } from './components/SketchIcons';
import { api } from './services/api';
import { Check, RefreshCw, BookOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [insightHistory, setInsightHistory] = useState([]);
  
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const token = localStorage.getItem('healtify_token');
    if (token) {
      api.getMe()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            fetchDashboard();
            fetchInsightHistory();
          } else {
            localStorage.removeItem('healtify_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('healtify_token');
        })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.getDashboardData();
      if (res.success) {
        setDashboard(res);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  };

  const fetchInsightHistory = async () => {
    try {
      const res = await api.getInsightHistory();
      if (res.success) {
        setInsightHistory(res.insights || []);
      }
    } catch (err) {
      console.error('Error fetching insight history:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('healtify_token');
    setUser(null);
    setDashboard(null);
  };

  const handleHabitSaved = async (habitData) => {
    const res = await api.logHabit(habitData);
    if (res.success) {
      showToast(`Logged entry for ${habitData.date}! Healtify Score calculated: ${res.score.overallScore}/100.`);
      await fetchDashboard();
    } else {
      throw new Error(res.message || 'Failed to save habit');
    }
  };

  const handleGenerateInsight = async (period) => {
    setIsGeneratingInsight(true);
    try {
      const res = await api.generateInsight(period);
      if (res.success) {
        showToast('New wellness reflection penned by Gemini Companion!');
        await fetchDashboard();
        await fetchInsightHistory();
      } else {
        showToast(res.message || 'Error generating AI reflection');
      }
    } catch (err) {
      showToast('Failed to generate insight: ' + err.message);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EE] text-[#554C3F]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#2A6F54]" />
          <span className="text-xs font-semibold">Opening Your Wellness Journal...</span>
        </div>
      </div>
    );
  }

  const hasRecords = Boolean(dashboard?.scoreRecord || dashboard?.todayHabit || dashboard?.hasAnyRecords);

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1F2824] flex flex-col selection:bg-[#E2DDCF] selection:text-[#18211E]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2623] text-[#FAF8F2] px-4 py-2.5 rounded-xl border border-[#3E4944] shadow-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-[#8DD5AE]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenLogger={() => setIsLoggerOpen(true)}
      />

      {/* Application Main Body */}
      {user ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Welcome & Journal Date Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#E3DAC8]/70">
            <div>
              <span className="font-handwriting text-xl text-[#2A6F54] block">
                Welcome back to your wellness pages, {user.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A231F]">
                Daily Lifestyle & Wellness Journal
              </h1>
              <p className="text-xs text-[#706757] font-journal mt-0.5">
                8 everyday lifestyle dimensions converted into one transparent Healtify Score with Gemini guidance.
              </p>
            </div>

            {/* Quick Log Action Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoggerOpen(true)}
                className="ink-btn px-4 py-2 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-[#9BD0B1]" />
                <span>
                  {dashboard?.hasLoggedToday ? 'Edit Today’s Log' : 'Record Today’s Habits'}
                </span>
              </button>
            </div>
          </div>

          {/* Empty State Banner (If user has no data yet) */}
          {!hasRecords && (
            <div className="paper-card p-8 text-center relative border-2 border-dashed border-[#DDD3C0]">
              <div className="washi-tape washi-tape-accent"></div>
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2A6F54]/10 border border-[#2A6F54]/30 flex items-center justify-center mx-auto">
                  <QuillSketch className="w-7 h-7" color="#2A6F54" />
                </div>
                <h3 className="text-xl font-bold text-[#1E2723]">
                  Start your wellness journal
                </h3>
                <p className="text-xs text-[#6E6454] font-journal leading-relaxed">
                  Record today's habits to calculate your first Healtify Score across all 8 lifestyle dimensions: Food, Smoking, Alcohol, Activity, Sleep, Hydration, Screen Time, and Mental Wellness.
                </p>
                <button
                  onClick={() => setIsLoggerOpen(true)}
                  className="ink-btn px-6 py-2.5 text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-md"
                >
                  <BookmarkSketch className="w-4 h-4" color="#FAF8F2" />
                  <span>Record Today's Habits</span>
                </button>
              </div>
            </div>
          )}

          {/* Top Row: Hero Healtify Score + Gemini AI Companion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 4 cols: Deterministic Healtify Score Gauge */}
            <div className="lg:col-span-4 flex">
              <div className="w-full">
                <HealtifyScoreGauge
                  scoreRecord={dashboard?.scoreRecord}
                  onLogClick={() => setIsLoggerOpen(true)}
                />
              </div>
            </div>

            {/* Right 8 cols: Gemini AI Interpretation Companion */}
            <div className="lg:col-span-8 flex">
              <div className="w-full">
                <GeminiCompanionCard
                  latestInsight={dashboard?.latestInsight}
                  onGenerateInsight={handleGenerateInsight}
                  isGenerating={isGeneratingInsight}
                  insightHistory={insightHistory}
                />
              </div>
            </div>
          </div>

          {/* 8 Core Lifestyle Categories Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7364]">
                  8-Dimension Breakdown
                </span>
                <h2 className="text-base font-bold text-[#1E2723]">
                  Lifestyle Categories (0–100 Scores)
                </h2>
              </div>
              <span className="text-xs text-[#8A7F6E] italic font-journal">
                Tap any card to record or edit
              </span>
            </div>

            <CategoryCards
              scoreRecord={dashboard?.scoreRecord}
              habit={dashboard?.todayHabit}
              onLogCategory={() => setIsLoggerOpen(true)}
            />
          </div>

          {/* Trend Charts Section */}
          <TrendCharts
            trendData={dashboard?.trendData || []}
            trendInterpretation={dashboard?.trendInterpretation}
          />

          {/* Bottom Grid: Areas Needing Attention + Goals Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttentionAreas
              scoreRecord={dashboard?.scoreRecord}
              onLogClick={() => setIsLoggerOpen(true)}
            />
            <GoalsTracker goalsProgress={dashboard?.goalsProgress || []} />
          </div>

          {/* Footer with Medical Disclaimer Note */}
          <footer className="pt-8 pb-4 border-t border-[#E3DAC8] text-center text-xs text-[#8C8273] space-y-2">
            <p className="max-w-2xl mx-auto font-journal italic text-[11px]">
              "Healtify turns everyday lifestyle habits into a simple personal score and uses AI-powered insights to help users understand their patterns and make small, healthier changes."
            </p>
            <p className="text-[10px] text-[#A69B88]">
              Healtify is a lifestyle and wellness companion application, not a medical measurement or diagnostic system. Scores are calculated transparently on the backend and AI outputs serve solely as general wellness guidance.
            </p>
          </footer>
        </main>
      ) : (
        <AuthModal
          onAuthSuccess={(userData) => {
            setUser(userData);
            fetchDashboard();
            fetchInsightHistory();
          }}
        />
      )}

      {/* Habit Logger Modal */}
      <QuickHabitLogger
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        initialHabit={dashboard?.todayHabit}
        onHabitSaved={handleHabitSaved}
      />
    </div>
  );
}
