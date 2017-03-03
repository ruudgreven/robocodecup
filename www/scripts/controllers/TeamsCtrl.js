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
        $scope.competition = CompetitionSvc.getCurrentCompetition();

        /**
         * When the something changed in the current competition, update the ranking
         */
        $scope.$on( 'competition.update', function( event ) {
            //TODO: There seem to be some nasty scoping bug that prevents this from working. When we update the scope here it does not work.
            updateTeams();
        });

        /**
         * Retrieves the ranking for the current competition and round
         */
        var updateTeams = function() {
            var url = '/api/competition/' + CompetitionSvc.getCurrentCompetition().code + '/team';

            $log.info('TeamsCtrl: Retrieving teams from ' + url);
            $http({
                method: 'GET',
                url: url
            }).then(function success(response) {
                $log.info('TeamsCtrl: Teams retrieved');
                $scope.teams = response.data.teams;
            }, function error(response) {
                $log.error('TeamsCtrl: There was an error: ' + response.statusText + ': ' + response.data);
            });

        };

        //TODO: Remove this call, should be triggered by a scope update or someting
        updateTeams();

    });