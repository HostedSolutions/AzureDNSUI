'use strict';
angular.module('AzureDNSUI')
.controller('dnsZoneCtrl', ['$scope', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $location, dnsZoneSvc, adalService, subscriptionSvc, resourceGroupSvc) {
    $scope.error = "";
    $scope.loadingMessage = "Loading...";
    $scope.isLoading = true;
    $scope.todoList = null;
    $scope.editingInProgress = false;
    $scope.dnsZoneName = "";
    $scope.isSubscriptionNotSelected = true;
    $scope.isResourceGroupNotSelected = true;
                            ////////////////////////////////////
    $scope.editInProgressTodo = {
        Description: "",
        ID: 0
    };
                            ////////////////////////////////////
    $scope.populate = function () {
        subscriptionSvc.getItems().success(function (results) {
            $scope.subList = results.value;
            $scope.loadingMessage = "";
            $scope.isLoading = false;
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
            $scope.isLoading = false;
        })
    };
                            ////////////////////////////////////
    $scope.changeSubscription = function (item) {
        resourceGroupSvc.subscriptionId = item;
        subscriptionSvc.getResourceProviders(item).success(function (results) {
            var i;
            var providers = results.value;
            for (i = 0; i < providers.length; i++) {
               var provider = providers[i];
                if (provider.namespace == 'Microsoft.Network') {
                    console.log('found him')
                    if (provider.registrationState == 'NotRegistered') {
                        console.log('Resource provider not registered, registering now.')
                        subscriptionSvc.setResourceProvider(item, 'Microsoft.Network')
                    }
                }
            }
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
        
            resourceGroupSvc.getItems().success(function (results) {
                $scope.resourceGroupList = results.value;
                
            $scope.loadingMessage = "";
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
        $scope.isSubscriptionNotSelected = false;
    }
                            ////////////////////////////////////
    $scope.changeResourceGroup = function (item) {
        dnsZoneSvc.resourceGroupName = item;
        $scope.RefreshZones();
    }
    $scope.RefreshZones = function () {
        dnsZoneSvc.getItems().success(function (results) {
            $scope.dnsZoneList = results.value;
            $scope.loadingMessage = "";
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
        $scope.isResourceGroupNotSelected = false;
    }
                            
    $scope.add = function () {
        if($scope.newDnsZoneName == '')
        {
            alert('please enter a value for the new zone.')
            return;
        }
        dnsZoneSvc.putItem($scope.newDnsZoneName);
        $scope.RefreshZones();
    }
}]);