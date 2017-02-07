var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var Competition = require('../model/Competition');


describe("competition test",function () {

    // Setup test environment.
    // Populate database.
    before(function (done) {
        // Before test execution
        console.log('Set up test environment.\n');

        // Connect to the database
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://localhost:27017/robocodecup');
        var db = mongoose.connection;
        db.once('open', function () {
            console.log('* Connected to test database.');

            // Add test data.
            var competitions = [
                new Competition({
                    code: 'useb_2016',
                    name: 'USEB 2016',
                    description: 'The Ultimate SElection Battle 2016',
                    official: true,
                    featured: false
                }),
                new Competition({
                    code: 'useb_2017',
                    name: 'USEB 2017',
                    description: 'The Ultimate SElection Battle 2017',
                    official: true,
                    featured: true
                })
            ];
            Competition.collection.insert(competitions, function (err, docs) {
                if (err) {
                    console.log("Error inserting competitions.")
                }
                console.info('%d competitions were successfully stored.', docs.insertedCount);

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
        console.log('Tear down test environment\n');

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
        server.get("/api/competition")
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
        server.get("/api/competition?featured=true")
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

    it('should return a single competition with code useb_2017',function (done) {
        server.get("/api/competition/useb_2017")
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