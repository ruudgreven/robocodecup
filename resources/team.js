var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var Team = require('../model/Team');

// List all teams
router.get('/', function (req, res) {

    Team.find({}, {secret_key: false}, function (err, teams) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find teams"});
        }
        res.status(200).json(teams);
    });

});

// Retrieve a specific team
router.get('/:name', function (req, res) {

    Team.findOne({'name': req.params.name}, {secret_key: false}, function (err, team) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find team"});
        }
        if (team === null || team.length == 0) {
            res.status(404).json();
        } else {
            res.status(200).json(team);
        }
    });

});


// Handle an upload for a team
router.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log("Lala: " + req.body);
});

// List details for one team
router.get('/:id', function (req, res) {
    res.send('About ' + req.params.id);
});



module.exports = router