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
            .when('/upload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html'
            })
            .otherwise({
                redirectTo: '/'
            });
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