
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the teams
 */
angular.module('robocodecupApp')
    .controller('TeamCtrl', function ($scope, $routeParams, $http, $log) {
        $scope.teamid = $routeParams.teamid;

        var init = function() {
            // Retrieve team details
            $http({
                method: 'GET',
                url: '/api/team/'+$scope.teamid
            }).then(function success(response) {
                $scope.team = response.data;
            }, function error(response) {
                $log.error('There was an error: ' + response);
            });

            // Retrieve the battles
            $http({
                method: 'GET',
                url: '/api/battle?team_name='+$scope.teamid
            }).then(function success(response) {
                $scope.battles = response.data;
            }, function error(response) {
                $log.error('There was an error: ' + response);
            });
        };

        $scope.$on('$routeChangeSuccess', function() {
            init();
        });

        $scope.showDetails = function(battle) {
            console.log(battle);
        }
    });