'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.mxRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
            $scope.spinner = { active: true };
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.editInProgressItem = Object();
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;

            ////////////////////////////////////

            $scope.populate = function () {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //MX
                recordSetSvc.getItems('MX').success(function (results) {
                    $scope.MXRecs = results.value;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                });
            };
            $scope.addRec = function (id) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID ;

                var newDomain = $scope.newRecRootDomain;
                if (newDomain == '') { newDomain = '@' }

                recordSetSvc.addMX(newDomain).success(function (results) {
                    $scope.newRecRootDomain = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.MXRecs.length; x++) {
                    if ($scope.MXRecs[x].id == id) return $scope.MXRecs[x];
                }
                return null;
            };
            $scope.updateRec = function (item, sub) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv4add is not the same as editInProgressA.ipv4add then it has chagned, del/add from array
                // need the full array of values
                var newVale = '';
                var newValp = '';
                var replacing = false;
                if (item == null) { newVale = sub.newRecExchange;newValp=sub.newRecPreference }
                if (item != null && item.exchange == $scope.editInProgressItem.exchange) { replacing = true; }
                var param = Array();
                var newValExist = false;
                var del = $scope.GetRec(sub.id);
                for (var x = 0; x < sub.properties.MXRecords.length; x++) {
                    param[x] = del.properties.MXRecords[x];
                    if (del.properties.MXRecords[x].exchange == newVale) { newValExist = true; }
                    if (replacing && param[x].exchange == item.exchange) {
                        param[x].exchange = $scope.editInProgressItem.exchange; 
                        param[x].preference = $scope.editInProgressItem.preference;
                    }
                }

                if (item == null && !newValExist) { param[sub.properties.MXRecords.length != 0 ? x : 0] = { exchange: newVale, preference: newValp }; }

                recordSetSvc.updateMX(param).success(function (results) {
                    sub.newRecExchange = "";
                    sub.newRecPreference = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };
            $scope.delete = function (item, subid) {
                $scope.spinner = { active: true };
                var param = Array();
                var del = $scope.GetRec(subid);
                //Create a new array without the delete value then use this to commit and update to Azure DNS
                var y = 0;
                for (var x = 0; x < del.properties.MXRecords.length; x++) {
                    if (del.properties.MXRecords[x].exchange != item.exchange) {
                        param[y] = del.properties.MXRecords[x];
                        y++;
                    }
                }

                recordSetSvc.recordSet = subid;
                recordSetSvc.deleteMX(subid).success(function (results) {
                    recordSetSvc.updateMX(param).success(function (results) {
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