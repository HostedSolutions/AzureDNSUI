'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.aRecordsCtrl', [
        '$scope', '$state', '$location', '$q', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'errorHandleSvc',
        function ($scope, $state, $location, $q, dnsZoneSvc, adalService, recordSetSvc, errorHandleSvc) {
            $scope.error = null;
            //$scope.spinner = {active: true};
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.newARecRoot = "";
            $scope.ARecs = null;
            $scope.bulkTTL = '';
            $scope.newARecRootIP = '';
            $scope.newARecRootTTL = '';

            ////////////////////////////////////INIT
            $scope.populate = function () {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.getItems('A').success(function (results) {
                    var del = $scope.ARecs;
                    for (var i = 0; i < results.value.length; i++) {
                        if (del == null || i >= del.length) {
                             results.value[i].imgEdit = '../../../Content/img/edit32.png';
                        }
                        else if (del[i].editModeOn != null ) {
                            results.value[i].editModeOn = del[i].editModeOn;
                            results.value[i].imgEdit = del[i].editModeOn ? '../../../Content/img/edit32a.png' : '../../../Content/img/edit32.png';
                        } else {
                            results.value[i].imgEdit = '../../../Content/img/edit32.png';
                        }
                    }
                    $scope.ARecs = results.value;
                    $scope.spinner = {active: false};
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = {active: false};
                });
            };
            /////////////////////////////////////// A RECORDS
            $scope.addA = function () {
                $scope.error = null;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //$scope fails here so need to use this, unsure why
                recordSetSvc.addA(this.newARecRoot, this.newARecRootIP,
                    this.newARecRootTTL).success(function (results) {
                    $scope.newARecRoot = "";
                    $scope.populate();
                    }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.GetARec = function (id) {
                for (var x = 0; x < $scope.ARecs.length; x++) {
                    if ($scope.ARecs[x].id == id) return $scope.ARecs[x];
                }
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
            $scope.updateTTLBulk = function () {
                $scope.error = null;
                var del = $scope;
                var e = document.getElementById("txtBulkTTL").value;

                $scope.spinner = { active: true };

                var promises = [];
                for (var i = 0; i < this.ARecs.length; i++) {
                    del.ARecs[i].properties.TTL = e;
                    var param = $scope.getParamForUpdate(null, this.ARecs[i], true, true);
                    promises.push(recordSetSvc.updateA(param, e));
                }
                $q.all(promises).then(function() {
                    $scope.spinner = { active: false };
                });
            };
            $scope.getParamForUpdate = function (item, sub, ttl, skipUpdate) {
                if (!skipUpdate) { $scope.error = null; };
                if (ttl == null) ttl = false;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                // if item.ipv4add is not the same as editInProgressItem.ipv4add then it has chagned, del/add from array
                // need the full array of values
                var newVal = '';
                if (sub.newARec != '') { newVal = sub.newARec; }
                if (item != null && item.ipv4Address != $scope.editInProgressItem.ipv4Address) { replacing = true; }
                var param = Array();
                var del = $scope.GetARec(sub.id);
                for (var x = 0; x < sub.properties.ARecords.length; x++) {
                    param[x] = del.properties.ARecords[x];
                }
                // if not edit or TTL update, and the new item is not empty, then add new record to array
                if (!ttl && item == null && sub.newARec != '') { param[sub.properties.ARecords.length != 0 ? x : 0] = { ipv4Address: newVal }; }
                return param;
            };
            $scope.updateA = function (item, sub, ttl, skipUpdate) {
                var param=$scope.getParamForUpdate(item, sub, ttl, skipUpdate);
                if (skipUpdate == null) skipUpdate = false;
                recordSetSvc.updateA(param, sub.properties.TTL).success(function (results) {
                    sub.newARec = "";
                    if (!skipUpdate){ $scope.populate();};
                }).error(function (err) {
                    $scope.error = err.code + ': ' + err.message;
                    $scope.spinner = { active: false };
                });
            };
            $scope.deleteRoot = function(sub) {
                if (confirm("Are you sure you want to delete this entire A Record?")) {
                    $scope.error = null;
                    $scope.spinner = { active: true };

                    recordSetSvc.recordSet = sub.id;
                    recordSetSvc.deleteA().success(function(results) {
                        $scope.populate();
                    }).error(function(err) {
                        $scope.error = err.code + ': ' + err.message;
                        $scope.spinner = { active: false };
                    });
                }
            };
            $scope.delete = function (item, subid) {

                $scope.error = null;
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
                    recordSetSvc.updateA(param).success(function (results) {
                        $scope.populate();
                    }).error(function (err) {
                        $scope.error = err.code + ': ' + err.message;
                        $scope.spinner = { active: false };
                    });
            }

            $scope.editSwitch = function (item) {
                item.edit = !item.edit;
                if (item.edit) {
                    $scope.editInProgressItem = item;
                }
            };


        }]);