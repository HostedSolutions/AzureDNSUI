'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.cnameRecordsCtrl', [
        '$scope', '$state', '$q', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'errorHandleSvc',
        function ($scope, $state, $q, $location, dnsZoneSvc, adalService, recordSetSvc, errorHandleSvc) {
            $scope.error = "";
            $scope.spinner = { active: true };
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;
            $scope.editInProgressItem = Object();
            $scope.bulk = {RecValue:'',RecTTL:''};
            ////////////////////////////////////
            $scope.BulkUpdate = function () {
                $scope.error = null;
                $scope.spinner = { active: true };
                var promises = [];
                for (var i = 0; i < $scope.CNAMERecs.length; i++) {
                    var rec = $scope.CNAMERecs[i];
                    if (rec.isSelected) {
                        var param = new Object();
                        param = { cname: $scope.bulk.RecValue == '' ? rec.value : $scope.bulk.RecValue };
                        recordSetSvc.recordSet = rec.id;
                        promises.push(recordSetSvc.updateCNAME(param, $scope.bulk.RecTTL == '' ? rec.TTL : $scope.bulk.RecTTL));
                    }
                }
                $q.all(promises).then(function () {
                    $scope.populate();
                    $scope.spinner = { active: false };
                });
            };
            $scope.populate = function () {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                recordSetSvc.getItems('CNAME').success(function (results) {
                        $scope.CNAMERecs = Array();
                        for (var x = 0; x < results.value.length; x++) {
                            $scope.CNAMERecs[x] = {
                                name: results.value[x].name,
                                value: results.value[x].properties.CNAMERecord.cname,
                                id: results.value[x].id,
                                TTL: results.value[x].properties.TTL,
                                isSelected: false
                        };
                        }
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.addRec = function (sub) {
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                var newCNAME = { cname: sub.newRecValue };
                recordSetSvc.addCNAME(sub.newRecName, newCNAME,sub.newRecTTL).then(function () {
                    $scope.populate();
                    $scope.spinner = { active: false };
                }, function (err) {
                    console.log(err);
                    $scope.spinner = { active: false };
                    if (err.status === 409) {
                        // conflict error
                        alert('The record you tried to add maybe a duplicate with an existing A Record, the API returned a 409 Conflict error. Please check the data and try again.');
                        return;
                    }
                    //$scope.error = errorHandleSvc.getErrorMessage(err);
                    sub.newRecValue = '';
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.Recs.length; x++) {
                    if ($scope.Recs[x].id == id) return $scope.Recs[x];
                }
                return null;
            };
            $scope.DoUpdate = function(id,value,ttl) {
                  var param = new Object();
                param = { cname: value };
                recordSetSvc.recordSet = id;
                recordSetSvc.updateCNAME(param, ttl).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.spinner = { active: false };
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                });
            };
            $scope.update = function (sub) {
                $scope.spinner = { active: true };
                DoUpdate(sub.id, $scope.editInProgressItem.cname, $scope.editInProgressItem.TTL);
                $scope.editSwitch(sub);
            };

            $scope.editSwitch = function (sub) {
                $scope.spinner = { active: true };
                sub.edit = !sub.edit;
                if (sub.edit) {
                    $scope.editInProgressItem.cname = sub.value;
                    $scope.editInProgressItem.TTL = sub.TTL;
                    $scope.editingInProgress = true;
                    $scope.spinner = { active: false };
                } else {
                    $scope.editingInProgress = false;
                    $scope.spinner = { active: false };
                }
            };
            $scope.delete = function(cname) {
                    $scope.spinner = { active: true };
                recordSetSvc.deleteCNAME(cname).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            }
        }]);