class Resource{
    static listThemes = new Array();

    static async loadTheme(urlTheme) {
        let rootXml = await this.loadLayoutSync(urlTheme);
        let styleObject = {};
        for (let index = 0; index < rootXml.children.length; index++){
            // <style name="PageTheme" parent="Page"></style>
            let styleChildNode = rootXml.children[index];
            let viewName = styleChildNode.getAttribute("view");
            styleObject[viewName] = {};

            for (let indexJ = 0; indexJ < styleChildNode.children.length; indexJ++){
                //<item name="textColor">#808080</item>
                let attrChildNode = styleChildNode.children[indexJ];
                let name = attrChildNode.getAttribute("name");
                let value = attrChildNode.textContent;
                if(value === "true" || value === "false")
                    styleObject[viewName][name] = value === "true";
                else
                    styleObject[viewName][name] = value;
            }
        }
        Resource.THEME = styleObject;
    }

    static getAttrOfTheme(themeName, name, value){
        if(value === undefined)
            value = null;
        let theme = Resource.THEME;
        if(theme[themeName]){
            if(theme[themeName][name]!== null && theme[themeName][name]!== undefined){
                return theme[themeName][name];
            }
            return value;
        }
        return value;
    }

    static async importJs(url) {
        return await new Promise(function (resolve, reject) {
            // Verificamos antes si el script ya fue cargado
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src && scripts[i].src.lastIndexOf(url)!==-1){
                    resolve(scripts[i]);
                    return;
                }
            }
            
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
    
            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            //script.onreadystatechange = callback;
            function callback() {
                resolve(script);
            }
    
            function callbackError(error) {
                reject(error);
            }
    
            script.onerror = callbackError;
            script.onload = callback;
            // Fire the loading
            head.appendChild(script);
        });
    };

    static async importCss(url) {
        return await new Promise(function (resolve, reject) {
            // Verificamos antes si el script ya fue cargado
            var scripts = document.getElementsByTagName("link");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].href && scripts[i].href.lastIndexOf(url) !== -1){
                    resolve(scripts[i]);
                    return;
                }
            }

            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('link');
            script.type = 'text/css';
            script.href = url;
            script.rel='stylesheet';
    
            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            //script.onreadystatechange = callback;
            function callback() {
                resolve(script);
            }
    
            function callbackError(error) {
                reject(error);
            }
    
            script.onerror = callbackError;
            script.onload = callback;
            // Fire the loading
            head.appendChild(script);
        });
    };

    static async import(url){
        if(url.lastIndexOf(".js")!==-1)
            return await this.importJs(url);
        else if(url.lastIndexOf(".css")!==-1)
            return await this.importCss(url);
        else
            throw new Error(`Tipo de archivo [${url}] no soportado. utilice unicamente .js o .css`);
    }
    
    static async importAll(urls) {
        if (Array.isArray(urls) === false)
            throw "Lista de urls vacio para [loadAllScripts]";
        for(let url of urls){
            await Resource.importJs(url);
        }
    };
    
    static async loadLayoutSync(urlXmlLayout){
        let rootXml = await new Promise(function(resolve,reject){
            var xmlhttp;
            if (window.XMLHttpRequest)
                xmlhttp = new XMLHttpRequest();
            else
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200 ||xmlhttp.status === 0) { // Habilitado para archivos en local host (||xmlhttp.status === 0)
                        resolve(xmlhttp.responseXML.documentElement);
                    } else {
                        reject(xmlhttp.statusText);
                    }
                }
            };
            xmlhttp.open("GET", urlXmlLayout, true);
            xmlhttp.send(null);
        });
        return rootXml;
    }

    static async loadImage(urlOrTextBase64){
        if(!urlOrTextBase64)
            throw "No se envió la imagen para la carga";
        if(typeof urlOrTextBase64 !== 'string')
            throw "El parámetro para cargar la imagen no es de tipo texto";
        let imageProm = await new Promise(function(resolve,reject){
            var image = new Image();
            image.onload = function(){
                resolve(image);
            }
            image.src =urlOrTextBase64;
        });
        return imageProm;
    }

    static isBase64Resource(urlOrTextBase64){
        return /data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(urlOrTextBase64);
    }

    static isImageNinePathResource(urlOrTextBase64){
        return /\.9\.(png|gif)/i.test(urlOrTextBase64);
    }

    static isImageResource(urlOrTextBase64){
        return /\.(jpe?g|png|gif|bmp|svg)$/i.test(urlOrTextBase64);
        //return /.(png|gif|jpg|svg)/i.test(urlOrTextBase64);
    }

    static isColorResource(hexColorText){
        return /^#[0-9A-F]{6}$/i.test(hexColorText);
    }

    static async waitToLoadAllResources(){
        await new Promise(function(resolve){
            let callback = function(){
                resolve();
            };

            if (window.attachEvent){
                window.attachEvent('onload', callback);
            }
            else if (window.addEventListener){
                window.addEventListener('load', callback, false);
            }
            else{
                document.addEventListener('load', callback, false);
            }
        });
    }

    static async screnshot(element, posX, posY, width, height){
        /*
        html2canvas(element, {
            onrendered: function (canvas) {
                var context = canvas.getContext('2d');
                var imageData = context.getImageData(posX, posY, width, height).data;
                var outputCanvas = document.createElement('canvas');
                var outputContext = outputCanvas.getContext('2d');
                outputCanvas.width = width;
                outputCanvas.height = height;
    
                var idata = outputContext.createImageData(width, height);
                idata.data.set(imageData);
                outputContext.putImageData(idata, 0, 0);
                callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
            },
            width: width,
            height: height,
            useCORS: true,
            taintTest: false,
            allowTaint: false
        });*/
    }
}