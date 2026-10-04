# HEALTIFY — Personal Lifestyle Tracking & Wellness Companion

> **"Healtify turns everyday lifestyle habits into a simple personal score and uses AI-powered insights to help users understand their patterns and make small, healthier changes."**

---

## 1. Project Overview

Healtify is a personal lifestyle tracking application designed around the physical feel of a **modern health journal**. Instead of fragmented habit trackers or emoji-heavy dashboards, Healtify gathers 8 core lifestyle dimensions into one central paper-inspired journal:
1. **Food & Nutrition** (Outside meals, junk/fast food)
2. **Smoking** (Cigarettes / smoking patterns)
3. **Alcohol** (Drinks / standard units)
4. **Physical Activity** (Steps & workout minutes)
5. **Sleep & Recovery** (Duration & sleep quality rating)
6. **Hydration** (Water intake e.g. 1.8 L / 2.5 L with simple `[ - ]` and `[ + ]` controls)
7. **Screen Time** (Recreational daily screen time)
8. **Mental Wellness** (Mood 1–5 & Stress 1–5 rating + optional journal reflection)

---

## 2. Lifestyle Trends: Clear Separation & Habit Balance

The **Lifestyle Trends** section is cleanly divided into three distinct views:

- **1. Healtify Score Tab**:
  - Displays the continuous 0–100 lifestyle curve with an archival ink gradient fill over 7 or 14 days.
- **2. 8 Categories Tab**:
  - Interactive multi-line chart with toggleable category lines to keep the view focused.
  - **Lifestyle Status**: Explicit textual status badges (`Good`, `Improve`, `Needs Attention`) with ink progress bars for each of the 8 categories.
- **3. Habit Balance Tab**:
  - Exclusively answers: *"Are my habits helping me more than hurting me?"*
  - **Interactive Donut Chart**:
    - Center label displaying overall healthy lifestyle percentage (e.g. `78% HEALTHY`).
    - Subtitle: `78% Healthy · 22% Risk Factors` with change from prior 7 days.
    - Hover interactions on the green/red segments revealing exact contributing factors.
  - **What's Driving Your Balance**:
    - Two clean columns without progress bars: **Supporting You** vs. **Needs Attention** with actual scores.
  - **Weekly Takeaway**:
    - Concise interpretation highlighting your strongest foundational habit and the highest leverage improvement area.

---

## 3. Core Lifestyle Categories & Deterministic Scoring

The application calculates its own score in the Node.js/Express backend rather than asking AI to decide numbers:

$$\text{Healtify Score} = \frac{\text{Food} + \text{Smoking} + \text{Alcohol} + \text{Activity} + \text{Sleep} + \text{Hydration} + \text{Screen Time} + \text{Wellness}}{8}$$

| Category | Tracked Metrics | Normalized Score | Details |
|---|---|---|---|
| **Food & Nutrition** | Outside food count, fast food meals | 0–100 | Base 100 with penalties for outside deliveries & ultra-processed food |
| **Smoking** | Cigarettes smoked | 0–100 | 100 for smoke-free day; linear deduction per cigarette |
| **Alcohol** | Drinks / units | 0–100 | 100 for alcohol-free; 85 for 1 drink; progressive scaling |
| **Physical Activity** | Steps & workout minutes | 0–100 | 60% steps (10k baseline) + 40% workout duration (45m baseline) |
| **Sleep & Recovery** | Sleep hours & rest quality (1–5) | 0–100 | 7.0–8.5h optimal zone (90–100 pts) with quality multiplier |
| **Hydration** | Water consumed (Liters) | 0–100 | Evaluated against standard 2.5 L baseline (e.g. 1.8 L = 72%) |
| **Screen Time** | Recreational screen hours | 0–100 | 100 for <= 2.0 hrs; scaled deductions for excessive recreational screen time |
| **Mental Wellness** | Mood (1–5) & Stress (1–5) | 0–100 | Combined score from positive mood and low stress |

*Thresholds and formulas are in [`backend/services/scoringService.js`](file:///d:/healtify/backend/services/scoringService.js).*

---

## 4. Multi-Tier AI Interpretation Layer (Llama 3.2 Local + Gemini Cloud)

AI acts strictly as the **interpretation and wellness coaching companion**:
- **Daily Reflection:** Explains significant changes in today's lifestyle habits.
- **Weekly Summary:** Analyzes 7-to-14-day trends, identifying consistency and momentum.
- **Score Breakdown:** Transparently describes which tracked area drives the current score.
- **Practical Actions:** Delivers a single, frictionless micro-action (e.g., reaching 1 L of water before noon, or a 10-minute walk).
- **Goals:** Formulates realistic, achievable short-term habits.

### Multi-Tier AI Architecture
```
React Frontend
   ↓
POST /api/insights
   ↓
Node.js + Express Backend
   ↓
   ├─► [Tier 1: Primary] Local Llama 3.2 via Ollama (127.0.0.1:11434, 100% private, on-device)
   │
   ├─► [Tier 2: Cloud Fallback] Google Gemini 1.5 Flash (via backend process.env.GEMINI_API_KEY)
   │
   └─► [Tier 3: Offline Guarantee] Healtify Deterministic Lifestyle Engine
   ↓
AI Wellness Insight (with active source badge)
   ↓
React Frontend
```
*The user never enters an API key in the browser. Local inference runs completely private on your machine without third-party network transmission.*

---

## 5. Running the Application

### 1. (Optional) Run Ollama Locally with Llama 3.2
```bash
# Start Ollama daemon
ollama serve

# Pull Llama 3.2 (3B model, ~2 GB)
ollama pull llama3.2
```

### 2. Backend
```bash
cd backend
# .env contains:
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/healtify
# OLLAMA_BASE_URL=http://127.0.0.1:11434
# OLLAMA_MODEL=llama3.2
# GEMINI_API_KEY=your_key_here (optional fallback)

npm install
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Deploying to Render Cloud ☁️

Healtify is pre-configured for **1-click deployment on Render** as a unified full-stack web service (or as separate static site + backend service).

See the step-by-step instructions in [`DEPLOY_TO_RENDER.md`](file:///d:/healtify/DEPLOY_TO_RENDER.md) or use [`render.yaml`](file:///d:/healtify/render.yaml).
