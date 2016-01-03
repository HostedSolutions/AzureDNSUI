'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.soaRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'errorHandleSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc, errorHandleSvc) {
            $scope.error = "";
            $scope.spinner = { active: true };
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.editInProgressItem = Object();
            ////////////////////////////////////

            $scope.populate = function () {

                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //SOA
                recordSetSvc.getItems('SOA').success(function (results) {
                    $scope.SOARec = results.value[0].properties.SOARecord;
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            }

        }]);