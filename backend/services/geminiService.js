/**
 * Multi-Tier AI Wellness Companion Service for Healtify
 * 
 * 1. Primary: Local Llama 3.2 via Ollama (100% private, on-device inference)
 * 2. Secondary: Google Gemini 1.5 Flash Cloud (read strictly from backend process.env.GEMINI_API_KEY)
 * 3. Tertiary: Deterministic Lifestyle Engine (rule-based offline fallback)
 * 
 * Acting strictly as the interpretation & lifestyle guidance layer.
 * Does not calculate numerical scores (done deterministically) and does not provide medical diagnoses.
 */

const { GoogleGenAI } = require('@google/genai');

function generateRuleBasedFallback(period, summary) {
  const { currentScore, categoryScores = {}, habit = {}, trends = {} } = summary;
  const food = categoryScores.food ?? 70;
  const smoking = categoryScores.smoking ?? 100;
  const alcohol = categoryScores.alcohol ?? 100;
  const activity = categoryScores.activity ?? 70;
  const sleep = categoryScores.sleep ?? 70;
  const hydration = categoryScores.hydration ?? 60;
  const screenTime = categoryScores.screenTime ?? 70;
  const wellness = categoryScores.wellness ?? 70;

  if (period === 'daily') {
    let focus = 'overall daily balance';
    let practical = 'Keep a water bottle near your workspace and aim to reach your first 1 L before early afternoon.';
    let highlights = [];

    if (hydration < 65) {
      focus = 'Hydration';
      highlights.push(`Logged ${habit.waterLiters || 0} L of water today—below your daily 2.5 L baseline.`);
      practical = 'Drink a full glass of water right now and keep a carafe visible at your desk.';
    } else if (screenTime < 60) {
      focus = 'Screen Boundaries';
      highlights.push(`Recreational screen time reached ${habit.screenTimeHours || 0} hours.`);
      practical = 'Set a timer for 30 minutes before bed to switch from glowing screens to journaling or gentle stretching.';
    } else if (sleep < 65) {
      focus = 'Sleep & Recovery';
      highlights.push(`Logged ${habit.sleepHours || 0} hours of sleep—your recovery score is dipping.`);
      practical = 'Wind down 30 minutes earlier tonight and dim room lighting to help your nervous system restore.';
    } else if (activity < 60) {
      focus = 'Physical Movement';
      highlights.push(`Steps logged (${(habit.steps || 0).toLocaleString()}) are below target.`);
      practical = 'Add a brisk 15-minute walk during a phone call or right after lunch.';
    } else {
      highlights.push(`Well-rounded lifestyle index of ${currentScore}/100 across all 8 lifestyle dimensions.`);
      practical = 'Maintain your great momentum by keeping your evening routine consistent.';
    }

    return {
      headline: `Daily Reflection: Focus on ${focus}`,
      overview: `Your lifestyle metrics today reflect a Healtify Score of ${currentScore}/100. Small micro-adjustments today make building lasting wellness effortless.`,
      highlights: highlights.length ? highlights : ['Consistent habits observed across your 8 tracked dimensions.'],
      practicalAction: practical,
      focusArea: focus,
      disclaimer: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
      source: 'fallback_engine',
      modelName: 'Lifestyle Engine'
    };
  }

  if (period === 'weekly') {
    let trendNote = 'Your activity and sleep have maintained a steady rhythm.';
    if (hydration < 70) {
      trendNote += ' However, your hydration has been inconsistent, with several days below your water goal.';
    }

    return {
      headline: 'Weekly Lifestyle Trajectory & Pattern Analysis',
      overview: `Your week is looking good overall. ${trendNote}`,
      highlights: [
        `Hydration level: ${habit.waterLiters || 'Variable'} L average.`,
        `Movement & steps baseline: ${activity}/100.`,
        `Sleep recovery score: ${sleep}/100.`,
        `Screen balance score: ${screenTime}/100.`
      ],
      practicalAction: 'Try keeping a 1-liter water bottle near your workspace and aim to finish the first bottle before lunch.',
      focusArea: 'Hydration & Rhythm',
      disclaimer: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
      source: 'fallback_engine',
      modelName: 'Lifestyle Engine'
    };
  }

  if (period === 'explanation') {
    const sorted = [
      { name: 'Hydration', score: hydration },
      { name: 'Sleep & Recovery', score: sleep },
      { name: 'Physical Activity', score: activity },
      { name: 'Screen Time', score: screenTime },
      { name: 'Mental Wellness', score: wellness },
      { name: 'Food & Nutrition', score: food },
      { name: 'Smoking Pattern', score: smoking },
      { name: 'Alcohol Balance', score: alcohol }
    ].sort((a, b) => b.score - a.score);

    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    return {
      headline: `Score Breakdown: ${highest.name} Leading, ${lowest.name} Has Highest Leverage`,
      overview: `Your current Healtify Score is ${currentScore}/100, calculated as the deterministic average across all 8 lifestyle dimensions.`,
      highlights: [
        `Strongest category: ${highest.name} (${highest.score}/100) is actively lifting your score.`,
        `Primary growth area: ${lowest.name} (${lowest.score}/100) currently has the greatest potential to lift your overall score.`
      ],
      practicalAction: `Focus on a low-friction improvement in ${lowest.name} tomorrow rather than trying to overhaul everything.`,
      focusArea: lowest.name,
      disclaimer: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
      source: 'fallback_engine',
      modelName: 'Lifestyle Engine'
    };
  }

  if (period === 'goals') {
    return {
      headline: 'Achievable Short-Term Micro-Goals',
      overview: 'Building sustainable health works best when goals are small enough to feel nearly effortless.',
      highlights: [
        'Reach 2.0 L of water daily by sipping a glass every 90 minutes.',
        'Target 7,500 daily steps with two brief 10-minute fresh air breaks.',
        'Keep recreational screen time under 2.5 hours in the evening.'
      ],
      practicalAction: 'Fill a fresh water tumbler first thing in the morning before turning on your computer or phone.',
      focusArea: 'Hydration & Rest Boundaries',
      disclaimer: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
      source: 'fallback_engine',
      modelName: 'Lifestyle Engine'
    };
  }

  // suggestions default
  return {
    headline: 'Practical Lifestyle Micro-Adjustments',
    overview: 'Here are realistic suggestions tailored to your recent log without requiring disruptive lifestyle overhauls.',
    highlights: [
      'Hydration first: drink 300ml of water before your first morning coffee.',
      'Movement snacks: stand up and stretch every 60 minutes of seated screen time.',
      'Pre-sleep winddown: trade 15 minutes of social scrolling for 15 minutes of reading or reflection.'
    ],
    practicalAction: 'Choose just one action above to test for the next 24 hours.',
    focusArea: 'Daily Habit Momentum',
    disclaimer: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
    source: 'fallback_engine',
    modelName: 'Lifestyle Engine'
  };
}

