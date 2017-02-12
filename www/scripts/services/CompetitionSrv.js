
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
        this.currentround = 1;

        $log.info('Current competition set to ' + this.currentcompetition.code + ' and round ' + this.currentround);
        $rootScope.$broadcast('competition.update');
    };
});