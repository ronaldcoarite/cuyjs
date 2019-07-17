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
}