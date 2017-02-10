var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var testdata = require('./test_data.js');

describe("ranking test",function () {

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

    // Actual tests
    it('should return a list of 3 rankings',function (done) {
        server.get("/api/ranking")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numRankings = res.body.length;
                numRankings.should.be.exactly(3);
                done();
            });
    });

    it('should return a list of 3 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2017")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numRankings = res.body.length;
                numRankings.should.be.exactly(3);
                done();
            });
    });

    it('should return a list of 0 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2016")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numRankings = res.body.length;
                numRankings.should.be.exactly(0);
                done();
            });
    });

    it('should return a list of 0 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2016&round=1")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numRankings = res.body.length;
                numRankings.should.be.exactly(0);
                done();
            });
    });

    it('should return a list of 0 rankings',function (done) {
        server.get("/api/ranking?round=1")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numRankings = res.body.length;
                numRankings.should.be.exactly(1);
                done();
            });
    });

    it('should return a list of 1 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2017&round=1")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var ranking = res.body;
                ranking.length.should.be.exactly(1);

                var teams = ranking[0].teams;
                teams.length.should.be.exactly(2);
                teams[0].team_name.should.be.exactly("TimTeam");
                teams[0].points.should.be.exactly(3);
                teams[1].team_name.should.be.exactly("RudeTeam");
                teams[1].points.should.be.exactly(0);

                done();
            });
    });

    it('should return a list of 1 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2017&round=2")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var ranking = res.body;
                ranking.length.should.be.exactly(1);

                var teams = ranking[0].teams;
                teams.length.should.be.exactly(2);
                teams[0].team_name.should.be.exactly("RudeTeam");
                teams[0].points.should.be.exactly(4);
                teams[1].team_name.should.be.exactly("TimTeam");
                teams[1].points.should.be.exactly(1);

                done();
            });
    });

    it('should return a list of 1 rankings',function (done) {
        server.get("/api/ranking?competition=useb_2017&round=3")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var ranking = res.body;
                ranking.length.should.be.exactly(1);

                var teams = ranking[0].teams;
                teams.length.should.be.exactly(2);
                teams[0].team_name.should.be.exactly("TimTeam");
                teams[0].points.should.be.exactly(3);
                teams[1].team_name.should.be.exactly("RudeTeam");
                teams[1].points.should.be.exactly(0);

                done();
            });
    });
});