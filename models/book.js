const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{1,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid year!`,
    },
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', schema);
