const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 4,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
    },
  ],
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);
