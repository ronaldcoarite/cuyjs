class Resource{
    static async loadScriptSync(url) {
        await new Promise(function (resolve, reject) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
    
            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            //script.onreadystatechange = callback;
            function callback() {
                resolve();
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
    
    static async loadAllScriptsSync(urls) {
        if (Array.isArray(urls) === false)
            throw "Lista de urls vacio para [loadAllScripts]";
        for(let url of urls){
            await loadScriptSync(url);
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
        let image = await new Promise(function(resolve,reject){
            let image = new Image();
            image.onload = function(){
                resolve(image);
            }
            if(Resource.isBase64Resource(urlOrTextBase64)){
                image.src = `data:image/png;base64,${urlOrTextBase64}`;
            }
            else
                image.src =urlOrTextBase64;
        });
        return image;
    }

    static isBase64Resource(urlOrTextBase64){
        return /data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(urlOrTextBase64);
    }

    static isImageNinePathResource(urlOrTextBase64){
        return /\.9\.(png|gif)/i.test(urlOrTextBase64);
    }

    static isImageResource(urlOrTextBase64){
        return /.(png|gif|jpg)/i.test(urlOrTextBase64);
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
}