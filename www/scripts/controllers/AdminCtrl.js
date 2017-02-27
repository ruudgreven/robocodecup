
(function () {
    'use strict';


    angular.module('robocodecupApp')
        .controller('AdminCtrl', function ($scope, $http, $log) {

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
                } else {
                    console.log("Not authenticated!");
                }

            },function error(){
                console.log("Error authenticating");
            });
        };

        $scope.logout = function() {

        };

        $scope.sendFile = function() {
            // var secretkey = $scope.secretkey.toUpperCase();
            var secretkey = "robocup-admin";

            var fd = new FormData();
            fd.append('file', $scope.battlefile);

            $http.post('/api/battles/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(){
                console.log("File uploaded!");
            },function(){
                console.log("Error uploading file");
            });
            console.log($scope.battlefile);
        }

    });
})();
