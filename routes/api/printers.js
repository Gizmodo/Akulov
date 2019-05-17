const express = require('express');
const router = express.Router();
const moment = require('moment');
//Printer Item Model
const printer_item = require('../../models/printer_item');

// @route  GET api/printer_item
// @desc   Get All Printers
// @access Public
router.get('/1', (req, res) => {
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
                      "$first_address_int"
                    ]
                  },
                  {
                    "$lte": [
                      "$$ip_int",
                      "$last_address_int"
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
        "filial": "$Printers.site_code"
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

router.get('/', (req, res) => {
  var options = {
    allowDiskUse: true
  };

  var pipeline = [
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
                      "$first_address_int"
                    ]
                  },
                  {
                    "$lte": [
                      "$$ip_int",
                      "$last_address_int"
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
        "filial": "$Printers.site_code"
      }
    },
    {
      "$project": {
        "Printers": false
      }
    },
    {
      "$lookup": {
        "from": "pages",
        "localField": "serial",
        "foreignField": "serial",
        "as": "pg"
      }
    },
    {
      "$unwind": {
        "path": "$pg"
      }
    },
    {
      "$match": {
        "pg.date": {
          "$gte": moment().startOf('month').toDate(),
          "$lte": moment().endOf('month').toDate()
        }
      }
    },
    {
      "$sort": {
        "pg.date": -1.0
      }
    },
    {
      "$group": {
        "_id": "$pg.serial",
        "firstHit": {
          "$first": "$pg.pages"
        },
        "lastHit": {
          "$last": "$pg.pages"
        },
        "count": {
          "$sum": 1
        },
        "printer_info": {
          "$addToSet": {
            "filial": "$filial",
            "model": "$model",
            "serial": "$serial",
            "date": "$date",
            "pages": "$pages",
            "location": "$location",
            "ip": "$ip",
            "ip_int": "$ip_int"
          }
        }
      }
    },
    {
      "$unwind": {
        "path": "$printer_info"
      }
    },
    {
      "$addFields": {
        "model": "$printer_info.model",
        "serial": "$printer_info.serial",
        "date": "$printer_info.date",
        "pages": "$printer_info.pages",
        "location": "$printer_info.location",
        "ip": "$printer_info.ip",
        "ip_int": "$printer_info.ip_int",
        "filial": "$printer_info.filial"
      }
    },
    {
      "$project": {
        "printer_info": false
      }
    },
    {
      "$project": {
        "model": true,
        "serial": true,
        "date": true,
        "pages": true,
        "location": true,
        "ip": true,
        "ip_int": true,
        "filial": true,
        "diff": {
          "$toInt": {
            "$subtract": [
              "$firstHit",
              "$lastHit"
            ]
          }
        }
      }
    },
    {
      "$sort": {
        "ip_int": 1.0
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
