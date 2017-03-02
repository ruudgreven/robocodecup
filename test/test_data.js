module.exports = {

    importData: function (callback) {
        var Competition = require('../model/Competition');
        var Team = require('../model/Team');
        var Battle = require('../model/Battle');
        var User = require('../model/User');
        var config = require('../config/config');

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
                current_round: 3,
                rounds: [3,2,1],
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
                    code: 'TimTeam',
                    name: 'Timothy\'s Team',
                    logo: "teamlogo_default.png",
                    description: 'None needed',
                    secret_key: '12345',
                    competitions: ['useb_2017']
                }),
                new Team({
                    code: 'RudeTeam',
                    name: 'Ruud\'s Team',
                    logo: "teamlogo_default.png",
                    description: 'None needed',
                    secret_key: '54321',
                    competitions: ['useb_2017', 'useb_2016']
                }),
                new Team({
                    code: 'CrazyTeam',
                    name: 'Crazy\'s Team',
                    logo: "teamlogo_default.png",
                    description: 'None needed',
                    secret_key: '54321',
                    competitions: ['useb_2017']
                }),
                new Team({
                    code: 'OrphanTeam',
                    name: 'Orphaned Team',
                    logo: "teamlogo_default.png",
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
                // Battle.insertMany(battles).then(function (battleDocs) {
                Battle.insertMany(battles, function (err, battleDocs) {
                    if(err) {
                        console.log("Error inserting battles.");
                        callback(err);
                    }
                    console.info('%d battles were successfully stored.\n\n', battleDocs.length);

                    var user = new User({
                        name: config.admin.name,
                        password: config.admin.password
                    });

                    user.save(function (err, doc) {
                        if(err) {
                            console.log('* Error creating admin user.');
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                });
                // }).catch(function (err){
                //     console.log("Error inserting battles.");
                //     callback(err);
                // });
            });
        });
    }
};