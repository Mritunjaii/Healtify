const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  goals: {
    targetSteps: { type: Number, default: 8000 },
    targetSleepHours: { type: Number, default: 7.5 },
    targetWaterLiters: { type: Number, default: 2.5 },
    maxOutsideFoodWeekly: { type: Number, default: 2 },
    maxSmokingDaily: { type: Number, default: 0 },
    maxAlcoholWeekly: { type: Number, default: 2 },
    targetWorkoutMinutes: { type: Number, default: 30 },
    maxScreenTimeDaily: { type: Number, default: 3.0 }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
