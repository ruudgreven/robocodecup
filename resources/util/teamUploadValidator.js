/**
 * Extract the JAR files
 * @param from The folder where the teams are
 * @param to The folder where the teams should be extracted
 */
var extractTeams = function(from, to) {
    var deferred = Q.defer();
    var promises = [];

    var files = fs.readdirSync(from);
    for (var i in files) {
        promises.push(extractTeam(from + '/' + files[i], to));
    }

    Q.all(promises).then(function() {
        deferred.resolve()
    });

    return deferred.promise;
};

/**
 * Extract one team
 * @param teamfile The JAR file of the team
 * @param to The output folder
 */
var extractTeam = function(teamfile, to) {
    var deferred = Q.defer();

    fs.createReadStream(teamfile).pipe(unzip.Extract({path: to}))
        .on('close', function () {
            deferred.resolve();
        });

    return deferred.promise;
};

/**
 * Returns a list of teams for the battle files
 * @folder the working folder
 */
var checkAndListTeams = function(folder) {
    var deferred = Q.defer();

    var teamfiles = [];
    var classDefs = [];
    var validteams = [];

    //Find all .team and .class files
    var files = readrecursive(folder);
    for (var i in files) {
        var filename = files[i];
        if (filename.indexOf('.team') > -1) {
            teamfiles.push(filename);
        }

        if (filename.indexOf('.class') > -1) {
            classDefs.push(filename.substr(0, filename.length - 6).replace(/\//g, '.'));        //Remove .class postfix, and replace / with .
        }
    }

    //Check teams
    for (var i in teamfiles) {
        var teamfile = teamfiles[i];
        var teamname = teamfile.substr(0, teamfile.length - 5);
        teamname = teamname.replace(/\//g, '.');

        process.stdout.write(chalk.cyan('  Checking team configurations: ' + teamname + '...'));

        //Read file contents
        try {
            var contents = fs.readFileSync(folder + '/' + teamfile, 'utf8');
            var contentsArray = contents.split('\n');
            for (var j in contentsArray) {
                var line = contentsArray[j];

                //Check the teammembers
                if (line.startsWith('team.members=')) {
                    var robotcount = 0;
                    var robots = line.substr(13).split(',');
                    for (var k in robots) {
                        var robot = robots[k];
                        if (classDefs.indexOf(robot) <= -1) {
                            if (classDefs.indexOf(robot.substr(0, robot.length - 1)) <= -1) {
                                throw 'Classfile for robot ' + robot + ' not found';
                            }
                        }
                        robotcount++;
                    }

                    if (robotcount!=4) {
                        throw 'There must be 4 robots in the team. Found ' + robotcount;
                    }
                }

                //Check the robocode version
                if (line.startsWith('robocode.version=')) {
                    if (line.indexOf('1.9.2.6') <= -1) {
                        throw 'Wrong robocode version, must be 1.9.2.6, found ' + line.substr(17);
                    }
                }
            }

            process.stdout.write(chalk.bold.cyan('OK!\n'));

            //Adding team to validteams
            validteams.push({
                packagename: teamname.substr(0, teamname.lastIndexOf('.')),
                teamname: teamname.substr(teamname.lastIndexOf('.') + 1)
            });
        } catch (error) {
            console.error(chalk.bold.red(error));
        }
        deferred.resolve(validteams);
    }

    return deferred.promise;
};

exports.extractTeams = extractTeams;
exports.checkAndListTeams = checkAndListTeams;