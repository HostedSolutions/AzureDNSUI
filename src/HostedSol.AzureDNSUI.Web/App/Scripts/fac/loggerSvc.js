'use strict';
angular.module('AzureDNSUI')
.factory('loggerSvc', ['$http', function ($http) {
    return {
        Error: function (data) {
            return $http.post('/api/Log/Error', data);
        },
        Warn: function (data) {
            return $http.post('/api/Log/Warn', data);
        },
        Info: function (data) {
            return $http.post('/api/Log/Info', data);
        },
        Debug: function (data) {
            return $http.post('/api/Log/Debug', data);
        }
    };
}]);