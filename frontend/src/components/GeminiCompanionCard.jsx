import React, { useState } from 'react';
import { QuillSketch } from './SketchIcons';
import { Sparkles, RefreshCw, Clock, ShieldCheck, Lightbulb } from 'lucide-react';

export const GeminiCompanionCard = ({ latestInsight, onGenerateInsight, isGenerating, insightHistory }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [showHistory, setShowHistory] = useState(false);

  const periods = [
    { id: 'daily', label: 'Daily Reflection', desc: 'Recent habit changes & focus' },
    { id: 'weekly', label: 'Weekly Summary', desc: 'Progress & 7-day pattern analysis' },
    { id: 'explanation', label: 'Score Breakdown', desc: 'Which areas drive your score' },
    { id: 'suggestions', label: 'Practical Actions', desc: 'Small micro-adjustments' },
    { id: 'goals', label: 'Goals', desc: 'Realistic short-term targets' },
  ];

  const handleGenerate = () => {
    onGenerateInsight(selectedPeriod);
  };

  const insight = latestInsight?.generatedInsight || (latestInsight ? latestInsight : null);

  return (
    <div className="paper-card p-6 md:p-8 relative overflow-hidden">
      {/* Washi Tape Header */}
      <div className="washi-tape"></div>

      {/* Card Title & AI Companion Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3DAC8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A6F54]/10 border border-[#2A6F54]/30 flex items-center justify-center">
            <QuillSketch className="w-6 h-6" color="#2A6F54" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#1E2723]">AI Wellness Companion</h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF3EE] border border-[#BFD5C6] text-[#225741] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2A6F54]" />
                Llama 3.2 (Local) + Gemini Cloud
              </span>
            </div>
            <p className="text-xs text-[#7A7163] font-journal italic">
              Private on-device inference via Ollama • Cloud fallback • Empathetic lifestyle guidance
            </p>
          </div>
        </div>

        {/* History Toggle */}
        {insightHistory && insightHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="ink-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#6B6152]" />
            <span>{showHistory ? 'Hide Past Notes' : `Past Notes (${insightHistory.length})`}</span>
          </button>
        )}
      </div>

      {/* Mode / Question Selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPeriod(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
              selectedPeriod === p.id
                ? 'bg-[#252F2B] text-[#FAF8F2] border-[#18201C] shadow-xs'
                : 'bg-[#FAF7F0] text-[#554C3F] border-[#DDD3C0] hover:bg-[#F2EDE2]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Generate Prompt Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#F6F1E6] border border-[#E3DAC8] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#52493D]">
          <span className="font-semibold text-[#1F2824]">Request Mode: </span>
          <span>{periods.find(p => p.id === selectedPeriod)?.desc}</span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="ink-btn px-4 py-2 text-xs flex items-center gap-2 cursor-pointer ml-auto"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Formulating Guidance...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#A5D6B6]" />
              <span>Generate AI Reflection</span>
            </>
          )}
        </button>
      </div>

      {/* Past Notes Drawer */}
      {showHistory && (
        <div className="mt-4 p-4 rounded-xl bg-[#FAF7F0] border border-[#DDD3C0] max-h-60 overflow-y-auto space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#695F50]">
            Archived Companion Reflections
          </h4>
          {insightHistory.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#FFFDF9] border border-[#E3DAC8] text-xs">
              <div className="flex items-center justify-between text-[#82786A] text-[10px] mb-1">
                <span className="font-semibold uppercase">{item.period || 'General'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EAE4D7] text-[#554C3F]">
                    {item.source === 'llama3.2' ? '🦙 Llama 3.2' : item.source === 'gemini' ? '☁️ Gemini' : '🌿 Engine'}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="font-bold text-[#1F2824]">{item.generatedInsight?.headline}</p>
              <p className="text-[#5C5243] mt-1">{item.generatedInsight?.practicalAction}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generated Insight Note Container (Archival Letter Look) */}
      <div className="mt-5 p-5 md:p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#DDD3C0] relative shadow-[0_2px_10px_rgba(40,30,15,0.02)]">
        {insight ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                {insight.focusArea && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF3EE] text-[#225741] border border-[#C6DDD0] inline-block mb-1.5">
                    Focus Area: {insight.focusArea}
                  </span>
                )}
                <h3 className="text-lg font-bold text-[#1C2621]">
                  {insight.headline}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap flex items-center gap-1 ${
                  latestInsight?.source === 'llama3.2'
                    ? 'bg-[#EBF3EE] text-[#1E4D38] border-[#A8CEB8]'
                    : latestInsight?.source === 'gemini'
                    ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
                    : 'bg-[#F2EDE2] text-[#695F50] border-[#DDD3C0]'
                }`}>
                  {latestInsight?.source === 'llama3.2' && '🦙 Llama 3.2 (Local)'}
                  {latestInsight?.source === 'gemini' && '☁️ Gemini 1.5 Flash'}
                  {(!latestInsight?.source || latestInsight?.source === 'fallback_engine') && '🌿 Lifestyle Engine'}
                </span>
                {latestInsight?.source === 'llama3.2' && (
                  <span className="text-[9px] text-[#2A6F54] font-medium tracking-tight">
                    100% Private • On-Device
                  </span>
                )}
                {latestInsight?.source === 'gemini' && (
                  <span className="text-[9px] text-[#3B82F6] font-medium tracking-tight">
                    Cloud Fallback
                  </span>
                )}
              </div>
            </div>

            {/* Overview / Body */}
            <p className="text-xs md:text-sm text-[#4D453A] leading-relaxed font-journal">
              "{insight.overview}"
            </p>

            {/* Key Observations / Highlights */}
            {insight.highlights && insight.highlights.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#695F50] block mb-2">
                  Observed Patterns & Highlights
                </span>
                <ul className="space-y-1.5">
                  {insight.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-[#4F4639] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A6F54] mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Micro-Action Callout */}
            {insight.practicalAction && (
              <div className="p-3.5 rounded-xl bg-[#F4F8F5] border border-[#CBE1D3] flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#2A6F54]/10 text-[#2A6F54] shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#225741] block">
                    Recommended Micro-Action
                  </span>
                  <p className="text-xs text-[#2A4D3B] mt-0.5 font-medium">
                    {insight.practicalAction}
                  </p>
                </div>
              </div>
            )}

            {/* Medical Disclaimer Note */}
            <div className="pt-3 border-t border-[#EDE5D6] flex items-center gap-2 text-[10px] text-[#8C8273]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#73887E] shrink-0" />
              <span>
                {insight.disclaimer || 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <QuillSketch className="w-10 h-10 mx-auto opacity-40 mb-3" color="#6B6152" />
            <p className="text-sm font-semibold text-[#544B3E]">Your Journal Companion Awaits</p>
            <p className="text-xs text-[#8A8070] max-w-md mx-auto mt-1 font-journal">
              Select a reflection mode above and tap "Generate AI Reflection" to receive concise, friendly lifestyle guidance from Gemini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
