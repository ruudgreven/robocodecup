'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:TeamsCtrl
 * @description
 * # TeamsCtrl
 * List all teams
 */
angular.module('robocodecupApp')
    .controller('TeamsCtrl', function ($scope, $http, $log, CompetitionSvc) {
        $scope.teams = [];

        /**
         * When the something changed in the current competition, update the ranking
         */
        $scope.$on( 'competition.update', function( event ) {
            $log.info("TeamsCtrl: Competition updated, updating rankings");

            //$scope.currentcompetition = CompetitionSrv.currentcompetition;
            //$scope.currentround = CompetitionSrv.currentround;
            //updateRanking();
        });

        /**
         * Retrieves the ranking for the current competition and round
         */
        var updateRanking = function() {
            $log.info('TeamsCtrl: Retrieving the teams for competition ' + $scope.currentcompetition.code);
            $http({
                method: 'GET',
                url: '/api/competition/' + $scope.currentcompetition.code + '/team'
            }).then(function success(response) {
                $log.info('TeamsCtrl: Teams retrieved');
                $scope.teams = response.data;
            }, function error(response) {
                $log.error('TeamsCtrl: There was an error: ' + response.statusText + ': ' + response.data);
            });
        }


    });