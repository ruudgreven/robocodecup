
'use strict';

/**
 * @ngdoc function
 * @name robocodecupApp.service:LoginSrv
 * @description
 * # loginSrv
 * Used to store and get login key/credentials
 */

angular.module('robocodecupApp').service('LoginSrv', function($log, localStorageService) {
    //TODO: FIND A BETTER WAY TO DO INITIALIZATION
    var login = localStorageService.get('login');
    this.loginkey = login.key;
    this.loginusername = login.username;

    this.setCredentials = function(loginkey, loginusername) {
        this.loginkey = loginkey;
        this.loginusername = loginusername;

        $log.info('Storing username ' + loginusername + ' and key ' + loginkey);
        localStorageService.set('login', {
            key: loginkey,
            username: loginusername
        });
    };

    this.clearCredentials = function() {
        localStorageService.remove('login');
        this.loginkey = undefined;
        this.loginusername = undefined;
        $log.info('Cleared credentials');
    };

    this.isLoggedIn = function() {
        $log.info('Checked login:' + (this.loginkey != undefined));
        return this.loginkey != undefined;
    };

    this.getLoginKey = function() {
        return this.loginkey;
    };

    this.getLoginUsername = function() {
        return this.loginusername;
    };

});