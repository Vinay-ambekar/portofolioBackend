const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  sidebarTitle: { type: String, default: 'My Works' },
  items: [{
    category: { type: String },
    title: { type: String },
    description: { type: String },
    details: [{ type: String }],
    images: [{ type: String }],
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Project', ProjectSchema);
