
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
    });