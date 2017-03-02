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
        $scope.teamfile = undefined;

        $scope.sendFile = function() {
            var secretkey = $scope.secretkey.toUpperCase();

            var fd = new FormData();
            fd.append('file', $scope.teamfile);

            $log.info('UploadCtrl: Upload file to server to /api/team/upload');
            $http.post('../api/team/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(){
                $log.info('UploadCtrl: File uploaded succesfully');
                $scope.message = {show:true, details: "File uploaded succesfully!"};
            },function(){
                $log.error('UploadCtrl: Error uploading file');
                $scope.message = {show:true, details: "Error uploading file!"};
            });

        }
    });