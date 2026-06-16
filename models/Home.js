const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  image: { type: String, default: '/img/header-img.jpg' },
  title: { type: String, default: 'Software Engineer' },
  description: { type: String, default: '' },
  contactInfo: [{
    icon: { type: String },
    text: { type: String },
  }],
  socialLinks: [{
    icon: { type: String },
    url: { type: String },
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Home', HomeSchema);
