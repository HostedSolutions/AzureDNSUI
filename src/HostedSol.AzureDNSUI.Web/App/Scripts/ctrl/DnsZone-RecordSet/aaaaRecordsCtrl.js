'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.aaaaRecordsCtrl', [
        '$scope', '$state', '$location','$q', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 
        function ($scope, $state, $location,$q, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = null;
            $scope.loadingMessage = "Loading...";
             $scope.spinner = {active: true};
            $scope.editingInProgress = false;
            $scope.editInProgressItem = Object();
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.bulkTTL = '';
            $scope.newRecRootIP = '';
            $scope.newRecRootTTL = '';

            ////////////////////////////////////

            $scope.populate = function () {
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //AAAA
                recordSetSvc.getItems('AAAA').success(function (results) {
                    var del = $scope.AAAARecs;
                    for (var i = 0; i < results.value.length; i++) {
                        if (del == null || i >= del.length) {
                            results.value[i].imgEdit = '../../../Content/img/edit32.png';
                        }
                        else if (del[i].editModeOn != null) {
                            results.value[i].editModeOn = del[i].editModeOn;
                            results.value[i].imgEdit = del[i].editModeOn ? '../../../Content/img/edit32a.png' : '../../../Content/img/edit32.png';
                        } else {
                            results.value[i].imgEdit = '../../../Content/img/edit32.png';
                        }
                    }
                        $scope.AAAARecs = results.value;
                    $scope.loadingMessage = "";
                     $scope.spinner = {active: false};
                }).error(function (err) {
                    $scope.error = err.error.code + ': ' + err.error.message;
                    $scope.loadingMessage = "";
                     $scope.spinner = {active: false};
                });
            };
            $scope.addRec = function (id) {
                $scope.error = null;
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.addAAAA(this.newRecRoot, this.newRecRootIP,
                    this.newRecRootTTL).success(function (results) {
                    $scope.newRecRoot = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err.error.code + ': ' + err.error.message;
                     $scope.spinner = {active: false};
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.AAAARecs.length; x++) {
                    if ($scope.AAAARecs[x].id == id) return $scope.AAAARecs[x];
                }
                return null;
            };
            $scope.getParamForUpdate = function (item, sub, ttl, skipUpdate) {
                console.log("prog");
                if (skipUpdate == null) skipUpdate = false;
                console.log("prog");
                if (!skipUpdate) { $scope.error = null; };
                console.log("prog");
                if (ttl == null) ttl = false;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv6add is not the same as editInProgressItem.ipv6add then it has chagned, del/add from array
                // need the full array of values
                var newVal = '';
                console.log("prog");
                if (sub.newRec != '') { newVal = sub.newRec; }
                if (item != null && item.ipv6Address != $scope.editInProgressItem.ipv6Address) { replacing = true; }
                var param = Array();
                console.log("prog");
                var del = $scope.GetRec(sub.id);
                for (var x = 0; x < sub.properties.AAAARecords.length; x++) {
                    param[x] = del.properties.AAAARecords[x];
                }
                // if not edit or TTL update, and the new item is not empty, then add new record to array
                if (!ttl && item == null && sub.newRec != '') { param[sub.properties.AAAARecords.length != 0 ? x : 0] = { ipv6Address: newVal }; }
                return param;
            };
            $scope.updateRec = function (item, sub, ttl, skipUpdate) {
                console.log("prog");
                var param = $scope.getParamForUpdate(item, sub, ttl, skipUpdate);

                recordSetSvc.updateAAAA(param).success(function () {
                    sub.newRec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err.error.code + ': ' + err.error.message;
                     $scope.spinner = {active: false};
                });
            };
            $scope.deleteRoot = function (sub) {
                $scope.error = null;
                if (confirm("Are you sure you want to delete this entire A Record?")) {
                    $scope.error = null;
                    $scope.spinner = { active: true };

                    recordSetSvc.recordSet = sub.id;
                    recordSetSvc.deleteAAAA().success(function (results) {
                        $scope.populate();
                    }).error(function (err) {
                        $scope.error = err.code + ': ' + err.message;
                        $scope.spinner = { active: false };
                    });
                }
            };
            $scope.delete = function (item, subid) {
                $scope.error = null;
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
                        $scope.error = err.error.code + ': ' + err.error.message;
                        $scope.spinner = { active: false };
                    });
                }).error(function (err) {
                    $scope.error = err.error.code + ': ' + err.error.message;
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
            $scope.getParamForUpdate = function (item, sub, ttl, skipUpdate) {
                if (!skipUpdate) { $scope.error = null; };
                if (ttl == null) ttl = false;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv6add is not the same as editInProgressItem.ipv6add then it has chagned, del/add from array
                // need the full array of values
                var newVal = '';
                if (sub.newRec != '') { newVal = sub.newRec; }
                if (item != null && item.ipv6Address != $scope.editInProgressItem.ipv6Address) { replacing = true; }
                var param = Array();
                var del = $scope.GetRec(sub.id);
                for (var x = 0; x < sub.properties.AAAARecords.length; x++) {
                    param[x] = del.properties.AAAARecords[x];
                }
                // if not edit or TTL update, and the new item is not empty, then add new record to array
                if (!ttl && item == null && sub.newRec != '') { param[sub.properties.AAAARecords.length != 0 ? x : 0] = { ipv6Address: newVal }; }
                return param;
            };
            $scope.updateTTLBulk = function () {
                $scope.error = null;
                var e = document.getElementById("txtBulkTTL").value;

                $scope.spinner = { active: true };

                var promises = [];
                for (var i = 0; i < $scope.AAAARecs.length; i++) {
                    $scope.AAAARecs[i].properties.TTL = e;
                    var param = $scope.getParamForUpdate(null, $scope.AAAARecs[i], true, true);
                    promises.push(recordSetSvc.updateAAAA(param, e));
                }
                $q.all(promises).then(function () {
                    $scope.spinner = { active: false };
                });
            };
            $scope.editSwitchPanel = function (item) {
                if (item.editModeOn == null || item.editModeOn === false) {
                    item.editModeOn = true;
                    item.imgEdit = '../../../Content/img/edit32a.png';
                } else {
                    item.editModeOn = false;
                    item.imgEdit = '../../../Content/img/edit32.png';
                }
            };
        }]);