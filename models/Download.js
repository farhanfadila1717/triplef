const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  postings_id: [String],
  date_created: {
    type: Number,
    default: 0,
  },
  date_updated: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Download', downloadSchema);