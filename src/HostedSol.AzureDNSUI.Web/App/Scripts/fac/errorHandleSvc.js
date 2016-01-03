'use strict';
angular.module('AzureDNSUI')
.factory('errorHandleSvc', ['$http', function ($http) {
    return {
        getErrorMessage: function (err) {
            console.log(err);
            // depending on the method in azure called sometimes the 
            // errors that are returned are slightly different
            // this method was designed to try to parse which one 
            // and return text that the user can read
            if (err.error != null) return err.error.code + ': ' + err.error.message;
            if (err.message != null) return err.code + ': ' + err.message;
            if (err != null) return err;
            return 'Unknown Error';
        }

    }
    }])