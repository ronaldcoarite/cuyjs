class DefaultHttpClient {
    constructor(url) {
        this.url = url;
        this.execute = function (httpRequest) {
            httpRequest.setUrl(this.url);
            return httpRequest.send();
        };
    }
}