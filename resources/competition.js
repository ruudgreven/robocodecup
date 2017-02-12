var express = require('express');
var router = express.Router();

var Competition = require('../model/Competition');
var Team = require('../model/Team');

// List all competitions.
router.get('/', function (req, res) {

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

// List a specific CompetitionSrv.js.
router.get('/:code', function (req, res) {

    Competition.findOne({'code': req.params.code}, {},  function (err, competitions) {
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