class HttpResponse {
    constructor(xmlhttp) {
        this.xmlhttp = xmlhttp;
    }

    getJson() {
        return JSON.parse(this.xmlhttp.responseText);
    }

    getRootElementXml() {
        return this.xmlhttp.responseXML.documentElement;
    }

    getText() {
        return this.xmlhttp.responseText;
    }
}