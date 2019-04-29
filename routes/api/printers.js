const express = require('express');
const router = express.Router();

//Printer Item Model
const printer_item = require('../../models/printer_item');

// @route  GET api/printer_item
// @desc   Get All Printers
// @access Public
router.get('/', (req, res) => {
  let pipeline = [
    {
      "$lookup": {
        "from": "branches",
        "let": {
          "ip_int": "$ip_int"
        },
        "pipeline": [
          {
            "$match": {
              "$expr": {
                "$and": [
                  {
                    "$gte": [
                      "$$ip_int",
                      "$ip_start"
                    ]
                  },
                  {
                    "$lte": [
                      "$$ip_int",
                      "$ip_end"
                    ]
                  }
                ]
              }
            }
          }
        ],
        "as": "Printers"
      }
    },
    {
      "$sort": {
        "ip_int": 1.0
      }
    },
    {
      "$unwind": {
        "path": "$Printers"
      }
    },
    {
      "$addFields": {
        "filial": "$Printers.name"
      }
    },
    {
      "$project": {
        "Printers": false,
        "ip_int": false
      }
    }
  ];

  printer_item
    .aggregate(pipeline)
    .then(items => {
      res.json(items);
    });
});

module.exports = router;
