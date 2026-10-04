import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const TrendCharts = ({ trendData = [], trendInterpretation }) => {
  // 3 Views: 'score' | 'categories' | 'balance'
  const [activeTab, setActiveTab] = useState('score');
  const [daysLimit, setDaysLimit] = useState(7); // 7 | 14

  // Interactive toggleable lines for the 8 Categories view
  const [visibleCategories, setVisibleCategories] = useState({
    food: true,
    smoking: false,
    alcohol: false,
    activity: true,
    sleep: true,
    hydration: true,
    screenTime: false,
    wellness: false,
  });

  // Hover state for the Habit Balance donut chart ('healthy' | 'risk' | null)
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const categoryConfigs = [
    { key: 'food', label: 'Food', color: '#2A6F54', scoreKey: 'foodScore' },
    { key: 'smoking', label: 'Smoking', color: '#B33927', scoreKey: 'smokingScore' },
    { key: 'alcohol', label: 'Alcohol', color: '#C47C2B', scoreKey: 'alcoholScore' },
    { key: 'activity', label: 'Activity', color: '#207264', scoreKey: 'activityScore' },
    { key: 'sleep', label: 'Sleep', color: '#2F4A71', scoreKey: 'sleepScore' },
    { key: 'hydration', label: 'Hydration', color: '#1E6888', scoreKey: 'hydrationScore' },
    { key: 'screenTime', label: 'Screen Time', color: '#68507B', scoreKey: 'screenTimeScore' },
    { key: 'wellness', label: 'Wellness', color: '#A24857', scoreKey: 'wellnessScore' },
  ];

  const toggleCategory = (key) => {
    setVisibleCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Slice dataset for the selected window
  const data = trendData.slice(-daysLimit);

  // Custom Paper Tooltip for main line/area graphs
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFDF9] border border-[#DDD3C0] p-2.5 rounded-xl shadow-xl text-xs space-y-1.5 z-30">
          <p className="font-bold text-[#1F2824] border-b border-[#EDE5D6] pb-1 font-mono">
            Date: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-[11px]">
              <span style={{ color: entry.color }} className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-extrabold text-[#1E2723]">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate average scores across the active window for each category
  const categoryAverages = categoryConfigs.map(c => {
    const sum = data.reduce((acc, d) => acc + (d[c.scoreKey] || 0), 0);
    const avg = data.length > 0 ? Math.round(sum / data.length) : 0;
    
    let statusLabel = 'Good';
    let statusClass = 'bg-[#E3EFE8] text-[#1E563E] border-[#B7D8C4]';
    let barColor = '#2A6F54';

    if (avg < 60) {
      statusLabel = 'Needs Attention';
      statusClass = 'bg-[#FBEBE8] text-[#8F3323] border-[#EEC1B9]';
      barColor = '#B33927';
    } else if (avg < 75) {
      statusLabel = 'Improve';
      statusClass = 'bg-[#F9F1E2] text-[#86591C] border-[#E8D4B4]';
      barColor = '#C47C2B';
    }

    return {
      ...c,
      average: avg,
      statusLabel,
      statusClass,
      barColor
    };
  });

  // Calculate overall average score for the window
  const overallAvg = data.length > 0
    ? Math.round(data.reduce((acc, d) => acc + (d.overallScore || 0), 0) / data.length)
    : 75;

  // Meaningful Donut Calculation: based on actual lifestyle quality vs friction load
  const healthyPct = Math.max(10, Math.min(95, overallAvg));
  const riskPct = 100 - healthyPct;

  const donutChartData = [
    { name: 'Healthy Habits', value: healthyPct, key: 'healthy' },
    { name: 'Risk Factors', value: riskPct, key: 'risk' }
  ];

  // Drivers: Supporting you (scores >= 70, sorted highest) vs Needs Attention (scores < 70, sorted lowest)
  const supportingDrivers = [...categoryAverages]
    .filter(c => c.average >= 70)
    .sort((a, b) => b.average - a.average);

  const riskDrivers = [...categoryAverages]
    .filter(c => c.average < 70)
    .sort((a, b) => a.average - b.average);

  // If one side is empty, pick top 4 vs bottom 4
  const sortedByScore = [...categoryAverages].sort((a, b) => b.average - a.average);
  const displaySupporting = supportingDrivers.length > 0 ? supportingDrivers : sortedByScore.slice(0, 4);
  const displayRisk = riskDrivers.length > 0 ? riskDrivers : sortedByScore.slice(4);

  const strongestHabit = sortedByScore[0];
  const lowestHabit = sortedByScore[sortedByScore.length - 1];

  // Trend Interpretation from props
  const interp = trendInterpretation || {
    trendDirection: 'steady',
    percentageChange: 0,
    message: 'Consistent trajectory observed across your logged days.'
  };

  return (
    <div className="paper-card p-6 md:p-7 relative space-y-5">
      {/* Top Header & Weekly Trend */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-[#E3DAC8]">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7364]">
            HISTORICAL TRAJECTORY
          </span>
          <h2 className="text-xl font-bold text-[#1E2723]">Lifestyle Trends</h2>
        </div>

        {/* Weekly Trend Interpretation */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6F6656] font-medium">Weekly trend:</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
              interp.trendDirection === 'improving'
                ? 'bg-[#E3EFE8] text-[#1E563E] border-[#B7D8C4]'
                : interp.trendDirection === 'needs_attention'
                ? 'bg-[#FBEBE8] text-[#8F3323] border-[#EEC1B9]'
                : 'bg-[#F2EDE2] text-[#554C3F] border-[#DDD3C0]'
            }`}>
              {interp.trendDirection === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
              {interp.trendDirection === 'needs_attention' && <TrendingDown className="w-3.5 h-3.5" />}
              {interp.trendDirection === 'steady' && <Minus className="w-3.5 h-3.5" />}
              {interp.trendDirection === 'improving'
                ? 'Improving'
                : interp.trendDirection === 'needs_attention'
                ? 'Needs Attention'
                : 'Steady'}
            </span>
          </div>
          <p className="text-[11px] text-[#7A7163] mt-0.5 italic font-journal">
            {interp.message}
          </p>
        </div>
      </div>

      {/* Tabs Selector: [Healtify Score] [8 Categories] [Habit Balance]  |  [7 Days] [14 Days] */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center bg-[#F2EDE2] p-1 rounded-xl border border-[#DDD3C0] text-xs">
          <button
            onClick={() => setActiveTab('score')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'score'
                ? 'bg-[#FFFDF9] text-[#1E2723] shadow-xs'
                : 'text-[#6B6152] hover:text-[#1E2723]'
            }`}
          >
            Healtify Score
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#FFFDF9] text-[#1E2723] shadow-xs'
                : 'text-[#6B6152] hover:text-[#1E2723]'
            }`}
          >
            8 Categories
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'balance'
                ? 'bg-[#FFFDF9] text-[#1E2723] shadow-xs'
                : 'text-[#6B6152] hover:text-[#1E2723]'
            }`}
          >
            Habit Balance
          </button>
        </div>

        {/* 7 Days / 14 Days Switcher */}
        <div className="flex items-center bg-[#F2EDE2] p-1 rounded-xl border border-[#DDD3C0] text-xs">
          <button
            onClick={() => setDaysLimit(7)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              daysLimit === 7
                ? 'bg-[#FFFDF9] text-[#1E2723] shadow-xs'
                : 'text-[#6B6152]'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDaysLimit(14)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              daysLimit === 14
                ? 'bg-[#FFFDF9] text-[#1E2723] shadow-xs'
                : 'text-[#6B6152]'
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: HEALTIFY SCORE TAB                                      */}
      {/* ============================================================== */}
      {activeTab === 'score' && (
        <div className="h-68 w-full pt-1">
          {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[#8A8172]">
              <p>Start recording your daily habits to view trends on this paper chart.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreInk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A6F54" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2A6F54" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ECE5D6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#9E9484" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#9E9484" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="overallScore"
                  name="Healtify Score"
                  stroke="#2A6F54"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#scoreInk)"
                  dot={{ stroke: '#2A6F54', strokeWidth: 2, r: 4, fill: '#FAF7F0' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: 8 CATEGORIES TAB (Graph + LIFESTYLE STATUS rows)        */}
      {/* ============================================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          {/* Multi-Line Chart with interactive line toggles */}
          <div className="h-68 w-full flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5 mb-2 pb-1 border-b border-[#EFE8DC]">
              <span className="text-[11px] text-[#7A7163] font-medium mr-1">Toggle Lines:</span>
              {categoryConfigs.map(c => {
                const isVisible = visibleCategories[c.key];
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleCategory(c.key)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isVisible
                        ? 'bg-[#FFFDF9] shadow-xs'
                        : 'bg-[#EDE7DA]/50 text-[#8C8273] opacity-60'
                    }`}
                    style={{
                      borderColor: isVisible ? c.color : '#DDD3C0',
                      color: isVisible ? c.color : '#7C7364'
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isVisible ? c.color : '#BDB2A0' }} />
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#ECE5D6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#9E9484" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#9E9484" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  {categoryConfigs.map(c => (
                    visibleCategories[c.key] ? (
                      <Line
                        key={c.key}
                        type="monotone"
                        dataKey={c.scoreKey}
                        name={c.label}
                        stroke={c.color}
                        strokeWidth={2.2}
                        dot={{ r: 3, fill: '#FAF7F0' }}
                        activeDot={{ r: 5 }}
                      />
                    ) : null
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIFESTYLE STATUS (Exclusive to 8 Categories tab) */}
          <div className="pt-3 border-t border-[#E3DAC8]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6F6656]">
                LIFESTYLE STATUS
              </h3>
              <span className="text-[10px] text-[#8C8273] font-semibold">
                Last {daysLimit} Days Average
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {categoryAverages.map(cat => (
                <div
                  key={cat.key}
                  className="flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E3DAC8]/70 text-xs"
                >
                  <span className="font-semibold text-[#1E2723] w-24 truncate">
                    {cat.label}
                  </span>
                  <span className="font-extrabold text-[#2F3934] w-7 text-right font-mono">
                    {cat.average}
                  </span>
                  {/* Progress bar */}
                  <div className="flex-1 bg-[#EAE2D4] h-1.5 rounded-full overflow-hidden border border-[#D9CEBC]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.average}%`,
                        backgroundColor: cat.barColor
                      }}
                    />
                  </div>
                  {/* Explicit Text Label */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.statusClass} w-24 text-center shrink-0`}>
                    {cat.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: HABIT BALANCE TAB (Donut + Drivers + Takeaway ONLY)      */}
      {/* ============================================================== */}
      {activeTab === 'balance' && (
        <div className="space-y-5">
          {/* 1. DONUT CHART (Interactive Donut with center text) */}
          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#DDD3C0] flex flex-col items-center justify-center relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#695F50] mb-1">
              HABIT BALANCE
            </h3>

            <div className="relative w-48 h-48 flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#FFFDF9"
                    strokeWidth={2}
                    onMouseEnter={(_, index) => {
                      setHoveredSegment(donutChartData[index].key);
                    }}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <Cell fill="#2A6F54" className="cursor-pointer transition-opacity hover:opacity-85" />
                    <Cell fill="#B33927" className="cursor-pointer transition-opacity hover:opacity-85" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Reading */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-3xl font-black text-[#1E2723] tracking-tight">
                  {healthyPct}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A6F54]">
                  HEALTHY
                </span>
              </div>
            </div>

            {/* Donut Subtitle & Hover Indicator */}
            <div className="text-center space-y-1 mt-1">
              <p className="text-xs font-bold text-[#1E2723]">
                <span className="text-[#2A6F54]">{healthyPct}% Healthy</span>
                <span className="text-[#8C8273] mx-1.5">&bull;</span>
                <span className="text-[#B33927]">{riskPct}% Risk Factors</span>
              </p>
              {interp.percentageChange !== 0 && (
                <p className="text-[11px] text-[#6E6454] font-medium font-journal">
                  {interp.percentageChange > 0 ? `+${interp.percentageChange}%` : `${interp.percentageChange}%`} from previous 7 days
                </p>
              )}
            </div>

            {/* Interactive Hover Breakdown Card */}
            {hoveredSegment && (
              <div className="mt-3 p-2.5 rounded-xl bg-[#FFFDF9] border border-[#DDD3C0] text-xs max-w-sm w-full shadow-md animate-fade-in">
                {hoveredSegment === 'healthy' ? (
                  <div>
                    <span className="font-bold text-[#2A6F54] block text-[11px] mb-1">
                      Healthy Habits &mdash; {healthyPct}%
                    </span>
                    <p className="text-[11px] text-[#554C3F]">
                      <strong>Strongest contributors:</strong>{' '}
                      {displaySupporting.map(c => `${c.label} (${c.average})`).join(' &bull; ')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-[#B33927] block text-[11px] mb-1">
                      Risk Factors &mdash; {riskPct}%
                    </span>
                    <p className="text-[11px] text-[#554C3F]">
                      <strong>Areas affecting lifestyle:</strong>{' '}
                      {displayRisk.map(c => `${c.label} (${c.average})`).join(' &bull; ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. WHAT'S DRIVING YOUR BALANCE (Compact Two Columns, No Progress Bars) */}
          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C0] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#695F50] border-b border-[#E3DAC8] pb-1.5">
              WHAT&rsquo;S DRIVING YOUR BALANCE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Supporting You */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A6F54] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SUPPORTING YOU
                </span>
                <div className="space-y-1.5">
                  {displaySupporting.map(c => (
                    <div
                      key={c.key}
                      className="flex items-center justify-between px-2.5 py-1 rounded-md bg-[#F4F9F6] border border-[#C5DDD0]"
                    >
                      <span className="font-semibold text-[#2C483B]">{c.label}</span>
                      <span className="font-bold text-[#2A6F54] font-mono">{c.average}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B33927] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  NEEDS ATTENTION
                </span>
                <div className="space-y-1.5">
                  {displayRisk.map(c => (
                    <div
                      key={c.key}
                      className="flex items-center justify-between px-2.5 py-1 rounded-md bg-[#FDF5F4] border border-[#EEC1B9]"
                    >
                      <span className="font-semibold text-[#5A241B]">{c.label}</span>
                      <span className="font-bold text-[#B33927] font-mono">{c.average}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. WEEKLY TAKEAWAY (One Short Concise Interpretation) */}
          <div className="p-3.5 rounded-xl bg-[#F7F3E9] border border-[#DDD3C0] flex items-start gap-3">
            <div className="p-1 rounded-lg bg-[#2A6F54]/10 text-[#2A6F54] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider text-[#524B40] block text-[10px]">
                WEEKLY TAKEAWAY
              </span>
              <p className="text-[#3A3226] font-journal mt-0.5 leading-relaxed">
                Your strongest habits are {strongestHabit?.label?.toLowerCase()} ({strongestHabit?.average}/100) and steady daily routines. Focusing on small pivots in {lowestHabit?.label?.toLowerCase()} ({lowestHabit?.average}/100) will yield the biggest positive lift to your overall lifestyle score.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
