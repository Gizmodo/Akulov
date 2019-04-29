const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
    serial: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = page_item = mongoose.model(
    'pages',
    ItemSchema,
    'pages'
);
