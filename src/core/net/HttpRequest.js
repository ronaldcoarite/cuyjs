class HttpRequest {
    url
    params
    condition
    data
    xmlhttp
    constructor(url) {
        this.url = url;
        this.params = new Array();
        if (window.XMLHttpRequest)
            this.xmlhttp = new XMLHttpRequest();
        else
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    setEntity(d) {
        this.data = d;
    }

    getMethod() {
        return null;
    }
    setUrl(url) {
        this.url = url;
    }
    addParam(name, value) {
        this.params[name] = value;
    }
    setCondition(condition) {
        this.condition = condition;
    }
    async sendSync() {
        let this_ = this;
        let result = await new Promise((resolve, reject) => {
            var url = this.url;
            if (this.condition !== null)
                url = url + '?' + this.condition;
            else {
                if (this.params.length > 0) {
                    url = url + '?';
                    for (var elem in this.params) {
                        url = (url + (elem + '=' + this.params[elem]) + "&&");
                    }
                    url = url.substring(0, url.length - 2);
                }
            }
            console.log("METODO", this.getMethod());
            console.log("URL", url);

            this.xmlhttp.open(this.getMethod(), url, true);
            this.xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            this.xmlhttp.setRequestHeader('Content-Type', 'application/json');

            var this_ = this;
            this.xmlhttp.onreadystatechange = function () {
                if (this_.xmlhttp.readyState === XMLHttpRequest.DONE && this_.xmlhttp.status === 200) {
                    var httpResonse = new HttpResponse(this_.xmlhttp);
                    resolve(httpResonse);
                }
                //            else
                //                error(this_.xmlhttp);
            };
            //        this.xmlhttp.onloadend = function()
            //        {
            //            var httpResonse = new HttpResponse(this_.xmlhttp);
            //            callback(httpResonse);
            //        };
            this.xmlhttp.send('' + JSON.stringify(this.data));
        });
        return result;
    }
    abort() {
        this.xmlhttp.abort();
    }
}