const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  pages: {
    type: String,
    required: true
  },
  toner: {
    type: String,
    required: true
  },
  toner_serial: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = Item = mongoose.model('printer', ItemSchema);
