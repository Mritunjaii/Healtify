/**
 * Scoring Service for Healtify
 * Fully deterministic 0-100 calculation across 8 Core Lifestyle Categories:
 * 1. Food & Nutrition
 * 2. Smoking
 * 3. Alcohol
 * 4. Physical Activity
 * 5. Sleep & Recovery
 * 6. Hydration
 * 7. Screen Time
 * 8. Mental Wellness
 *
 * Overall Healtify Score = (Food + Smoking + Alcohol + Activity + Sleep + Hydration + Screen Time + Wellness) / 8
 */

const DEFAULT_THRESHOLDS = {
  food: {
    base: 100,
    outsideFoodPenalty: 18,
    junkMealPenalty: 14,
    minScore: 10
  },
  smoking: {
    zeroScore: 100,
    perCigarettePenalty: 12,
    minScore: 5
  },
  alcohol: {
    zeroScore: 100,
    oneDrinkScore: 85,
    twoDrinksScore: 65,
    perDrinkExtraPenalty: 18,
    minScore: 5
  },
  activity: {
    targetSteps: 10000,
    targetWorkoutMinutes: 45,
    stepsWeight: 0.6,
    workoutWeight: 0.4,
    minScore: 10
  },
  sleep: {
    optimalMin: 7.0,
    optimalMax: 8.5,
    minScore: 15
  },
  hydration: {
    targetLiters: 2.5,
    minScore: 10
  },
  screenTime: {
    optimalMaxHours: 2.0,
    moderateMaxHours: 3.5,
    highMaxHours: 5.5,
    minScore: 15
  }
};

function calculateFoodScore(habit, config = DEFAULT_THRESHOLDS.food) {
  const outside = habit.outsideFoodCount || 0;
  const junk = habit.junkFoodMeals || 0;
  const score = config.base - (outside * config.outsideFoodPenalty) - (junk * config.junkMealPenalty);
  return Math.max(config.minScore, Math.min(100, Math.round(score)));
}

function calculateSmokingScore(habit, config = DEFAULT_THRESHOLDS.smoking) {
  const count = habit.smokingCount || 0;
  if (count === 0) return config.zeroScore;
  const score = Math.max(config.minScore, config.zeroScore - (count * config.perCigarettePenalty));
  return Math.min(100, Math.round(score));
}

function calculateAlcoholScore(habit, config = DEFAULT_THRESHOLDS.alcohol) {
  const count = habit.alcoholCount || 0;
  if (count === 0) return config.zeroScore;
  if (count === 1) return config.oneDrinkScore;
  if (count === 2) return config.twoDrinksScore;
  const extra = count - 2;
  const score = Math.max(config.minScore, config.twoDrinksScore - (extra * config.perDrinkExtraPenalty));
  return Math.min(100, Math.round(score));
}

function calculateActivityScore(habit, config = DEFAULT_THRESHOLDS.activity) {
  const steps = habit.steps || 0;
  const workout = habit.workoutMinutes || 0;
  const stepsRatio = Math.min(1.2, steps / config.targetSteps);
  const workoutRatio = Math.min(1.2, workout / config.targetWorkoutMinutes);
  const stepsPts = stepsRatio * (config.stepsWeight * 100);
  const workoutPts = workoutRatio * (config.workoutWeight * 100);
  const score = stepsPts + workoutPts;
  return Math.max(config.minScore, Math.min(100, Math.round(score)));
}

function calculateSleepScore(habit, config = DEFAULT_THRESHOLDS.sleep) {
  const hours = habit.sleepHours || 0;
  const quality = habit.sleepQuality || 3;

  if (hours <= 0) return config.minScore;

  let baseScore = 25;
  if (hours >= config.optimalMin && hours <= config.optimalMax) {
    baseScore = 95;
  } else if (hours >= 6.5 && hours < config.optimalMin) {
    baseScore = 80;
  } else if (hours > config.optimalMax && hours <= 9.5) {
    baseScore = 85;
  } else if (hours >= 5.5 && hours < 6.5) {
    baseScore = 65;
  } else if (hours >= 4.5 && hours < 5.5) {
    baseScore = 45;
  }

  const qualityAdjustment = (quality - 3) * 5;
  return Math.max(config.minScore, Math.min(100, Math.round(baseScore + qualityAdjustment)));
}

function calculateHydrationScore(habit, config = DEFAULT_THRESHOLDS.hydration) {
  const liters = habit.waterLiters || 0;
  if (liters <= 0) return config.minScore;
  const ratio = Math.min(1.0, liters / config.targetLiters);
  const score = Math.round(ratio * 100);
  return Math.max(config.minScore, Math.min(100, score));
}

