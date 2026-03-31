const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
  title:       String,
  description: String,
  techStack:   [String],
  role:        String,
  challenges:  String,
  outcome:     String,
  images:      [String]
});

const FreelancerSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bio:             String,
  skills:          [String],
  hourlyRate:      Number,
  experienceYears: Number,
  availability:    { type: String, enum: ['available', 'busy', 'part-time'], default: 'available' },
  portfolio:       [PortfolioItemSchema],
  resumeURL:       String,
  rating:          { type: Number, default: 0 }
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);