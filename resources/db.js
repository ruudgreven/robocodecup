var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'robocodecup_service',
    password : '123',
    database : 'robocodecup'
});

db.connect();

module.exports = db;