'use strict';
angular.module('AzureDNSUI')
.controller('recordSetCtrl', ['$scope','$state', '$location', '$stateParams', 'recordSetSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $state,$location, $stateParams, recordSetSvc, adalService, subscriptionSvc, resourceGroupSvc) {
                            $scope.dnsZoneSvcID = decodeURIComponent($stateParams.id);
                            $scope.newNSRec = "";
                            $scope.newARecRoot = "";
                            $scope.newARec = "";
                            $scope.editInProgressNS = { nsdname: "" };
                            $scope.editInProgressA = { ipv4Address: "" };
                            $scope.editingInProgressNS = false;
                            $scope.isLoading = true;   $scope.go = function(state) {
                                $state.go(state);
                            };

                            $scope.tabData   = [
                              {
                                  heading: 'A Records',
                                  route: 'RecordSet.aRecordsCtrl',
                                  params: {
                                      Id: $scope.dnsZoneSvcID
                                  }
                              },
                               {
                                   heading: 'NS Records',
                                   route: 'RecordSet.nsRecordsCtrl',
                                   params: {
                                       Id: $scope.dnsZoneSvcID
                                   }
                               },
                                {
                                    heading: 'CNAME Records',
                                    route: 'RecordSet.cnameRecordsCtrl',
                                    params: {
                                        Id: $scope.dnsZoneSvcID
                                    }
                                },
                               {
                                   heading: 'AAAA Records',
                                   route: 'RecordSet.aaaaRecordsCtrl',
                                   params: {
                                       Id: $scope.dnsZoneSvcID
                                   }
                               },
                               {
                                   heading: 'MX Records',
                                   route: 'RecordSet.mxRecordsCtrl',
                                   params: {
                                       Id: $scope.dnsZoneSvcID
                                   }
                               },
                               {
                                   heading: 'TXT Records',
                                   route: 'RecordSet.txtRecordsCtrl',
                                   params: {
                                       Id: $scope.dnsZoneSvcID
                                   }
                               }
                            ];
                        
                         

                            ///////////////////////////////////// INIT
                         

                            $scope.populateSRV = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //SRV
                                recordSetSvc.getItems('SRV').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.SRVRecs = results.value[0].properties.SRVRecords;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });

                            }
                            $scope.populate = function () {

                                $scope.spinner = { active: true };
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                    //SOA
                                recordSetSvc.getItems('SOA').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.SOARec = results.value[0].properties.SOARecord;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.spinner = { active: false };
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.spinner = { active: false };
                                });
                            }
                        }]);