function calculateScreenTimeScore(habit, config = DEFAULT_THRESHOLDS.screenTime) {
  const hours = habit.screenTimeHours || 0;
  if (hours <= config.optimalMaxHours) return 100;
  if (hours <= config.moderateMaxHours) return 82;
  if (hours <= config.highMaxHours) return 60;
  const extra = hours - config.highMaxHours;
  const score = 60 - (extra * 10);
  return Math.max(config.minScore, Math.min(100, Math.round(score)));
}

function calculateWellnessScore(habit) {
  const mood = habit.mood || 3; // 1 to 5
  const stress = habit.stress || 2; // 1 to 5 (1 = lowest/peaceful, 5 = highest)
  
  // Mood contributes 50% (1->10, 5->50)
  const moodPts = (mood / 5) * 50;
  // Stress contributes 50% inverted (stress 1 -> 50pts, stress 5 -> 10pts)
  const stressPts = ((6 - stress) / 5) * 50;

  return Math.max(15, Math.min(100, Math.round(moodPts + stressPts)));
}

function calculateOverallScore(habit) {
  const foodScore = calculateFoodScore(habit);
  const smokingScore = calculateSmokingScore(habit);
  const alcoholScore = calculateAlcoholScore(habit);
  const activityScore = calculateActivityScore(habit);
  const sleepScore = calculateSleepScore(habit);
  const hydrationScore = calculateHydrationScore(habit);
  const screenTimeScore = calculateScreenTimeScore(habit);
  const wellnessScore = calculateWellnessScore(habit);

  const sum = foodScore + smokingScore + alcoholScore + activityScore + sleepScore + hydrationScore + screenTimeScore + wellnessScore;
  const overallScore = Math.max(0, Math.min(100, Math.round(sum / 8)));

  const categories = [
    { name: 'Food & Nutrition', key: 'food', score: foodScore, status: foodScore >= 75 ? 'Healthy' : foodScore >= 50 ? 'Moderate' : 'Needs Care' },
    { name: 'Smoking Pattern', key: 'smoking', score: smokingScore, status: smokingScore >= 80 ? 'Optimal' : smokingScore >= 50 ? 'Moderate' : 'Caution' },
    { name: 'Alcohol Balance', key: 'alcohol', score: alcoholScore, status: alcoholScore >= 80 ? 'Optimal' : alcoholScore >= 50 ? 'Moderate' : 'Caution' },
    { name: 'Physical Activity', key: 'activity', score: activityScore, status: activityScore >= 70 ? 'Active' : activityScore >= 45 ? 'Fair' : 'Low Movement' },
    { name: 'Sleep & Recovery', key: 'sleep', score: sleepScore, status: sleepScore >= 75 ? 'Restful' : sleepScore >= 50 ? 'Fair' : 'Rest Deficit' },
    { name: 'Hydration', key: 'hydration', score: hydrationScore, status: hydrationScore >= 80 ? 'Hydrated' : hydrationScore >= 50 ? 'Moderate' : 'Low Fluids' },
    { name: 'Screen Time', key: 'screenTime', score: screenTimeScore, status: screenTimeScore >= 75 ? 'Balanced' : screenTimeScore >= 50 ? 'Moderate' : 'High Screen Time' },
    { name: 'Mental Wellness', key: 'wellness', score: wellnessScore, status: wellnessScore >= 75 ? 'Positive' : wellnessScore >= 50 ? 'Neutral' : 'High Tension' },
  ];

  const attentionAreas = categories
    .filter(c => c.score < 65)
    .sort((a, b) => a.score - b.score);

  let ratingLabel = 'Balanced';
  let badgeColor = 'emerald';
  if (overallScore >= 85) {
    ratingLabel = 'Optimal Wellness';
    badgeColor = 'emerald';
  } else if (overallScore >= 70) {
    ratingLabel = 'Good Balance';
    badgeColor = 'teal';
  } else if (overallScore >= 50) {
    ratingLabel = 'Fair / Improving';
    badgeColor = 'amber';
  } else {
    ratingLabel = 'Needs Recovery & Care';
    badgeColor = 'rose';
  }

  return {
    foodScore,
    smokingScore,
    alcoholScore,
    activityScore,
    sleepScore,
    hydrationScore,
    screenTimeScore,
    wellnessScore,
    overallScore,
    ratingLabel,
    badgeColor,
    breakdown: {
      categories,
      attentionAreas,
      formula: '(Food + Smoking + Alcohol + Activity + Sleep + Hydration + Screen Time + Wellness) / 8'
    }
  };
}

module.exports = {
  DEFAULT_THRESHOLDS,
  calculateFoodScore,
  calculateSmokingScore,
  calculateAlcoholScore,
  calculateActivityScore,
  calculateSleepScore,
  calculateHydrationScore,
  calculateScreenTimeScore,
  calculateWellnessScore,
  calculateOverallScore,
};
