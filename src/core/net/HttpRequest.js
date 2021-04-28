class HttpRequest {
    // this.url
    // params
    // data
    // xmlhttp
    constructor(url) {
        this.url = url;
        this.params = new Array();
        this.headers = new Array();
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

    addParam(name, value) {
        this.params[name] = value;
    }

    addHeader(name, value) {
        this.headers[name] = value;
    }

    async execute(){
        return await this.send();
    }

    async send() {
        let filter = await AjaxFilters.verifUrl(this);
        let httpResponse = await new Promise((resolve, reject) => {
            let url = this.url;
            if (this.params.length > 0) {
                if(url.indexOf('?')===-1)
                    url = url + '?';
                for (let elem in this.params) {
                    url = (url + (elem + '=' + this.params[elem]) + "&&");
                }
                url = url.substring(0, url.length - 2);
            }
            this.xmlhttp.open(this.getMethod(), url, true);
            this.xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            this.xmlhttp.setRequestHeader('Content-Type', 'application/json');
            for(let elem in this.headers)
                this.xmlhttp.setRequestHeader(elem, this.headers[elem]);
            if(this.data)
                this.xmlhttp.send(JSON.stringify(this.data));
            else
                this.xmlhttp.send();
            this.xmlhttp.onreadystatechange = ()=>{
                let httpResponse = new HttpResponse(this.xmlhttp);
                if (this.xmlhttp.readyState === XMLHttpRequest.DONE){
                    if(this.xmlhttp.status === 200 || this.xmlhttp.status === 204 ){
                        resolve(httpResponse);
                    }
                }
            };
        });
        if(filter)
            await filter.onPostExecute(httpResponse);
        return httpResponse;
    }

    abort() {
        this.xmlhttp.abort();
        this.xmlhttp = null;
    }
}