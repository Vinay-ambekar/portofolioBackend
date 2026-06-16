const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  project: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
