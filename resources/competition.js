var express = require('express');
var router = express.Router();

var Competition = require('../model/Competition');
var Team = require('../model/Team');

/**
 * @api {get} /api/competition List all competitions.
 * @apiGroup Competitions
 * @apiSuccess {Number} id Task id
 * @apiSuccess {String} title Task title
 * @apiSuccess {Boolean} done Task is done?
 * @apiSuccess {Date} updated_at Update's date
 * @apiSuccess {Date} created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "title": "Study",
 *      "done": false
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', function (req, res) {

    var where = {};
    if (req.query.featured !== undefined){
        where = {featured: req.query.featured};
    }

    var fields = {}
    Competition.find(where, {}, function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        var results = { competitions: competitions };
        res.status(200).json(results);
    });

});

/**
 * @api {get} /api/competition/<competition_code> List details of a competition.
 * @apiGroup Competitions
 * @apiSuccess {Number} id Task id
 * @apiSuccess {String} title Task title
 * @apiSuccess {Boolean} done Task is done?
 * @apiSuccess {Date} updated_at Update's date
 * @apiSuccess {Date} created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "title": "Study",
 *      "done": false
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:competition_code', function (req, res) {

    Competition.findOne({code: req.params.competition_code}, {},  function (err, competitions) {
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
 * @api {get} /api/competition/<competition_code> Details competition.
 * @apiGroup Competitions
 * @apiSuccess {Number} id Task id
 * @apiSuccess {String} title Task title
 * @apiSuccess {Boolean} done Task is done?
 * @apiSuccess {Date} updated_at Update's date
 * @apiSuccess {Date} created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "code": "useb_2017",
 *      "name": "USEB 2017",
 *      "description": "The Ultimate SElection Battle 2017",
 *      "current_round: 2,
 *      "rounds": [1,2],
 *      "official": true,
 *      "featured" : false
 *    }
 *
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:competition_code/round', function (req, res) {

    var where = {};
    if (req.query.featured !== undefined){
        where = {featured: req.query.featured};
    }

    Competition.find(where, {}, function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        res.status(200).json(competitions);
    });

});


// List all teams in a specific CompetitionSrv.js.
router.get('/:code/team', function (req, res) {

    // Query CompetitionSrv.js to see if it exists.
    Competition.findOne({'code': req.params.code}, {},  function (err, competitions) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find competitions"});
        }
        if (competitions === null || competitions.length == 0) {
            res.status(404).json();
        } else {
            // Query teams if we have a valid CompetitionSrv.js.
            Team.find({'competitions': req.params.code}, {secret_key: false}, function (err, teams) {
                if (err) {
                    console.error(err);
                    res.status(500).json({error: "true", message: "Cannot find teams"});
                }
                res.status(200).json(teams);
            });
        }
    });

});

module.exports = router;