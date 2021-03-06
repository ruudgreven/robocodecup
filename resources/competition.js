var express = require('express');
var router = express.Router();

var Battle = require('../model/Battle');
var Competition = require('../model/Competition');
var Ranking = require('../model/Ranking');
var Team = require('../model/Team');

/**
 * @api {get} /api/competition List all competitions
 * @apiGroup Competitions
 * @apiSuccess {Competition[]} competitions A list of competitions.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
 *      competitions:
 *          {
 *              "code": "useb_2017",
 *              "name": "USEB 2017",
 *              "description": "The Ultimate SElection Battle 2017",
 *              "rounds": [2,1]
 *          },
 *          {
 *              ...
 *          }
 *    ]
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', function (req, res) {

    var where = {};
    if (req.query.featured !== undefined){
        where = {featured: req.query.featured};
    }

    var fields = {code: true, name: true, description: true, rounds: true, _id: false};
    Competition.find(where, fields, function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        var results = { competitions: competitions };
        res.status(200).json(results);
    });

});

/**
 * @api {get} /api/competition/<competition_code> Details of a competition
 * @apiParam {String} competition_code Competition code (id).
 *
 * @apiGroup Competitions
 * @apiSuccess {String} code Competition code (id).
 * @apiSuccess {String} name Name of the competition.
 * @apiSuccess {String} description The competition's description.
 * @apiSuccess {Number[]} rounds The rounds in the competition so far.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "code": "useb_2017",
 *      "name": "USEB 2017",
 *      "description": "The Ultimate SElection Battle 2017",
 *      "rounds": [2,1]
 *    }
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:competition_code', function (req, res) {

    var fields = {code: true, name: true, description: true, rounds: true, _id: false};
    Competition.findOne({code: req.params.competition_code}, fields,  function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        if (competitions === null || competitions.length == 0) {
            res.status(404).json();
        } else {
            res.status(200).json(competitions);
        }
    });

});

/**
 * @api {get} /api/competition/<competition_code>/team List teams in competition
 * @apiParam {String} competition_code Competition code (id).
 *
 * @apiGroup Competitions
 * @apiSuccess {Team[]} teams The list of teams.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "teams": [
 *          {
 *              "code": "team1",
 *              "name": "Team 1",
 *              "logo": "teamlogo_default.png",
 *              "competitions": [
 *                  "useb_2017"
 *              ]
 *          },
 *          {
 *              ...
 *          },
 *      ]
 *    }
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found
 */
router.get('/:competition_code/team', function (req, res) {

    // Query competition to see if it exists.
    Competition.findOne({code: req.params.competition_code}, function (err, competitionDocs) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        if (competitionDocs === null || competitionDocs.length == 0) {
            res.status(404).json({});
        } else {
            // Query teams if we have a valid competition.
            var fields = {code: true, name: true, logo: true, competitions: true, _id: false};
            Team.find({competitions: req.params.competition_code}, fields, function (err, teams) {
                if (err) {
                    console.error(err);
                    res.status(500).json({error: "true", message: "Cannot find teams"});
                }
                var results = {teams: teams};
                res.status(200).json(results);
            });
        }
    });

});

/**
 * @api {get} /api/competition/<competition_code>/round/<round_number>/ranking  Ranking in competition
 * @apiParam {String} competition_code Competition code (id).
 * @apiParam {Number} round_number The round for the ranking in competition.
 *
 * @apiGroup Competitions
 * @apiSuccess {String} competition The competition for the ranking.
 * @apiSuccess {Number} round The round for which the ranking is shown.
 * @apiSuccess {Entry[]} entries An ordered list of entries containing a team and its scores.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      {
 *          "competition": "useb_2017",
 *          "round": 1,
 *          "entries": [
 *              {
 *                  "icon": "teamlogo_default.png",
 *                  "disqualifications": 0,
 *                  "loses": 0,
 *                  "wins": 1,
 *                  "points": 3,
 *                  "played": 1,
 *                  "team": {
 *                      "logo": "teamlogo_default.png",
 *                      "name": "Team 1",
 *                      "code": "team1"
 *                   }
 *              },
 *              {
 *                  ...
 *              }
 *          ]
 *      }
 *    }
 *
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found
 */
//TODO: Move this method to the ranking file.
router.get('/:competition_code/round/:round_number/ranking', function (req, res) {

    // Query competition to see if it exists.
    Competition.findOne({code: req.params.competition_code}, {},  function (err, competitionDocs) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        if (competitionDocs === null || competitionDocs.length == 0) {
            res.status(404).json({});
        } else {
            // Query ranking if we have a valid competition.
            var fields = {competition: true, round: true, entries: true, _id: false};
            var where = {competition : req.params.competition_code, round: req.params.round_number};
            Ranking.findOne(where, fields, function (err, ranking) {
                if (err) {
                    console.error(err);
                    res.status(500).json({error: "true", message: "Cannot find ranking"});
                }
                //
                res.status(200).json(ranking);
            });
        }
    });

});


