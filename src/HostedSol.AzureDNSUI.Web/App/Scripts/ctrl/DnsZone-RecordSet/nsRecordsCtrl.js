'use strict';
angular.module('AzureDNSUI')
    .controller('DnsZone-RecordSet.nsRecordsCtrl', [
        '$scope', '$state', '$location', 'dnsZoneSvc', 'adalAuthenticationService', 'recordSetSvc', 'resourceGroupSvc',
        function ($scope, $state, $location, dnsZoneSvc, adalService, recordSetSvc, resourceGroupSvc) {
            $scope.error = "";
            $scope.loadingMessage = "Loading...";
            $scope.spinner = { active: true };
            $scope.todoList = null;
            $scope.editingInProgress = false;
            $scope.dnsZoneName = "";
            $scope.isSubscriptionNotSelected = true;
            $scope.isResourceGroupNotSelected = true;

            ////////////////////////////////////INIT

            $scope.populate = function () {
                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                //NS
                recordSetSvc.getItems('NS').success(function (results) {
                    $scope.NSRecs = results.value;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                }).error(function (err) {
                    $scope.error = err;
                    $scope.loadingMessage = "";
                    $scope.spinner = { active: false };
                });
            }
            ////////////////////////////////////// NS RECORDS
            $scope.addNS = function () {
                $scope.spinner = { active: true };
                var del = $scope.NSRecs;
                del[del.length] = { nsdname: $scope.newNSRec };
                //Create a new array without the delete value then use this to commit and update to Azure DNS
               
                recordSetSvc.updateNS(del).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });
            };

            $scope.updateNS = function () {
                $scope.spinner = { active: true };
                var del = $scope.NSRecs[0];
                var newVal = $scope.editInProgressNS.nsdname;
                var oldVal = $scope.editInProgressNS.nsdnameOld;
                var param = Array();
                for (var x = 0; x < del.properties.NSRecords.length; x++) {
                    param[x] = del.properties.NSRecords[x];
                    if (del.properties.NSRecords[x].nsdname == oldVal) {
                        param[x] = {nsdname:newVal};
                    }
                }

                recordSetSvc.updateNS(param).success(function (results) {
                    $scope.populate();
                }).error(function (err) {
                    $scope.error = err;
                    $scope.spinner = { active: false };
                });

            };

            $scope.editSwitchNS = function (NSRec) {
                NSRec.edit = !NSRec.edit;
                if (NSRec.edit) {
                    $scope.editInProgressNS.nsdname = NSRec.nsdname;
                    $scope.editInProgressNS.nsdnameOld = NSRec.nsdname;
                    $scope.editingInProgressNS = true;
                } else {
                    $scope.editingInProgressNS = false;
                }
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
        }]);