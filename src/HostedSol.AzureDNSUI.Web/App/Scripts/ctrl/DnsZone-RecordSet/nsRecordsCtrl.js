'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.nsRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'resourceGroupSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc, resourceGroupSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
            $scope.isLoading = true;
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;

            ////////////////////////////////////

        }]);