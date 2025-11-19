const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  project_image: {
    type: String,
  },
  blocks: [{
    type: {
      type: String,
      enum: ['image', 'paragraph', 'video', 'youtube', 'link'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Threshold_data', thresholdSchema);
