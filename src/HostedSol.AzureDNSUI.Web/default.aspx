<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Azure DNS UI</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="App/lib/angular-bootstrap/ui-bootstrap-csp.css">
    <link rel="stylesheet" href="App/lib/angular-treasure-overlay-spinner/dist/treasure-overlay-spinner.min.css" />
    <link rel="stylesheet" href="Content/Site.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>

        <script src="App/lib.min.js"></script>     
    <script src="App/lib/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>  
        <script src="App/scripts.min.js"></script>
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
            <div class="col-xs-10 col-xs-offset-1">
                <div ui-view>

                </div>
            </div>
        </div>

    </div>
      
</body>
</html>
