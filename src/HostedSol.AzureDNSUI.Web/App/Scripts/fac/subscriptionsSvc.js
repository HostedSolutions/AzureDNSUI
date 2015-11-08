'use strict';
angular.module('AzureDNSUI')
.factory('subscriptionsSvc', ['$http', function ($http) {
    return {
        CallURL: 'https://management.azure.com',
        getItems: function () {
            return $http.get(this.CallURL + '/subscriptions?api-version=2014-04-01-preview');
        },
        getResourceProviders: function(id) {
            return $http.get(this.CallURL + '/' + id + '/providers?api-version=2014-04-01-preview');
        },
        setResourceProvider: function (id,name) {
            return $http.post(this.CallURL + '/' + id + '/providers/' + name + '/register?api-version=2014-04-01-preview');
        }
    };
}]);