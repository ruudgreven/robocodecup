
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:CompetitionsCtrl
 * @description
 * # CompetitionsCtrl
 * Controller of the competitions.
 */
angular.module('robocodecupApp')
    .controller('CompetitionsCtrl', function ($scope, $http, $log, CompetitionSrv) {
        $scope.competitions = [];
        $scope.featuredcompetition = undefined;

        var init = function() {
            //Retrieving a list of competitions
            $http({
                method: 'GET',
                url: '/api/competition'
            }).then(function success(response) {
                $scope.competitions = response.data;
                angular.forEach($scope.competitions, function(competition, key) {
                    //When the competition is featured, set it as the default competition for the site
                    if (competition.featured == true) {
                        $scope.featuredcompetition = competition;
                        CompetitionSrv.setCurrentCompetition($scope.featuredcompetition);
                    }
                });
            }, function error(response) {
                $log.error('There was an error: ' + response);
            });
        };

        $scope.$on('$routeChangeSuccess', function() {
            init();
        });
    });