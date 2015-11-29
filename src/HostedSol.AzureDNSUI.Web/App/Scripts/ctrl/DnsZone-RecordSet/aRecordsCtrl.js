'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.aRecordsCtrl', [
        '$scope','$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc',
        function($scope,$state, $location, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
            $scope.spinner = {active: true};
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
         
            ////////////////////////////////////INIT
            $scope.populate = function () {
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.getItems('A').success(function (results) {
                    //A
                    if (results.value.length != 0) {
                        $scope.ARecs = results.value;
                    }
                    $scope.loadingMessage = "";
                    $scope.spinner = {active: false};
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
                    $scope.spinner = {active: false};
                });
            };
            /////////////////////////////////////// A RECORDS
            $scope.addA = function (id) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.addA($scope.newARecRoot).success(function (results) {
                    $scope.newARecRoot = "";
                    $scope.populateA();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };
            $scope.GetARec = function (id) {
                for (var x = 0; x < $scope.ARecs.length; x++) {
                    if ($scope.ARecs[x].id == id) return $scope.ARecs[x];
                }
            };
            $scope.updateA = function (item, sub) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv4add is not the same as editInProgressA.ipv4add then it has chagned, del/add from array
                // need the full array of values
                var newVal = '';
                var replacing = false;
                if (sub.newARec != '') { newVal = sub.newARec; }
                if (item != null && item.ipv4Address != editInProgressA.ipv4Address) { replacing = true; }
                var param = Array();
                var newValExist = false;
                //var del = $scope.GetARec(id);
                for (var x = 0; x < sub.properties.ARecords.length; x++) {
                    param[x] = $scope.ARecs.properties.ARecords[x];
                    if ($scope.ARecs.properties.ARecords[x].ipv4Address == newVal.ipv4Address) { newValExist = true; }
                    if (replacing && param[x].ipv4Address == item.ipv4Address) { param[x].ip = editInProgressA.ipv4Address; }
                }

                if (!newValExist) { param[sub.properties.ARecords.length != 0 ? x + 1 : 0] = { ipv4Address: newVal }; }

                recordSetSvc.updateA(param).success(function (results) {
                    sub.newARec = "";
                    $scope.populateA();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };


        }]);