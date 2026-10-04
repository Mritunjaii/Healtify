const mongoose = require('mongoose');

const dailyHabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String, // ISO date string 'YYYY-MM-DD'
    required: true,
    index: true,
  },
  // 1. Food & Nutrition
  outsideFoodCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  junkFoodMeals: {
    type: Number,
    default: 0,
    min: 0,
  },
  // 2. Smoking
  smokingCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // 3. Alcohol
  alcoholCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // 4. Physical Activity
  steps: {
    type: Number,
    default: 0,
    min: 0,
  },
  workoutMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },
  // 5. Sleep & Recovery
  sleepHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 24,
  },
  sleepQuality: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
  // 6. Hydration
  waterLiters: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  // 7. Screen Time (Recreational)
  screenTimeHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 24,
  },
  // 8. Wellness
  mood: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
  stress: {
    type: Number,
    default: 2,
    min: 1,
    max: 5,
  },
  // 9. Personal Journal
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

dailyHabitSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyHabit', dailyHabitSchema);
