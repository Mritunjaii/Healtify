import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import {
  FoodSketch,
  LungsSmokingSketch,
  AlcoholSketch,
  ActivitySketch,
  SleepBedMoonSketch,
  WaterBottleSketch,
  ScreenPhoneSketch,
  WellnessHeartSketch
} from './SketchIcons';

export const AttentionAreas = ({ scoreRecord, onLogClick }) => {
  const breakdown = scoreRecord?.breakdown;
  const attentionAreas = breakdown?.attentionAreas || [];

  const getCategoryIcon = (key) => {
    switch (key) {
      case 'food': return <FoodSketch className="w-5 h-5" color="#B33927" />;
      case 'smoking': return <LungsSmokingSketch className="w-5 h-5" color="#B33927" />;
      case 'alcohol': return <AlcoholSketch className="w-5 h-5" color="#C47C2B" />;
      case 'activity': return <ActivitySketch className="w-5 h-5" color="#C47C2B" />;
      case 'sleep': return <SleepBedMoonSketch className="w-5 h-5" color="#2F4A71" />;
      case 'hydration': return <WaterBottleSketch className="w-5 h-5" color="#1E6888" />;
      case 'screenTime': return <ScreenPhoneSketch className="w-5 h-5" color="#68507B" />;
      case 'wellness': return <WellnessHeartSketch className="w-5 h-5" color="#A24857" />;
      default: return <AlertCircle className="w-5 h-5 text-[#B33927]" />;
    }
  };

  const getPracticalPivot = (key) => {
    switch (key) {
      case 'food': return 'Prepare one home-cooked meal or swap takeout for a simple grain/veggie bowl.';
      case 'smoking': return 'Delay the next cigarette by 30 minutes with a tall glass of cold water.';
      case 'alcohol': return 'Alternate alcoholic drinks with sparkling water or switch to herbal tea.';
      case 'activity': return 'Take a 10-minute post-meal stroll or stand during your next call.';
      case 'sleep': return 'Dim bedroom lights 40 minutes earlier and stow your phone away from the bed.';
      case 'hydration': return 'Keep a 1-liter bottle at your desk and aim to finish the first bottle before 1 PM.';
      case 'screenTime': return 'Swap 20 minutes of late-night social scrolling for reading or quiet wind-down.';
      case 'wellness': return 'Take 3 deep grounding breaths or write down 2 things you feel grateful for today.';
      default: return 'Focus on gentle, consistent daily habit pivots.';
    }
  };

  return (
    <div className="paper-card p-6 relative">
      <div className="flex items-center justify-between pb-3 border-b border-[#E3DAC8]">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7364]">
            Actionable Observations
          </span>
          <h2 className="text-lg font-bold text-[#1E2723]">Areas Needing Attention</h2>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {attentionAreas.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#F0F6F2] border border-[#C5DDD0] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2A6F54] shrink-0" />
            <div className="text-xs text-[#204E3B]">
              <span className="font-bold block">All 8 Dimensions in Healthy Balance!</span>
              No high-friction deficit areas detected. Keep nurturing your daily rhythm.
            </div>
          </div>
        ) : (
          attentionAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-[#D0BF9F] transition space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#FAF7F0] border border-[#DDD3C0]">
                    {getCategoryIcon(area.key)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#1E2723]">{area.name}</h4>
                    <span className="text-[10px] text-[#8A7F6E]">Score: {area.score}/100 • {area.status}</span>
                  </div>
                </div>
                <button
                  onClick={onLogClick}
                  className="text-[11px] font-semibold text-[#2A6F54] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Update</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-[#5C5243] font-journal bg-[#FAF6EE] p-2 rounded-lg border border-[#EDE3D2]">
                💡 <span className="font-medium">Nudge:</span> {getPracticalPivot(area.key)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
