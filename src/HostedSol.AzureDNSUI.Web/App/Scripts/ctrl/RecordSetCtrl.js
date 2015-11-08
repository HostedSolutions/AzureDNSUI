'use strict';
angular.module('AzureDNSUI')
.controller('recordSetCtrl', ['$scope', '$location', '$stateParams', 'recordSetSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $location, $stateParams, recordSetSvc, adalService, subscriptionSvc, resourceGroupSvc) {
                            $scope.dnsZoneSvcID = decodeURIComponent($stateParams.id);
                            $scope.newNSRec = "";
                            $scope.newARecRoot = "";
                            $scope.newARec = "";
                            $scope.editInProgressNS = { nsdname: "" };
                            $scope.editInProgressA = { ipv4Address: "" };
                            $scope.editingInProgressNS = false;
                            /////////////////////////////////////// A RECORDS
                            $scope.addA = function (id) {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                recordSetSvc.addA($scope.newARecRoot).success(function (results) {
                                    $scope.newARecRoot = "";
                                    $scope.populateA();
                                }).error(function (err) {
                                    $scope.error = err;
                                })
                            };
                            $scope.GetARec = function (id) {
                                for (var x = 0; x < $scope.ARecs.length; x++) {
                                    if ($scope.ARecs[x].id == id) return $scope.ARecs[x];
                                }
                            };
                            $scope.updateA = function (item,sub) {
                                recordSetSvc.recordSet = sub.id;
                                // if this is not empty there is a new value to add $scope.newARecRoot, but check if exists already
                                // if item.ipv4add is not the same as editInProgressA.ipv4add then it has chagned, del/add from array
                                // need the full array of values
                                var newVal = '';
                                var replacing = false;
                                if (sub.newARec != '') { newVal = sub.newARec; }
                                if (item !=null && item.ipv4Address != editInProgressA.ipv4Address) { replacing = true; }
                                var param = Array();
                                var newValExist = false;
                                //var del = $scope.GetARec(id);
                                for (var x = 0; x < sub.properties.ARecords.length; x++)
                                {
                                    param[x] = $scope.ARecs.properties.ARecords[x];
                                    if ($scope.ARecs.properties.ARecords[x].ipv4Address == newVal.ipv4Address) { newValExist = true; }
                                    if (replacing && param[x].ipv4Address == item.ipv4Address) { param[x].ip = editInProgressA.ipv4Address; }
                                }
                                
                                if (!newValExist) { param[sub.properties.ARecords.length != 0 ? x + 1 : 0] = { ipv4Address: newVal }; }

                                recordSetSvc.updateA(param).success(function (results) {
                                    sub.newARec = "";
                                    $scope.populateA();
                                }).error(function (err) {
                                    $scope.error = err;
                                })
                            };




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
                            $scope.populateA = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                recordSetSvc.getItems('A').success(function (results) {
                                    //A
                                    if (results.value.length != 0) {
                                        $scope.ARecs = results.value;//[0].properties.ARecords
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                            }
                            
                            $scope.populateAAAA = function () {
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                //AAAA
                                recordSetSvc.getItems('AAAA').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.AAAARecs = results.value[0].properties.AAAARecords;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                            }

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
                                    
                                recordSetSvc.recordSet = $scope.dnsZoneSvcID;
                                    //SOA
                                recordSetSvc.getItems('SOA').success(function (results) {
                                    if (results.value.length != 0) {
                                        $scope.SOARec = results.value[0].properties.SOARecord;
                                    }
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                }).error(function (err) {
                                    $scope.error = err;
                                    $scope.loadingMessage = "";
                                    $scope.isLoading = false;
                                });
                                $scope.populateNS();
                                $scope.populateA();
                                $scope.populateAAAA();
                                $scope.populateCNAME();
                                $scope.populateMX();
                                $scope.populateSRV();
                                $scope.populateTXT();
                            }
                        }]);