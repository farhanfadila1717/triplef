const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postingSchema = new Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile_pic_url: {
      type: String,
    },
    campuss_id: {
      type: String,
      default: "111",
    },
    campuss_name: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: 0,
    },
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