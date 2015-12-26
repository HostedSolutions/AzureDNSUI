'use strict';
angular.module('AzureDNSUI')
.factory('resourceGroupSvc', ['$http', function ($http) {
    return {
        //GET https://management.azure.com/subscriptions/{subscription-id}/resourcegroups?api-version={api-version}&$top={top}$skiptoken={skiptoken}&$filter={filter}
        /*
        {
  "value": [ {
    "id": "/subscriptions/########-####-####-####-############/resourceGroups/myresourcegroup1",
    "name": "myresourcegroup1",
    "location": "westus",
    "tags": {
      "tagname1": "tagvalue1"
    },
    "properties": {
      "provisioningState": "Succeeded"
    }
  } ],
  "nextLink": "https://management.azure.com/subscriptions/########-####-####-####-############/resourcegroups?api-version=2015-01-01&$skiptoken=######"
}
*/
        subscriptionId: "",
        CallURL: function () {
           return 'https://management.azure.com/' + this.subscriptionId + '/';
        },
        getItems: function () {
            var url = this.CallURL();
            return $http.get(url + 'resourcegroups?api-version=2014-04-01-preview');
        }
    };
}]);