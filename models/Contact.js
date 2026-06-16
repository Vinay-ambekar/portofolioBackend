const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  sidebarTitle: { type: String, default: "Let's Start A New Project" },
  items: [{
    icon: { type: String },
    label: { type: String },
    value: { type: String },
  }],
  mapSrc: { type: String, default: '' },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Contact', ContactSchema);
