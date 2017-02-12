var testdata = require('../../test/test_data.js');
var mongoose = require('mongoose');

// Before test execution
console.log('Filling the database with testdata. Make sure the docker database image is running!');

// Connect to the database
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robocodecup');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error : '));
db.once('open', function () {
    console.log('* Connected to database.');

    // Add test data.
    testdata.importData(function (err) {
        // Close connection.
        mongoose.connection.close();
    });
});