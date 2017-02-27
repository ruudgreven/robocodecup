var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();

var config = require('../config/config');
var User = require('../model/User');

// List all rankings
router.post('/', function (req, res) {

    User.findOne({
        name: req.body.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });

});

module.exports = router;