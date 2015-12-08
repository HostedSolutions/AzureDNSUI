'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.cnameRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
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
                recordSetSvc.getItems('CNAME').success(function (results) {
                        $scope.CNAMERecs = Array();
                        for (var x = 0; x < results.value.length; x++) {
                            $scope.CNAMERecs[x] = {
                                name: results.value[x].name,
                                value: results.value[x].properties.CNAMERecord.cname,
                                id: results.value[x].id,
                                TTL: results.value[x].properties.TTL
                            };
                        }
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
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
                    //$scope.error = err;
                    sub.newRecValue = '';
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.Recs.length; x++) {
                    if ($scope.Recs[x].id == id) return $scope.Recs[x];
                }
                return null;
            };

            $scope.update = function (sub) {
                $scope.spinner = { active: true };
                var param = new Object();
                param = { cname: $scope.editInProgressItem.cname };
                recordSetSvc.recordSet = sub.id;
                recordSetSvc.updateCNAME(param, $scope.editInProgressItem.TTL).success(function (results) {
                    $scope.loadingMsg = "";
                    $scope.populate();
                    $scope.editSwitch(sub);
                }).error(function (err) {
                    $scope.spinner = { active: false };
                    $scope.error = err;
                    $scope.loadingMessage = "";
                });
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
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            }
        }]);