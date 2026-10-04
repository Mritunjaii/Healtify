const express = require('express');
const router = express.Router();
const DailyHabit = require('../models/DailyHabit');
const Score = require('../models/Score');
const AIInsight = require('../models/AIInsight');
const { protect } = require('../middleware/auth');

const getTodayString = () => new Date().toISOString().split('T')[0];

// @route   GET /api/dashboard
// @desc    Retrieve all aggregated dashboard data for the 8 lifestyle categories
router.get('/', protect, async (req, res) => {
  try {
    const today = getTodayString();
    const userId = req.user._id;

    // 1. Fetch today's habit and score
    let todayHabit = await DailyHabit.findOne({ userId, date: today });
    let latestScore = await Score.findOne({ userId, date: today });

    // If today hasn't been logged yet, get the most recent score
    if (!latestScore) {
      latestScore = await Score.findOne({ userId }).sort({ date: -1 });
    }

    // 2. Fetch last 30 days of habits and scores for trend charts & comparisons
    const recentScores = await Score.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    const recentHabits = await DailyHabit.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    // 3. Fetch latest generated AI Insight
    const latestInsight = await AIInsight.findOne({ userId })
      .sort({ createdAt: -1 });

    // 4. Calculate weekly goal progress including water & screen time
    const past7Habits = recentHabits.slice(0, 7);
    const goals = req.user.goals || {
      targetSteps: 8000,
      targetSleepHours: 7.5,
      targetWaterLiters: 2.5,
      maxOutsideFoodWeekly: 2,
      maxSmokingDaily: 0,
      maxAlcoholWeekly: 2,
      targetWorkoutMinutes: 30,
      maxScreenTimeDaily: 3.0
    };

    let totalOutsideFood7Days = 0;
    let totalAlcohol7Days = 0;
    let daysWithZeroSmoking = 0;
    let stepsToday = todayHabit ? todayHabit.steps : 0;
    let sleepToday = todayHabit ? todayHabit.sleepHours : 0;
    let waterToday = todayHabit ? (todayHabit.waterLiters || 0) : 0;
    let screenTimeToday = todayHabit ? (todayHabit.screenTimeHours || 0) : 0;

    past7Habits.forEach(h => {
      totalOutsideFood7Days += (h.outsideFoodCount || 0);
      totalAlcohol7Days += (h.alcoholCount || 0);
      if ((h.smokingCount || 0) === 0) daysWithZeroSmoking++;
    });

    const goalsProgress = [
      {
        id: 'water',
        title: 'Water Intake',
        current: Number(waterToday.toFixed(1)),
        target: goals.targetWaterLiters || 2.5,
        unit: 'L',
        percent: Math.min(100, Math.round((waterToday / (goals.targetWaterLiters || 2.5)) * 100)),
        type: 'daily'
      },
      {
        id: 'steps',
        title: 'Daily Steps',
        current: stepsToday,
        target: goals.targetSteps || 8000,
        unit: 'steps',
        percent: Math.min(100, Math.round((stepsToday / (goals.targetSteps || 8000)) * 100)),
        type: 'daily'
      },
      {
        id: 'sleep',
        title: 'Nightly Sleep',
        current: sleepToday,
        target: goals.targetSleepHours || 7.5,
        unit: 'hours',
        percent: Math.min(100, Math.round((sleepToday / (goals.targetSleepHours || 7.5)) * 100)),
        type: 'daily'
      },
      {
        id: 'screenTime',
        title: 'Screen Time Boundary',
        current: screenTimeToday,
        target: goals.maxScreenTimeDaily || 3.0,
        unit: 'hours',
        percent: screenTimeToday <= (goals.maxScreenTimeDaily || 3.0) ? 100 : Math.max(20, Math.round(((goals.maxScreenTimeDaily || 3.0) / screenTimeToday) * 100)),
        type: 'daily_limit',
        status: screenTimeToday <= (goals.maxScreenTimeDaily || 3.0) ? 'Within Limit' : 'Extended'
      },
      {
        id: 'outsideFood',
        title: 'Weekly Outside Food Limit',
        current: totalOutsideFood7Days,
        target: goals.maxOutsideFoodWeekly || 2,
        unit: 'meals',
        percent: Math.max(0, 100 - Math.round((totalOutsideFood7Days / (goals.maxOutsideFoodWeekly || 2)) * 50)),
        type: 'weekly_limit',
        status: totalOutsideFood7Days <= (goals.maxOutsideFoodWeekly || 2) ? 'On Track' : 'Exceeded'
      },
      {
        id: 'smoking',
        title: 'Smoke-Free Days (Past 7d)',
        current: daysWithZeroSmoking,
        target: 7,
        unit: 'days',
        percent: Math.round((daysWithZeroSmoking / 7) * 100),
        type: 'streak'
      }
    ];

    // 5. Structure trend data chronologically with all 8 metrics and details
    const trendData = recentScores.slice().reverse().map(s => {
      const matchingHabit = recentHabits.find(h => h.date === s.date) || {};
      return {
        date: s.date,
        overallScore: s.overallScore,
        foodScore: s.foodScore,
        smokingScore: s.smokingScore,
        alcoholScore: s.alcoholScore,
        activityScore: s.activityScore,
        sleepScore: s.sleepScore,
        hydrationScore: s.hydrationScore,
        screenTimeScore: s.screenTimeScore,
        wellnessScore: s.wellnessScore,
        steps: matchingHabit.steps || 0,
        workoutMinutes: matchingHabit.workoutMinutes || 0,
        sleepHours: matchingHabit.sleepHours || 0,
        sleepQuality: matchingHabit.sleepQuality || 3,
        waterLiters: matchingHabit.waterLiters || 0,
        screenTimeHours: matchingHabit.screenTimeHours || 0,
        outsideFoodCount: matchingHabit.outsideFoodCount || 0,
        junkFoodMeals: matchingHabit.junkFoodMeals || 0,
        smokingCount: matchingHabit.smokingCount || 0,
        alcoholCount: matchingHabit.alcoholCount || 0,
        mood: matchingHabit.mood || 3,
        stress: matchingHabit.stress || 2,
        notes: matchingHabit.notes || ''
      };
    });

    // 6. Calculate weekly trend interpretation (Comparing past 7 days vs previous 7 days)
    let trendInterpretation = {
      trendDirection: 'steady',
      percentageChange: 0,
      currentAverageScore: 0,
      previousAverageScore: 0,
      message: 'Consistent lifestyle trajectory across logged days.'
    };

    if (recentScores.length >= 2) {
      const past7 = recentScores.slice(0, 7);
      const prev7 = recentScores.slice(7, 14);

      const past7Avg = Math.round(past7.reduce((sum, s) => sum + s.overallScore, 0) / past7.length);
      trendInterpretation.currentAverageScore = past7Avg;

      if (prev7.length > 0) {
        const prev7Avg = Math.round(prev7.reduce((sum, s) => sum + s.overallScore, 0) / prev7.length);
        trendInterpretation.previousAverageScore = prev7Avg;
        
        const diff = past7Avg - prev7Avg;
        const pct = prev7Avg > 0 ? Math.round((diff / prev7Avg) * 100) : 0;
        trendInterpretation.percentageChange = pct;

        if (pct >= 3) {
          trendInterpretation.trendDirection = 'improving';
          trendInterpretation.message = `Your average score increased ${Math.abs(pct)}% compared with the previous 7 days.`;
        } else if (pct <= -3) {
          trendInterpretation.trendDirection = 'needs_attention';
          trendInterpretation.message = `Your average score decreased ${Math.abs(pct)}% compared with the previous 7 days.`;
        } else {
          trendInterpretation.trendDirection = 'steady';
          trendInterpretation.message = `Your average score remained steady (${past7Avg}/100) compared with the previous 7 days.`;
        }
      } else {
        trendInterpretation.message = `Current 7-day average score is ${past7Avg}/100.`;
      }
    }

    res.json({
      success: true,
      currentScore: latestScore ? latestScore.overallScore : null,
      scoreRecord: latestScore || null,
      todayHabit: todayHabit || null,
      goalsProgress,
      trendData,
      trendInterpretation,
      latestInsight: latestInsight || null,
      hasLoggedToday: Boolean(todayHabit),
      hasAnyRecords: recentScores.length > 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
