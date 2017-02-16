
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Upload a file for your team
 */
angular.module('robocodecupApp')
    .controller('UploadCtrl', function ($scope, $routeParams, $http, $log, config) {
        $scope.secretkey = '';
        $scope.teamfile = undefined

        $scope.sendFile = function() {
            var secretkey = $scope.secretkey.toUpperCase();

            var fd = new FormData();
            fd.append('file', $scope.teamfile);

            $http.post('../api/team/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(){
                console.log("File uploaded!");
            },function(){
                console.log("Error uploading file");
            });

            console.log(secretkey);
            console.log($scope.teamfile);
        }
    });