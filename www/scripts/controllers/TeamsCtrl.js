
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:TeamsCtrl
 * @description
 * # TeamsCtrl
 * List all teams
 */
angular.module('robocodecupApp')
    .controller('TeamsCtrl', function ($scope, $http, $log, CompetitionSrv) {
        $scope.teams = [];

        /**
         * When the something changed in the current competition, update the ranking
         */
        $scope.$on( 'competition.update', function( event ) {
            $log.info("Competition updated, updating rankings");

            $scope.currentcompetition = CompetitionSrv.currentcompetition;
            $scope.currentround = CompetitionSrv.currentround;
            updateRanking();
        });

        /**
         * Retrieves the ranking for the current competition and round
         */
        var updateRanking = function() {
            $log.info('Listing the teams for competition ' + $scope.currentcompetition.code);
            $http({
                method: 'GET',
                url: '/api/competition/' + $scope.currentcompetition.code + '/team'
            }).then(function success(response) {
                $scope.teams = response.data;
            }, function error(response) {
                $log.error('There was an error: ' + response.statusText + ': ' + response.data);
            });
        }


    });