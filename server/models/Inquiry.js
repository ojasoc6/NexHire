const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  clientName:   { type: String, required: true },
  clientEmail:  { type: String, required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
  message:      { type: String, required: true },
  status: {
    type: String,
    enum: ['sent', 'viewed', 'responded', 'accepted'],
    default: 'sent'
  },
  statusHistory: [{ status: String, timestamp: Date }],
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);