/**
 * @api {get} /api/competition/<competition_code>/round/<round_number>/battle[?team=<team_code>]  List of battles in competition
 * @apiParam {String} competition_code Competition code (id).
 * @apiParam {Number} round_number The round for the ranking in competition.
 * @apiParam {String} [team_code]  Team name for which the battle list should be filtered.

 * @apiGroup Competitions
 * @apiSuccess {Number} replayfile The robocode replay file for a battle.
 * @apiSuccess {Number} round The round for which the battles are shown.
 * @apiSuccess {String} competition The competition for the ranking.
 * @apiSuccess {Team[]} teams A list of two teams and their scores.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "battles": [
 *          {
 *              "round": 3,
 *              "competition": "useb_2017",
 *              "replayfile": "replay.br",
 *              "teams": [
 *                  {
 *                      "team_name": "team1",
 *                      "points": 3
 *                  },
 *                  {
 *                      "team_name": "team2",
 *                      "points": 1
 *                  }
 *              ]
 *          },
 *          {
 *              ...
 *          }
 *      ]
 *    }
 *
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:competition_code/round/:round_number/battle', function (req, res) {

    // Optionally filter by team.
    var where = {};
    if (req.query.team !== undefined) {
        where.teams =
        {
            "$elemMatch":  {
                team_name: req.query.team.toLowerCase()
            }
        };
    }
    where.competition = req.params.competition_code;
    where.round = req.params.round_number;

    // If we have no competition code or round number then simply return empty list.
    if (req.params.competition_code === undefined || req.params.round_number === undefined) {
        return res.status(200).json({ battles: [] });
    }

    var fields = {round: true, competition: true, replayfile: true, teams: true, _id: false};
    Battle.find(where, fields, function (err, battles) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: "true", message: "Cannot find battles"});
        }
        var results = {battles: battles};
        res.status(200).json(results);
    });

});



//--------------------------------------------------------------------------------------------------------------------

var authz = require('./api_authorization');
router.use(authz);

//--------------------------------------------------------------------------------------------------------------------


/**
 * @api {post} /api/competition/ Create a new competition
 *
 * @apiGroup Competitions
 * @apiParam {String} code Competition code (id).
 * @apiParam {String} name Name of the competition.
 * @apiParam {String} [description] The competition's description.
 * @apiParam {Number} [current_round] The competition's current round.
 * @apiParam {Number[]} [rounds] The rounds in the competition so far.
 * @apiParam {Boolean} official A boolean indicating whether the competition is official.
 * @apiParam {Boolean} featured A boolean indicating whether the competition is featured.
 *
 * @apiSuccess {Boolean} error A boolean indicating whether an error has occurred.
 * @apiSuccess {String} message Error or succes message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Competition useb_2017 created."
 *    }
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 409 Conflict
 *    HTTP/1.1 400 Not Found
 */
router.post('/', function (req, res) {

    // Validate input first.
    if (!req.body.code || req.body.code === "") {
        return res.status(400).json({error: true, message: "Invalid code for competition."});
    }

    if (!req.body.name || req.body.name === "") {
        return res.status(400).json({error: true, message: "Invalid name for competition."});
    }

    if (req.body.official === undefined || req.body.official === "") {
        return res.status(400).json({error: true, message: "Competition should be defined as official or not."});
    }

    if (req.body.featured === undefined || req.body.featured === "") {
        return res.status(400).json({error: true, message: "Competition should be defined as featured or not."});
    }

    var valid_current_round = true;
    if (req.body.current_round !== undefined) {
        valid_current_round = false;
        var rounds = req.body.rounds;
        if (rounds !== undefined) {
            for (var i = 0, len = rounds.length; i < len; i++) {
                if (rounds[i] === req.body.current_round) {
                    valid_current_round = true;
                    break;
                }
            }
        }
    }

    if (!valid_current_round) {
        return res.status(400).json({error: true, message: "Current round is invalid."});
    }


    var newCompetition = new Competition();
    newCompetition.code = req.body.code;
    newCompetition.name = req.body.name;
    newCompetition.description = req.body.description;
    newCompetition.current_round = req.body.current_round;
    newCompetition.rounds = [];
    if (req.body.featured !== undefined) {
        newCompetition.rounds = req.body.rounds;
    }
    newCompetition.official = req.body.official;
    newCompetition.featured = req.body.featured;

    // Save new competition.
    newCompetition.save(function (err) {
        if (err) {
            return res.status(409).json({error: true, message: "Can't save the new competition."});
        }
        //Return 201
        return res.status(201).json({error: false, message: "Competition "+ newCompetition.code +" created."});
    });
});

/**
 * @api {get} /api/competition/<competition_code>/team List teams in competition
 * @apiParam {String} competition_code Competition code (id).
 *
 * @apiGroup Competitions
 * @apiSuccess {Team[]} teams The list of teams.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "teams": [
 *          {
 *              "code": "team1",
 *              "name": "Team 1",
 *              "logo": "teamlogo_default.png",
 *              "competitions": [
 *                  "useb_2017"
 *              ]
 *          },
 *          {
 *              ...
 *          },
 *      ]
 *    }
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found
 */
router.get('/:competition_code/team/all', function (req, res) {

    // Query competition to see if it exists.
    Competition.findOne({code: req.params.competition_code}, function (err, competitionDocs) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        if (competitionDocs === null || competitionDocs.length == 0) {
            res.status(404).json({});
        } else {
            // Query teams if we have a valid competition.
            var fields = {code: true, name: true, logo: true, secret_key: true, competitions: true, _id: false};
            Team.find({competitions: req.params.competition_code}, fields, function (err, teams) {
                if (err) {
                    console.error(err);
                    res.status(500).json({error: "true", message: "Cannot find teams"});
                }
                var results = {teams: teams};
                res.status(200).json(results);
            });
        }
    });

});

module.exports = router;