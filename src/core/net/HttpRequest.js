class HttpRequest {
    // this.url
    // params
    // data
    // xmlhttp
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
    // setUrl(url) {
    //     this.url = url;
    // }
    addParam(name, value) {
        this.params[name] = value;
    }

    async send() {
        return await new Promise((resolve, reject) => {
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
            if(this.data)
                this.xmlhttp.send(JSON.stringify(this.data));
            else
                this.xmlhttp.send();
            this.xmlhttp.onreadystatechange = ()=>{
                if (this.xmlhttp.readyState === XMLHttpRequest.DONE && this.xmlhttp.status === 200) {
                    let httpResonse = new HttpResponse(this.xmlhttp);
                    resolve(httpResonse);
                }   
            };
        });

        // return await new Promise((resolve, reject) => {
        //     let url = this.url;
        //     if (this.params.length > 0) {
        //         if(url.indexOf('?')===-1)
        //             url = url + '?';
        //         for (let elem in this.params) {
        //             url = (url + (elem + '=' + this.params[elem]) + "&&");
        //         }
        //         url = url.substring(0, url.length - 2);
        //     }

        //     this.xmlhttp.open(this.getMethod(), url, true);
        //     this.xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
        //     this.xmlhttp.setRequestHeader('Content-Type', 'application/json');
        //     this.xmlhttp.onreadystatechange = ()=>{
        //         if (this.xmlhttp.readyState === XMLHttpRequest.DONE && this.xmlhttp.status === 200) {
        //             let httpResonse = new HttpResponse(this.xmlhttp);
        //             console.log("Response",httpResonse);
        //             resolve(httpResonse);
        //         }
        //         else
        //             reject();
        //     };
              
        //     //        this.xmlhttp.onloadend = function()
        //     //        {
        //     //            var httpResonse = new HttpResponse(this_.xmlhttp);
        //     //            callback(httpResonse);
        //     //        };
        //     if(this.data)
        //         this.xmlhttp.send(JSON.stringify(this.data));
        //     else
        //         this.xmlhttp.send();
        // });
    }

    abort() {
        this.xmlhttp.abort();
        this.xmlhttp = null;
    }
}