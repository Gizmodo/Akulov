const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
    site_code: {
        type: String,
        required: true
    },
    first_address_int: {
        type: Number,
        required: true
    },
    last_address_int: {
        type: Number,
        required: true
    }
});

module.exports = branch_item = mongoose.model(
    'branches',
    ItemSchema,
    'branches'
);
