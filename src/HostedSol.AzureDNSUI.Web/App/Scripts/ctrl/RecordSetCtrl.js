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
                               }
                            ];
                        
                         


                            ////////////////////////////////////// NS RECORDS
                            $scope.addNS = function () {
                                recordSetSvc.addNS($scope.newTodoCaption).success(function (results) {
                                    $scope.loadingMsg = "";
                                    $scope.newTodoCaption = "";
                                    $scope.populate();
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMsg = "";
                                })
                            };

                            $scope.updateNS = function (NSRec) {
                                recordSetSvc.updateNS($scope.editInProgressNS).success(function (results) {
                                    $scope.loadingMsg = "";
                                    $scope.populate();
                                    $scope.editSwitch(NSRec);
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                })
                            };

                            $scope.editSwitchNS = function (NSRec) {
                                NSRec.edit = !NSRec.edit;
                                if (NSRec.edit) {
                                    $scope.editInProgressNS.nsdname = NSRec.nsdname;
                                    $scope.editingInProgressNS = true;
                                } else {
                                    $scope.editingInProgressNS = false;
                                }
                            };
                            ///////////////////////////////////// INIT
                         
                            

                            $scope.populateCNAME = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //CNAME
                                recordSetSvc.getItems('CNAME').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.CNAMERecs = results.value[0].properties.CNAMERecords;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                            }

                            $scope.populateMX = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //MX
                                recordSetSvc.getItems('MX').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.MXRecs = results.value[0].properties.MXRecords;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });

                            }

                            $scope.populateNS = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //NS
                                recordSetSvc.getItems('NS').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.NSRecs = results.value;//[0].properties.NSRecords
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                            }

                            $scope.populateTXT = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //TXT
                                recordSetSvc.getItems('TXT').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.TXTRecs = results.value[0].properties.TXTRecords;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                            }

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