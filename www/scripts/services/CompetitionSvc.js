
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:CompetitionSvc
 * @description
 * # competitionSvc
 * Contains information about the current competition
 */

angular.module('robocodecupApp').factory('CompetitionSvc', function($rootScope, $http, $log, $location, localStorageService) {
    var competitions;
    var currentcompetition;
    var currentround;

    var competitionSvc = {
        /**
         * Constructor
         * Retrieves the list of competitions from the server and picks the first (or last selected competition as current)
         */
        init: function() {
            //Retrieving a list of competitions
            $log.info('CompetitionsSrv: Retrieving a list of competitions from the server');
            $http({
                method: 'GET',
                url: '/api/competition'
            }).then(function success(response) {
                competitions = response.data.competitions;
                if (competitions.length == 0) {
                    $log.info('No competitions available. Redirecting to admin');
                    $location.path('/admin/admin_competitions');
                }
                if (localStorageService.get('currentcompetition') != undefined) {
                    competitionSvc.setCurrentCompetition(localStorageService.get('currentcompetition').code);
                    $rootScope.$broadcast('competition.update');
                } else {
                    competitionSvc.setCurrentCompetition(competitions[0].code)
                }

                $log.info('CompetitionsSrv: Loaded ' + competitions.length + ' competitions, current is ' + currentcompetition.code);
            }, function error(response) {
                $log.error('There was an error: ' + response);
            });
        },

        /**
         * Returns all the competitions
         * @returns {Array} An array with competition objects
         */
        getCompetitions: function() {
            return competitions;
        },

        /**
         * Returns the current competition object
         * @returns
         */
        getCurrentCompetition: function() {
            return currentcompetition;
        },

        getCurrentRound: function() {
            return currentround;
        },

        /**
         * Set the current competition and the current round
         * @param code The code of the competition
         */
        setCurrentCompetition: function(code) {
            for (var i = 0; i < competitions.length; i++) {
                var competition = competitions[i];
                if (competition.code == code) {
                    currentcompetition = competitions[i];
                    localStorageService.set('currentcompetition', currentcompetition);

                    if (competitions[i].rounds[0] != undefined) {
                        currentround = competitions[i].rounds[0];
                        $log.info('CompetitionsSrv: Set current competition to ' + competition.code + ' with round ' + currentround);
                    } else {
                        currentround = undefined;
                        $log.info('CompetitionsSrv: Set current competition to ' + competition.code);
                    }

                    $rootScope.$broadcast('competition.update');
                    break;
                }
            }
        }

    };
    competitionSvc.init();

    return competitionSvc;
});