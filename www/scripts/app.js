'use strict';

/**
 * @ngdoc overview
 * @name robocodecupApp
 * @description
 * # robocodecupApp
 *
 * Main module of the application.
 */
angular
    .module('robocodecupApp', [
        'ngRoute'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/rankings.html',
                controller: 'RankingsCtrl'
            })
            .when('/team', {
                templateUrl: 'views/teams.html',
                controller: 'TeamsCtrl'
            })
            .when('/team/:teamid', {
                templateUrl: 'views/team.html',
                controller: 'TeamCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).constant('config', {
        api: 'api'
    });