'use strict';
angular.module('todoApp')
.factory('dnsZoneSvc', ['$http', function ($http) {
    return {
        resourceGroupName: "",
        CallURL: function (){
            return 'https://management.azure.com/' + this.resourceGroupName + '/providers/Microsoft.Network';
        },
        getItems: function () {
            return $http.get(this.CallURL() + '/dnsZones?api-version=2015-05-04-preview');
        },
        getItem: function (id) {
            //https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}?api-version={api-version}
            //{
            //    "id": "/subscriptions/111111-2222-3333-444444444444/resourceGroups/myrg/Microsoft.Network/dnszones/test.com.",
            //    "location": "global",
            //    "name": "test.com",
            //   "tags": {
            //        "dept": "shopping",
            //        "env": "test"
            //    },
            //    "type": "Microsoft.Network/dnszones",
            //    "etag": "aa239a8e-cce9-4d71-bbe3-70312d4f0d5c"
            //    "properties": {
            //        "numberOfRecordSets": 4,
            //        "maxNumberOfRecordSets": 1000
            //    }
            //} 
            return $http.get('/api/TodoList/' + id);
        },
        postItem: function (item) {
            return $http.post('/api/TodoList/', item);
        },
        putItem: function (item) {
            //PUT / PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}?api-version={api-version}
            //{
            //    "location": "global",
            //    "tags": {},
            //    "properties": { }
            //}
            var posty = new Object();
            posty.location = 'global';
            posty.tags = Object();
            posty.properties = Object();
            return $http.put(this.CallURL() + '/dnsZones/' + item + '?api-version=2015-05-04-preview', posty);
        },
        deleteItem: function (id) {
            //DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}?api-version={api-version}
            return $http({
                method: 'DELETE',
                url: '/api/TodoList/' + id
            });
        }
    };
}]);