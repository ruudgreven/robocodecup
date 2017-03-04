var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var testdata = require('./test_data.js');
var config = require('../config/config');

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
        server.get("/api/competition")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competitions = res.body.competitions;
                competitions.length.should.be.exactly(2);
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
                var competitions = res.body.competitions;
                competitions.length.should.be.exactly(1);

                competitions[0].code.should.be.exactly('useb_2017');
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
                done();
            });
    });

    it('should return unauthorized when creating a new competition without a token',function (done) {
        var newCompetition = {
            code: 'useb_2015',
            name: 'USEB 2015',
            description: 'The Ultimate SElection Battle 2015',
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(true);

                done();
            });
    });

    // -------------- Authentication
    var token;

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
                token = res.body.token;
                should.exist(token);

                done();
            });
    });

    it('should create a new competition with code useb_2015',function (done) {
        var newCompetition = {
            code: 'useb_2015',
            name: 'USEB 2015',
            description: 'The Ultimate SElection Battle 2015',
            current_round: 2,
            rounds: [1,2],
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .set('X-Authentication', token)
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(false);

                done();
            });
    });

    it('should not create a duplicate competition with code useb_2015',function (done) {
        var newCompetition = {
            code: 'useb_2015',
            name: 'USEB 2015',
            description: 'The Ultimate SElection Battle 2015',
            current_round: 2,
            rounds: [1,2],
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .set('X-Authentication', token)
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(409)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(true);

                done();
            });
    });

    it('should create a new competition with minimal attributes',function (done) {
        var newCompetition = {
            code: 'useb_2014',
            name: 'USEB 2014',
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .set('X-Authentication', token)
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(false);

                done();
            });
    });

    it('should not create a new competition with invalid current_round',function (done) {
        var newCompetition = {
            code: 'useb_2013',
            name: 'USEB 2013',
            description: 'The Ultimate SElection Battle 2013',
            current_round: 2,
            rounds: [],
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .set('X-Authentication', token)
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(true);

                done();
            });
    });

    it('should not create a new competition with invalid current_round',function (done) {
        var newCompetition = {
            code: 'useb_2013',
            name: 'USEB 2013',
            description: 'The Ultimate SElection Battle 2013',
            current_round: 2,
            rounds: [1],
            official: true,
            featured: false
        };
        server.post("/api/competition")
            .set('Accept', 'application/json')
            .set('X-Authentication', token)
            .send(newCompetition)
            .expect("Content-type", /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var competition = res.body;
                competition.error.should.be.exactly(true);

                done();
            });
    });
});