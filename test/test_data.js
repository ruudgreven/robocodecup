module.exports = {

    importData: function (callback) {
        var Competition = require('../model/Competition');
        var Team = require('../model/Team');
        var Battle = require('../model/Battle');

        var competitions = [
            new Competition({
                code: 'useb_2016',
                name: 'USEB 2016',
                description: 'The Ultimate SElection Battle 2016',
                official: true,
                featured: false
            }),
            new Competition({
                code: 'useb_2017',
                name: 'USEB 2017',
                description: 'The Ultimate SElection Battle 2017',
                official: true,
                featured: true
            })
        ];
        Competition.collection.insert(competitions, function (err, compDocs) {
            if (err) {
                console.log("Error inserting competitions.");
                callback(err);
            }
            console.info('%d competitions were successfully stored.', compDocs.insertedCount);

            var teams = [
                new Team({
                    name: 'TimTeam',
                    fullname: 'Timothy\'s Team',
                    description: 'None needed',
                    secret_key: '12345',
                    competitions: ['useb_2017']
                }),
                new Team({
                    name: 'RudeTeam',
                    fullname: 'Ruud\'s Team',
                    description: 'None needed',
                    secret_key: '54321',
                    competitions: ['useb_2017', 'useb_2016']
                }),
                new Team({
                    name: 'CrazyTeam',
                    fullname: 'Crazy\'s Team',
                    description: 'None needed',
                    secret_key: '54321',
                    competitions: ['useb_2017']
                }),
                new Team({
                    name: 'OrphanTeam',
                    fullname: 'Orphaned Team',
                    description: 'None needed',
                    secret_key: '123',
                    competitions: []
                })
            ];
            Team.collection.insert(teams, function (err, teamDocs) {
                if (err) {
                    console.log("Error inserting teams.");
                    callback(err);
                }
                console.info('%d teams were successfully stored.', teamDocs.insertedCount);

                // Add battles.
                var battles = [
                    new Battle({
                        competition: 'useb_2017',
                        round: 1,
                        teams: [
                            {
                                team_name: 'TimTeam',
                                points: 3
                            },
                            {
                                team_name: 'RudeTeam',
                                points: 0
                            }
                        ]
                    }),
                    new Battle({
                        competition: 'useb_2017',
                        round: 2,
                        teams: [
                            {
                                team_name: 'TimTeam',
                                points: 1
                            },
                            {
                                team_name: 'RudeTeam',
                                points: 1
                            }
                        ]
                    }),
                    new Battle({
                        competition: 'useb_2017',
                        round: 2,
                        teams: [
                            {
                                team_name: 'TimTeam',
                                points: 0
                            },
                            {
                                team_name: 'RudeTeam',
                                points: 3
                            }
                        ]
                    }),
                    new Battle({
                        competition: 'useb_2017',
                        round: 3,
                        teams: [
                            {
                                team_name: 'TimTeam',
                                points: 3
                            },
                            {
                                team_name: 'RudeTeam',
                                points: 0
                            }
                        ]
                    }),
                    new Battle({
                        competition: 'useb_2017',
                        round: 3,
                        teams: [
                            {
                                team_name: 'TimTeam',
                                points: 3
                            },
                            {
                                team_name: 'CrazyTeam',
                                points: 0
                            }
                        ]
                    }),
                    new Battle({
                        competition: 'useb_2017',
                        round: 3,
                        teams: [
                            {
                                team_name: 'RudeTeam',
                                points: 3
                            },
                            {
                                team_name: 'CrazyTeam',
                                points: 0
                            }
                        ]
                    })
                ];
                // Battle.collection.insert(battles, function (err, battleDocs) {
                Battle.insertMany(battles).then(function (battleDocs) {
                    console.info('%d battles were successfully stored.\n\n', battleDocs.length);
                    callback(null);
                }).catch(function (err){
                    console.log("Error inserting battles.");
                    callback(err);
                });
            });
        });
    }
};