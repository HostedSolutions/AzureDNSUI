'use strict';
angular.module('AzureDNSUI')
.controller('RecordSetCtrl', ['$scope', '$location', 'recordSetSvc', 'adalAuthenticationService', 'subscriptionsSvc', 'resourceGroupSvc',
                        function ($scope, $location, dnsZoneSvc, adalService, subscriptionSvc, resourceGroupSvc) {
                           
                            $scope.populate = function () {
                                
                            }
                        }]);