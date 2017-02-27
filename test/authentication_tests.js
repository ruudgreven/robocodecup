var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var testdata = require('./test_data.js');
var config = require('../config/config');

describe("aithentication.js test",function () {

    // Setup test environment.
    // Populate database.
    before(function (done) {
        // Before test execution
        console.log('Set up test environment.');

        // Connect to the database
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://localhost:27017/robocodecup');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error : '));
        db.once('open', function () {
            console.log('* Connected to test database.');

            // Add test data.
            testdata.importData(function (err) {
                // Close connection.
                mongoose.connection.close();
                done();
            });
        });

    });

    // Teardown test environment.
    // Drop database.
    after(function (done) {
        // After test execution
        console.log('Tear down test environment.');

        // Connect to the database
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://localhost:27017/robocodecup');
        var db = mongoose.connection;
        db.once('open', function () {
            console.log('* Connected to test database.');
            db.db.dropDatabase();
            console.log('* Dropped test database.');

            // Close connection.
            mongoose.connection.close();
            done();
        });
    });

    // Actual unit tests.
    it('should return token for correct credentials',function (done) {
        var user = {username: config.admin.name, password: config.admin.password};

        server.post("/api/authenticate")
            .set('Accept', 'application/json')
            .send(user)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.success.should.be.exactly(true);
                should.exist(res.body.token);
                done();
            });
    });

    // Actual unit tests.
    it('should return token for correct credentials',function (done) {
        var user = {username: "admin", password: "123"};

        server.post("/api/authenticate")
            .set('Accept', 'application/json')
            .send(user)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.success.should.be.exactly(false);
                should.not.exist(res.body.token);
                done();
            });
    });


});