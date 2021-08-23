const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postingSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  campuss: {
    campuss_id: {
      type: String,
      required: true,

    },
    campuss_name: {
      type: String,
      required: true,
    }
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
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
  posting_type: {
    type: String,
    default: "Public",
  },
  source: {
    type: String,
    default: "",
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