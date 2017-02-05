
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:RankingCtrl
 * @description
 * # RankingCtrl
 * Controller of the rankings
 */
angular.module('robocodecupApp')
    .controller('RankingsCtrl', function ($scope, $http, $log, config) {
        $scope.blaat = 'blaat';

        $scope.rankings = [
            {
                rank: 1,
                icon: "teamlogo_default.png",
                name: "Ruud's team",
                played: 32,
                won: 32,
                lost: 0,
                disq: 0,
                points: 96
            },
            {
                rank: 2,
                icon: "teamlogo_default.png",
                name: "Timothy's team",
                played: 1,
                won: 16,
                lost: 16,
                disq: 0,
                points: 64
            },
            {
                rank: 3,
                icon: "teamlogo_default.png",
                name: "Another team",
                played: 1,
                won: 0,
                lost: 0,
                disq: 32,
                points: 0
            },

        ];

    });