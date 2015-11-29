'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.aRecordsCtrl', [
        '$scope','$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc',
        function($scope,$state, $location, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = "";
            $scope.spinner = {active: true};
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.newARecRoot = "";
         
            ////////////////////////////////////INIT
            $scope.populate = function () {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.getItems('A').success(function (results) {
                    //A
                    $scope.ARecs = results.value;
                    $scope.spinner = {active: false};
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = {active: false};
                });
            };
            /////////////////////////////////////// A RECORDS
            $scope.addA = function () {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.addA($scope.newARecRoot).success(function (results) {
                    $scope.newARecRoot = "";
                    $scope.populate();
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
                if (item != null && item.ipv4Address != $scope.editInProgressA.ipv4Address) { replacing = true; }
                var param = Array();
                var newValExist = false;
                var del = $scope.GetARec(sub.id);
                for (var x = 0; x < sub.properties.ARecords.length; x++) {
                    param[x] = del.properties.ARecords[x];
                    if (del.properties.ARecords[x].ipv4Address == newVal) { newValExist = true; }
                    if (replacing && param[x].ipv4Address == item.ipv4Address) { param[x].ip = $scope.editInProgressA.ipv4Address; }
                }

                if (item == null && !newValExist) { param[sub.properties.ARecords.length != 0 ? x : 0] = { ipv4Address: newVal }; }

                recordSetSvc.updateA(param).success(function (results) {
                    sub.newARec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };
            $scope.delete = function (item, subid) {
                $scope.spinner = { active: true };
                var param = Array();
                var del = $scope.GetARec(subid);
                //Create a new array without the delete value then use this to commit and update to Azure DNS
                var y = 0;
                for (var x = 0; x < del.properties.ARecords.length; x++) {
                    if (del.properties.ARecords[x].ipv4Address != item.ipv4Address) {
                        param[y] = del.properties.ARecords[x];
                        y++;
                    }
                }

                recordSetSvc.recordSet = subid;
                recordSetSvc.deleteA(subid).success(function (results) {
                    recordSetSvc.updateA(param).success(function (results) {
                        $scope.populate();
                    }).error(function (err) {
                        $scope.error = err;
                        $scope.spinner = { active: false };
                    });
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });;
            }



        }]);