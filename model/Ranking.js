var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rankingSchema = new Schema({
    competition: {type: String, required: true, match: /\w/},
    round: {type: Number, required: true},
    entries: [
        {
            team: {
                code: {type: String, required: true, match: /\w/},
                name: {type: String, required: true},
                logo: {type: String}
            },
            points: {type: Number, required: true},
            wins: {type: Number, required: true},
            loses: {type: Number, required: true},
            disqualifications: {type: Number, required: true},
            played: {type: Number, required: true}
        }
    ]

}, {strict: false});

module.exports = mongoose.model("Ranking", rankingSchema);