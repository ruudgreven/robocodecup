var testdata = require('../../test/test_data.js');
var mongoose = require('mongoose');

// Before test execution
console.log('Removing all data.');

// Connect to the database
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robocodecup');
var db = mongoose.connection;
db.once('open', function () {
    console.log('* Connected to database.');
    db.db.dropDatabase();
    console.log('* Dropped test database.');

    // Close connection.
    mongoose.connection.close();
});