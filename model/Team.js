var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name: {type: String, required: true, unique: true, match: /\w/},
    fullname: {type: String, required: true, unique: true},
    description: {type: String, required: false},
    secret_key: {type: String, required: true},
    competitions: {type: [String]}
});

module.exports = mongoose.model("Team", teamSchema);