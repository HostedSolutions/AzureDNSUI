'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.nsRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'resourceGroupSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc, resourceGroupSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
            $scope.spinner = { active: true };
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.editInProgressNS = new Object();
            ////////////////////////////////////INIT

            $scope.populate = function () {
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //NS
                recordSetSvc.getItems('NS').success(function (results) {
                    $scope.NSRecs = results.value;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                });
            }
            ////////////////////////////////////// NS RECORDS
            $scope.addNS = function () {
                $scope.spinner = { active: true };
                //var del = $scope.NSRecs;
                var del = Array();
                del[0] = { nsdname: $scope.newNSRec };
                //Create a new array without the delete value then use this to commit and update to Azure DNS
                recordSetSvc.recordSet = $scope.dnsZoneSvcID + '/NS/' + $scope.newNSRec;
                recordSetSvc.updateNS(del).success(function (results) {
                    $scope.newNSRec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };

            $scope.updateNS = function () {
                $scope.spinner = { active: true };
                var newVal = $scope.editInProgressNS.nsdname;
                var oldVal = $scope.editInProgressNS.nsdnameOld;
                recordSetSvc.recordSet = $scope.dnsZoneSvcID + '/NS/' + oldVal;

                var del = Array();
                del[0] = { nsdname: newVal };
                recordSetSvc.updateNS(del).success(function () {
                    $scope.populate();
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });

            };

            $scope.editSwitchNS = function (NSRec) {
                NSRec.edit = !NSRec.edit;
                if (NSRec.edit) {
                    $scope.editInProgressNS.nsdname = NSRec.nsdname;
                    $scope.editInProgressNS.nsdnameOld = NSRec.nsdname;
                    $scope.editingInProgressNS = true;
                } else {
                    $scope.editingInProgressNS = false;
                }
            };

            $scope.deleteNS = function (nsdname) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID + '/NS/' + nsdname;
                recordSetSvc.deleteNS().success(function () {
                    $scope.populate();
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            }
        }]);