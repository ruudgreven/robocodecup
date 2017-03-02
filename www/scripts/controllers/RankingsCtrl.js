'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:RankingCtrl
 * @description
 * # RankingCtrl
 * Controller of the rankings
 */
angular.module('robocodecupApp')
    .controller('RankingsCtrl', function ($scope, $http, $log, CompetitionSrv) {
        $scope.rankings = [];
        $scope.currentcompetition = undefined;
        $scope.currentround = undefined;

        /**
         * When the something changed in the current competition, update the ranking
         */
        $scope.$on( 'competition.update', function( event ) {
            $log.info("RankingsCtrl: competition updated, updating rankings");

            $scope.currentcompetition = CompetitionSrv.currentcompetition;
            $scope.currentround = CompetitionSrv.currentround;
            updateRanking();
        });

        /**
         * Retrieves the ranking for the current competition and round
         */
        var updateRanking = function() {
            $log.info('RankingsCtrl: Updating the ranking for competition ' + $scope.currentcompetition.code + ' and round ' + $scope.currentround);
            $http({
                method: 'GET',
                url: '/api/ranking?competition=' + $scope.currentcompetition.code + '&round=' + $scope.currentround
            }).then(function success(response) {
                $log.info('RankingsCtrl: Received rankings succesfully');
                $scope.rankings = response.data[0].teams;
            }, function error(response) {
                $log.error('RankingsCtrl: There was an error: ' + response.statusText + ': ' + response.data);
            });
        }

    });