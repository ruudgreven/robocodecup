var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');

var User = require('./model/User');
var config = require('./config/config');

var app = express();

console.log("Starting Robocodecup webapi:");

// For parsing our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure API resources
var ranking = require('./resources/ranking');
app.use('/api/ranking', ranking);

var competitions = require('./resources/competition');
app.use('/api/competition', competitions);

var team = require('./resources/team');
app.use('/api/team', team);

var battle = require('./resources/battle');
app.use('/api/battle', battle);

var authn = require('./resources/authentication');
app.use('/api/authenticate', authn);

var help = require('./resources/help');
app.use('/api', help);

// Configure static folders
app.use('/web', express.static('www'));
app.use('/files', express.static('files'));
app.use('/apidoc', express.static('apidoc'));

//Configure redirect to /web
app.route('/').get(function(req,res) {
    res.redirect('/web');
});

// Connect to the database
mongoose.Promise = require('bluebird');
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('* Connected to database.');

    // Create admin user.
    var query = {name: config.admin.name};
    var options = {};
    User.findOneAndRemove(query, options, function (err, doc, result) {
        var adminUser = new User({name: config.admin.name, password: config.admin.password});
        adminUser.save(function (err, doc) {
            if(err) {
                console.log('* Error creating admin user.');
            }
        });
    });
});

// Bind app to port 3000
app.listen(3000, function () {
    console.log('* Robocodecup website listening on port 3000.');
});
