﻿'use strict';
angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        throw exception;
    };
});
angular.module('AzureDNSUI', ['AdalAngular', 'ui.router',
  'ui.bootstrap',
  'ui.router.tabs',
'treasure-overlay-spinner',
'ngAnimate'])
.config(['$urlRouterProvider', '$httpProvider', '$stateProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, $stateProvider, adalProvider) {

    $routeProvider.otherwise("/Home");

    $stateProvider.state("Home", {
        url:"/Home",
        controller: "homeCtrl",
        templateUrl: "App/Views/Home.html"
    }).state("UserData", {
        url:"/UserData",
        controller: "userDataCtrl",
        templateUrl: "App/Views/UserData.html"
    }).state('DnsZone', {
           url: '/DnsZone',
           templateUrl: 'App/Views/DnsZone.html',
           controller: 'dnsZoneCtrl'
    }).state('RecordSet', {
           url: '/RecordSet/:id',
           templateUrl: 'App/Views/DnsZone-RecordSet.html',
           controller: 'recordSetCtrl'
    }).state('RecordSet.aRecordsCtrl', {
        url: '/RecordSet/aRecordsCtrl/:id',
        templateUrl: 'App/Views/DnsZone-RecordSet/ARecords.html',
        controller: 'DnsZone-RecordSet.aRecordsCtrl'
    }).state('RecordSet.cnameRecordsCtrl', {
        url: '/RecordSet/cnameRecordsCtrl/:id',
        templateUrl: 'App/Views/DnsZone-RecordSet/CnameRecords.html',
        controller: 'DnsZone-RecordSet.cnameRecordsCtrl'
    }).state('RecordSet.aaaaRecordsCtrl', {
        url: '/RecordSet/aaaaRecordsCtrl/:id',
        templateUrl: 'App/Views/DnsZone-RecordSet/AaaaRecords.html',
        controller: 'DnsZone-RecordSet.aaaaRecordsCtrl'
    }).state('RecordSet.nsRecordsCtrl', {
        url: '/RecordSet/nsRecordsCtrl/:id',
        templateUrl: 'App/Views/DnsZone-RecordSet/NsRecords.html',
        controller: 'DnsZone-RecordSet.nsRecordsCtrl'
    });

    adalProvider.init(
        {
            instance: 'https://login.microsoftonline.com/', 
            tenant: 'hostedsolutionscomau.onmicrosoft.com',
            clientId: 'ffd940d1-3eed-425b-9ae9-fd0e9955db29',
            //clientId: 'https://management.core.windows.net/',
            loginResource: 'https://management.azure.com/',
            extraQueryParameter: 'nux=1',
            
            //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
        },
        $httpProvider
        );
   
}]);

