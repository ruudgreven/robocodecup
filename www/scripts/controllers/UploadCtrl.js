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

        /**
         * Helper method for error handling. Removes token and redirects to the login page if the statuscode is 401
         * @param message The error message
         * @param errorResponse The error response object
         */
        var handleError = function(message, errorResponse) {
            if (errorResponse.status == 401) {
                $log.info('Retrieved 401 from server. Most common cause is that your token is expired. Redirect to login page');
                LoginSrv.clearCredentials();
                $location.path('/login');
            } else {
                if (errorResponse.data.error == true) {
                    $log.error('AdminCtrl: ' + message + ': ' + errorResponse.statusText + ': ' + errorResponse.data.message);
                } else {
                    $log.error('AdminCtrl: ' + message + ': ' + errorResponse.statusText + ': ' + errorResponse.data);
                }

            }
        };

        $scope.sendFile = function() {
            var secretkey = $scope.secretkey.toUpperCase();

            var fd = new FormData();
            fd.append('file', $scope.teamfile);

            $log.info('UploadCtrl: Upload file to server to /api/team/upload');
            $http.post('../api/team/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'X-Authentication' : secretkey}
            }).then(function(response){
                $log.info('UploadCtrl: File uploaded succesfully');
                $scope.message = {show:true, details: "File uploaded succesfully!"};
            },function(response){
                handleError('Error by uploading file', response);
                $scope.message = {show:true, details: "Error by uploading file!"};
            });

        }
    });