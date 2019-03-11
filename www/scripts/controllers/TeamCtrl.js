'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller for one team
 */
angular.module('robocodecupApp')
    .controller('TeamCtrl', function ($scope, $routeParams, $http, $log, CompetitionSvc) {

        $scope.competition = CompetitionSvc.getCurrentCompetition();
        $scope.round = CompetitionSvc.getCurrentRound();

        $scope.$watch('round', function() {
            // Store new round in localstorage
            CompetitionSvc.setCurrentRound($scope.round);

            // Update list of battles for teams.
            updateTeamBattlesPerRound();
        });

        /**
         * Retrieves the team data from the server
         */
        var updateTeamData = function() {
            var url = '/api/team/' + $routeParams.teamid;
            $log.info('TeamCtrl: Retrieving team details from ' + url);
            // Retrieve team details
            $http({
                method: 'GET',
                url: url
            }).then(function success(response) {
                $log.info('TeamCtrl: Succesfully retrieved team details');
                $scope.team = response.data;
            }, function error(response) {
                $log.error('TeamCtrl: There was an error: ' + response);
            });
        };

        var updateTeamBattlesPerRound = function() {
            var url = '/api/competition/' + $scope.competition.code + '/round/' +  $scope.round + '/battle?team=' + $routeParams.teamid;
            $log.info('TeamCtrl: Retrieving the battles from ' + url);
            // Retrieve the battles
            $http({
                method: 'GET',
                url: url
            }).then(function success(response) {
                $log.info('TeamCtrl: Succesfully retrieved ' + response.data.battles.length + ' battles.');
                $scope.battles = response.data.battles;
            }, function error(response) {
                $log.error('TeamCtrl: There was an error: ' + response);
            });
        }

        /**
         * Constructor
         * Retrieves the team information and the battles for this team from the server
         */
        var init = function() {
            updateTeamData();
            updateTeamBattlesPerRound();
        };

        $scope.$on('$routeChangeSuccess', function() {
            init();
        });

        $scope.showDetails = function(battle) {
            console.log(battle);
        }
    });