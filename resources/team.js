var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var AdmZip = require('adm-zip');

var Team = require('../model/Team');


// List all teams
router.get('/', function (req, res) {

    Team.find({}, {secret_key: false}, function (err, teams) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find teams"});
        }
        res.status(200).json(teams);
    });

});


/**
 * @api {get} /api/team/<team_code> Retrieve a team
 * @apiParam {String} team_code Team code (id).
 *
 * @apiGroup Teams
 * @apiSuccess {String} code Team code (id).
 * @apiSuccess {String} name Name of the team.
 * @apiSuccess {String} logo The team's logo (url).
 * @apiSuccess {String[]} competitions The competitions in the team is participating.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "code": "team1",
 *      "name": "Team 1",
 *      "logo": "teamlogo_default.png",
 *      "competitions": [
 *          "useb_2017"
 *      ]
 *    }
 * @apiErrorExample {json} Query error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found
 */
router.get('/:team_code', function (req, res) {

    var fields = {code: true, name: true, logo: true, competitions: true, _id: false};
    Team.findOne({'code': req.params.team_code}, fields, function (err, team) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find team"});
        }
        if (team === null || team.length == 0) {
            res.status(404).json({});
        } else {
            res.status(200).json(team);
        }
    });

});

// Handle an upload for a team
router.post('/upload', function (req, res) {
    uploadJar(req, res);
});

function uploadJar(req, res) {
    var secret_key = req.header('X-Authentication');

    // Create an form object
    var form = new formidable.IncomingForm();

    form.multiples = true;

    // Store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../uploads/');

    var fields = {code: true, name: true, logo: true, competitions: true, _id: false};
    Team.findOne({'secret_key': secret_key}, fields, function (err, teamDoc) {
        if (err) {
            console.error(err);
            res.status(500).json({'error':true, message: 'Error uploading file. Team with given code not found'});
        }
        if (teamDoc === null || teamDoc.length == 0) {
            res.status(404).json({'error':true, message: 'Error uploading file. Team with given code not found'});
        } else {
            var filename;
            form.on('fileBegin', function (name, file){
                //TODO: The file will only be stored in the first competition where the team is in. FIX THIS FOR MULTIPLE COMPEITITIONS
                var foldername = __dirname + '/../uploads/' + teamDoc.competitions[0];

                //Create a folder for the competition if it does not exists.
                if (!fs.existsSync(foldername)){
                    fs.mkdirSync(foldername);
                }

                //Store file in the created folder.
                file.path = path.join(foldername + '/' + teamDoc.name + '-' + file.name);
                filename = file.path;
            });

            // Return a 500 in case of an error
            form.on('error', function(err) {
                res.status(500).json({'error':true, 'message': err});
            });

            // Send a response to the client when file upload is finished.
            form.on('end', function() {
                //Check the file, list all files in it
                try {
                    console.log('Checking file ' + filename);
                    checkTeamfile('nl.saxion.' + teamDoc.name.toLowerCase(), filename);
                    res.status(201).json({'error':false, 'message':'Upload succesfull.'})
                } catch (error) {
                    console.error(error);
                    res.status(400).json({'error':true, 'message': 'The file does not meet the requirements: ' + error});
                }
            });

            // Parse the incoming request.
            form.parse(req);
        }
    });
}

/**
 * Check the given JAR file for some consistency checks:
 * If it contains a teamfile
 * If it contains exactly 4 robots
 * If it uses the correct pagename
 * @param packagename The packagename that should be used
 * @param path
 * @return true when everything ok, else throws an error
 */
