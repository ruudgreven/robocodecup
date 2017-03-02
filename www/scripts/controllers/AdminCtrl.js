'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller for all the admin pages.
 */
angular.module('robocodecupApp').controller('AdminCtrl', function ($scope, $http, $location, LoginSrv) {
    $scope.competition = "useb_2017";

    /**
     * Initializes this controller
     */
    var init = function() {
        if (!LoginSrv.isLoggedIn()) {
            $location.path('/login');
        }
    };

    $scope.$on('$routeChangeSuccess', function() {
        init();
    });

    /**
     * Logs the current user out and redirects to / (home)
     */
    $scope.logout = function() {
        LoginSrv.clearCredentials();
        $location.path('/');
    };

    /**
     * Retrieves a list of teams from the server and set them to $scope.teams
     */
    var retrieveTeams = function() {
        var secretkey = LoginSrv.getLoginKey();

        $log.info('AdminCtrl: Retrieving a list of teams from the server');
        $http({
            method: 'GET',
            url: '/api/team/show/all',
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
        }).then(function success(response) {
            $scope.teams = response.data;
        }, function error(response) {
            $log.error('AdminCtrl: There was an error: ' + response.statusText + ': ' + response.data);
        });
    };

    /**
     * Send a results file to the server.
     */
    $scope.sendFile = function() {
        var secretkey = LoginSrv.getLoginKey();

        var fd = new FormData();
        fd.append('file', $scope.battlefile);
        //TODO: Add competition to formdata instead of header

        $log.info('AdminCtrl: Upload file to server to /api/battle/upload');
        $http.post('/api/battle/upload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey, 'X-Competition' : $scope.competition}

        }).then(function(){
            $log.info('AdminCtrl: File uploaded succesfully');
            $scope.message = {show:true, details: "File uploaded succesfully!"};
        },function(){
            $log.error('AdminCtrl: Error uploading file');
            $scope.message = {show:true, details: "Error uploading file!"};
        });
    };

    /**
     * Send a teams file to the server.
     */
    $scope.uploadTeams = function() {
        var secretkey = LoginSrv.getLoginKey();

        var fd = new FormData();
        fd.append('file', $scope.teamfile);
        //TODO: Add competition to formdata instead of header

        $log.info('AdminCtrl: Upload file to server to /api/team/upload/team');
        $http.post('/api/team/upload/team', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey, 'X-Competition' : $scope.competition}
        }).then(function(){
            $log.info('AdminCtrl: File uploaded succesfully');
            $scope.message = {show:true, details: "File uploaded succesfully!"};
        },function(){
            $log.error('AdminCtrl: Error uploading file');
            $scope.message = {show:true, details: "Error uploading file!"};
        });
    }
});
