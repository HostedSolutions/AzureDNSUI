var DnsZone = (function () {
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
    function DnsZone() {
        this.id = "";
        this.location = "";
        this.name = "";
        this.tags = new Object();// TODO expand out
        this.type = "";
        this.etag = "";
        this.properties = new Object(); // TODO expand out
    }
    function DnsZone(dnsZone) {
        this = dnsZone;
    }
    return DnsZone;
})();
