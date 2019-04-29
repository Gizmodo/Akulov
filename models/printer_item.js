const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  serial: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  pages: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  ip_int: {
    type: Number,
    required: true
  }
});

module.exports = printer_item = mongoose.model(
  'printers',
  ItemSchema,
  'printers'
);
