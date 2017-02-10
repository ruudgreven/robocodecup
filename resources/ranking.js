var express = require('express');
var router = express.Router();

var Ranking = require('../model/Ranking');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    //Do some initialization???
    next()
})

// List all rankings
router.get('/', function (req, res) {

    var where = {};
    if (req.query.competition !== undefined) {
        // where = {competition: req.query.competition};
        where.competition = req.query.competition;
    }

    if (req.query.round !== undefined) {
        // where = {competition: req.query.competition, round: req.query.round};
        where.round = req.query.round;
    }

    Ranking.find(where, {}, function (err, ranking) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find ranking"});
        }
        res.status(200).json(ranking);
    });

});

module.exports = router;