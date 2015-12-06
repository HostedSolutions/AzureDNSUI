'use strict';
angular.module('AzureDNSUI')
.factory('recordSetSvc', ['$http', function ($http) {
    return {
        recordSet: "",
        CallURL: function (){
            return 'https://management.azure.com' + this.recordSet;
        },
        getItems: function (recordType) {
            /*
            Query a specific record type
            GET
            https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/{recordType}?api-version={api-version}
                Query all records
            GET
            https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/recordsets?api-version={api-version}

            {
    "value": [
        {
            "id": "/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myrg/providers/Microsoft.Network/dnszones/test.com./SOA/@",
            "location": "global",
            "name": "@",
            "type": "Microsoft.Network/dnszones",
            "etag": "12c40389-4877-4f3d-9dea-2221a57cdc05"
            "properties": {
                "SOARecord": {
                    "email": "dnshst.microsoft.com",
                    "expireTime": 604800,
                    "host": "ns1-01.azure-dns.com",
                    "minimumTTL": 300,
                    "refreshTime": 900,
                    "retryTime": 300
                },
                "TTL": 3600,
            }
        },
        {
            "id": "/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myrg/providers/Microsoft.Network/dnszones/test.com./NS/@",
            "location": "global",
            "name": "@",
            "type": "Microsoft.Network/dnszones",
            "etag": "bf20c5d9-16a3-4a9b-9fde-f559449639ee"
            "properties": {
                "NSRecords": [
                    {
                        "nsdname": "ns1-01.azure-dns.com"
                    },
                    {
                        "nsdname": "ns2-01.azure-dns.com"
                    },
                    {
                        "nsdname": "ns3-01.azure-dns.com"
                    },
                    {
                        "nsdname": "ns4-01.azure-dns.com"
                    }
                ],
                "TTL": 3600,
            }
        },
       {
            "id": "/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myrg/providers/Microsoft.Network/dnszones/test.com./AAAA/www",
            "location": "global",
            "name": "www",
            "tags": {},
            "type": "Microsoft.Network/dnszones/AAAA",
            "etag": "f8d9aa7b-b075-4753-ae60-ac3097564c7b"
            "properties": {
                "AAAARecords": [
                    {
                        "ipv6Address": "1:1:1:1::1"
                    },
                    {
                        "ipv6Address": "1:1:1:1::2"
                    }
                ],
                "TTL": 3600,
            }
        }
    ]
}
            */
            if (recordType != null) {
                return $http.get(this.CallURL() + '/' + recordType + '?api-version=2015-05-04-preview');
            }
            else {
                return $http.get(this.CallURL() + '/recordsets?api-version=2015-05-04-preview');
            }
        },
        getItem: function (recordType, recordSetName) {
            //GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/{recordType}/{recordSetName}?api-version={api-version}
            //{
            //    "id": "/subscriptions/6bb4a28a-db84-4e8a-b1dc-fabf7bd9f0b2/resourceGroups/EdgeMonitoring2/providers/Microsoft.Network/dnszones/edgemonitoring2.com./A/www",
            //    "location": "global",
            //    "name": "www",
            //    "tags": {},
            //    "type": "Microsoft.Network/dnszones/A",
            //    "etag": "5b83020b-b59c-44be-8f19-a052ebe80fe7"
            //    "properties": {
            //        "TTL": 3600,
            //        "ARecords": [
            //            {
            //                "ipv4Address": "4.3.2.1"
            //            },
            //            {
            //                "ipv4Address": "5.3.2.1"
            //            }
            //        ]
            //    }
            //}
            //return $http.get('/'recordType}/{recordSetName}' + id + '?api-version=2015-05-04-preview');
        },
        ///////////////////////////////////////////////////////////////A
        //{
        //    "location": "global",
        //    "tags": {},
        //    "properties": {
        //        "TTL": 300,
        //        "ARecords": [
        //            {
        //                "ipv4Address": "1.2.3.4"
        //            },
        //            {
        //                "ipv4Address": "1.2.3.5"
        //            }
        //        ]
        //    }
        //}
        addA: function (hostName)
        {
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.ARecords = new Object();
            return $http.put(this.CallURL() + '/A/' + hostName + '?api-version=2015-05-04-preview', o);
        },
        updateA: function (aRecords) {
            
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.ARecords = aRecords;
            
            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        deleteA: function () {
            return $http.delete(this.CallURL() + '?api-version=2015-05-04-preview');
        },
        /*
NS
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "NSRecords": [
        {
           "nsdname": "ns1.contoso.com"
        },
        {
           "nsdname": "ns2.contoso.com"
        }
    ]
 }
}
        */
     
        updateNS: function (nsdname) {

            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.NSRecords = nsdname;

            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        deleteNS: function () {
            return $http.delete(this.CallURL() + '?api-version=2015-05-04-preview');
        },
        /*
        
SOA
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "SOARecord": {
        "email": "dnshst.microsoft.com",
        "expireTime": 604800,
        "host": "ns1-01.azure-dns.com",
        "minimumTTL": 300,
        "refreshTime": 900,
        "retryTime": 300
    }
 }
}

AAAA
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "AAAARecords": [
        {
           "ipv6Address": "2607:f8b0:4009:1803::1005"
        },
        {
           "ipv6Address": "2607:f8b0:4009:1803::1006"
        }
    ]
 }
}
*/

        deleteAAAA: function () {
            return $http.delete(this.CallURL() + '?api-version=2015-05-04-preview');
        },
        addAAAA: function (hostName) {
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.AAAARecords = new Object();
            return $http.put(this.CallURL() + '/AAAA/' + hostName + '?api-version=2015-05-04-preview', o);
        },
        updateAAAA: function (aaaaRecords) {

            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.AAAARecords = aaaaRecords;

            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        /*
CNAME
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "CNAMERecord": {
        "cname": "contoso.com"
    }
 }
}
*/

        addCNAME: function (hostName, cnameRecord) {
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.CNAMERecord = cnameRecord;
            return $http.put(this.CallURL() + '/CNAME/' + hostName + '?api-version=2015-05-04-preview', o);
        },
        updateCNAME: function (cnameRecord) {

            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.CNAMERecord = cnameRecord;

            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        deleteCNAME: function (hostName) {
            return $http.delete(this.CallURL() + '/CNAME/' + hostName + '?api-version=2015-05-04-preview');
        },
        /*
        
TXT
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "TXTRecords": [
        {
           "value": "The quick brown fox jumps over the lazy dog.”
        },
        {
           "value": "One two three four five.”
        }
    ]
 }
}
        */
        addTXT: function (hostName, txtRecord) {
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.TXTRecords = Array();
            o.properties.TXTRecords[0] = txtRecord;
            return $http.put(this.CallURL() + '/TXT/' + hostName + '?api-version=2015-05-04-preview', o);
        },
        updateTXT: function (txtRecord) {

            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.TXTRecords = Array();
            o.properties.TXTRecords[0] = txtRecord;

            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        deleteTXT: function (hostName) {
            return $http.delete(this.CallURL() + '/TXT/' + hostName + '?api-version=2015-05-04-preview');
        },
        /*
MX
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "MXRecords": [
        {
           "preference": "10",
           "exchange": "mail1.contoso.com"
        },
        {
           "preference": "20",
           "exchange": "mail2.contoso.com"
        }
    ]
 }
}
*/

        deleteMX: function () {
            return $http.delete(this.CallURL() + '?api-version=2015-05-04-preview');
        },
        addMX: function (hostName) {
            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.MXRecords = new Object();
            return $http.put(this.CallURL() + '/MX/' + hostName + '?api-version=2015-05-04-preview', o);
        },
        updateMX: function (mxRecords) {

            var o = new Object();
            o.location = 'global';
            o.tags = new Object();
            o.properties = new Object();
            o.properties.TTL = 300;
            o.properties.MXRecords = mxRecords;

            return $http.put(this.CallURL() + '?api-version=2015-05-04-preview', o);
        },
        /*
SRV
{
 "location": "global",
 "tags": {},
 "properties": {
    "TTL": 300,
    "SRVRecords": [
        {
           "priority": 1,
           "weight": 5,
           "port": 8080,
           "target": "target1.contoso.com"
        },
        {
           "priority": 2,
           "weight": 25,
           "port": 8080,
           "target": "target2.contoso.com"
        }
    ]
 }
}


Note: The ‘Service’ and ‘Protocol’ should be specified as part of the record name, including leading underscores
https://msdn.microsoft.com/en-us/library/azure/mt130640.aspx
*/
    };
}]);