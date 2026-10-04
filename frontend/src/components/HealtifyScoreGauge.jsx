import React from 'react';

export const HealtifyScoreGauge = ({ scoreRecord, onLogClick }) => {
  const score = scoreRecord ? Math.round(scoreRecord.overallScore) : null;
  const hasScore = score !== null && !isNaN(score);

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // 270-degree arc
  const strokeDashoffset = hasScore
    ? circumference - (circumference * 0.75 * (score / 100))
    : circumference;

  let label = 'Awaiting First Entry';
  let badgeClass = 'bg-[#EDE8DC] text-[#635A4D] border-[#D6CDBC]';
  let needleColor = '#635A4D';

  if (hasScore) {
    if (score >= 85) {
      label = 'Optimal Wellness';
      badgeClass = 'bg-[#E3EFE8] text-[#1E563E] border-[#B7D8C4]';
      needleColor = '#2A6F54';
    } else if (score >= 70) {
      label = 'Good Balance';
      badgeClass = 'bg-[#E5EFF3] text-[#245367] border-[#BCD4DE]';
      needleColor = '#245367';
    } else if (score >= 50) {
      label = 'Fair / Moderate';
      badgeClass = 'bg-[#F9F1E2] text-[#86591C] border-[#E8D4B4]';
      needleColor = '#C2822B';
    } else {
      label = 'Needs Recovery & Care';
      badgeClass = 'bg-[#FBEBE8] text-[#8F3323] border-[#EEC1B9]';
      needleColor = '#BD4B39';
    }
  }

  return (
    <div className="paper-card p-6 relative overflow-hidden flex flex-col items-center justify-between text-center">
      {/* Paper Washi Tape header */}
      <div className="washi-tape washi-tape-accent"></div>

      {/* Top Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EBE4D5] text-left">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7364]">
            Computed Lifestyle Index
          </span>
          <h2 className="text-lg font-bold text-[#1E2723]">Healtify Score</h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${badgeClass}`}>
          {label}
        </span>
      </div>

      {/* Gauge Visualization */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-48 h-48 -rotate-135" viewBox="0 0 200 200">
          {/* Background Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#EAE3D2"
            strokeWidth="12"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Sketched tick marks around the perimeter */}
          {[0, 25, 50, 75, 100].map((tick, i) => {
            const angle = -135 + (tick / 100) * 270;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + (radius - 12) * Math.cos(rad);
            const y1 = 100 + (radius - 12) * Math.sin(rad);
            const x2 = 100 + (radius - 5) * Math.cos(rad);
            const y2 = 100 + (radius - 5) * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#C7BDAB"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          {/* Active Score Arc */}
          {hasScore && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke={needleColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>

        {/* Center Score Reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hasScore ? (
            <>
              <span className="text-4xl font-extrabold tracking-tight text-[#1C2621]">
                {score}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#7C7466] font-medium">
                out of 100
              </span>
            </>
          ) : (
            <div className="px-4">
              <span className="text-sm font-medium text-[#7C7466]">No log yet</span>
              <p className="text-xs text-[#9E9484] mt-1">Record today to calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* Score Summary & Formula transparency */}
      <div className="w-full bg-[#F6F1E6] rounded-xl p-3 border border-[#E3DAC8] text-left text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[#4D453A]">
          <span className="font-semibold">Deterministic Formula:</span>
          <span className="text-[10px] font-mono text-[#6A6153]">8 Categories / 8</span>
        </div>
        <p className="text-[11px] text-[#7A7163] leading-relaxed">
          Food + Smoking + Alcohol + Activity + Sleep + Hydration + Screen + Wellness. Evaluated deterministically in backend.
        </p>
      </div>

      {/* Scope disclaimer */}
      <div className="mt-3 text-[10px] text-[#8C8273] italic">
        * Healtify Score is a personal lifestyle indicator, not a medical measurement or diagnosis.
      </div>
    </div>
  );
};
