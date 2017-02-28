
(function () {
    'use strict';


    angular.module('robocodecupApp').controller('AdminCtrl', function ($scope, $http, $log) {

        $scope.competition = "useb_2017";

        $scope.sendFile = function() {
            // var secretkey = $scope.secretkey.toUpperCase();
            var secretkey = "robocup-admin";

            var fd = new FormData();
            fd.append('file', $scope.battlefile);

            $http.post('/api/battles/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(){
                console.log("File uploaded!");
            },function(){
                console.log("Error uploading file");
            });
            console.log($scope.battlefile);
        };

        $scope.uploadTeams = function() {
            // var secretkey = $scope.secretkey.toUpperCase();
            var secretkey = "robocup-admin";

            var fd = new FormData();
            fd.append('file', $scope.teamfile);

            $http.post('/api/team/upload/team', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey, 'X-Competition' : $scope.competition}
            }).then(function(){
                console.log("File uploaded!");
                $scope.message = {show:true, details: "File uploaded succesfully!"};
            },function(){
                console.log("Error uploading file");
                $scope.message = {show:true, details: "Error uploading file!"};
            });
            console.log($scope.teamfile);
        }

    });
})();
