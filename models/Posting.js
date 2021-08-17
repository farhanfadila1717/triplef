const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postingSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  campus_id: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  document_url: {
    type: String,
    required: true,
  },
  download_count: {
    type: Number,
    default: 0,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Posting', postingSchema);