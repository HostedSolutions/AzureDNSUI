'use strict';
angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        throw exception;
    };
});
angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {

    $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/App/Views/Home.html",
    }).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/App/Views/TodoList.html",
        requireADLogin: true,
    }).when("/UserData", {
        controller: "userDataCtrl",
        templateUrl: "/App/Views/UserData.html",
    }).when("/DnsZone", {
        controller: "dnsZoneCtrl",
        templateUrl: "/App/Views/DnsZone.html",
    }).otherwise({ redirectTo: "/Home" });

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

