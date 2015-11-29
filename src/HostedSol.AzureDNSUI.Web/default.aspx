<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Todo List: a SPA sample demonstrating Azure AD and ADAL JS</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="App/lib/angular-bootstrap/ui-bootstrap-csp.css">
    <link rel="stylesheet" href="App/lib/angular-treasure-overlay-spinner/dist/treasure-overlay-spinner.min.css" />
</head>
<body ng-app="AzureDNSUI" ng-controller="homeCtrl" role="document">
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target=".navbar-collapse">

                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" ui-sref="Home">Azure DNS</a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li ng-class="{ active: isActive('/Home') }"><a ui-sref="Home">Home</a></li>
                    <li ng-class="{ active: isActive('/DnsZone') }"><a ui-sref="DnsZone" ng-show="userInfo.isAuthenticated">DNS Zones</a></li>
                    <li ng-class="{ active: isActive('/UserData') }"><a ui-sref="UserData" ng-show="userInfo.isAuthenticated">User</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a class="btn btn-link" ng-show="userInfo.isAuthenticated" ng-click="logout()">Logout</a></li>
                    <li><a class="btn btn-link" ng-hide=" userInfo.isAuthenticated" ng-click="login()">Login</a></li>
                </ul>
            </div>
        </div>
    </div>

    <br />
    <div class="container" role="main">
        <div class="row">
            <div class="col-xs-10 col-xs-offset-1" style="background-color:azure">
                <div class="page-header">
                    <h3>Azure DNS UI Zone Editor</h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
                <div ui-view>

                </div>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        
        <script src="App/lib/angular/angular.min.js"></script>
        
        <script src="App/Scripts/app.js"></script>

        <script src="App/Scripts/lib/adal.js"></script>
        <script src="App/Scripts/lib/adal-angular.js"></script>
        <script src="App/lib/angular-ui-router/release/angular-ui-router.js"></script>
        <script src="App/lib/angular-ui-router-tabs/src/ui-router-tabs.js"></script>
        <script src="App/lib/angular-bootstrap/ui-bootstrap.min.js"></script>
        <script src="App/lib/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="App/lib/angular-treasure-overlay-spinner/dist/treasure-overlay-spinner.min.js"></script>
        <script src="App/lib/angular-animate/angular-animate.min.js"></script>
        
        
        <script src="App/Scripts/ctrl/homeCtrl.js"></script>
        <script src="App/Scripts/ctrl/userDataCtrl.js"></script>
        <script src="App/Scripts/fac/subscriptionsSvc.js"></script>
        <script src="App/Scripts/ctrl/dnsZoneCtrl.js"></script>
        <script src="App/Scripts/ctrl/recordSetCtrl.js"></script>
        <script src="App/Scripts/fac/recordSetSvc.js"></script>
        <script src="App/Scripts/fac/dnsZoneSvc.js"></script>
        <script src="App/Scripts/fac/resourceGroupSvc.js"></script>
        
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/aRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/aaaaRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/cnameRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/nsRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/srvRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/txtRecordsCtrl.js"></script>
        <script src="App/Scripts/ctrl/DnsZone-RecordSet/mxRecordsCtrl.js"></script>
        

</body>
</html>
