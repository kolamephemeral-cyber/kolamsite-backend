const mongoose = require('mongoose');

const kolamNotebookSchema = new mongoose.Schema({
  project_title: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
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

module.exports = mongoose.model('KolamNotebook', kolamNotebookSchema);
