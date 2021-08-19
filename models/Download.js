const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  posting_id: {
    type: String,
    required: true,
  },
  date_created: {
    type: Number,
    default: 0,
  },
  date_Updated: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Download', downloadSchema);