import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export const GoalsTracker = ({ goalsProgress = [] }) => {
  return (
    <div className="paper-card p-6 relative">
      <div className="flex items-center justify-between pb-3 border-b border-[#E3DAC8]">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#2A6F54]" />
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7364]">
              Personal Intentions
            </span>
            <h2 className="text-lg font-bold text-[#1E2723]">Lifestyle Goals</h2>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {goalsProgress.length === 0 ? (
          <p className="text-xs text-[#8A8070] italic">No active goals configured.</p>
        ) : (
          goalsProgress.map((goal) => {
            const isCompleted = goal.percent >= 100;
            return (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#252F2B] flex items-center gap-1.5">
                    {goal.title}
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A6F54]" />
                    )}
                  </span>
                  <span className="text-[#6E6352] text-[11px]">
                    {goal.current} / {goal.target} {goal.unit} ({goal.percent}%)
                  </span>
                </div>

                {/* Paper Ink Progress Strip */}
                <div className="w-full bg-[#EAE2D4] h-2 rounded-full overflow-hidden border border-[#DDD1BE]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(100, goal.percent)}%`,
                      backgroundColor: isCompleted ? '#2A6F54' : '#C47C2B'
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
