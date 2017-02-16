var updateRanking = function (competition_id, round, callback) {
    var Ranking = require('./../Ranking');
    var Battle = require('./../Battle');

    // Aggregate over all the battles to compute the new ranking.
    // Explainer:
    //  - we match each round from this loop,
    //  - we flatten the teams array so we can aggregate over the attributes of the elemens in the array.
    //  - we group by the (unique) team names and sum the points per team.
    //  - we sort the list by the total points (descending).
    Battle.aggregate(
        [
            {$match: {round: round}},
            {$unwind: "$teams"},
            {
                $group: {
                    _id: "$teams.team_name",
                    played: {$sum: 1},
                    points: {$sum: "$teams.points"}
                }
            },
            {$sort: {points: -1}}
        ], function (err, ranking) {
            if (err) {
                callback(err, null);
            } else {
                // We have a sorted list of teams with total points here.
                // Let's replace the _id element key with team_name (conform schema).
                ranking = JSON.parse(JSON.stringify(ranking).split('"_id":').join('"team_name":'));
                // HACK: For now just add the default logo to every team.
                for (var i = 0, len = ranking.length; i < len; i++) {
                    ranking[i].icon = "teamlogo_default.png";
                }

                // Upsert the ranking.
                var query = {'code': competition_id, 'round': round};
                var update = {
                        competition: competition_id,
                        round: round,
                        teams: ranking
                };
                var options = {upsert: true, new: true};
                Ranking.findOneAndUpdate(query,update, options, function(err, result){
                    callback(err, result);
                });
            }
        });
};

var updateRankings = function (docs, callback) {

    // Add some recursion here.
    // WOW: This recursion structure works but to be honest I don't really know why.
    var battleDoc = docs.pop();
    updateRanking(battleDoc.competition, battleDoc.round, function (err, result) {
        if (err || docs.length == 0) {
            callback(err, result);
        } else {
            updateRankings(docs, callback);
        }
    });
};

exports.updateRanking = updateRanking;
exports.updateRankings = updateRankings;