const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeholder_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4y-6ppt-jZx6W1RtuKI6mXr2mbyPMy8mG2QhjumYJLgI5m8riAEPHwHpgsUWnrz7lZNU&usqp=CAU';

const userSchema = new Schema({
  name: {
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
  profile_pic_url: {
    type: String,
    default: placeholder_image,
  },
  campuss_id: {
    type: String,
    default: "111",
  },
  year: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  date_created: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);