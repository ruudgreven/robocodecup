
(function () {
    'use strict';


    angular.module('robocodecupApp').controller('LoginCtrl', function ($scope, $http, $log) {

        $scope.competition = "useb_2017";

        var vm = this;
        vm.login = $scope.login;

        initController();

        function initController() {
            // reset login status
        }

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
