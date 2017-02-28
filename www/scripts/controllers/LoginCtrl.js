
(function () {
    'use strict';


    angular.module('robocodecupApp').controller('LoginCtrl', function ($scope, $http, $log, $location, LoginSrv) {
        //TODO: FIND A BETTER WAY TO DO INITIALIZATION
        $scope.competition = "useb_2017";

        var init =  function() {
            if (LoginSrv.isLoggedIn()) {
                $location.path('/admin');
            }
        };
        init();

        $scope.login = function() {
            var username = $scope.username;
            var password = $scope.password;

            $http({
                method: 'POST',
                url: '/api/authenticate',
                data: {username: username, password: password},
                headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                if (response.data.success) {
                    console.log("Authenticated!");
                    $scope.error = undefined;

                    LoginSrv.setCredentials(response.data.token, $scope.username);
                    $location.path('/admin');
                } else {
                    console.log("Not authenticated!");
                    $scope.error = {details: "Invalid credentials."};
                }

            },function error(){
                console.log("Error authenticating");
            });
        };

        $scope.logout = function() {
            // TODO
        };
    });
})();
