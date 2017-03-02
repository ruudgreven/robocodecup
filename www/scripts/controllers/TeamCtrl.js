'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller for one team
 */
angular.module('robocodecupApp')
    .controller('TeamCtrl', function ($scope, $routeParams, $http, $log) {

        /**
         * Constructor
         * Retrieves the team information and the battles for this team from the server
         */
        var init = function() {
            $log.info('TeamCtrl: Retrieving team details for team with id' + $routeParams.teamid);
            // Retrieve team details
            $http({
                method: 'GET',
                url: '/api/team/' + $routeParams.teamid
            }).then(function success(response) {
                $log.info('TeamCtrl: Succesfully retrieved team details');
                $scope.team = response.data;
            }, function error(response) {
                $log.error('TeamCtrl: There was an error: ' + response);
            });

            $log.info('TeamCtrl: Retrieving the battles for team with id' + $routeParams.teamid);
            // Retrieve the battles
            $http({
                method: 'GET',
                url: '/api/battle?team_name=' + $routeParams.teamid
            }).then(function success(response) {
                $log.info('TeamCtrl: Succesfully retrieved the battles');
                $scope.battles = response.data;
            }, function error(response) {
                $log.error('TeamCtrl: There was an error: ' + response);
            });
        };

        $scope.$on('$routeChangeSuccess', function() {
            init();
        });

        $scope.showDetails = function(battle) {
            console.log(battle);
        }
    });