'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.aaaaRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
             $scope.spinner = {active: true};
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.editInProgressItem = Object();
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;

            ////////////////////////////////////

            $scope.populate = function () {
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //AAAA
                recordSetSvc.getItems('AAAA').success(function (results) {
                        $scope.AAAARecs = results.value;
                    $scope.loadingMessage = "";
                     $scope.spinner = {active: false};
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
                     $scope.spinner = {active: false};
                });
            };
            $scope.addRec = function (id) {
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.addAAAA($scope.newRecRoot).success(function (results) {
                    $scope.newRecRoot = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                     $scope.spinner = {active: false};
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.AAAARecs.length; x++) {
                    if ($scope.AAAARecs[x].id == id) return $scope.AAAARecs[x];
                }
                return null;
            };
            $scope.updateRec = function (item, sub) {
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv4add is not the same as editInProgressA.ipv4add then it has chagned, del/add from array
                // need the full array of values
                var newVal = '';
                var replacing = false;
                if (item == null) { newVal = sub.newRec; }
                if (item != null && item.ipv6Address == $scope.editInProgressItem.ipv6Address) { replacing = true; }
                var param = Array();
                var newValExist = false;
                var del = $scope.GetRec(sub.id);
                for (var x = 0; x < sub.properties.AAAARecords.length; x++) {
                    param[x] = del.properties.AAAARecords[x];
                    if (del.properties.AAAARecords[x].ipv6Address == newVal) { newValExist = true; }
                    if (replacing && param[x].ipv6Address == item.ipv6Address) { param[x].ip = $scope.editInProgressItem.ipv6Address; }
                }

                if (item == null && !newValExist) { param[sub.properties.AAAARecords.length != 0 ? x : 0] = { ipv6Address: newVal }; }

                recordSetSvc.updateAAAA(param).success(function (results) {
                    sub.newRec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                     $scope.spinner = {active: false};
                });
            };
            $scope.delete = function (item, subid) {
                $scope.spinner = { active: true };
                var param = Array();
                var del = $scope.GetRec(subid);
                //Create a new array without the delete value then use this to commit and update to Azure DNS
                var y = 0;
                for (var x = 0; x < del.properties.AAAARecords.length; x++) {
                    if (del.properties.AAAARecords[x].ipv6Address != item.ipv6Address) {
                        param[y] = del.properties.AAAARecords[x];
                        y++;
                    } 
                }

                recordSetSvc.recordSet = subid;
                recordSetSvc.deleteAAAA(subid).success(function (results) {
                    recordSetSvc.updateAAAA(param).success(function (results) {
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

            $scope.editSwitch = function (item) {
                item.edit = !item.edit;
                if (item.edit) {
                    $scope.editInProgressItem = item;
                    $scope.editingInProgress = true;
                } else {
                    $scope.editingInProgress = false;
                }
            };
        }]);