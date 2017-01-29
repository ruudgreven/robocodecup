var express = require('express');
var router = express.Router();
var db = require('./db');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//    //Do some initialization???
//    next()
//})

// List all teams
router.get('/', function (req, res) {
    db.query('SELECT id, robotteam_name, robotteam_author, robotteam_description, robotteam_url FROM team', function(err, rows){
        res.json(rows);
        //res.render('team', {team : rows});
    });
})

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