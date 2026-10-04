const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'suggestions', 'explanation', 'goals'],
    default: 'daily',
  },
  date: {
    type: String,
    required: true,
  },
  inputSummary: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  generatedInsight: {
    headline: { type: String, required: true },
    overview: { type: String, required: true },
    highlights: [{ type: String }],
    practicalAction: { type: String, required: true },
    focusArea: { type: String },
    disclaimer: {
      type: String,
      default: 'Healtify provides general lifestyle guidance and is not intended for medical diagnosis or treatment.'
    }
  },
  source: {
    type: String,
    enum: ['llama3.2', 'gemini', 'fallback_engine'],
    default: 'llama3.2'
  },
  modelName: {
    type: String,
    default: 'Llama 3.2 (Local via Ollama)'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);
