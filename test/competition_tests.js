var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var testdata = require('./test_data.js');

describe("competition.js test",function () {

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
    it('should return a list of 2 competitions',function (done) {
        server.get("/api/CompetitionSrv.js")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var numCompetitions = res.body.length;
                numCompetitions.should.be.exactly(2);
                done();
            });
    });

    it('should return a list of 1 featured competitions',function (done) {
        server.get("/api/CompetitionSrv.js?featured=true")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var numCompetitions = res.body.length;
                numCompetitions.should.be.exactly(1);

                var competition = res.body;
                competition[0].code.should.be.exactly('useb_2017');
                done();
            });
    });

    it('should return a single CompetitionSrv.js with code useb_2017',function (done) {
        server.get("/api/CompetitionSrv.js/useb_2017")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.code.should.be.exactly('useb_2017');
                competition.name.should.be.exactly('USEB 2017');
                competition.featured.should.be.exactly(true);
                competition.official.should.be.exactly(true);
                done();
            });
    });
});