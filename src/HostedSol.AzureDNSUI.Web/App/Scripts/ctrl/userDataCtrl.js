'use strict';
angular.module('AzureDNSUI')
.controller('userDataCtrl', ['$scope', 'adalAuthenticationService', 'subscriptionsSvc', function ($scope, adalService, subscriptionsSvc) {
    

    $scope.populate = function () {
        subscriptionsSvc.getItems().success(function (results) {
            console.log(results)
        }).error(function (err) {
            console.log(err)
        })
    };
}]);