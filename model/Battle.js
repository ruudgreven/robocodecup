var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RankingUtil = require('./util/RankingUtil');

var battleSchema = new Schema({
    competition: {type: String, required: true, match: /\w/},
    round: {type: Number, required: true},
    teams: [
        {
            // Referentia naar een team.
            team_name: {type: String, required: true, match: /\w/},
            // Aantal punten die aan dit team is toegekend na de battle.
            points: {type: Number, required: true},
            /* Van het onderstaande snap ik niet zo veel. */
            survivalscore: {type: Number},
            totalscore: {type: Number},
            ramdamage: {type: Number},
            bulletdamage: {type: Number},
            survivalbonus: {type: Number},
            firsts: {type: Number},
            bulletbonus: {type: Number},
            rambonus: {type: Number}
        },
        {
            // Referentia naar een team.
            team_name: {type: String, required: true, match: /\w/},
            // Aantal punten die aan dit team is toegekend na de battle.
            points: {type: Number, required: true},
            /* Van het onderstaande snap ik niet zo veel. */
            survivalscore: {type: Number},
            totalscore: {type: Number},
            ramdamage: {type: Number},
            bulletdamage: {type: Number},
            survivalbonus: {type: Number},
            firsts: {type: Number},
            bulletbonus: {type: Number},
            rambonus: {type: Number}
        }]
});



// Update ranking when one battle is saved in database.
battleSchema.post('save', function(battleDoc, next) {

    // Update a single ranking.
    RankingUtil.updateRanking(battleDoc.competition, battleDoc.round, function (err, result) {
        next();
    });

});

// Update ranking when many battles have been updated (in the case of the test data for example).
battleSchema.post('insertMany', function(battleDocs, next) {

    RankingUtil.updateRankings(battleDocs, function (err, result) {
        next();
    });
});

module.exports = mongoose.model("Battle", battleSchema);