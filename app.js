var express = require('express')
var app = express()

console.log("Starting Robocodecup webapi");

//Configure API resources
var ranking = require('./resources/ranking')
app.use('/api/ranking', ranking)

var team = require('./resources/team')
app.use('/api/team', team)


//Configure static folders
app.use('/web', express.static('www'));
app.use('/files', express.static('files'));

//Configure redirect to /web
app.route('/').get(function(req,res) {
    res.redirect('/web');
});

app.listen(3000, function () {
    console.log('Robocodecup website listening on port 3000');
});
