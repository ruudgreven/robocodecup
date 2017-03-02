
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:RankingCtrl
 * @description
 * # competitionSrv
 * Contains information about the current competition
 */

angular.module('robocodecupApp').service('CompetitionSrv', function($rootScope, $log) {
    this.currentcompetition = undefined;
    this.currentround = undefined;

    this.setCurrentCompetition = function(nwCurrentCompetition) {
        this.currentcompetition = nwCurrentCompetition;
        this.currentround = nwCurrentCompetition.current_round;

        $log.info('CompetitionSrv: Current competition set to ' + this.currentcompetition.code + ' and round ' + this.currentround);
        $rootScope.$broadcast('competition.update');
    };

    this.updateRound = function(current_round) {
        this.currentround = current_round;
        $rootScope.$broadcast('competition.update');
    };

});