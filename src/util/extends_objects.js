/* global CanvasRenderingContext2D, Class, REQUEST_CANCELED, Promise */

// Agregando metodos utiles String
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
String.prototype.equalsIgnoreCase = function (cad) {
    if (cad === null)
        return false;
    return ("" + this).toUpperCase() === (("" + cad).toUpperCase());
};

// *****************  PARA DEIBUJAR ROUND RECT EN EL CANVAS **********************
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r)
        r = w / 2;
    if (h < 2 * r)
        r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

// *********************** CARGADOR DE CODIGO DE JAVASCRIPT EN LINEA **************************
async function loadScriptSync(url) {
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

async function loadAllScriptsSync(urls) {
    if (Array.isArray(urls) === false)
        throw "Lista de urls vacio para [loadAllScripts]";
    for(let url of urls){
        await loadScriptSync(url);
    }
};

async function loadLayoutSync(url){
    let rootXml = await new Promise(function(resolve,reject){
        var xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp = new XMLHttpRequest();
        else
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
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