function buildPrompt(period, summary) {
  return `
You are the empathetic, grounded, and clear wellness companion for Healtify, a personal lifestyle journal.
The user has calculated lifestyle metrics across 8 Core Categories:
- Overall Healtify Score: ${summary.currentScore}/100
- 8 Category Scores (0-100):
  * Food & Nutrition: ${summary.categoryScores?.food ?? 'N/A'}
  * Smoking Pattern: ${summary.categoryScores?.smoking ?? 'N/A'}
  * Alcohol Balance: ${summary.categoryScores?.alcohol ?? 'N/A'}
  * Physical Activity: ${summary.categoryScores?.activity ?? 'N/A'}
  * Sleep & Recovery: ${summary.categoryScores?.sleep ?? 'N/A'}
  * Hydration (Water): ${summary.categoryScores?.hydration ?? 'N/A'}
  * Screen Time: ${summary.categoryScores?.screenTime ?? 'N/A'}
  * Mental Wellness (Mood & Stress): ${summary.categoryScores?.wellness ?? 'N/A'}
- Today's logged habits: ${JSON.stringify(summary.habit || {})}
- User reflection notes: "${summary.habit?.notes || 'None'}"

Insight Request Type: "${period}" (Options: daily, weekly, suggestions, explanation, goals)

CRITICAL SAFETY & MEDICAL POLICY:
- Do NOT provide medical diagnosis, treatment advice, or prescriptions.
- Emphasize sustainable lifestyle patterns, mindfulness, and small micro-habits.
- Do not attempt to diagnose mental health from mood/stress ratings; use them only for supportive context.
- Keep the tone warm, grounded, realistic, and paper-journal friendly (like a thoughtful note from a wise coach).

Respond ONLY with valid JSON in this exact structure:
{
  "headline": "A short, engaging title (5-9 words)",
  "overview": "A 2-3 sentence thoughtful reflection explaining the data and context.",
  "highlights": [
    "Key observation or pattern 1",
    "Key observation or pattern 2"
  ],
  "practicalAction": "One single, realistic micro-action the user can take today.",
  "focusArea": "The single category needing the most care (e.g. Hydration, Screen Time, Sleep, Food, Activity)",
  "disclaimer": "Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment."
}
`;
}

