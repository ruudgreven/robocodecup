var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var Team = require('../model/Team');
var TeamUploadValidator = require('./util/teamUploadValidator');

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
router.post('/upload', function (req, res) {
    uploadFile(req, res);
});

function uploadFile(req, res) {
    var fileName;

    // Create an form object
    var form = new formidable.IncomingForm();

    form.multiples = true;

    // Store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../uploads/');

    Team
        .find({secret_key : req.header('X-Authentication')})
        .then(function(docs) {
            if (docs.length == 1) {

                // Set folder name
                var folderName = docs[0].name;

                // When file has been uploaded successfully,
                // rename it to it's orignal name.
                form.on('fileBegin', function (name, file){
                    file.path = path.join(__dirname + '/../uploads/' + folderName + '-' + file.name);
                });

                // Return a 500 in case of an error
                form.on('error', function(err) {
                    res.status(500).json({'error':true, 'message': err});
                });

                // Send a response to the client when file upload is finished.
                form.on('end', function() {
                    TeamUploadValidator.extractTeams()
                    res.status(201).json({'error':false, 'message':'Upload succesfull.'})
                });

                // Parse the incoming request.
                form.parse(req);
            } else {
                res.status(500).json({'error':true, 'message': err});
            }
        })
        .catch(function(err) {
            res.status(500).json({'error':true, 'message': 'Error uploading file.'});
        });
}

module.exports = router;