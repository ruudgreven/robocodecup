var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var Battle = require('../model/Battle');
var Competition = require('../model/Competition');
var User = require('../model/User');

// List all battles.
// TODO: add some paging here because the list of battles can potentialy be very large.
/**
 * @api {get} /battle List Battles
 * @apiGroup Battles
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
// router.get('/', function (req, res) {
//
//     Battle.find(function (err, battles) {
//         if (err) {
//             console.error(err);
//             res.status(500).json({error: "true", message: "Cannot find battles"});
//         }
//         res.status(200).json(battles);
//     });
//
// });
// List all battles for a specific team.
// TODO: add some paging here because the list of battles can potentialy be very large.
router.get('/', function (req, res) {
    var where = {};
    if (req.query.team_name !== undefined) {
        where = {teams: {$elemMatch: {team_name: req.query.team_name}}};
    }
    Battle.find(where, {}, function (err, battles) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find battles"});
        }
        res.status(200).json(battles);
    });

});

// Get a specific battle
router.get('/:id', function (req, res) {
    Battle.find({ '_id': req.params.id }, {}, function (err, battles) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find battle"});
        }
        res.status(200).json(battles);
    });
});

//--------------------------------------------------------------------------------------------------------------------

var authz = require('./api_authorization');
router.use(authz);

//--------------------------------------------------------------------------------------------------------------------


// Handle an upload for battles
router.post('/upload', function (req, res) {
    uploadFile(req, res);
});

function uploadFile(req, res) {

    // Create an form object
    var form = new formidable.IncomingForm();
    form.competition = req.header('X-Competition');
    form.round = req.header('X-CompetitionRound');

    form.multiples = true;

    // Store all uploads in the /uploads directory
    var filepath = path.join(__dirname + '/../uploads/admin/battle_result.json');
    form.uploadDir = path.join(__dirname, '../uploads/admin/');

    // When file has been uploaded successfully,
    // rename it to it's orignal name.
    form.on('fileBegin', function (name, file){
        file.path = filepath;
    });

    // Return a 500 in case of an error
    form.on('error', function(err) {
        res.status(500).json({'error':true, 'message': err});
    });

    // Send a response to the client when file upload is finished.
    form.on('end', function() {

        var battles = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        for (var i = 0, len = battles.length; i < len; i++) {
            battles[i].competition = form.competition;
            battles[i].round = form.round;
        }

        // Battle.collection.insert(battles, function (err, battleDocs) {
        Battle.insertMany(battles, function (err, battleDocs) {
            if (err) {
                console.log("Error inserting battles.");
                res.status(500).json({'error':true, 'message': 'The battles already exist.'})
            }

            //TODO: Check whether round already exists.
            Competition.findOneAndUpdate({code: form.competition}, {$push:{rounds:form.round}}, function(err, doc){
                if(err){
                    console.log("Something wrong when updating competition!");
                }
                //var message = battleDocs.length + ' battles were successfully stored.';
                //TODO: FIX the message below. The variable battleDocs is not available due to async hell
                var message = 'succesfully stored';
                res.status(201).json({'error':false, 'message': message})
            });
        });
    });

    // Parse the incoming request.
    form.parse(req);
}

module.exports = router;