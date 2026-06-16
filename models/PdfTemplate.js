const mongoose = require('mongoose');

const PdfTemplateSchema = new mongoose.Schema({
  name: { type: String, default: 'VINAY B' },
  title: { type: String, default: 'Software Engineer' },
  location: { type: String, default: 'Bangalore, India' },
  phone: { type: String, default: '+91 6361325812' },
  email: { type: String, default: 'vinayamberk.b@gmail.com' },
  github: { type: String, default: 'https://github.com/vinay-ambekar' },
  linkedin: { type: String, default: 'www.linkedin.com/in/vinay-b-ambekar' },
  profileSummary: { type: String, default: '' },
  technicalSkills: {
    frontend: { type: String },
    backend: { type: String },
    database: { type: String },
    tools: { type: String },
    programming: { type: String },
    concepts: { type: String },
  },
  experience: [{
    company: { type: String },
    role: { type: String },
    product: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    location: { type: String },
    highlights: [{ type: String }],
  }],
  education: [{
    degree: { type: String },
    institution: { type: String },
    startDate: { type: String },
    endDate: { type: String },
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('PdfTemplate', PdfTemplateSchema);
