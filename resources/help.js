var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var testdata = require('../test/test_data.js');

// List all rankings
router.get('/', function (req, res) {

    var help = {
        "documenation" : "/apidoc",
        "populate_test_data": "/testdata"
    };
    res.status(200).json(help);

});

router.get('/testdata', function (req, res) {

    // Populate database.
    console.log('Importing test data.');

    var db = mongoose.connection;
    db.db.dropDatabase(function (err) {
        console.log('* Dropped test database.');

        // Add test data.
        testdata.importData(function (err) {
            if(err) {
                res.status(500).json({"error": true,"message": "Oops!"});
            } else {
                res.status(200).json({"error": false, "message": "Test data imported"});
            }
        });
    });

});


module.exports = router;