# Robocode script in Docker

## Installation and creating docker container
- Run the following commands to create and start the docker container with robocode
```docker build -t robocoderunner .```
```docker run -dit -v <YOUR-ROBOTS-PATH>:/robocode/robots -v <YOUR-OUTPUT-PATH>:/robocode/output --name robocode-runner robocoderunner```
