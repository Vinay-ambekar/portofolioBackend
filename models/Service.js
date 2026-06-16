const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  sidebarTitle: { type: String, default: 'What I Do For You' },
  items: [{
    icon: { type: String },
    title: { type: String },
    desc: { type: String },
    tags: [{ type: String }],
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Service', ServiceSchema);
