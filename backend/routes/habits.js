const express = require('express');
const router = express.Router();
const DailyHabit = require('../models/DailyHabit');
const Score = require('../models/Score');
const { protect } = require('../middleware/auth');
const { calculateOverallScore } = require('../services/scoringService');

const getTodayString = () => new Date().toISOString().split('T')[0];

// @route   POST /api/habits
// @desc    Record or update daily lifestyle habit & recalculate score across 8 categories
router.post('/', protect, async (req, res) => {
  try {
    const {
      date = getTodayString(),
      outsideFoodCount = 0,
      junkFoodMeals = 0,
      smokingCount = 0,
      alcoholCount = 0,
      steps = 0,
      workoutMinutes = 0,
      sleepHours = 0,
      sleepQuality = 3,
      waterLiters = 0,
      screenTimeHours = 0,
      mood = 3,
      stress = 2,
      notes = ''
    } = req.body;

    // 1. Upsert DailyHabit record
    const habit = await DailyHabit.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        outsideFoodCount: Number(outsideFoodCount),
        junkFoodMeals: Number(junkFoodMeals),
        smokingCount: Number(smokingCount),
        alcoholCount: Number(alcoholCount),
        steps: Number(steps),
        workoutMinutes: Number(workoutMinutes),
        sleepHours: Number(sleepHours),
        sleepQuality: Number(sleepQuality),
        waterLiters: Number(waterLiters),
        screenTimeHours: Number(screenTimeHours),
        mood: Number(mood),
        stress: Number(stress),
        notes,
        updatedAt: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    // 2. Compute score using transparent 8-category scoring service
    const calculated = calculateOverallScore(habit);

    // 3. Upsert Score record
    const scoreDoc = await Score.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        foodScore: calculated.foodScore,
        smokingScore: calculated.smokingScore,
        alcoholScore: calculated.alcoholScore,
        activityScore: calculated.activityScore,
        sleepScore: calculated.sleepScore,
        hydrationScore: calculated.hydrationScore,
        screenTimeScore: calculated.screenTimeScore,
        wellnessScore: calculated.wellnessScore,
        overallScore: calculated.overallScore,
        breakdown: calculated.breakdown,
        calculatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      habit,
      score: {
        date: scoreDoc.date,
        foodScore: scoreDoc.foodScore,
        smokingScore: scoreDoc.smokingScore,
        alcoholScore: scoreDoc.alcoholScore,
        activityScore: scoreDoc.activityScore,
        sleepScore: scoreDoc.sleepScore,
        hydrationScore: scoreDoc.hydrationScore,
        screenTimeScore: scoreDoc.screenTimeScore,
        wellnessScore: scoreDoc.wellnessScore,
        overallScore: scoreDoc.overallScore,
        ratingLabel: calculated.ratingLabel,
        badgeColor: calculated.badgeColor,
        breakdown: scoreDoc.breakdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/habits
// @desc    Retrieve habit history for user
router.get('/', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const habits = await DailyHabit.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: habits.length,
      habits: habits.reverse()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/habits/:date
// @desc    Get habit for specific date
router.get('/:date', protect, async (req, res) => {
  try {
    const habit = await DailyHabit.findOne({
      userId: req.user._id,
      date: req.params.date
    });

    res.json({
      success: true,
      habit: habit || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
