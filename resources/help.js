var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

// List all rankings
router.get('/', function (req, res) {

    var help = {
        "documenation" : "/apidoc"
    };
    res.status(200).json(help);

});

module.exports = router;
