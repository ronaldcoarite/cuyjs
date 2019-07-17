class HttpResponse {
    constructor(xmlhttp) {
        this.xmlhttp = xmlhttp;
        this.showProgress = false;
        this.message = null;
        this.getJson = function () {
            return JSON.parse(xmlhttp.responseText);
            // JSON.stringify(arr);
        };
        this.getRootElementXml = function () {
            return this.xmlhttp.responseXML.documentElement;
        };
        this.getText = function () {
            return this.xmlhttp.responseText;
        };
        this.getImage = function () {
        };
    }
}