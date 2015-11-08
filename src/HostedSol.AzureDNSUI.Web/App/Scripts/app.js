'use strict';
angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        throw exception;
    };
});
angular.module('AzureDNSUI', ['AdalAngular','ui.router'])
.config(['$urlRouterProvider', '$httpProvider', '$stateProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, $stateProvider, adalProvider) {

    $routeProvider.otherwise("/Home");

    $stateProvider.state("Home", {
        url:"/Home",
        controller: "homeCtrl",
        templateUrl: "App/Views/Home.html",
    }).state("UserData", {
        url:"/UserData",
        controller: "userDataCtrl",
        templateUrl: "App/Views/UserData.html",
    }).state('DnsZone', {
           url: '/DnsZone',
           templateUrl: 'App/Views/DnsZone.html',
           controller: 'dnsZoneCtrl'
    }).state('RecordSet', {
           url: '/RecordSet/:id',
           templateUrl: 'App/Views/DnsZone-RecordSet.html',
           controller: 'recordSetCtrl'
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

