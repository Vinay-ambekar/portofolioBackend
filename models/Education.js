const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  sidebarTitle: { type: String, default: 'My Education Qualification' },
  items: [{
    school: { type: String },
    year: { type: String },
    degree: { type: String },
    desc: { type: String },
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Education', EducationSchema);
