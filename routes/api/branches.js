const express = require('express');
const router = express.Router();

//Branch item model
const branch_item = require('../../models/branch_item');

// @route  GET api/branches
// @desc   Get All Branches
// @access Public
router.get('/', (req, res) => {
    branch_item
        .find()
        .sort({ site_code: 1 })
        .then(items => {
            res.json(items);
        });
});

// @route  POST api/items
// @desc   Create An Item
// @access Public
/*
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    newItem.save().then(item => res.json(item));
});
*/
// @route  DELETE api/items/:id
// @desc   Delete An Item
// @access Public
/*
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});
*/
module.exports = router;
