angular.module('app.auth').service('AuthenticationService', function($http, SessionService, RegionService) {
    var service = {
        loggedInCallback: function(callback) {
            return function(response, status, headers) {
                SessionService.populateSessionInfo(function() {
                  callback();
                  RegionService.populateLoggedInDataForCurrentRegion();
                });
            }
        },
        notLoggedInCallback: function(callback) {
            return function(response, status, headers) {
                SessionService.clearSessionInfo();
                if (!!callback) {
                    callback();
                }
                RegionService.populateLoggedInDataForCurrentRegion();
            }
        },
        login: function(params, successCallback, failureCallback) {
            url = hostname + 'users/session'
            SessionService.authenticatedPut(url,
                params,
                this.loggedInCallback(successCallback),
                this.notLoggedInCallback(failureCallback));
        },
        logout: function() {
            url = hostname + 'users/session'
            SessionService.authenticatedDelete(url, this.notLoggedInCallback());
        }
    };

    return service;
});
