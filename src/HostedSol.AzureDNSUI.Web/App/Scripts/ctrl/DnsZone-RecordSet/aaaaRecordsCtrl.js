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
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;

            ////////////////////////////////////

            $scope.populate = function () {
                 $scope.spinner = {active: true};
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //AAAA
                recordSetSvc.getItems('AAAA').success(function (results) {
                    if (results.value.length != 0) {
                        $scope.AAAARecs = results.value;
                    }
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
                for (var x = 0; x < $scope.Recs.length; x++) {
                    if ($scope.Recs[x].id == id) return $scope.Recs[x];
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
                if (sub.newRec != '') { newVal = sub.newRec; }
                if (item != null && item.ipv6Address != editInProgress.ipv6Address) { replacing = true; }
                var param = Array();
                var newValExist = false;
                //var del = $scope.GetARec(id);
                for (var x = 0; x < sub.properties.AAAARecords.length; x++) {
                    param[x] = $scope.Recs.properties.AAAARecords[x];
                    if ($scope.Recs.properties.AAAARecords[x].ipv6Address == newVal.ipv6Address) { newValExist = true; }
                    if (replacing && param[x].ipv6Address == item.ipv6Address) { param[x].ip = editInProgress.ipv6Address; }
                }

                if (!newValExist) { param[sub.properties.AAAARecords.length != 0 ? x + 1 : 0] = { ipv6Address: newVal }; }

                recordSetSvc.updateAAAA(param).success(function (results) {
                    sub.newRec = "";
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                     $scope.spinner = {active: false};
                });
            };
        }]);