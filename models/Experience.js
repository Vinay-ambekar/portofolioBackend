const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  sidebarTitle: { type: String, default: 'My Work Experience' },
  items: [{
    company: { type: String },
    year: { type: String },
    role: { type: String },
    desc: { type: String },
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Experience', ExperienceSchema);
