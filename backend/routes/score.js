const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { protect } = require('../middleware/auth');

const getTodayString = () => new Date().toISOString().split('T')[0];

// @route   GET /api/score
// @desc    Retrieve current and historical scores
router.get('/', protect, async (req, res) => {
  try {
    const today = getTodayString();
    let currentScore = await Score.findOne({ userId: req.user._id, date: today });

    // If today is not logged yet, find the most recent logged score
    if (!currentScore) {
      currentScore = await Score.findOne({ userId: req.user._id }).sort({ date: -1 });
    }

    const history = await Score.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json({
      success: true,
      current: currentScore || null,
      history: history.reverse()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
