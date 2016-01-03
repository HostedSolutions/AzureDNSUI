'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.mxRecordsCtrl', [
        '$scope', '$state', '$location', '$q','dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc','errorHandleSvc',
        function ($scope, $state, $location, $q, dnsZoneSvc, adalService, recordSetSvc, errorHandleSvc) {
            $scope.error = null;
            $scope.spinner = { active: true };
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
                $scope.newRecRoot = '';
                $scope.newRecRootAddy = '';
                $scope.newRecRootPref = '';
                $scope.newRecRootTTL = '';
                $scope.bulkTTL = '';
                recordSetSvc.getItems('MX').success(function (results) {
                    var del = $scope.MXRecs;
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
                    $scope.MXRecs = results.value;
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.addRec = function (id) {
                $scope.error = null;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //$scope doesn't work here with the inputs, replaced with 'this'
                var newDomain = this.newRecRoot;
                if (newDomain == '') { newDomain = '@' }
                var param = Array();
                param[0] = { exchange: this.newRecRootAddy, preference: this.newRecRootPref };
                var TTL = this.newRecRootTTL;
                recordSetSvc.addMX(newDomain,TTL,param).success(function (results) {
                    $scope.newRecRootDomain = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.MXRecs.length; x++) {
                    if ($scope.MXRecs[x].id == id) return $scope.MXRecs[x];
                }
                return null;
            };
            $scope.getParamForUpdate = function (item, sub, ttl, skipUpdate) {
                if (!skipUpdate) { $scope.error = null; };
                if (ttl == null) ttl = false;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = sub.id;
                var newVal = '';
                var newValp = '';
                if (sub.newRec != '') { newVal = sub.newRec; newValp = sub.newRecP }
                if (item != null && item.exchange != $scope.editInProgressItem.exchange) { replacing = true; }
                var param = Array();
                var del = $scope.GetRec(sub.id);
                for (var x = 0; x < sub.properties.MXRecords.length; x++) {
                    param[x] = del.properties.MXRecords[x];
                }
                // if not edit or TTL update, and the new item is not empty, then add new record to array
                if (!ttl && item == null && sub.newRec != '') { param[sub.properties.MXRecords.length != 0 ? x : 0] = { exchange: newVal, preference: newValp }; }
                return param;
            };
            $scope.updateTTLBulk = function () {
                $scope.error = null;
                var e = this.bulkTTL;
                $scope.spinner = { active: true };

                var promises = [];
                for (var i = 0; i < $scope.MXRecs.length; i++) {
                    $scope.MXRecs[i].properties.TTL = e;
                    var param = $scope.getParamForUpdate(null, $scope.MXRecs[i], true, true);
                    promises.push(recordSetSvc.updateMX(param, e));
                }
                $q.all(promises).then(function () {
                    $scope.populate();
                    $scope.spinner = { active: false };
                });
            };
            $scope.updateRec = function (item, sub, ttl, skipUpdate) {
                var param = $scope.getParamForUpdate(item, sub,ttl);
                recordSetSvc.updateMX(param,sub.properties.TTL).success(function () {
                    sub.newRec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error=errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.deleteRoot = function (sub) {
                $scope.error = null;
                if (confirm("Are you sure you want to delete this entire MX Record?")) {
                    $scope.error = null;
                    $scope.spinner = { active: true };

                    recordSetSvc.recordSet = sub.id;
                    recordSetSvc.deleteMX().success(function (results) {
                        $scope.populate();
                    }).error(function (err) {
                        $scope.error = err.code + ': ' + err.message;
                        $scope.spinner = { active: false };
                    });
                }
            };
            $scope.delete = function (item, sub) {
                $scope.error = null;
                $scope.spinner = { active: true };
                var param = Array();
                var del = $scope.GetRec(sub.id);
                //Create a new array without the delete value then use this to commit and update to Azure DNS
                var y = 0;
                for (var x = 0; x < del.properties.MXRecords.length; x++) {
                    if (!(del.properties.MXRecords[x].exchange == item.exchange
                       && item.preference == del.properties.MXRecords[x].preference)) {
                        param[y] = del.properties.MXRecords[x];
                        y++;
                    } 
                }
                recordSetSvc.recordSet = sub.id;
                recordSetSvc.updateMX(param, sub.properties.TTL).success(function (results) {
                        $scope.populate();
                    }).error(function (err) {
                        errorHandleSvc.getErrorMessage(err);
                        $scope.spinner = { active: false };
                    });
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