var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    //Do some initialization???
    next()
})

// List all rankings
router.get('/', function (req, res) {
    res.send('List all rankings')
})

module.exports = router