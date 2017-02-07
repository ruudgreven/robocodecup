var express = require('express')
var router = express.Router()

var Competition = require('../model/Competition');

// List all competitions.
router.get('/', function (req, res) {

    Competition.find(function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        res.status(200).json(competitions);
    });

});

module.exports = router;