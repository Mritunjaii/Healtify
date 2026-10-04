import React from 'react';

/**
 * Hand-drawn / Sketch-style Vector Illustrations
 * Completely replaces emojis with archival journal ink illustrations
 * 8 Core Lifestyle Categories:
 * - Food → hand-drawn plate/food
 * - Smoking → hand-drawn lungs
 * - Alcohol → hand-drawn glass/bottle
 * - Activity → hand-drawn running shoe
 * - Sleep → hand-drawn bed/moon
 * - Water → hand-drawn water bottle
 * - Screen → hand-drawn phone
 * - Wellness → hand-drawn journal/heart
 */

// 1. Food: Hand-drawn plate and fork/knife
export const FoodSketch = ({ className = "w-8 h-8", color = "#2A6F54" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 1.5" />
    <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    {/* Fork Sketch */}
    <path d="M16 14v8m3-8v8m-6-8v8a3 3 0 003 3v9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Knife Sketch */}
    <path d="M33 14c-1.5 2-2 6-2 10v10h2V14z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Fresh Sprig in Center */}
    <path d="M24 20c-1-2 0-4 1-5m-2 7c1-2 0-4-1-5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 2. Smoking: Hand-drawn lungs sketch
export const LungsSmokingSketch = ({ className = "w-8 h-8", color = "#B33927" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Trachea / Windpipe */}
    <path d="M24 8v10" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M21 11h6m-6 4h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    {/* Bronchi bifurcation */}
    <path d="M24 18c-3 2-6 4-9 6m9-6c3 2 6 4 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Left Lung Lobe */}
    <path d="M15 24c-5 2-9 7-9 13 0 4 3 6 7 6 5 0 9-4 9-11v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Right Lung Lobe */}
    <path d="M33 24c5 2 9 7 9 13 0 4-3 6-7 6-5 0-9-4-9-11v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Hand-drawn clean air breath hatching */}
    <path d="M13 32c2 1 4 0 5-1m12 0c1 1 3 2 5 1" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

// 3. Alcohol: Hand-drawn glass / bottle
export const AlcoholSketch = ({ className = "w-8 h-8", color = "#C47C2B" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Sketched Bottle */}
    <path d="M14 16h6v-6h-6v6zm1-6h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 20c-1 2-2 4-2 7v13h10v-13c0-3-1-5-2-7h-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Sketched Stemmed Tumbler */}
    <path d="M28 22h12l-2 11c-1 3-3 4-5 4s-4-1-5-4l-2-11z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 37v5m-4 0h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Liquid Line */}
    <path d="M30 27c2 1 6 1 8 0" stroke={color} strokeWidth="1.4" strokeDasharray="2 1" />
  </svg>
);

// 4. Physical Activity: Hand-drawn running shoe
export const ActivitySketch = ({ className = "w-8 h-8", color = "#207264" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Running shoe silhouette */}
    <path d="M8 29c3 1 7 1 10-1l9-7 7 4c2 1 5 1 6 0v7c-8 2-24 2-32-3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 32h34" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    {/* Shoe laces */}
    <path d="M23 23l4 3m-2-5l4 3m-2-5l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Motion / Step strides */}
    <path d="M4 22c3-1 6-1 7 0m-9 5c3-1 5-1 6 0m28-16c4 3 6 8 6 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" />
  </svg>
);

// 5. Sleep & Recovery: Hand-drawn bed / moon
export const SleepBedMoonSketch = ({ className = "w-8 h-8", color = "#2F4A71" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Sketched Crescent Moon */}
    <path d="M32 8a10 10 0 108 14 9 9 0 01-8-14z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
    {/* Sketched Cozy Bed Headboard & Mattress */}
    <path d="M8 26v14m0-7h32m0-7v14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Curved Pillow */}
    <rect x="12" y="24" width="9" height="5" rx="2" stroke={color} strokeWidth="1.8" />
    {/* Duvet / Blanket line */}
    <path d="M21 28h19c0 4-2 6-6 6H12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 6. Hydration: Hand-drawn water bottle
export const WaterBottleSketch = ({ className = "w-8 h-8", color = "#1E6888" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bottle Cap */}
    <rect x="20" y="7" width="8" height="5" rx="1.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M22 12v3m4-3v3" stroke={color} strokeWidth="1.6" />
    {/* Bottle Body */}
    <path d="M16 18c0-3 3-4 6-4h4c3 0 6 1 6 4v20c0 3-2 5-6 5H22c-4 0-6-2-6-5V18z" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Measurement Graduation Lines on Paper */}
    <path d="M20 22h4m-4 5h5m-5 5h4m-4 5h5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    {/* Floating Water Droplet */}
    <path d="M36 21c-2 2-3 4-3 6 0 2 1.5 3 3 3s3-1 3-3c0-2-1-4-3-6z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
  </svg>
);

// 7. Screen Time: Hand-drawn phone
export const ScreenPhoneSketch = ({ className = "w-8 h-8", color = "#68507B" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Phone Frame */}
    <rect x="14" y="8" width="20" height="32" rx="4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    {/* Speaker notch */}
    <path d="M21 12h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    {/* Screen Display Area */}
    <rect x="17" y="16" width="14" height="18" rx="1.5" stroke={color} strokeWidth="1.4" strokeDasharray="3 1.5" />
    {/* Home indicator bar */}
    <path d="M21 36h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 8. Mental Wellness: Hand-drawn journal & heart
export const WellnessHeartSketch = ({ className = "w-8 h-8", color = "#A24857" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Sketched Heart */}
    <path d="M24 16c-3-5-10-5-13-1-4 4-2 11 3 16l10 9 10-9c5-5 7-12 3-16-3-4-10-4-13 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.08" />
    {/* Peaceful Mind / Serenity Sprig */}
    <path d="M24 23v8m-3-6c2-1 3-3 3-5m0 5c1-2 2-4 3-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// Fountain Pen / Quill for Gemini AI
export const QuillSketch = ({ className = "w-6 h-6", color = "#3A4540" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M26 4c-6 3-10 8-12 13l-4 8 8-4c5-2 10-6 13-12-1-3-3-5-5-5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 25l-3 3 1-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="14" r="1" fill={color} />
  </svg>
);

export const BookmarkSketch = ({ className = "w-5 h-5", color = "#8C7C66" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v18l-7-4-7 4V4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
