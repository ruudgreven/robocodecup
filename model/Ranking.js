var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rankingSchema = new Schema({
    competition: {type: String, required: true, match: /\w/},
    round: {type: Number, required: true},
    teams: [{
        team_name: {type: String, required: true, match: /\w/},
        points: {type: Number, required: true}
    }]
}, {strict: false});

module.exports = mongoose.model("Ranking", rankingSchema);