'use strict';
angular.module('AzureDNSUI')
.controller('dnsZoneCtrl', ['$scope', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $location, dnsZoneSvc, adalService, subscriptionSvc, resourceGroupSvc) {
    $scope.error = "";
    $scope.selectedItem = null;
    $scope.selectedRg = null;
    $scope.spinner = { active: true };
    $scope.todoList = null;
    $scope.editingInProgress = false;
    $scope.dnsZoneName = "";
    $scope.isSubscriptionNotSelected = true;
    $scope.isResourceGroupNotSelected = true;
                           
                            ////////////////////////////////////
    $scope.populate = function () {
        subscriptionSvc.getItems().success(function (results) {
            $scope.subList = results.value;
            $scope.isLoading = false;
            $scope.spinner = { active: false };
        }).error(function (err) {
            $scope.error = err;
            $scope.isLoading = false;
            $scope.spinner = { active: false };
        });
    };
                            ////////////////////////////////////
    $scope.changeSubscription = function (item) {
        $scope.selectedItem = item;
        resourceGroupSvc.subscriptionId = item.id;
        $scope.spinner = { active: true };
        subscriptionSvc.getResourceProviders(item.id).success(function (results) {
            var i;
            var providers = results.value;
            for (i = 0; i < providers.length; i++) {
               var provider = providers[i];
                if (provider.namespace == 'Microsoft.Network') {
                    console.log('found him');
                    if (provider.registrationState == 'NotRegistered') {
                        console.log('Resource provider not registered, registering now.');
                        subscriptionSvc.setResourceProvider(item, 'Microsoft.Network');
                    }
                }
            }
        }).error(function (err) {
            $scope.error = err;
        });
        resourceGroupSvc.getItems().success(function (results) {
            $scope.resourceGroupList = results.value;
            $scope.spinner = { active: false };
                
        }).error(function (err) {
            $scope.error = err;
            $scope.spinner = { active: false };
        });
        $scope.isSubscriptionNotSelected = false;
    };
                            ////////////////////////////////////
    $scope.changeResourceGroup = function (item) {
        $scope.spinner = { active: true };
        $scope.selectedRg = item;
        dnsZoneSvc.resourceGroupName = item.id;
        $scope.RefreshZones();
    };
                            $scope.RefreshZones = function () {
        $scope.spinner = { active: true };
        dnsZoneSvc.getItems().success(function(results) {
            $scope.dnsZoneList = results.value;
            $scope.loadingMessage = "";
            $scope.spinner = { active: false };
        }).error(function(err) {
            $scope.error = err;
            $scope.loadingMessage = "";
            $scope.spinner = { active: false };
        });
        $scope.isResourceGroupNotSelected = false;
    };
                            $scope.add = function () {
        if($scope.newDnsZoneName == '') {
            alert('please enter a value for the new zone.');
            return;
        }
        $scope.spinner = { active: true };
        dnsZoneSvc.putItem($scope.newDnsZoneName);
        $scope.RefreshZones();
        $scope.spinner = { active: false };
    };
                        }]);