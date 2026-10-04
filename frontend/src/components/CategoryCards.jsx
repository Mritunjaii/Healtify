import React from 'react';
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

export const CategoryCards = ({ scoreRecord, habit, onLogCategory }) => {
  const categories = [
    {
      id: 'food',
      name: 'Food & Nutrition',
      description: 'Outside food & junk meals',
      score: scoreRecord ? scoreRecord.foodScore : null,
      currentValue: habit
        ? `${habit.outsideFoodCount || 0} outside, ${habit.junkFoodMeals || 0} junk`
        : 'Not recorded',
      icon: (color) => <FoodSketch color={color} className="w-7 h-7" />,
      color: '#2A6F54',
      badge: habit
        ? (habit.outsideFoodCount === 0 && habit.junkFoodMeals === 0 ? 'Homecooked' : 'Takeout')
        : 'Pending',
    },
    {
      id: 'smoking',
      name: 'Smoking Pattern',
      description: 'Cigarettes & frequency',
      score: scoreRecord ? scoreRecord.smokingScore : null,
      currentValue: habit
        ? (habit.smokingCount === 0 ? '0 cigarettes' : `${habit.smokingCount} cigarettes`)
        : 'Not recorded',
      icon: (color) => <LungsSmokingSketch color={color} className="w-7 h-7" />,
      color: '#B33927',
      badge: habit
        ? (habit.smokingCount === 0 ? 'Smoke-Free' : `${habit.smokingCount} Sticks`)
        : 'Pending',
    },
    {
      id: 'alcohol',
      name: 'Alcohol Balance',
      description: 'Drinks / units',
      score: scoreRecord ? scoreRecord.alcoholScore : null,
      currentValue: habit
        ? (habit.alcoholCount === 0 ? '0 drinks' : `${habit.alcoholCount} standard drinks`)
        : 'Not recorded',
      icon: (color) => <AlcoholSketch color={color} className="w-7 h-7" />,
      color: '#C47C2B',
      badge: habit
        ? (habit.alcoholCount === 0 ? 'Alcohol-Free' : `${habit.alcoholCount} Drinks`)
        : 'Pending',
    },
    {
      id: 'activity',
      name: 'Physical Activity',
      description: 'Steps & active workout',
      score: scoreRecord ? scoreRecord.activityScore : null,
      currentValue: habit
        ? `${(habit.steps || 0).toLocaleString()} steps • ${habit.workoutMinutes || 0}m`
        : 'Not recorded',
      icon: (color) => <ActivitySketch color={color} className="w-7 h-7" />,
      color: '#207264',
      badge: habit
        ? ((habit.steps || 0) >= 8000 ? 'Active' : 'Light Move')
        : 'Pending',
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery',
      description: 'Duration & rest quality',
      score: scoreRecord ? scoreRecord.sleepScore : null,
      currentValue: habit
        ? `${habit.sleepHours || 0}h • Quality: ${habit.sleepQuality || 3}/5`
        : 'Not recorded',
      icon: (color) => <SleepBedMoonSketch color={color} className="w-7 h-7" />,
      color: '#2F4A71',
      badge: habit
        ? ((habit.sleepHours || 0) >= 7.0 ? 'Restorative' : 'Deficit')
        : 'Pending',
    },
    {
      id: 'hydration',
      name: 'Hydration',
      description: 'Water consumed today',
      score: scoreRecord ? scoreRecord.hydrationScore : null,
      currentValue: habit
        ? `${(habit.waterLiters || 0).toFixed(1)} L / 2.5 L (${Math.min(100, Math.round(((habit.waterLiters || 0) / 2.5) * 100))}%)`
        : 'Not recorded',
      icon: (color) => <WaterBottleSketch color={color} className="w-7 h-7" />,
      color: '#1E6888',
      badge: habit
        ? ((habit.waterLiters || 0) >= 2.0 ? 'Hydrated' : 'Low Fluids')
        : 'Pending',
    },
    {
      id: 'screenTime',
      name: 'Screen Time',
      description: 'Recreational screen time',
      score: scoreRecord ? scoreRecord.screenTimeScore : null,
      currentValue: habit
        ? `${(habit.screenTimeHours || 0)} hrs screen`
        : 'Not recorded',
      icon: (color) => <ScreenPhoneSketch color={color} className="w-7 h-7" />,
      color: '#68507B',
      badge: habit
        ? ((habit.screenTimeHours || 0) <= 2.5 ? 'Mindful' : 'Extended')
        : 'Pending',
    },
    {
      id: 'wellness',
      name: 'Mental Wellness',
      description: 'Mood & stress level',
      score: scoreRecord ? scoreRecord.wellnessScore : null,
      currentValue: habit
        ? `Mood: ${habit.mood || 3}/5 • Stress: ${habit.stress || 2}/5`
        : 'Not recorded',
      icon: (color) => <WellnessHeartSketch color={color} className="w-7 h-7" />,
      color: '#A24857',
      badge: habit
        ? ((habit.mood || 3) >= 4 ? 'Positive' : (habit.stress || 2) >= 4 ? 'Tension' : 'Calm')
        : 'Pending',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const hasScore = cat.score !== null && !isNaN(cat.score);
        let inkBarColor = '#2A6F54';
        if (hasScore) {
          if (cat.score < 50) inkBarColor = '#B33927';
          else if (cat.score < 75) inkBarColor = '#C47C2B';
        }

        return (
          <div
            key={cat.id}
            onClick={() => onLogCategory(cat.id)}
            className="paper-card p-4 flex flex-col justify-between cursor-pointer hover:border-[#BFB39E] group"
          >
            <div>
              {/* Header with Sketched Icon */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="p-2 rounded-xl bg-[#F4EFE5] border border-[#E3DAC8] group-hover:scale-105 transition-transform">
                  {cat.icon(cat.color)}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#1E2723]">
                    {hasScore ? cat.score : '—'}
                  </span>
                  <span className="text-[10px] text-[#8C8374] block uppercase tracking-wider">
                    Score / 100
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-semibold text-sm text-[#1E2723] group-hover:text-[#2A6F54] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#7C7465] mt-0.5 line-clamp-1">
                {cat.description}
              </p>
            </div>

            {/* Score Bar & Today's Metric */}
            <div className="mt-3.5 pt-2.5 border-t border-[#ECE5D8] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#696153] font-medium truncate max-w-[140px]">
                  {cat.currentValue}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F1ECE1] border border-[#DDD3C0] text-[#554C40]">
                  {cat.badge}
                </span>
              </div>

              {/* Paper Hatching / Ink Fill Bar */}
              <div className="w-full bg-[#EAE2D4] h-2 rounded-full overflow-hidden border border-[#D9CEBC]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${hasScore ? Math.min(100, cat.score) : 0}%`,
                    backgroundColor: inkBarColor
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
