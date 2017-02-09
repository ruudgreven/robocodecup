var express = require('express')
var mongoose = require('mongoose');
var app = express()

console.log("Starting Robocodecup webapi:");

//Configure API resources
var ranking = require('./resources/ranking');
app.use('/api/ranking', ranking);

var competitions = require('./resources/competition');
app.use('/api/competition', competitions);

var team = require('./resources/team');
app.use('/api/team', team);

var battle = require('./resources/battle');
app.use('/api/battle', battle);

//Configure static folders
app.use('/web', express.static('www'));
app.use('/files', express.static('files'));

//Configure redirect to /web
app.route('/').get(function(req,res) {
    res.redirect('/web');
});

// Connect to the database
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robocodecup');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('* Connected to database.');
});

// Bind app to port 3000
app.listen(3000, function () {
    console.log('* Robocodecup website listening on port 3000.');
});
