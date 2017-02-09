var express = require('express');
var router = express.Router();

var Battle = require('../model/Battle');

// List all battles.
// TODO: add some paging here because the list of battles can potentialy be very large.
router.get('/', function (req, res) {

    Battle.find(function (err, battles) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find battles"});
        }
        res.status(200).json(battles);
    });

});

module.exports = router;