const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    default: 'Tehnik Informatika',
  },
  campus_id: {
    type: Number,
    default: 111,
  },
  graduation_year: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('User', userSchema);