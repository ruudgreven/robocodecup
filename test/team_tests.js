var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var server = supertest.agent("http://localhost:3000");

var Competition = require('../model/Competition');
var Team = require('../model/Team');

describe("team test",function () {

    // Setup test environment.
    // Populate database.
    before(function (done) {
        // Before test execution
        console.log('Set up test environment.\n')

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
            Competition.collection.insert(competitions, function (err, compDocs) {
                if (err) {
                    console.log("Error inserting competitions.")
                }
                console.info('%d competitions were successfully stored.', compDocs.insertedCount);

                var teams = [
                    new Team({
                        name: 'TimTeam',
                        fullname: 'Timothy\'s Team',
                        description: 'None needed',
                        secret_key: '12345',
                        competitions: ['useb_2017']
                    }),
                    new Team({
                        name: 'RudeTeam',
                        fullname: 'Ruud\'s Team',
                        description: 'None needed',
                        secret_key: '54321',
                        competitions: ['useb_2017', 'useb_2016']
                    }),
                    new Team({
                        name: 'OrphanTeam',
                        fullname: 'Orphaned Team',
                        description: 'None needed',
                        secret_key: '123',
                        competitions: []
                    })
                ];
                Team.collection.insert(teams, function (err, teamDocs) {
                    if (err) {
                        console.log("Error inserting teams.")
                    }
                    console.info('%d teams were successfully stored.', teamDocs.insertedCount);

                    // Close connection.
                    mongoose.connection.close();
                    done();
                });
            });
        });

    });

    // Teardown test environment.
    // Drop database.
    after(function (done) {
        // After test execution
        console.log('Tear down test environment\n')

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
    it('should return a list of 3 teams',function (done) {
        server.get("/api/team/")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                var numCompetitions = res.body.length;
                numCompetitions.should.be.exactly(3);
                done();
            });
    });

    it('should return Timothy\'s team',function (done) {
        server.get("/api/team/TimTeam")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var team = res.body;
                team.name.should.be.exactly('TimTeam');
                should.not.exist(team.secret_key);
                team.competitions.length.should.be.exactly(1);
                team.competitions[0].should.be.exactly('useb_2017');
                done();
            });
    });

    it('should return Ruud\'s team',function (done) {
        server.get("/api/team/RudeTeam")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var team = res.body;
                team.name.should.be.exactly('RudeTeam');
                should.not.exist(team.secret_key);
                team.competitions.length.should.be.exactly(2);
                team.competitions[0].should.be.exactly('useb_2017');
                team.competitions[1].should.be.exactly('useb_2016');
                done();
            });
    });

    it('should return no team',function (done) {
        server.get("/api/team/timteam")
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(404)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should return a list of 2 teams in the USEB 2017 competition',function (done) {
        server.get("/api/competition/useb_2017/team/")
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
});