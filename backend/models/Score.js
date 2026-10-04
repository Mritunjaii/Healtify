const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
    index: true,
  },
  // 8 Core Normalized Scores (0-100)
  foodScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  smokingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  alcoholScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  activityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  sleepScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  hydrationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  screenTimeScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  wellnessScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // Overall Deterministic Healtify Score (Average of the 8 categories)
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  breakdown: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  }
});

scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
