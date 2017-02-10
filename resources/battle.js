var express = require('express');
var router = express.Router();

var Battle = require('../model/Battle');

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
router.get('/', function (req, res) {

    Battle.find(function (err, battles) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find battles"});
        }
        res.status(200).json(battles);
    });

});


// List all battles for a specific team.
// TODO: add some paging here because the list of battles can potentialy be very large.
router.get('/:team_name', function (req, res) {

    Battle.find({}, {}, function (err, battles) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find battles"});
        }
        res.status(200).json(battles);
    });

});


module.exports = router;