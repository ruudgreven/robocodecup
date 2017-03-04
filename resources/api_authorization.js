var config = require('../config/config.js');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.use('/', function (req, res, next) {

    var token = req.headers['x-authentication'];

    // Verify token
    if (token) {

        jwt.verify(token, config.secret, function (err, decoded) {

            // Return 401 if token is invalid.
            if (err) {
                return res.status(401).json({error: true, message: 'Invalid token.'});
            }

            //Call the next in middleware.
            return next();
        });
    } else {
        return res.status(401).json({error: true, message: 'No token was provided!'});
    }
});

module.exports = router;