function parseAIResponse(rawText, source, modelName) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty AI response received');
  }

  // Strip code fences if present
  let cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

  // If there's extra text before/after JSON, extract the outer { ... }
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  const parsed = JSON.parse(cleaned);

  return {
    headline: parsed.headline || 'Your Lifestyle Insight',
    overview: parsed.overview || 'Here is your personalized lifestyle reflection.',
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
    practicalAction: parsed.practicalAction || 'Take a deep breath and drink a glass of fresh water.',
    focusArea: parsed.focusArea || 'General Wellness',
    disclaimer: parsed.disclaimer || 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.',
    source,
    modelName
  };
}

/**
 * Tier 1: Local Llama 3.2 via Ollama
 */
async function generateWithOllama(period, summary) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2';
  const prompt = buildPrompt(period, summary);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for cold start / heavy prompts

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are the empathetic, grounded wellness companion for Healtify, a personal lifestyle journal. Always reply with valid JSON only conforming strictly to the requested schema. No conversational preamble.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        format: 'json',
        stream: false,
        options: {
          temperature: 0.6,
          num_predict: 450
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Ollama HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.message?.content;
    return parseAIResponse(content, 'llama3.2', 'Llama 3.2 (Local via Ollama)');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Tier 2: Google Gemini 1.5 Flash Cloud
 */
async function generateWithGemini(period, summary) {
  const activeKey = process.env.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = buildPrompt(period, summary);
  let aiResponseText = '';

  try {
    const ai = new GoogleGenAI({ apiKey: activeKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    aiResponseText = response.text;
  } catch (sdkError) {
    // Fallback directly to REST endpoint
    const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
    const restResp = await fetch(restUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!restResp.ok) {
      throw new Error(`Gemini API error: ${restResp.status} ${restResp.statusText}`);
    }

    const restData = await restResp.json();
    aiResponseText = restData.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  return parseAIResponse(aiResponseText, 'gemini', 'Gemini 1.5 Flash (Cloud)');
}

/**
 * Main Entry Point: Tri-Tier Orchestrator
 * 1. Llama 3.2 (Local Ollama) -> 2. Gemini 1.5 Flash (Cloud) -> 3. Lifestyle Engine (Fallback)
 */
async function generateLifestyleInsight(period, summary) {
  // 1. Try Local Llama 3.2 via Ollama
  try {
    console.log(`🦙 Attempting insight generation with local Llama 3.2 via Ollama (${period})...`);
    const result = await generateWithOllama(period, summary);
    console.log(`✅ Llama 3.2 local inference succeeded for ${period}!`);
    return result;
  } catch (ollamaErr) {
    console.warn(`⚠️ Ollama (Llama 3.2) unavailable or timed out: ${ollamaErr.message}. Falling back to Gemini Cloud...`);
  }

  // 2. Try Gemini 1.5 Flash Cloud
  try {
    console.log(`☁️ Attempting insight generation with Gemini 1.5 Flash Cloud (${period})...`);
    const result = await generateWithGemini(period, summary);
    console.log(`✅ Gemini Cloud inference succeeded for ${period}!`);
    return result;
  } catch (geminiErr) {
    console.warn(`⚠️ Gemini Cloud inference failed: ${geminiErr.message}. Falling back to Lifestyle Engine...`);
  }

  // 3. Fallback to Deterministic Heuristic Engine
  console.log(`🌿 Generating insight via deterministic Healtify Lifestyle Engine (${period})...`);
  return generateRuleBasedFallback(period, summary);
}

module.exports = {
  generateLifestyleInsight,
  generateWithOllama,
  generateWithGemini,
  generateRuleBasedFallback
};
