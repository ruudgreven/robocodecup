
(function () {
    'use strict';


    angular.module('robocodecupApp').controller('AdminCtrl', function ($scope, $http, $location, LoginSrv) {
        //TODO: FIND A BETTER WAY TO DO INITIALIZATION
        $scope.competition = "useb_2017";

        /**
         * Initializes this controller
         */
        var init = function() {
            if (!LoginSrv.isLoggedIn()) {
                $location.path('/login');
            }
        };
        init();

        $scope.logout = function() {
            LoginSrv.clearCredentials();
            $location.path('/');
        };

        var retrieveTeams = function() {
            var secretkey = LoginSrv.getLoginKey();

            $http({
                method: 'GET',
                url: '/api/team/show/all',
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function success(response) {
                $scope.teams = response.data;
            }, function error(response) {
                console.log('There was an error: ' + response.statusText + ': ' + response.data);
            });
        };
        retrieveTeams();

        $scope.sendFile = function() {
            var secretkey = LoginSrv.getLoginKey();

            var fd = new FormData();
            fd.append('file', $scope.battlefile);

            $http.post('/api/battles/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(){
                console.log("File uploaded!");
                $scope.message = {show:true, details: "File uploaded succesfully!"};
            },function(){
                console.log("Error uploading file");
                $scope.message = {show:true, details: "Error uploading file!"};
            });
            console.log($scope.battlefile);
        };

        $scope.uploadTeams = function() {
            var secretkey = LoginSrv.getLoginKey();

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
