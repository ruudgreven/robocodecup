var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    //Do some initialization???
    next()
})

// List all teams
router.get('/', function (req, res) {
    res.send('List all teams')
})

// List details for one team
router.get('/:id', function (req, res) {
    res.send('About ' + req.params.id);
})

module.exports = router