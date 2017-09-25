angular.module('app.auth').service('AuthenticationService', function($http, SessionService, RegionService) {
    var service = {
        loginSuccess: function(callback) {
            return function(response, status, headers) {
                SessionService.populateSessionInfo(function() {
                  callback();
                  RegionService.populateLoggedInDataForCurrentRegion();
                });
            }
        },
        loginFailure: function(callback) {
            return function(response, status, headers) {
                SessionService.clearSessionInfo();
                if (!!callback) {
                    callback();
                }
            }
        },
        login: function(params, successCallback, failureCallback) {
            url = hostname + 'users/session'
            SessionService.authenticatedPut(url,
                params,
                this.loginSuccess(successCallback),
                this.loginFailure(failureCallback));
        },
        logout: function() {
            url = hostname + 'users/session'
            SessionService.authenticatedDelete(url, this.loginFailure());
        }
    };

    return service;
});