var checkTeamfile = function(packagename, path) {
    var teamfiles = [];
    var classDefs = [];

    var zip = new AdmZip(path);
    var zipEntries = zip.getEntries();
    for (var i in zipEntries) {
        var zipEntry = zipEntries[i];
        var filename = zipEntry.entryName;
        if (filename.indexOf('.team') == filename.length - 5) {
            teamfiles.push(filename);
        }
        if (filename.indexOf('.class') == filename.length - 6) {
            classDefs.push(filename.substr(0, filename.length - 6).replace(/\//g, '.').trim());
        }
    }

    //Check if there is exactly 1 teamfile, and if the classfiles are all in the correct package (or subpackages)
    if (teamfiles.length != 1) {
        throw 'There must be exactly 1 teamfile in the JAR file, yours has ' + teamfiles.length;
    }
    if (classDefs.length == 0) {
        throw 'There must be a minimum of one class file inside the JAR. You have 0';
    }
    for (var k in classDefs) {
        var classDef = classDefs[k];
        if (classDef.indexOf(packagename) != 0) {
            throw 'All classes should be in package ' + packagename + '. The class ' + classDef + ' is not!';
        }
    }

    //Check the content of the teamfile
    var teamfile = teamfiles[0];
    var teamname = teamfile.substr(0, teamfile.length - 5);
    teamname = teamname.replace(/\//g, '.');

    //Read file contents
    var contents = zip.readAsText(teamfile);
    var contentsArray = contents.split('\n');
    for (var j in contentsArray) {
        var line = contentsArray[j];

        //Check the teammembers
        if (line.startsWith('team.members=')) {
            var robotcount = 0;
            var robots = line.substr(13).split(',');
            for (var k in robots) {
                var robot = robots[k].trim();
                if (classDefs.indexOf(robot) <= -1) {
                    if (classDefs.indexOf(robot.substr(0, robot.length - 1)) <= -1) {
                        throw 'Classfile for robot ' + robot + ' not found';
                    }
                }
                robotcount++;
            }

            if (robotcount!=4) {
                throw 'There must be 4 robots in the team, found ' + robotcount;
            }
        }

        //Check the robocode version
        if (line.startsWith('robocode.version=')) {
            if (line.indexOf('1.9.2.6') <= -1) {
                throw 'Wrong robocode version, must be 1.9.2.6, found ' + line.substr(17);
            }
        }
    }
};

//--------------------------------------------------------------------------------------------------------------------

var authz = require('./api_authorization');
router.use(authz);

//--------------------------------------------------------------------------------------------------------------------

// List all teams
router.get('/show/all', function (req, res) {

    Team.find({}, {}, function (err, teams) {
        if (err) {
            console.error(err);
            res.status(500).json({error: "true", message: "Cannot find teams"});
        }
        res.status(200).json(teams);
    });

});


// Handle an upload for a team
router.post('/upload/team', function (req, res) {
    uploadTeams(req, res);
});

function uploadTeams(req, res) {

    // Create an form object
    var form = new formidable.IncomingForm();
    form.competition = req.header('X-Competition');

    form.multiples = true;

    // Store all uploads in the /uploads directory
    var filepath = path.join(__dirname + '/../uploads/admin/teams.json');
    form.uploadDir = path.join(__dirname, '../uploads/admin/');

    // When file has been uploaded successfully,
    // rename it to it's orignal name.
    form.on('fileBegin', function (name, file){
        file.path = filepath;
    });

    // Return a 500 in case of an error
    form.on('error', function(err) {
        res.status(500).json({'error':true, 'message': err});
    });

    // Send a response to the client when file upload is finished.
    form.on('end', function() {
        var teams = JSON.parse(fs.readFileSync(filepath, 'utf8'));

        for (var i = 0, len = teams.length; i < len; i++) {
            teams[i].logo = "teamlogo_default.png";
            if (teams[i].secret_key === undefined ) {
                teams[i].secret_key = randomstring.generate({
                    length: 7,
                    charset: 'numeric'
                });
            }
            if (teams[i].competitions === undefined) {
                teams[i].competitions = [];
            }
            teams[i].competitions.push(form.competition);
        }

        Team.collection.insert(teams, function (err, teamDocs) {
            if (err) {
                console.log("Error inserting teams.");
                res.status(500).json({'error':true, 'message': 'The teams already exist.'})
            }
            var message = teamDocs.insertedCount + ' teams were successfully stored.';

            res.status(201).json({'error':false, 'message': message})
        });
    });

    // Parse the incoming request.
    form.parse(req);

}


module.exports = router;