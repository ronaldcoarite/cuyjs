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
        this.blockDomElem=null;
    }

    blockTo(view){
        if(view instanceof View){
            this.blockDomElem = view.elemDom;
        }else if(view instanceof Dialog){
            this.blockDomElem = view.viewRoot.elemDom;
        }else if(view instanceof Page){
            this.blockDomElem = view.viewRoot.elemDom;
        }else
            throw new Exception(`Se enviar uno de los siguiente parámetros [view,Dialog o Page]. Y se envio [${view}]`);            
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
        let bgView = null;
        if(this.blockDomElem){
            let rectView = this.blockDomElem.getBoundingClientRect();
            // Creando fondo de vista
            this.blockDomElem.style.filter = "blur(5px)";

            bgView = document.createElement('div');
            bgView.style.marginTop = '0px';
            bgView.style.marginLeft = '0px';
            bgView.style.marginBottom = '0px';
            bgView.marginRight = '0px';
            // Padding por defecto
            bgView.style.paddingTop = '0px';
            bgView.style.paddingLeft = '0px';
            bgView.style.paddingBottom = '0px';
            bgView.style.paddingRight = '0px';
            bgView.style.position = "absolute";
            bgView.style.width = this.blockDomElem.clientWidth+'px';
            bgView.style.height = this.blockDomElem.clientHeight+'px';
            bgView.style.filter = "blur(3px)";
            bgView.style.backgroundColor = "rgba(30, 30, 30, 0.7)";

            bgView.onclick=async ()=>{
                return false;
            };
            bgView.onmouseenter=async ()=>{
                return false;
            };

            // Agregando el spinner
            let MAX = 150;
            let maxSize = Math.min(this.blockDomElem.clientHeight,MAX);

            let animation = new SpinnerAnimation({
                left: this.blockDomElem.clientWidth/2-maxSize/2,
                top: 0,
                size: maxSize, 
                showBackground: false,
                backgroundRotation: false,
                parentElement: bgView
            });
            bgView.style.left = (rectView.left) + 'px';
            bgView.style.top = (rectView.top) + 'px';
            document.body.appendChild(bgView);
            animation.show();
        }
        let resutl =await this.send();
        if(this.blockDomElem){
            this.blockDomElem.style.filter = "none";
            bgView.remove();
        }
        return resutl;
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