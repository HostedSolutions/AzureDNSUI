'use strict';
angular.module('AzureDNSUI')
.controller('recordSetCtrl', ['$scope','$state', '$location', '$stateParams', 'recordSetSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $state,$location, $stateParams, recordSetSvc, adalService, subscriptionSvc, resourceGroupSvc) {
                            $scope.dnsZoneSvcID = decodeURIComponent($stateParams.id);
                            $scope.dnsZone = "";
                            $scope.editingInProgressNS = false;
                            $scope.isLoading = true;   $scope.go = function(state) {
                                $state.go(state);
                            };
                            $scope.populate = function() {
                                // do somthing
                                var inx = $scope.dnsZoneSvcID.lastIndexOf("/");
                                var Len =$scope.dnsZoneSvcID.length;
                                $scope.dnsZone = $scope.dnsZoneSvcID.substr(inx+1, Len-inx);
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
                               },
                               {
                                   heading: 'SOA Records',
                                   route: 'RecordSet.soaRecordsCtrl',
                                   params: {
                                       Id: $scope.dnsZoneSvcID
                                   }
                               }
                            ];
                        
                         
                        }]);