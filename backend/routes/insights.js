const express = require('express');
const router = express.Router();
const DailyHabit = require('../models/DailyHabit');
const Score = require('../models/Score');
const AIInsight = require('../models/AIInsight');
const { protect } = require('../middleware/auth');
const { generateLifestyleInsight } = require('../services/geminiService');

const getTodayString = () => new Date().toISOString().split('T')[0];

// @route   POST /api/insights
// @desc    Generate personalized wellness insight using Gemini AI (API key kept strictly on backend)
router.post('/', protect, async (req, res) => {
  try {
    const { period = 'daily' } = req.body;
    const userId = req.user._id;
    const today = getTodayString();

    // 1. Fetch latest habits and scores to form structured summary
    const todayHabit = await DailyHabit.findOne({ userId, date: today });
    const latestScore = await Score.findOne({ userId }).sort({ date: -1 });
    const recentScores = await Score.find({ userId }).sort({ date: -1 }).limit(7);
    const recentHabits = await DailyHabit.find({ userId }).sort({ date: -1 }).limit(7);

    if (!latestScore && !todayHabit) {
      return res.status(400).json({
        success: false,
        message: 'Please record at least one day of lifestyle habits before generating an insight.'
      });
    }

    // 2. Prepare compact structured summary across all 8 lifestyle dimensions
    const summary = {
      period,
      currentScore: latestScore ? latestScore.overallScore : 70,
      categoryScores: latestScore ? {
        food: latestScore.foodScore,
        smoking: latestScore.smokingScore,
        alcohol: latestScore.alcoholScore,
        activity: latestScore.activityScore,
        sleep: latestScore.sleepScore,
        hydration: latestScore.hydrationScore,
        screenTime: latestScore.screenTimeScore,
        wellness: latestScore.wellnessScore
      } : {},
      habit: todayHabit ? {
        date: todayHabit.date,
        steps: todayHabit.steps,
        workoutMinutes: todayHabit.workoutMinutes,
        sleepHours: todayHabit.sleepHours,
        waterLiters: todayHabit.waterLiters,
        screenTimeHours: todayHabit.screenTimeHours,
        mood: todayHabit.mood,
        stress: todayHabit.stress,
        outsideFoodCount: todayHabit.outsideFoodCount,
        smokingCount: todayHabit.smokingCount,
        alcoholCount: todayHabit.alcoholCount,
        notes: todayHabit.notes
      } : {},
      trends: {
        loggedDaysInLastWeek: recentScores.length,
        averageScore: recentScores.length ? Math.round(recentScores.reduce((acc, s) => acc + s.overallScore, 0) / recentScores.length) : null,
        lowestCategory: latestScore?.breakdown?.attentionAreas?.[0]?.name || 'Hydration'
      }
    };

    // 3. Generate AI insight (using backend process.env.GEMINI_API_KEY)
    const generated = await generateLifestyleInsight(period, summary);

    // 4. Store in MongoDB AIInsight collection
    const insightDoc = await AIInsight.create({
      userId,
      period,
      date: today,
      inputSummary: summary,
      generatedInsight: {
        headline: generated.headline,
        overview: generated.overview,
        highlights: generated.highlights,
        practicalAction: generated.practicalAction,
        focusArea: generated.focusArea,
        disclaimer: generated.disclaimer
      },
      source: generated.source,
      modelName: generated.modelName
    });

    res.json({
      success: true,
      insight: insightDoc
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/insights/history
// @desc    Retrieve past insights
router.get('/history', protect, async (req, res) => {
  try {
    const insights = await AIInsight.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      insights
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
