const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ip_start: {
        type: Number,
        required: true
    },
    ip_end: {
        type: Number,
        required: true
    }
});

module.exports = branch_item = mongoose.model(
    'branches',
    ItemSchema,
    'branches'
);
