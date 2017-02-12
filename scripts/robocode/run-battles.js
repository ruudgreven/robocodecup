var Docker = require('dockerode');
var docker = new Docker({socketPath:'/var/run/docker.sock', version: 'v1.13'});
var Q = require('q');

/**
 * Search for a container with the name robocoderunner.
 * @return a promise that resolved on the id if it is available, or undefined if it's not available
 */
var checkForRunningContainer = function() {
    var deferred = Q.defer();

    docker.listContainers(function (err, containers) {
        containers.forEach(function (containerInfo) {
            if (containerInfo.Image === 'robocoderunner') {
               deferred.resolve (containerInfo.Id);
            }
        });
        deferred.resolve(undefined);
    });
    return deferred.promise;
}

/**
 * Runs a battle from battlefile FILENAME.battle, and sends output to FILENAME.txt (results) and FILENAME.br (replay).
 * This functions assumes that the robots are available in ./robots and there is a ./output folder to write the output to
 * @param container
 */
function runBattle(container, filename) {
    var deferred = Q.defer();

    //java -Xmx512M -Dsun.io.useCanonCaches=false -DROBOTPATH=robots/ -cp libs/robocode.jar:. robocode.Robocode -battle battles/intro.battle -nodisplay -results results.txt -record results.replay
    var options = {
        Cmd: ['java', '-Xmx512M', '-Dsun.io.useCanonCaches=false', '-DROBOTPATH=robots/', '-cp', 'libs/robocode.jar:.', 'robocode.Robocode', '-battle', 'battles/' + filename +'.battle', '-nodisplay', '-results', 'output/' + filename + '.txt', '-record', 'output/' + filename + '.br'],
        AttachStdout: true,
        AttachStderr: true
    };

    container.exec(options, function(err, exec) {
        if (err) return;
        exec.start(function(err, stream) {
            if (err) return;
            //Display the output on the console
            container.modem.demuxStream(stream, process.stdout, process.stderr);
        });
    });

    return deferred.promise;
}

/**
 * The main script
 */
checkForRunningContainer().then(function(containerId) {
    if (containerId === undefined) {
        console.error('You should create and run a docker container first. Please run the following commands: ');
        console.error('- docker build -t robocoderunner .');
        console.error('- docker run -dit -v <YOUR-ROBOTS-PATH>:/robocode/robots -v <YOUR-OUTPUT-PATH>:/robocode/output --name robocode-runner robocoderunner')
        process,exit(1);
    }

    var container = docker.getContainer(containerId);
    runBattle(container, 'intro').then(function(output) {
        console.log(output);
        console.log(container);
    });
});


//docker.run('ubuntu', ['bash', '-c', 'uname -a'], process.stdout, function (err, data, container) {
//    console.log(data.StatusCode);
//});
