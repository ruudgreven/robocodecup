'use strict';

angular.module('robocodecupApp').controller('LoginCtrl', function ($scope, $http, $log, $location, LoginSrv) {
    //TODO: FIND A BETTER WAY TO DO INITIALIZATION
    $scope.competition = "useb_2017";

    var init = function () {
        if (LoginSrv.isLoggedIn()) {
            $location.path('/admin');
        }
    };

    $scope.$on('$routeChangeSuccess', function() {
        init();
    });

    /**
     * Send a login request to server with the $scope.username and $scope.password
     */
    $scope.login = function () {
        $log.info('LoginCtrl: Send a login request to /api/authenticate');
        $http({
            method: 'POST',
            url: '/api/authenticate',
            data: {username: $scope.username, password: $scope.password},
            headers: {'Content-Type': 'application/json'}
        }).then(function success(response) {
            if (response.data.success) {
                $log.info('LoginCtrl: Authenticated. Saving credentials and redirecting to /admin');
                $scope.error = undefined;

                LoginSrv.setCredentials(response.data.token, $scope.username);
                $location.path('/admin');
            } else {
                $log.error('LoginCtrl: Not authenticated. Invalid credentials?');
                $scope.error = {details: "Invalid credentials."};
            }

        }, function error() {
            $log.error('LoginCtrl: Error in authentication request');
        });
    };
});
