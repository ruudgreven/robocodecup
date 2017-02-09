var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var battleSchema = new Schema({
    competition: {type: String, required: true, match: /\w/},
    round: {type: Number, required: true},
    result: {
        opponent_1: {
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
        opponent_2: {
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
        }
    }
});

module.exports = mongoose.model("Battle", battleSchema);