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
        'ngRoute',
        'LocalStorageModule'
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
            .when('/upload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html'
            })
            .when('/login', {
                templateUrl: 'views/admin/login.html',
                controller: "LoginCtrl"
            })
            .when('/admin', {
                templateUrl: 'views/admin/index.html',
                controller: "AdminCtrl"
            })
            .when('/admin/admin_competitions', {
                templateUrl: 'views/admin/admin_competitions.html',
                controller: "AdminCtrl"
            })
            .when('/admin/upload_battles', {
                templateUrl: 'views/admin/upload_battles.html',
                controller: "AdminCtrl"
            })
            .when('/admin/teams', {
                templateUrl: 'views/admin/teams.html',
                controller: "AdminCtrl"
            })
            .when('/admin/upload_teams', {
                templateUrl: 'views/admin/upload_teams.html',
                controller: "AdminCtrl"
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('robocodecup');
    }).constant('config', {

    }).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
    }]);