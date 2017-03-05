'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller for all the admin pages.
 */
angular.module('robocodecupApp').controller('AdminCtrl', function ($scope, $http, $log, $location, LoginSrv, CompetitionSvc) {
    // TODO: Retrieve teams at the proper time (now its on init).
    // TODO: Think of a better url  for listing teams including secrets (its now "/api/competitions/<code>/team/all")

    $scope.competition = CompetitionSvc.getCurrentCompetition();
    $scope.round = CompetitionSvc.getCurrentRound();
    $scope.teams = [];

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
        retrieveTeams();
    });

    /**
     * Helper method for error handling. Removes token and redirects to the login page if the statuscode is 401
     * @param message The error message
     * @param errorResponse The error response object
     */
    var handleError = function(message, errorResponse) {
        if (errorResponse.status == 401) {
            $log.info('Retrieved 401 from server. Most common cause is that your token is expired. Redirect to login page');
            LoginSrv.clearCredentials();
            $location.path('/login');
        } else {
            $log.error('AdminCtrl: ' + message + ': ' + errorResponse.statusText + ': ' + errorResponse.data);
        }
    };

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

        // $log.info('AdminCtrl: Retrieving a list of teams from the server');
        $http({
            method: 'GET',
            url: '/api/competition/' + $scope.competition.code + '/team/all',
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
        }).then(function success(response) {
            $scope.teams = response.data.teams;
        }, function error(response) {
            handleError('Error retrieving teams', response);
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

        // $log.info('AdminCtrl: Upload file to server to /api/battle/upload');
        $http.post('/api/battle/upload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey, 'X-Competition' : $scope.competition.code, 'X-CompetitionRound' : $scope.round}

        }).then(function(){
            // $log.info('AdminCtrl: File uploaded succesfully');
            $scope.message = {show:true, details: "File uploaded succesfully!"};
        },function(){
            $scope.message = {show:true, details: "Error uploading file!"};
            handleError('Error uploading file', response);
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

        // $log.info('AdminCtrl: Upload file to server to /api/team/upload/team');
        $http.post('/api/team/upload/team', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'X-Authentication' : secretkey, 'X-Competition' : $scope.competition.code}
        }).then(function(){
            // $log.info('AdminCtrl: File uploaded succesfully');
            $scope.message = {show:true, details: "File uploaded succesfully!"};
        },function(){
            handleError('Error uploading file', response);
            $scope.message = {show:true, details: "Error uploading file!"};
        });
    }
});
