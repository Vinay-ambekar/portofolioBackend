const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  image: { type: String, default: '/img/about.jpg' },
  sidebarTitle: { type: String, default: '' },
  greeting: { type: String, default: '' },
  description: { type: String, default: '' },
  info: [{
    label: { type: String },
    value: { type: String },
  }],
  socialLinks: [{
    icon: { type: String },
    url: { type: String },
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('About', AboutSchema);
