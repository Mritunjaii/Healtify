import React, { useState, useEffect } from 'react';
import {
  FoodSketch,
  LungsSmokingSketch,
  AlcoholSketch,
  ActivitySketch,
  SleepBedMoonSketch,
  WaterBottleSketch,
  ScreenPhoneSketch,
  WellnessHeartSketch,
  BookmarkSketch
} from './SketchIcons';
import { X, Check, Plus, Minus } from 'lucide-react';

export const QuickHabitLogger = ({ isOpen, onClose, initialDate, initialHabit, onHabitSaved }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || todayStr);
  
  // 1. Food
  const [outsideFoodCount, setOutsideFoodCount] = useState(0);
  const [junkFoodMeals, setJunkFoodMeals] = useState(0);
  // 2. Smoking
  const [smokingCount, setSmokingCount] = useState(0);
  // 3. Alcohol
  const [alcoholCount, setAlcoholCount] = useState(0);
  // 4. Physical Activity
  const [steps, setSteps] = useState(7500);
  const [workoutMinutes, setWorkoutMinutes] = useState(30);
  // 5. Sleep & Recovery
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(4);
  // 6. Hydration
  const [waterLiters, setWaterLiters] = useState(2.0);
  // 7. Screen Time
  const [screenTimeHours, setScreenTimeHours] = useState(2.5);
  // 8. Mental Wellness
  const [mood, setMood] = useState(4);
  const [stress, setStress] = useState(2);
  // 9. Personal Journal
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialHabit) {
      setDate(initialHabit.date || todayStr);
      setOutsideFoodCount(initialHabit.outsideFoodCount || 0);
      setJunkFoodMeals(initialHabit.junkFoodMeals || 0);
      setSmokingCount(initialHabit.smokingCount || 0);
      setAlcoholCount(initialHabit.alcoholCount || 0);
      setSteps(initialHabit.steps || 7500);
      setWorkoutMinutes(initialHabit.workoutMinutes || 30);
      setSleepHours(initialHabit.sleepHours || 7.5);
      setSleepQuality(initialHabit.sleepQuality || 4);
      setWaterLiters(initialHabit.waterLiters !== undefined ? initialHabit.waterLiters : 2.0);
      setScreenTimeHours(initialHabit.screenTimeHours !== undefined ? initialHabit.screenTimeHours : 2.5);
      setMood(initialHabit.mood || 4);
      setStress(initialHabit.stress || 2);
      setNotes(initialHabit.notes || '');
    } else {
      setDate(initialDate || todayStr);
    }
  }, [initialHabit, initialDate, isOpen]);

  if (!isOpen) return null;

  // Frontend Live Score Preview (Deterministic 8 categories divided by 8)
  const computePreview = () => {
    const foodScore = Math.max(10, Math.min(100, Math.round(100 - (outsideFoodCount * 18) - (junkFoodMeals * 14))));
    const smokingScore = smokingCount === 0 ? 100 : Math.max(5, Math.round(100 - (smokingCount * 12)));
    
    let alcoholScore = 100;
    if (alcoholCount === 1) alcoholScore = 85;
    else if (alcoholCount === 2) alcoholScore = 65;
    else if (alcoholCount > 2) alcoholScore = Math.max(5, 65 - ((alcoholCount - 2) * 18));
    
    const stepsPts = Math.min(1.2, steps / 10000) * 60;
    const workoutPts = Math.min(1.2, workoutMinutes / 45) * 40;
    const activityScore = Math.max(10, Math.min(100, Math.round(stepsPts + workoutPts)));
    
    let sleepScore = 25;
    if (sleepHours >= 7.0 && sleepHours <= 8.5) sleepScore = 95;
    else if (sleepHours >= 6.5 && sleepHours < 7.0) sleepScore = 80;
    else if (sleepHours > 8.5 && sleepHours <= 9.5) sleepScore = 85;
    else if (sleepHours >= 5.5 && sleepHours < 6.5) sleepScore = 65;
    else if (sleepHours >= 4.5 && sleepHours < 5.5) sleepScore = 45;
    const qualityAdj = (sleepQuality - 3) * 5;
    sleepScore = Math.max(15, Math.min(100, sleepScore + qualityAdj));

    const hydrationScore = Math.max(10, Math.min(100, Math.round(Math.min(1.0, waterLiters / 2.5) * 100)));

    let screenTimeScore = 100;
    if (screenTimeHours > 5.5) screenTimeScore = Math.max(15, Math.round(60 - (screenTimeHours - 5.5) * 10));
    else if (screenTimeHours > 3.5) screenTimeScore = 60;
    else if (screenTimeHours > 2.0) screenTimeScore = 82;

    const wellnessScore = Math.max(15, Math.min(100, Math.round(((mood / 5) * 50) + (((6 - stress) / 5) * 50))));

    const overall = Math.round((foodScore + smokingScore + alcoholScore + activityScore + sleepScore + hydrationScore + screenTimeScore + wellnessScore) / 8);
    return { overall, foodScore, smokingScore, alcoholScore, activityScore, sleepScore, hydrationScore, screenTimeScore, wellnessScore };
  };

  const preview = computePreview();
  const waterPercent = Math.min(100, Math.round((waterLiters / 2.5) * 100));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        date,
        outsideFoodCount: Number(outsideFoodCount),
        junkFoodMeals: Number(junkFoodMeals),
        smokingCount: Number(smokingCount),
        alcoholCount: Number(alcoholCount),
        steps: Number(steps),
        workoutMinutes: Number(workoutMinutes),
        sleepHours: Number(sleepHours),
        sleepQuality: Number(sleepQuality),
        waterLiters: Number(Number(waterLiters).toFixed(2)),
        screenTimeHours: Number(Number(screenTimeHours).toFixed(1)),
        mood: Number(mood),
        stress: Number(stress),
        notes: notes.trim()
      };

      await onHabitSaved(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2623]/50 backdrop-blur-xs overflow-y-auto">
      <div className="paper-card w-full max-w-3xl my-6 p-6 md:p-8 relative shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="washi-tape washi-tape-accent"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E3DAC8]">
          <div className="flex items-center gap-2.5">
            <BookmarkSketch className="w-6 h-6" color="#2A6F54" />
            <div>
              <h2 className="text-xl font-bold text-[#1E2723]">Daily Lifestyle Log</h2>
              <p className="text-xs text-[#7A7163] font-journal italic">
                Record your 8 lifestyle dimensions • Deterministic Healtify Score calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#DDD3C0] hover:bg-[#F2EDE2] text-[#6E6556] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-[#FBEBE8] border border-[#EEC1B9] text-xs text-[#8F3323]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Date Picker & Live Score Preview Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#F6F1E6] p-3.5 rounded-xl border border-[#E3DAC8]">
            <div>
              <label className="block text-xs font-semibold text-[#544C3F] mb-1">
                Log Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={todayStr}
                required
                className="w-full px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#D5C9B4] text-xs text-[#1F2824] focus:outline-none focus:ring-1 focus:ring-[#2A6F54]"
              />
            </div>
            {/* Live Score Preview */}
            <div className="flex items-center justify-between bg-[#FFFDF9] px-4 py-2.5 rounded-xl border border-[#D8CCBA]">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7A7163] block">
                  Calculated Healtify Score
                </span>
                <span className="text-2xl font-black text-[#1F2B26]">
                  {preview.overall}
                  <span className="text-xs font-normal text-[#8A8172]"> / 100</span>
                </span>
              </div>
              <div className="text-right text-[11px] font-medium text-[#4F685B]">
                {preview.overall >= 80 ? 'Optimal' : preview.overall >= 60 ? 'Balanced' : 'Needs Care'}
              </div>
            </div>
          </div>

          {/* 2-Column Grid for the 8 Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Food & Nutrition */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <FoodSketch className="w-5 h-5" color="#2A6F54" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  1. Food & Nutrition
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Outside Food Orders:</span>
                  <span className="font-bold">{outsideFoodCount} orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOutsideFoodCount(Math.max(0, outsideFoodCount - 1))}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={outsideFoodCount}
                    onChange={(e) => setOutsideFoodCount(Number(e.target.value))}
                    className="w-full accent-[#2A6F54]"
                  />
                  <button
                    type="button"
                    onClick={() => setOutsideFoodCount(outsideFoodCount + 1)}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Junk / Fast Food Meals:</span>
                  <span className="font-bold">{junkFoodMeals} meals</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={junkFoodMeals}
                  onChange={(e) => setJunkFoodMeals(Number(e.target.value))}
                  className="w-full accent-[#2A6F54]"
                />
              </div>
            </div>

            {/* 2. Smoking */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <LungsSmokingSketch className="w-5 h-5" color="#B33927" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  2. Smoking Habits
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Cigarettes Smoked:</span>
                  <span className={`font-bold ${smokingCount === 0 ? 'text-[#2A6F54]' : 'text-[#B33927]'}`}>
                    {smokingCount === 0 ? '0 (Smoke-free)' : `${smokingCount} sticks`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSmokingCount(Math.max(0, smokingCount - 1))}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={smokingCount}
                    onChange={(e) => setSmokingCount(Number(e.target.value))}
                    className="w-full accent-[#B33927]"
                  />
                  <button
                    type="button"
                    onClick={() => setSmokingCount(smokingCount + 1)}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmokingCount(0)}
                className="text-[10px] px-2 py-0.5 rounded bg-[#E3EFE8] text-[#1E563E] border border-[#B7D8C4]"
              >
                Mark Smoke-Free
              </button>
            </div>

            {/* 3. Alcohol */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <AlcoholSketch className="w-5 h-5" color="#C47C2B" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  3. Alcohol Balance
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Standard Drinks / Units:</span>
                  <span className={`font-bold ${alcoholCount === 0 ? 'text-[#2A6F54]' : 'text-[#C47C2B]'}`}>
                    {alcoholCount === 0 ? '0 (Alcohol-free)' : `${alcoholCount} drinks`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAlcoholCount(Math.max(0, alcoholCount - 1))}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={alcoholCount}
                    onChange={(e) => setAlcoholCount(Number(e.target.value))}
                    className="w-full accent-[#C47C2B]"
                  />
                  <button
                    type="button"
                    onClick={() => setAlcoholCount(alcoholCount + 1)}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAlcoholCount(0)}
                className="text-[10px] px-2 py-0.5 rounded bg-[#E3EFE8] text-[#1E563E] border border-[#B7D8C4]"
              >
                Mark Alcohol-Free
              </button>
            </div>

            {/* 4. Physical Activity */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <ActivitySketch className="w-5 h-5" color="#207264" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  4. Physical Activity
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Daily Steps:</span>
                  <span className="font-bold">{steps.toLocaleString()} steps</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="250"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-[#207264]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Workout / Active Time:</span>
                  <span className="font-bold">{workoutMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={workoutMinutes}
                  onChange={(e) => setWorkoutMinutes(Number(e.target.value))}
                  className="w-full accent-[#207264]"
                />
              </div>
            </div>

            {/* 5. Sleep & Recovery */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <SleepBedMoonSketch className="w-5 h-5" color="#2F4A71" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  5. Sleep & Recovery
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Sleep Duration:</span>
                  <span className="font-bold">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="12.0"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full accent-[#2F4A71]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Sleep Quality:</span>
                  <span className="font-bold">{sleepQuality} / 5</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`flex-1 py-0.5 text-xs rounded border transition ${
                        sleepQuality === q
                          ? 'bg-[#2F4A71] text-white border-[#1B3252]'
                          : 'bg-[#FFFDF9] text-[#554C3F] border-[#DDD3C0]'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Hydration (Water Consumption) */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WaterBottleSketch className="w-5 h-5" color="#1E6888" />
                  <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                    6. Hydration
                  </h4>
                </div>
                <span className="text-xs font-bold text-[#1E6888]">
                  {waterPercent}% of 2.5 L
                </span>
              </div>

              {/* Water Stepper Controls as specified in Section 3 */}
              <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#DDD3C0] text-center space-y-2">
                <div className="flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => setWaterLiters(Math.max(0, Math.round((waterLiters - 0.25) * 100) / 100))}
                    className="w-8 h-8 rounded-lg bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    [ − ]
                  </button>
                  <span className="text-base font-extrabold text-[#1E2723] font-mono">
                    {waterLiters.toFixed(1)} L / 2.5 L
                  </span>
                  <button
                    type="button"
                    onClick={() => setWaterLiters(Math.min(6.0, Math.round((waterLiters + 0.25) * 100) / 100))}
                    className="w-8 h-8 rounded-lg bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    [ + ]
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EAE3D4] h-2.5 rounded-full overflow-hidden border border-[#D9CEBC]">
                  <div
                    className="h-full rounded-full bg-[#1E6888] transition-all duration-300"
                    style={{ width: `${waterPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 7. Screen Time */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <ScreenPhoneSketch className="w-5 h-5" color="#68507B" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  7. Screen Time
                </h4>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Recreational Screen Time:</span>
                  <span className="font-bold">{screenTimeHours} hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScreenTimeHours(Math.max(0, Math.round((screenTimeHours - 0.5) * 10) / 10))}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0.0"
                    max="10.0"
                    step="0.5"
                    value={screenTimeHours}
                    onChange={(e) => setScreenTimeHours(Number(e.target.value))}
                    className="w-full accent-[#68507B]"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenTimeHours(Math.min(16.0, Math.round((screenTimeHours + 0.5) * 10) / 10))}
                    className="p-1 rounded bg-[#EAE2D2] text-[#4F4639] hover:bg-[#DDD3C0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-[#7A7163] italic">
                Social media, entertainment, recreational browsing.
              </p>
            </div>

            {/* 8. Mental Wellness */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DAC8] space-y-2.5">
              <div className="flex items-center gap-2">
                <WellnessHeartSketch className="w-5 h-5" color="#A24857" />
                <h4 className="font-semibold text-xs text-[#1E2723] uppercase tracking-wide">
                  8. Mental Wellness
                </h4>
              </div>

              {/* Mood 1-5 */}
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Mood (1: Low → 5: Great):</span>
                  <span className="font-bold">{mood} / 5</span>
                </div>
                <div className="flex items-center justify-between gap-2 px-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMood(val)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center border ${
                        mood === val
                          ? 'bg-[#A24857] text-white border-[#7E2937]'
                          : 'bg-[#FFFDF9] text-[#554C3F] border-[#DDD3C0] hover:bg-[#F2EDE2]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress 1-5 */}
              <div>
                <div className="flex justify-between text-xs text-[#524B40] mb-1">
                  <span>Stress (1: Peaceful → 5: High):</span>
                  <span className="font-bold">{stress} / 5</span>
                </div>
                <div className="flex items-center justify-between gap-2 px-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStress(val)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center border ${
                        stress === val
                          ? 'bg-[#C47C2B] text-white border-[#8E5212]'
                          : 'bg-[#FFFDF9] text-[#554C3F] border-[#DDD3C0] hover:bg-[#F2EDE2]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 9. Personal Journal Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#544C3F] mb-1">
              9. Personal Journal Notes (Contextual reflection)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Drank 2L of water throughout the morning, felt calm, walked outdoors after dinner..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D5C9B4] text-xs text-[#1F2824] focus:outline-none focus:ring-1 focus:ring-[#2A6F54] lined-paper"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#E3DAC8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="ink-btn-secondary px-4 py-2 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ink-btn px-6 py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Save Journal Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
