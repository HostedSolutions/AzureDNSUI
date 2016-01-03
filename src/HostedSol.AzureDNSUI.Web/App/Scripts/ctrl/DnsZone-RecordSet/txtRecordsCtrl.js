'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.txtRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'errorHandleSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc, errorHandleSvc) {
            $scope.error = null;
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
                //AAAA
                recordSetSvc.getItems('TXT').success(function (results) {
                    $scope.TXTRecs = Array();
                    for (var x = 0; x < results.value.length; x++) {
                        $scope.TXTRecs[x] = {
                            name: results.value[x].name,
                            value: results.value[x].properties.TXTRecords.length == 0 ? null : results.value[x].properties.TXTRecords[0].value,
                            id: results.value[x].id
                        };
                    }
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.addRec = function (sub) {
                $scope.error = null;
                $scope.spinner = { active: true };
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                var newTXT = { value: sub.newRecValue };
                recordSetSvc.addTXT(sub.newRecTXT, newTXT).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            };
            $scope.GetRec = function (id) {
                for (var x = 0; x < $scope.Recs.length; x++) {
                    if ($scope.Recs[x].id == id) return $scope.Recs[x];
                }
                return null;
            };

            $scope.update = function (sub) {
                $scope.error = null;
                $scope.spinner = { active: true };
                var param = Object();
                param = { value: $scope.editInProgressItem.value };
                recordSetSvc.recordSet = sub.id;
                recordSetSvc.updateTXT(param).success(function (results) {
                    $scope.populate();
                    $scope.editSwitch(sub);
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                });
            };

            $scope.editSwitch = function (sub) {
                $scope.spinner = { active: true };
                sub.edit = !sub.edit;
                if (sub.edit) {
                    $scope.editInProgressItem.value = sub.value;
                    $scope.editingInProgress = true;
                    $scope.spinner = { active: false };
                } else {
                    $scope.editingInProgress = false;
                    $scope.spinner = { active: false };
                }
            };
            $scope.delete = function (value) {
                $scope.error = null;
                $scope.spinner = { active: true };
                recordSetSvc.deleteTXT(value).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = errorHandleSvc.getErrorMessage(err);
                    $scope.spinner = { active: false };
                });
            }
        }]);