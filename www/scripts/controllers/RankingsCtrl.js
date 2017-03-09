'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:RankingCtrl
 * @description
 * # RankingCtrl
 * Controller of the rankings
 */
angular.module('robocodecupApp')
    .controller('RankingsCtrl', function ($scope, $http, $log, CompetitionSvc) {
        $scope.rankings = [];
        $scope.competition = CompetitionSvc.getCurrentCompetition();
        $scope.round = CompetitionSvc.getCurrentRound();

        /**
         * When the something changed in the current competition, update the ranking
         */
        $scope.$on( 'competition.update', function( event ) {
            $scope.competition = CompetitionSvc.getCurrentCompetition();
            $scope.round = CompetitionSvc.getCurrentRound();
            updateRanking();
        });

        $scope.$watch('round', function() {
            updateRanking();
        });

        /**
         * Retrieves the ranking for the current competition and round
         */
        var updateRanking = function() {
            var round = CompetitionSvc.getCurrentRound();
            if (round == undefined) {
                $log.info("RankingsCtrl: No current round, cannot show ranking");
                $scope.rankings = [];
                return;
            }
            var url = '/api/competition/' + $scope.competition.code  + '/round/' + $scope.round + '/ranking';

            $log.info('RankingsCtrl: Retreiving ranking from ' + url );
            $http({
                method: 'GET',
                url: url
            }).then(function success(response) {
                if (response.data == undefined) {
                    $log.error('The API responded with NULL data, something went wrong: ' + response.statusText + ': ' + response.data);
                    return;
                }
                $scope.rankings = response.data.entries;
                $log.info('RankingsCtrl: Received rankings succesfully');
            }, function error(response) {
                $log.error('RankingsCtrl: There was an error: ' + response.statusText + ': ' + response.data);
            });
        };

        //TODO: Remove this call, should be triggered by a scope update or someting
        updateRanking();
    });