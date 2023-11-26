const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
    max: new Date().getFullYear(),
    validate: {
      validator: function (v) {
        return /^[0-9]{1,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid year!`,
    },
  },
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', schema);
