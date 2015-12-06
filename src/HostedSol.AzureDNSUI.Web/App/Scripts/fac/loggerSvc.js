//'use strict';
//angular.module('AzureDNSUI')
//    .factory('$exceptionHandler', function($injector) {
//        return function(exception, cause) {
//            var $http = $injector.get("$http");
//            var $log = $injector.get("$log");
//            exception.message += ' (caused by "' + cause + '")';
//            $log.log(exception);
//            $http.post('/api/Log/Error', JSON.stringify(exception));
//            throw exception;
//        };
//    });