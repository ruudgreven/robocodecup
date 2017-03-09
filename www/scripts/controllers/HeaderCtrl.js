'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:CompetitionsCtrl
 * @description
 * # CompetitionsCtrl
 * Controller of the competitions.
 */
angular.module('robocodecupApp').controller('HeaderCtrl', function ($scope, $http, $log, CompetitionSvc) {
    $scope.competitions = [];
    $scope.currentcompetition = undefined;

    $scope.$on( 'competition.update', function( event ) {
        $scope.competitions = CompetitionSvc.getCompetitions();
        $scope.currentcompetition = CompetitionSvc.getCurrentCompetition();
    });
    /**
     * Constructor
     * Retrieves the list of competitions from the server and add the featured competition as the default competition
     */
    var init = function () {
        $log.info('HeaderCtrl: Initialize');
        $scope.competitions = CompetitionSvc.getCompetitions();
        $scope.currentcompetition = CompetitionSvc.getCurrentCompetition();
    };

    $scope.$on('$routeChangeSuccess', function () {
        init();
    });

    $scope.setCurrentCompetition = function(code) {
        CompetitionSvc.setCurrentCompetition(code);
        $scope.currentcompetition = CompetitionSvc.getCurrentCompetition();
    }
});