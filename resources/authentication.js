var jwt = require('jsonwebtoken');
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
                    // Found user let's create a token.
                    var token = jwt.sign({username: user.username },
                        config.secret, {
                            expiresIn: '7d'
                        });

                    // Return token
                    res.json({success: true, token: token, expiresIn: 1440});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });

});

module.exports = router;