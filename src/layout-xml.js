/* global CanvasRenderingContext2D, Class, REQUEST_CANCELED, Promise */

// Agregando metodos utiles String
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.equalsIgnoreCase=function(cad)
{
    if(cad===null)
        return false;
    return (""+this).toUpperCase()===((""+cad).toUpperCase());
};

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
};
//ctx.roundRect(35, 10, 225, 110, 20).stroke(); //or .fill() for a filled rect

function initEventDevice() {
    document.addEventListener("deviceready", onDR, false);
    document.addEventListener("keydown",function(event)
    {
        if (event.keyCode === 27) {
            event.preventDefault();
            backKeyDown();
        }
    }, false);
    
    window.onerror = function (errorMsg, url, lineNumber) {
        console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
        return true;
    };
} 


function onDR(){
    document.addEventListener("backbutton", backKeyDown, true);
}

function backKeyDown() {
    alert("aaaaaaa");
}
// *****************  PARA DEIBUJAR ROUND RECT EN EL CANVAS **********************
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r){
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
async function loadScriptSync(url){
    var result= await new Promise(function(resolve,reject){
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        function callback(){
            resolve();
        }
        
        function callbackError(error){
            reject(error);
        }
        
        script.onerror = callbackError;
        script.onload = callback;
        // Fire the loading
        head.appendChild(script);
    });
    
    return result;
};

async function loadAllScriptsSync(urls){
    if(Array.isArray(urls)===false)
        throw "Lista de urls vacio";
    return await Promise.all(urls.map(x=>loadScript(x)));
};

// *********************** COMENSANDO NINE PATH ************************

// Verifica si se tiene una image con nine path.
function NinePatchGetStyle(element, style){
    if (window.getComputedStyle){
        var computedStyle = window.getComputedStyle(element, "");
        if (computedStyle === null)
            return "";
        return computedStyle.getPropertyValue(style);
    }
    else if (element.currentStyle){
        return element.currentStyle[style];
    }
    else{
        return "";
    }
}

// Cross browser function to find valid property
function NinePatchGetSupportedProp(propArray){
    var root = document.documentElement; //reference root element of document
    for (var i = 0; i < propArray.length; i++){
        // loop through possible properties
        if (typeof root.style[propArray[i]] === "string"){
            //if the property value is a string (versus undefined)
            return propArray[i]; // return that string
        }
    }
    return false;
}

/**
 * 9patch constructer. Sets up cached data and runs initial draw.
 * @param {Dom Element} div El Elemento dom en donde se pinta el ninepath.
 * @param {function} callback La funcion que se llamara cuando se termina.
 * la carga de la imagen y el pintado del elemento div.
 * @returns {NinePatch} Un objeto nine path
 */
function NinePatch(div,callback){
    this.div = div;
    this.callback =callback;
    this.padding = {top:0,left:0,right:0,bottom:0};
    // Load 9patch from background-image
    this.bgImage = new Image();
    this.bgImage.src = NinePatchGetStyle(this.div, 'background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
    var este = this;
    
    this.bgImage.onload = function(){
        este.originalBgColor = NinePatchGetStyle(este.div, 'background-color');
        este.div.style.background = 'none';

        // Create a temporary canvas to get the 9Patch index data.
        var tempCtx, tempCanvas;
        tempCanvas = document.createElement('canvas');
        tempCanvas.width  = este.bgImage.width;
        tempCanvas.height = este.bgImage.height;
        tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(este.bgImage, 0, 0);

        // Obteniendo el padding lateral derecho
        var dataPad = tempCtx.getImageData(este.bgImage.width-1,0,1,este.bgImage.height).data;
        var padRight = este.getPadBorder(dataPad,este.bgImage.width,este.bgImage.height);
        este.padding.top = padRight.top;
        este.padding.bottom = padRight.bottom;
        dataPad = tempCtx.getImageData(0,este.bgImage.height-1,este.bgImage.width,1).data;
        var padBottom = este.getPadBorder(dataPad,este.bgImage.width,este.bgImage.height);

        este.padding.left = padBottom.top;
        este.padding.right = padBottom.bottom;

        // Loop over each  horizontal pixel and get piece
        var data = tempCtx.getImageData(0, 0, este.bgImage.width, 1).data;

        // Use the upper-left corner to get staticColor, use the upper-right corner
        // to get the repeatColor.
        var tempLength = data.length - 4;
        var staticColor = data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3];
        var repeatColor = data[tempLength] + ',' + data[tempLength + 1] + ',' +
                data[tempLength + 2] + ',' + data[tempLength + 3];

        este.horizontalPieces = este.getPieces(data, staticColor, repeatColor);

        // Loop over each  horizontal pixel and get piece
        data = tempCtx.getImageData(0, 0, 1, este.bgImage.height).data;
        este.verticalPieces = este.getPieces(data, staticColor, repeatColor);

        // use this.horizontalPieces and this.verticalPieces to generate image
        este.draw();
//        este.div.onresize = function()
//        {
//            console.log("Pintandoooooooooooooooooo");
//            este.draw();
//        };
        if(callback !== undefined)
        {
            if (typeof(callback) === "function")
                callback();
        }
    };
}

// Stores the HTMLDivElement that's using the 9patch image
NinePatch.prototype.div = null;
// Padding
NinePatch.prototype.padding = null;
// Get padding
NinePatch.prototype.callback = null;
// Stores the original background css color to use later
NinePatch.prototype.originalBG = null;
// Stores the pieces used to generate the horizontal layout
NinePatch.prototype.horizontalPieces = null;
// Stores the pieces used to generate the vertical layout
NinePatch.prototype.verticalPieces = null;
// Stores the 9patch image
NinePatch.prototype.bgImage = null;

// Gets the horizontal|vertical pieces based on image data
NinePatch.prototype.getPieces = function(data, staticColor, repeatColor){
    var tempDS, tempPosition, tempWidth, tempColor, tempType;
    var tempArray = new Array();

    tempColor = data[4] + ',' + data[5] + ',' + data[6] + ',' + data[7];
    tempDS = (tempColor === staticColor ? 's' : (tempColor === repeatColor ? 'r' : 'd'));
    tempPosition = 1;

    for (var i = 4, n = data.length - 4; i < n; i += 4){
        tempColor = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
        tempType = (tempColor === staticColor ? 's' : (tempColor === repeatColor ? 'r' : 'd'));
        if (tempDS !== tempType)
        {
            // box changed colors
            tempWidth = (i / 4) - tempPosition;
            tempArray.push(new Array(tempDS, tempPosition, tempWidth));

            tempDS = tempType;
            tempPosition = i / 4;
            tempWidth = 1;
        }
    }

    // push end
    tempWidth = (i / 4) - tempPosition;
    tempArray.push(new Array(tempDS, tempPosition, tempWidth));
    return tempArray;
};

NinePatch.prototype.getPadBorder = function(dataPad,width,height){
    var staticRight = dataPad[0] + ',' + dataPad[1] + ',' + dataPad[2] + ',' + dataPad[3];
    var pad={top:0,bottom:0};

    // Padding para la parte superior
    for (var i=0;i<dataPad.length;i+=4){
        var tempColor = dataPad[i] + ',' + dataPad[i + 1] + ',' + dataPad[i + 2] + ',' + dataPad[i + 3];
        if(tempColor !==staticRight)
            break;
        pad.top++;
    }
    // padding inferior
    for (var i=dataPad.length-4;i>=0;i-=4){
        var tempColor = dataPad[i] + ',' + dataPad[i + 1] + ',' + dataPad[i + 2] + ',' + dataPad[i + 3];
        if(tempColor !==staticRight)
            break;
        pad.bottom++;
    }
    return pad;
};

// Function to draw the background for the given element size.
NinePatch.prototype.draw = function(){
    var dCtx, dCanvas, dWidth, dHeight;
    
    if(this.horizontalPieces === null)
        return;
    
    dWidth = this.div.clientWidth;
    dHeight = this.div.clientHeight;
    
    if(dWidth === 0 || dHeight===0)
        return;

    dCanvas = document.createElement('canvas');
    dCtx = dCanvas.getContext('2d');

    dCanvas.width = dWidth;
    dCanvas.height = dHeight;

    var fillWidth, fillHeight;
    // Determine the width for the static and dynamic pieces
    var tempStaticWidth = 0;
    var tempDynamicCount = 0;

    for (var i = 0, n = this.horizontalPieces.length; i < n; i++)
    {
        if (this.horizontalPieces[i][0] === 's')
            tempStaticWidth += this.horizontalPieces[i][2];
        else
            tempDynamicCount++;
    }

    fillWidth = (dWidth - tempStaticWidth) / tempDynamicCount;

    // Determine the height for the static and dynamic pieces
    var tempStaticHeight = 0;
    tempDynamicCount = 0;
    for (var i = 0, n = this.verticalPieces.length; i < n; i++)
    {
        if (this.verticalPieces[i][0] === 's')
            tempStaticHeight += this.verticalPieces[i][2];
        else
            tempDynamicCount++;
    }

    fillHeight = (dHeight - tempStaticHeight) / tempDynamicCount;

    // Loop through each of the vertical/horizontal pieces and draw on
    // the canvas
    for (var i = 0, m = this.verticalPieces.length; i < m; i++)
    {
        for (var j = 0, n = this.horizontalPieces.length; j < n; j++)
        {
            var tempFillWidth, tempFillHeight;

            tempFillWidth = (this.horizontalPieces[j][0] === 'd') ?
                    fillWidth : this.horizontalPieces[j][2];
            tempFillHeight = (this.verticalPieces[i][0] === 'd') ?
                    fillHeight : this.verticalPieces[i][2];

            // Stretching :
            if (this.verticalPieces[i][0] !== 'r')
            {
                // Stretching is the same function for the static squares
                // the only difference is the widths/heights are the same.
                if(tempFillWidth>=0&&tempFillHeight>=0)
                {
                    dCtx.drawImage(
                            this.bgImage,
                            this.horizontalPieces[j][1], this.verticalPieces[i][1],
                            this.horizontalPieces[j][2], this.verticalPieces[i][2],
                            0, 0,
                            tempFillWidth, tempFillHeight);
                }
                else
                    break;
            }
            else
            {
                var tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.horizontalPieces[j][2];
                tempCanvas.height = this.verticalPieces[i][2];

                var tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(
                        this.bgImage,
                        this.horizontalPieces[j][1], this.verticalPieces[i][1],
                        this.horizontalPieces[j][2], this.verticalPieces[i][2],
                        0, 0,
                        this.horizontalPieces[j][2], this.verticalPieces[i][2]);

                var tempPattern = dCtx.createPattern(tempCanvas, 'repeat');
                dCtx.fillStyle = tempPattern;
                dCtx.fillRect(
                        0, 0,
                        tempFillWidth, tempFillHeight);
            }

            // Shift to next x position
            dCtx.translate(tempFillWidth, 0);
        }

        // shift back to 0 x and down to the next line
        dCtx.translate(-dWidth, (this.verticalPieces[i][0] === 's' ? this.verticalPieces[i][2] : fillHeight));
    }

    // store the canvas as the div's background
    var url = dCanvas.toDataURL("image/png");
    var tempIMG = new Image();

    var _this = this;
    tempIMG.onload = function(event)
    {
        _this.div.style.background = _this.originalBgColor + " url(" + url + ") no-repeat";
    };
    tempIMG.src = url;
};
// *********************** FINALIZANDO NINE PATH ************************

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function()
{
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){
      this.constructor = null;
//      this.parent = this;
  };

  // Create a new Class that inherits from this class
  Class.forName = function(classStringName,param){
      let vpul = eval("new "+classStringName+"(param);");
      return vpul;
  };
  
  Class.extend = function(prop){
//    Page = Class.extend({});
    
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop)
    {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] === "function" &&
        typeof _super[name] === "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]):prop[name];
    }
    
//    prototype["parent"] = this;

    // The dummy class constructor
    function Class(){
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
//        prototype.PAGE={
//          this_= this
//        };

//        console.log("GGGG",Object.keys(this.prototype)[0]);
//      console.log("aaaaa",arguments.callee);
//        console.log("INSTANCIA",window['Class']());
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
    // And make this class extendable
    Class.extend = arguments.callee;
//    console.log("INSTANCIA",Class["extend"]());
//    console.log("NOMBRESSSS",arguments.callee);
//    console.log("NOMBRE",Object.keys({prop})[0]);
    return Class;
  };
})();
//*********** FIN DE LA FUNCION DE HERENCIA DE JQUERY ***********

Exception = function (messajeException){
    this.message= messajeException;
    this.toString=function()
    {
        return this.message;
    };
};

var ADLayoutUtils = {
    onLoadPage:function(callback)
    {
        if (window.attachEvent)
        {
            window.attachEvent('onload', callback);
        }
        else if (window.addEventListener)
        {
            window.addEventListener('load', callback, false);
        }
        else
        {
            document.addEventListener('load', callback, false);
        }
    }
};

var LayoutInflater ={
    // Atributos generales para los layouts
    ATTR_LAYOUT_WIDTH : "layout_width",
    ATTR_LAYOUT_HEIGHT : "layout_height",
    ATTR_ID : "id",
    ATTR_LAYOUT_GRAVITY : "layout_gravity",
    
    ATTR_LAYOUT_MARGIN : "layout_margin",
    ATTR_LAYOUT_MARGIN_TOP : "layout_marginTop",
    ATTR_LAYOUT_MARGIN_LEFT : "layout_marginLeft",
    ATTR_LAYOUT_MARGIN_RIGHT : "layout_marginRight",
    ATTR_LAYOUT_MARGIN_BOTTOM : "layout_marginBottom",
    
    ATTR_PADDING : "padding",
    ATTR_PADDING_TOP : "paddingTop",
    ATTR_PADDING_LEFT : "paddingLeft",
    ATTR_PADDING_RIGHT : "paddingRight",
    ATTR_PADDING_BOTTOM : "paddingBottom",
    
    ATTR_ON_CLICK : "onClick",
    ATTR_BACKGROUND : "background",
    ATTR_ORIENTATION : "orientation",
    ATTR_LAYOUT_WEIGHT:"layout_weight",
    
    // Atributos de RelativeLayout
    ATTR_LAYOUT_ALIGNPARENTLEFT:"layout_alignParentLeft",// true,false
    ATTR_LAYOUT_ALIGNPARENTTOP:"layout_alignParentTop",//true,false
    ATTR_LAYOUT_ALIGNPARENTRIGHT:"layout_alignParentRight",//true,false
    ATTR_LAYOUT_ALIGNPARENTBOTTOM:"layout_alignParentBottom",//true,false

    ATTR_LAYOUT_CENTERHORIZONTAL:"layout_centerHorizontal",//true,false
    ATTR_LAYOUT_CENTERVERTICAL:"layout_centerVertical",//true,false
    ATTR_LAYOUT_CENTERINPARENT:"layout_centerInParent",//true,false

    ATTR_LAYOUT_ABOVE:"layout_above",//id
    ATTR_LAYOUT_BELOW:"layout_below",//id

    ATTR_LAYOUT_TORIGHTOF:"layout_toRightOf",//id
    ATTR_LAYOUT_TOLEFTOF:"layout_toLeftOf",//id

    ATTR_MIN_WIDTH:"minWidth",
    ATTR_MIN_HEIGHT:"minHeight",
    
    // TextView
    ATTR_LAYOUT_TEXT : "text",
    ATTR_DRAWABLE_LEFT:"drawableLeft",
    ATTR_DRAWABLE_TOP:"drawableTop",
    ATTR_DRAWABLE_BOTTOM:"drawableBottom",
    ATTR_DRAWABLE_RIGHT:"drawableRight",

    // ImageVIew
    ATTR_SRC : "src",
    ATTR_SCALE_TYPE : "scaleType",
    FIT_XY : "fitXY",
    FIT_START : "fitStart",
    FIT_CENTER : "fitCenter",
    //CENTER : "center"

    // LinearLayout
    HORIZONTAL : "horizontal",
    VERTICAL : "vertical",
    
    // vista
    ATTR_VISIBILITY:"visibility",

    // Valores que pueden tomar los atributos
    MATCH_PARENT : "match_parent",
    WRAP_CONTENT : "wrap_content",
    LEFT : "left",
    RIGHT : "right",
    BOTTOM : "bottom",
    CENTER_HORIZONTAL : "center_horizontal",
    CENTER_VERTICAL : "center_vertical",
    CENTER : "center",
    TOP : "top",
    
    VISIBLE : "visible",
    INVISIBLE : "invisible",
    GONE : "gone",
    
    parse:function(context,firstElement){
        var view = null;
        try
        {
            var view = eval("new " + firstElement.tagName + "(context)");
        }
        catch (o)
        {
            console.log(o);
            throw new Exception("No existe la vista ["+firstElement.tagName+"]");
        }
        view.parse(firstElement);
        return view;
    },
    createView:function(context,domXmlElement){
        return this.parse(context,domXmlElement);
    },
    inflateFromURL:function(context,urlXmlLayout,params,contextPath){
        var este = this;
        return new Promise(function(resolve,reject){
            var xmlhttp;
            if (window.XMLHttpRequest)
                xmlhttp = new XMLHttpRequest();
            else
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            // Iteramos todo el xml para ver si tiene atributos con la estructura {{atributo}}
            // para remplazarlos con ese valor
            var variablePatern = /{{\w+(?:\}\})/;
            var remplazarValores = function(nodeXml){
                for (var j in nodeXml.attributes)
                {
                    var attr = nodeXml.attributes[j];
                    if(typeof attr === "object")
                    {
                        if(variablePatern.test(attr.value))
                        {
                            var varName = attr.value.replace("{{","");
                            var varName = varName.replace("}}","");
                            if(params[varName])
                                attr.value = params[varName];
                        }
                    }
                }
                if(nodeXml.children.length === 0)
                    return;
                for (var index=0;index<nodeXml.children.length;index++)
                    remplazarValores(nodeXml.children[index]);
            };

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState === 4){
                    if(xmlhttp.status === 200){
                        if(params)
                            remplazarValores(xmlhttp.responseXML.documentElement);

                        var view = este.parse(context,xmlhttp.responseXML.documentElement);
                        resolve(view);
                        este= null;
                    }else{
                        reject(xmlhttp.statusText);
                    }
                }
            };
            xmlhttp.open("GET",urlXmlLayout,true);
            xmlhttp.send(null);
        });
    },
    inflateFromID:function(idElementRoot){
        // Buscamos el elemento
        var element = document.getElementsByTagName(idElementRoot);
        if(element.length===0)
            throw new Exception("No exisite la vista con el id ["+idElementRoot+"]");
        return this.parse(element);
    }
};

View = Class.extend({
    parentView:null,
    elemDom:null,
    buided:false,
    margin:null,
    padding:null,
    ninePatch:null,
    context:null,
    visibility:LayoutInflater.VISIBLE,
    width:LayoutInflater.WRAP_CONTENT,
    height:LayoutInflater.WRAP_CONTENT,
    id:-1,
    layoutGravity:(LayoutInflater.LEFT+'|'+LayoutInflater.TOP),
    background:null,
    onClick:null,
    addedInParent:false,
    maxWidth:0,
    tooltip:null,
    maxHeigth:0,
    name:null,
    minWidth:0,
    minHeigth:0,
    
    GONE:"GONE",
    INVISIBLE:"INVISIBLE",
    VISIBLE:"VISIBLE",
    
    setVisibility:function(v){
        this.visibility = v;
        switch (this.visibility){
            case View.INVISIBLE:
                this.elemDom.style.visibility = 'hidden';
                break;
            case View.GONE:
                this.elemDom.style.visibility = 'hidden';
                break;
            default:
                this.elemDom.style.visibility = 'block';
                break;
        }
    },
    setToolTip: function(text){
        if(this.elemDom)
            this.elemDom.setAttribute("title",text);
        this.tooltip=text;
    },
    setMinWidth:function(w){
        this.minWidth = w;
    },
    getContext:function(){
        return this.context;
    },
    setMinHeight:function(h){
        this.minHeigth = h;
    },
    invalidate:function(onInvalidate){
        if(this.ninePatch !== null){
            this.ninePatch.draw();
        }
        if(this.context.loaded === true){
            this.context.loaded = false;
            var this_ = this;
            var temp = function(){
                this_.context.loaded = true;
                if(onInvalidate !== undefined)
                    onInvalidate();
            };
            this.context.viewRoot.onMeasure(
                    PageManager.getWindowsDimension().width,
                    PageManager.getWindowsDimension().height,temp);
        }
    },
    forseInvalidate:function(){
        this.onMeasure(
            this.getWidth(),
            this.getHeight());
    },
    init:function(context){
        if(context === undefined||context === null)
            throw new Exception("El contexto no esta en los parametros o es nulo");
        this.context = context;
        this.margin = {top:0,left:0,right:0,bottom:0};
        this.padding = {top:0,left:0,right:0,bottom:0};
        this.elemDom = this.createDomElement();
        this.parentView = null;
        this.name = "View";
    },
    parse:function(nodeXml){
        // VISIBILITY DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY)!==null)
        {
            this.visibility = nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY);
            this.setVisibility(this.visibility);
        }
        
        // PADDING DEL VIEW
        var padding = nodeXml.getAttribute(LayoutInflater.ATTR_PADDING);
        if(padding !== null)
        {
            var pad = parseInt(padding);
            this.padding.top = this.padding.left=this.padding.right=this.padding.bottom=pad;
        }
        // MARGEN DEL COMPONENTE
        this.setMargin(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN));
        this.setMarginBottom(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM));
        this.setMarginLeft(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT));
        this.setMarginRight(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT));
        this.setMarginTop(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_TOP));

        // ID DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_ID)!==null)
            this.id = nodeXml.getAttribute(LayoutInflater.ATTR_ID);

        // LAYOUT GRAVITY DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY)!==null)
            this.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        // WIDTH DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)!==null)
            this.width = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH);
        // HEIGHT DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_HEIGHT)!==null)
            this.height = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_HEIGHT);
        if(nodeXml.getAttribute('tooltip')!==null)
            this.setToolTip(nodeXml.getAttribute('tooltip'));

        // BACKGROUDN DEL VIEW
        if(nodeXml.getAttribute(LayoutInflater.ATTR_BACKGROUND)!==null)
            this.background = nodeXml.getAttribute(LayoutInflater.ATTR_BACKGROUND);
        // SET ON CLICK DEL VIEW
        this.onClick = nodeXml.getAttribute(LayoutInflater.ATTR_ON_CLICK);
        this.setOnClickListener(this.onClick);
        
        if(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT)!==null)
            this.minHeigth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT));
        
        if(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH)!==null)
            this.minWidth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH));
    },
    createDomElement:function(){
        var elem = document.createElement(this.getTypeElement());
        // Margenes por defector
        elem.style.marginTop = '0px';
        elem.style.marginLeft = '0px';
        elem.style.marginBottom = '0px';
        elem.style.marginRight = '0px';
        // Padding por defecto
        elem.style.paddingTop = '0px';
        elem.style.paddingLeft = '0px';
        elem.style.paddingBottom = '0px';
        elem.style.paddingRight = '0px';
        
        elem.style.position = 'absolute';
        return elem;
    },
    getTypeElement:function(){
        return 'div';
    },
    setId:function(id){
        this.id = id;
    },
    clone:function(){
        var copy = Object.assign({},this);
        copy.elemDom = this.elemDom.cloneNode(true);
    },
    onMeasure:function(maxWidth,maxHeigth,loadListener){
        this.maxHeigth = maxHeigth;
        this.maxWidth = maxWidth;
        if(this.addedInParent === false)
        {
            if(this.parentView !== null)
                this.parentView.elemDom.appendChild(this.elemDom);
            this.addedInParent = true;
        }

        // ************  ANCHO DE PANTALLA  ************
        switch (this.width)
        {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = (maxWidth-this.margin.left-this.margin.right)+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                //this.elemDom.style.width = 'auto';
                break;
            default:
                var width = parseInt(this.width);
                this.elemDom.style.width = width+'px';
                break;
        }
        
        switch (this.height)
        {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = (maxHeigth-this.margin.top-this.margin.bottom)+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                //this.elemDom.style.height = 'auto';
                break;
            default:
                var height = parseInt(this.height);
                this.elemDom.style.height = height+'px';
                break;
        }
        //this.checkMinSize();
        // Estableciendo fondo de componente
        this.setBackground(this.background,loadListener);
    },
    checkMinSize:function(){
        var sw = false;
        if(this.getWidth()<=this.minWidth)
        {
            this.elemDom.style.width = this.minWidth+'px';
            sw = true;
        }
        if(this.getHeight()<=this.minHeigth)
        {
            this.elemDom.style.height = this.minHeigth+'px';
            sw = true;
        }
        if(sw === true)
            this.invalidate();
    },
    getWidth:function(){
        return this.elemDom.clientWidth;
    },
    getHeight:function(){
        return this.elemDom.clientHeight;
    },
    setMargin:function(margin){
        if(margin === null||margin === undefined)return;
        var mg = parseInt(margin);
        this.margin.top = this.margin.left=this.margin.right=this.margin.bottom=mg;
    },
    setMarginTop:function(margin){
        if(margin === null||margin === undefined)return;
        this.margin.top = parseInt(margin);
    },
    setMarginLeft:function(margin){
        if(margin === null||margin === undefined)return;
        this.margin.left = parseInt(margin);
    },
    setMarginRight:function(margin){
        if(margin === null||margin === undefined)return;
        this.margin.right = parseInt(margin);
    },
    setMarginBottom:function(margin){
        if(margin === null||margin === undefined)return;
        this.margin.bottom = parseInt(margin);
    },
    getBackground:function(){
        return this.background;
    },
    setBackground:function(background,loadListener){
        if(loadListener === undefined)
            loadListener =function(){};
        if(background === null||background === undefined)
        {
            loadListener();
            return;
        }
        this.background = background;
        if (background.match(/\.9\.(png|gif)/i)) // Es nine path?
        {
            this.elemDom.style.backgroundRepeat = "no-repeat";
            this.elemDom.style.backgroundPosition = "-1000px -1000px";
            this.elemDom.style.backgroundImage = "url('"+background+"')";
            var this_=this;
            this.ninePatch = new NinePatch(this.elemDom,function()
            {
                this_.padding.left = this_.ninePatch.padding.left;
                this_.padding.top = this_.ninePatch.padding.top;
                this_.padding.right = this_.ninePatch.padding.right;
                this_.padding.bottom = this_.ninePatch.padding.bottom;
                loadListener();
            });
        }
        else if (background.match(/.(png|gif|jpg)/i)) // Es una imagen de fondo
        {
            this.ninePatch = null;
            this.elemDom.style.backgroundRepeat = "no-repeat";
            this.elemDom.style.backgroundPosition = "0px 0px";
            var img = new Image();
            var this_ = this;
            img.onload = function()
            {
                this_.elemDom.style.backgroundImage = "url('"+this.src+"')";
                if(loadListener !== undefined)
                    loadListener();
            };
            img.src = background;
        }
        else // es un fondo de un color
        {
            this.ninePatch = null;
            this.elemDom.style.background = background;
            loadListener();
        }
        //this.invalidate();
    },
    setWidth:function(width){
        this.width = width;
    },
    setHeight:function(height){
        this.height = height;
    },
    setLayoutGravity:function(gravity){
        this.layoutGravity = gravity;
    },
    setOnClickListener:function(onCLick){
        if(onCLick === null)
            return;
        if(typeof onCLick === 'string')
        {
            // Buscamos el nombre de metodo en el contexto
            var encontrado = false;
            var this_ = this;
            for(var obj in this.context)
            {
                // Falta verificar si el objeto es una funcion
                if(typeof this.context[obj] === 'function')
                {
                    if(obj === onCLick)
                    {
                        this.elemDom.onclick = function()
                        {
                            this_.context[obj](this_);
                        };
                        encontrado = true;
                        break;
                    }
                }
            }
            if(encontrado === false)
                throw new Exception("No se pudo encontrar la funcion ["+onCLick+"] dentro del contexto");
        }
        else if(typeof onCLick === 'function')
        {
            var this_ = this;
            this.elemDom.onclick = function()
            {
                onCLick(this_);
            };
        }
    },
    setMP:function(dr,ic,txt,tc){
        var popupError = new PopupWindow(this.getContext());
        var message = new TextView(popupError);
        message.setText(txt);
        if(ic!==null)
            message.setDrawableLeft(ic);
        message.setBackground(dr);
        message.setSingleLine(true);
        message.setTextColor(tc);
        popupError.setView(this);
        popupError.setContentView(message);
        popupError.show(function()
        {
            setTimeout(function()
            {
               popupError.cancel();
            },3000);
        });
    },
    setAlert:function(msg){
        this.setMP("res/drawable/util/bg_alerta.9.png","res/drawable/util/ic_alert.png",msg,"#653400");
    },
    setConfirm:function(msg){
        this.setMP("res/drawable/util/bg_confirm.9.png","res/drawable/util/ic_confirm.png",msg,"#346700");
    },
    setError:function(msg){
        this.setMP("res/drawable/util/bg_error.9.png","res/drawable/util/ic_error.png",msg,"#A90400");
    },
    setInfo:function(msg){
        this.setMP("res/drawable/util/bg_info.9.png","res/drawable/util/ic_info.png",msg,"#4C95E7");
    }
});
ProgressBar = View.extend({
    imgLoader:null,
    init:function(context){
        this._super(context);
        this.name="ProgressBar";
        this.elemDom.style.background='#05112B';
        this.imgLoader = document.createElement('canvas');
        this.elemDom.appendChild(this.imgLoader);
        this.imgLoader.className = "rotate";
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var width = this.getWidth();
        var height = this.getHeight();
        var min = Math.min(width,height);
        width = height = min;
        var radiusBack = width/8;
        this.elemDom.style.borderRadius=radiusBack+'px';
        
        this.imgLoader.width  = width-radiusBack*2;
        this.imgLoader.height = height-radiusBack*2;
        this.imgLoader.style.position='absolute';
        this.imgLoader.style.top=radiusBack+'px';
        this.imgLoader.style.left=radiusBack+'px';
        var ctx = this.imgLoader.getContext("2d");
        
        // Pintando spinner
        var lines = 13;
        var radius = this.imgLoader.width/10;
        var rotation = radius;
        ctx.save();
        ctx.translate(this.imgLoader.width / 2, this.imgLoader.height / 2);
        ctx.rotate(Math.PI * 2 * rotation);
        for (var i = 0; i < lines; i++)
        {
            ctx.beginPath();
            ctx.rotate(Math.PI * 2 / lines);
            ctx.fillStyle = "rgba(250,254,255," + (1-i / lines) + ")";
            ctx.arc(this.imgLoader.width/2-radius,0, radius,0, 2 * Math.PI, false);
            ctx.fill();
            radius = radius-radius/(lines-1);
            if(radius<1)
                break;
        }
        ctx.restore();
        loadListener();
    }
});
DomView = View.extend({
    init:function(context){
        this._super(context);
        this.name = "DomView";
    },
    createDomElement:function(){
        //<input type="text" size="2" placeholder="asas">
        var elemDom =  document.createElement(this.getDomType());
        elemDom.style.margin = '0px';
        // Padding por defecto
        elemDom.style.paddingTop = '0px';
        elemDom.style.paddingLeft = '0px';
        elemDom.style.paddingBottom = '0px';
        elemDom.style.paddingRight = '0px';
        elemDom.style.position = 'absolute';
        return elemDom;
    },
    getDomType:function(){
        throw new Exception("No implementado");
    },
    onPreProccessAttributes:function(onLoaded){
        this.padding.top = parseInt(this.elemDom.style.paddingTop);
        this.padding.left = parseInt(this.elemDom.style.paddingLeft);
        this.padding.right = parseInt(this.elemDom.style.paddingRight);
        this.padding.bottom = parseInt(this.elemDom.style.paddingBottom);
        onLoaded();
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_ = this;
        var tempListener = function()
        {
            // Obteniendo paddings de EditText
            var onLoaded = function()
            {
                switch (this_.width)
                {
                    case LayoutInflater.WRAP_CONTENT:
                        //setWidth(this_.elemDom.clientWidth);
                        break;
                    case LayoutInflater.MATCH_PARENT:
                        this_.elemDom.style.width = (maxWidth - this_.margin.left -this_.margin.right-this_.padding.left-this_.padding.right)+'px';
                        this_.invalidate();
                        break;
                    default:
                        var width = parseInt(this_.width);
                        this_.elemDom.style.width = (width)+'px';
                        this_.invalidate();
                        break;
                }
                switch (this_.height)
                {
                    case LayoutInflater.WRAP_CONTENT:
                        //this_.setHeight(this_.elemDom.clientHeight);
                        break;
                    case LayoutInflater.MATCH_PARENT:
                        this_.elemDom.style.height = (maxHeight - this_.margin.top -this_.margin.bottom -this_.padding.top-this_.padding.bottom)+'px';
                        break;
                    default:
                        var height = parseInt(this_.height);
                        this_.elemDom.style.height = (height)+'px';
                        break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };
            this_.onPreProccessAttributes(onLoaded);
        };
        this._super(maxWidth,maxHeight,tempListener);
    },
    getWidth:function(){
        return this.padding.left + this.elemDom.clientWidth+this.padding.right;
    },
    getHeight:function(){
        return this.padding.top + this.elemDom.clientHeight+this.padding.bottom;
    }
});
EditText = DomView.extend({
    ems:20,
    lines:1,
    maxEms:80,
    maxLines:10,
    hint:null,
    maxLength:-1,
    readonly:false,
    init:function(context){
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.name = "EditText";
        
        //cols="5" rows="1"
        this.elemDom.cols = this.ems;
        this.elemDom.rows = this.lines;
        if(this.hint !== null)
            this.elemDom.placeholder = this.hint;
        if(this.maxLength>0)
            this.elemDom.setAttribute("maxlength",this.maxLength);
        this.elemDom.style.resize = 'none';
        if(this.lines===1)
            this.elemDom.style.height = '22px';
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        if(nodeXml.getAttribute("ems")!==null){
            this.ems = parseInt(nodeXml.getAttribute("ems"));
            this.elemDom.cols = this.ems;
        }
        if(nodeXml.getAttribute("lines")!==null){
            this.lines = parseInt(nodeXml.getAttribute("lines"));
            this.elemDom.rows = this.lines;
            this.elemDom.style.height = (this.elemDom.rows*22)+'px';
        }
        if(nodeXml.getAttribute("maxEms")!==null)
            this.maxEms = parseInt(nodeXml.getAttribute("maxEms"));
        if(nodeXml.getAttribute("maxLines")!==null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        if(nodeXml.getAttribute("maxLines")!==null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        this.hint = nodeXml.getAttribute("hint");
        if(this.hint!==null)
            this.elemDom.placeholder=this.hint;
        if(nodeXml.getAttribute("maxlength")!==null)
            this.maxLength = parseInt(nodeXml.getAttribute("maxlength"));
        if(nodeXml.getAttribute("text")!==null)
            this.elemDom.value = nodeXml.getAttribute("text");
        if(nodeXml.getAttribute("singleLine")==="true")
            this.elemDom.rows=1;
        if(nodeXml.getAttribute("enabled")==="false")
            this.elemDom.disabled = true;
    },
    getDomType:function(){
        return 'TextArea';
    },
    getText:function(){
        return this.elemDom.value;
    },
    setText:function(txt){
        this.elemDom.value = txt;
    },
    setEnabled:function(sw){
        this.elemDom.disabled=!sw;
    },
    setError:function(msg){
        this._super(msg);
        this.elemDom.focus();
    }
});
FileChooserDialog = {
    showSelectFile:function(type){
        return new Promise(function(resolve,reject){
            var domoInput = document.getElementById("files");
            domoInput.click();
            domoInput.onchange = function(){
                var reader = new FileReader();
                reader.onload = function(evt){
//                    var parser = new DOMParser();
                    var contents = evt.target.result;
                    // El contenido se encuentra en Base64
                    // application/octet-stream;base64,UEsDBBQAAAgIAEe8.....
                    let posBase = contents.indexOf(',');
                    contents = posBase===-1?contents:contents.substr(posBase+1);
//                    var doc = parser.parseFromString(contents, "application/xml");
                    resolve({
                        fileName: domoInput.files[0].name,
                        data: contents,
                        size: domoInput.files[0].size,
                        lastModified: domoInput.files[0].lastModified
                    });
//                    cbSelected(doc.documentElement);
                };
                reader.onerror = function(error){
                    reject(error);
                },
//                reader.readAsBinaryString(domoInput.files[0],"UTF-8");
                reader.readAsDataURL(domoInput.files[0]);
            };
            
        });
    }
};
ImageView = DomView.extend({
    src:null,
    scaleType:LayoutInflater.FIT_XY,
    init:function(context){
        this._super(context);
        this.name = "ImageView";
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        this.src = nodeXml.getAttribute(LayoutInflater.ATTR_SRC);
        this.scaleType = nodeXml.getAttribute(LayoutInflater.ATTR_SCALE_TYPE);
    },
    getDomType:function(){
        return 'img';
    },
    setImageFromBase64: function(txtImageBase64){
//        console.log("ASSSSSSSSSS",this.elemDom.getAttribute("src"));
        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,'data:image/png;base64,'+txtImageBase64);
//        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,"data:image/png;base64, "+txtImageBase64);
//        this.elemDom.src=("data:image/png;base64, "+txtImageBase64);
//        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEVBMTczNDg3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEVBMTczNDk3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRUExNzM0NjdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRUExNzM0NzdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjjUmssAAAGASURBVHjatJaxTsMwEIbpIzDA6FaMMPYJkDKzVYU+QFeEGPIKfYU8AETkCYI6wANkZQwIKRNDB1hA0Jrf0rk6WXZ8BvWkb4kv99vn89kDrfVexBSYgVNwDA7AN+jAK3gEd+AlGMGIBFDgFvzouK3JV/lihQTOwLtOtw9wIRG5pJn91Tbgqk9kSk7GViADrTD4HCyZ0NQnomi51sb0fUyCMQEbp2WpU67IjfNjwcYyoUDhjJVcZBjYBy40j4wXgaobWoe8Z6Y80CJBwFpunepIzt2AUgFjtXXshNXjVmMh+K+zzp/CMs0CqeuzrxSRpbOKfdCkiMTS1VBQ41uxMyQR2qbrXiiwYN3ACh1FDmsdK2Eu4J6Tlo31dYVtCY88h5ELZIJJ+IRMzBHfyJINrigNkt5VsRiub9nXICdsYyVd2NcVvA3ScE5t2rb5JuEeyZnAhmLt9NK63vX1O5Pe8XaPSuGq1uTrfUgMEp9EJ+CQvr+BJ/AAKvAcCiAR+bf9CjAAluzmdX4AEIIAAAAASUVORK5CYII=");
    },
    setImageFromURL:function(urlImage,onLoaded){
        this.src = urlImage;
        if(this.src !== null)
        {
            this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,this.src);

            if(onLoaded)
                onLoaded();
//            this.elemDom.onload = function ()
//            {               
//                    switch (scaleType)
//                    {
//                        case LayoutInflater.FIT_CENTER:
//                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
//                            {
//                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
//                                this.imgElem.setAttribute("height","auto");
//                            }
//                            else
//                            {
//                                this.imgElem.setAttribute("width","auto");
//                                this.imgElem.setAttribute("height","auto");                            
//                            }
//                            break;
//                        case LayoutInflater.FIT_XY:
//                            console.log("Ajustando a este tipo");
//                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
//                            {
//                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
//                                this.imgElem.setAttribute("height","auto");
//                            }
//                            else
//                            {
//                                this.imgElem.setAttribute("width","auto");
//                                this.imgElem.setAttribute("height","auto");
//                            }
//                            break;
//                    }
//                    this.imgElem.style.top = this.padding.top+'px';
//                    this.imgElem.style.left = this.padding.left+'px';
//                    this.setWidth(this.padding.left+this.imgElem.clientWidth+this.padding.right);
//                    this.setHeight(this.padding.top+this.imgElem.clientHeight+this.padding.bottom);
//
//                if(onLoaded !== undefined)
//                    onLoaded();
//            };
        }
        else
        {
            if(onLoaded)
                onLoaded();
        }
    },
    onPreProccessAttributes:function(onLoaded){
        var this_ = this;
        var tempLoader = function()
        {
            this_.setImageFromURL(this_.src,onLoaded);
        };
        this._super(tempLoader);
    }
});
ImageButton = ImageView.extend({
    init:function(context)
    {
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.name = "ImageButton";
    },
    createDomElement:function()
    {
        var elemDom = this._super();
        elemDom.classList.add("AndButton");
        return elemDom;
    }
});
TextView = View.extend({
    text:null,
    elemText:null,
    elemIcon:null,
    drawableLeft:null,
    drawableTop:null,
    drawableRight:null,
    drawableBottom:null,
    gravityIcon:"none",
    singleLine:false,
    ellipsize:"none",
    getTypeElement:function(){
        return 'TextView';
    },
    init:function(context){
        this._super(context);
        this.name = "TextView";
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        this.text = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TEXT);
        this.elemText.innerHTML = this.text;
        
        if(nodeXml.getAttribute("textColor")!==null)
            this.elemText.style.color = nodeXml.getAttribute("textColor");
        if(nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT)!==null){
            this.gravityIcon = LayoutInflater.LEFT;
            this.drawableLeft = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT);
        }
        else if(nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT)!==null){
            this.gravityIcon = LayoutInflater.RIGHT;
            this.drawableRight = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT);            
        }
        else if(nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP)!==null){
            this.gravityIcon = LayoutInflater.TOP;
            this.drawableTop = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP);
        }
        else if(nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM)!==null){
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableBottom = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM);            
        }
        else
             this.gravityIcon = "none";
         
        if(nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM)!==null){
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableBottom = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM);            
        }
        this.singleLine = (nodeXml.getAttribute("singleLine")==="true");
        if(this.singleLine === true)
            this.elemText.style.whiteSpace="nowrap";
        if(nodeXml.getAttribute("textStyle") !== null){
            switch(nodeXml.getAttribute("textStyle"))
            {
                case "bold":this.elemText.style.fontWeight = 'bold';break;
                case "italic":this.elemText.style.fontWeight = 'italic';break;
            }
        }
        this.elemText.style.textOverflow="ellipsis";
        if(nodeXml.getAttribute("textSize") !== null)
            this.elemText.style.fontSize = nodeXml.getAttribute("textSize");
    },
    setSingleLine:function(single){
        this.singleLine = single;
        if(this.singleLine === true)
            this.elemText.style.whiteSpace="nowrap";
    },
    setTextColor:function(color){
        this.elemText.style.color = color;
    },
    createDomElement:function(){
        // Texto
        this.elemText = document.createElement('span');
        this.elemText.style.margin = '0px';
        this.elemText.style.paddingTop = '0px';
        this.elemText.style.paddingLeft = '0px';
        this.elemText.style.paddingBottom = '0px';
        this.elemText.style.paddingRight = '0px';
        this.elemText.style.wordWrap='break-word'; // Ajustar texto a contenido
        this.elemText.style.position = 'absolute';
        
        // Icono
        this.elemIcon = document.createElement('img');
        this.elemIcon.style.margin = '0px';
        this.elemIcon.style.paddingTop = '0px';
        this.elemIcon.style.paddingLeft = '0px';
        this.elemIcon.style.paddingBottom = '0px';
        this.elemIcon.style.paddingRight = '0px';
        this.elemIcon.style.position = 'absolute';
        
        var elemDom = this._super();
        elemDom.appendChild(this.elemText);
        elemDom.appendChild(this.elemIcon);
        return elemDom;
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_ = this;
        var tempListener = function(){
            var onDrawableLoaded = function(){
                // Pintar el drawable
                var marginDrawable = 4; // 4px
                switch (this_.gravityIcon)
                {
                    case LayoutInflater.LEFT:
                        // posicionamos
                        this_.elemIcon.style.top=this_.padding.top+'px';
                        this_.elemIcon.style.left=this_.padding.left+'px';
                        
                        this_.elemText.style.top = this_.padding.top+'px';
                        this_.elemText.style.left= (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable)+'px';
                        
                        switch (this_.width)
                        {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                        maxWidth-
                                        this_.margin.left-this_.padding.left-
                                        this_.elemIcon.clientWidth-
                                        marginDrawable-
                                        this_.padding.right-this_.margin.right)+'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                        width-
                                        this_.padding.left-
                                        this_.elemIcon.clientWidth-
                                        marginDrawable-
                                        this_.padding.right)+'px';
                                break;
                        }
                        
                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable+this_.elemText.clientWidth+this_.padding.right)+'px';
                        this_.elemDom.style.height = (this_.padding.top+Math.max(this_.elemText.clientHeight,this_.elemIcon.clientHeight)+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.RIGHT:
                        // posicionamos
                        this_.elemIcon.style.top=this_.padding.top+'px';
                        this_.elemIcon.style.left=this_.padding.left+'px';
                        
                        this_.elemText.style.top = this_.padding.top+'px';
                        this_.elemText.style.left= (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable)+'px';
                        
                        switch (this_.width)
                        {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                        maxWidth-
                                        this_.margin.left-this_.padding.left-
                                        this_.elemIcon.clientWidth-
                                        marginDrawable-
                                        this_.padding.right-this_.margin.right)+'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                        width-
                                        this_.padding.left-
                                        this_.elemIcon.clientWidth-
                                        marginDrawable-
                                        this_.padding.right)+'px';
                                break;
                        }
                        
                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable+this_.elemText.clientWidth+this_.padding.right)+'px';
                        this_.elemDom.style.height = (this_.padding.top+Math.max(this_.elemText.clientHeight,this_.elemIcon.clientHeight)+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.TOP:                        
                        switch (this_.width)
                        {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                        maxWidth-
                                        this_.margin.left-this_.padding.left-
                                        this_.padding.right-this_.margin.right)+'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                        width-
                                        this_.padding.left-
                                        this_.padding.right)+'px';
                                break;
                        }
                        var width_elem = Math.max(this_.elemText.clientWidth,this_.elemIcon.clientWidth);
                        this_.elemIcon.style.top = this_.padding.top+'px';
                        this_.elemIcon.style.left = (this_.padding.left+width_elem/2-this_.elemIcon.clientWidth/2)+'px';
                        
                        this_.elemText.style.top = (this_.padding.top+this_.elemIcon.clientHeight+marginDrawable)+'px';
                        this_.elemText.style.left= (this_.padding.left+width_elem/2-this_.elemText.clientWidth/2)+'px';
                        
                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left +width_elem+this_.padding.right)+'px';
                        this_.elemDom.style.height = (this_.padding.top+this_.elemIcon.clientHeight+marginDrawable+this_.elemText.clientHeight+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.RIGHT:
                        break;
                    case LayoutInflater.BOTTOM:
                        break;
                    default: // none (No tiene drawableIcon)
                        this_.elemText.style.top=this_.padding.top+'px';
                        this_.elemText.style.left=this_.padding.left+'px';
                        switch (this_.width)
                        {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                        maxWidth-
                                        this_.margin.left-this_.padding.left-
                                        this_.padding.right-this_.margin.right)+'px';
                                this_.elemDom.style.width = (this_.padding.left+this_.elemText.clientWidth+this_.padding.right)+'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                this_.elemDom.style.width = (this_.padding.left+this_.elemText.clientWidth+this_.padding.right)+'px';
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                        width-
                                        this_.padding.left-
                                        this_.padding.right)+'px';
                                break;
                        }
                        switch (this_.height)
                        {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.height = (
                                            maxHeight-
                                            this_.margin.top-this_.padding.bottom-
                                            this_.padding.top-this_.margin.bottom)+'px';
                                this_.elemDom.style.height = (this_.padding.top+this_.elemText.clientHeight+this_.padding.bottom)+'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                this_.elemDom.style.height = (this_.padding.top+this_.elemText.clientHeight+this_.padding.bottom)+'px';
                                break;
                            default:
                                var height = parseInt(this_.height);
                                this_.elemText.style.height = (
                                        height-
                                        this_.padding.top-
                                        this_.padding.bottom)+'px';
                                break;
                        }
                        this_.invalidate();
                        break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };
            if(this_.drawableLeft!==null)
                this_.setDrawableLeft(this_.drawableLeft,onDrawableLoaded);
            else if(this_.drawableTop!==null)
                this_.setDrawableTop(this_.drawableTop,onDrawableLoaded);
            else
                onDrawableLoaded();
        };
        this._super(maxWidth,maxHeight,tempListener);
    },
    cdf:function(dr,of){
        var img = new Image();
        var this_ = this;
        if(typeof of === "function"){
            img.onload = function(){
                this_.elemIcon.src = this.src;
                if(of !== undefined)
                    of();
            };
        }
        img.src = dr;
    },
    setDrawableLeft:function(drawable,onLoadedDrawable){
        this.gravityIcon = LayoutInflater.LEFT;
        this.drawableLeft = drawable;
        this.cdf(drawable,onLoadedDrawable);
    },
    setDrawableTop:function(drawable,onLoadedDrawable){
        this.gravityIcon = LayoutInflater.TOP;
        this.drawableTop = drawable;
        this.cdf(drawable,onLoadedDrawable);
    },
    setDrawableRight:function(drawable,onLoadedDrawable){
        this.gravityIcon = LayoutInflater.RIGHT;
        this.drawableTop = drawable;
        this.cdf(drawable,onLoadedDrawable);
    },
    setText:function(text,onChange){
        this.text = text;
        this.elemText.innerHTML = text;
        this.invalidate(onChange);
    },
    getText:function(){
        return this.text;
    }
});
Button = TextView.extend({
    init:function(context){
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.padding.left = this.padding.top = this.padding.right = this.padding.bottom = 4;
        this.name = "Button";
    },
    getTypeElement:function(){
        return 'Button';
    },
    createDomElement:function(){
        var elemDom = this._super();
        elemDom.classList.add("AndButton");
        return elemDom;
    }
});
ViewGroup = View.extend({
    viewsChilds:null,
    init:function(context){
        this._super(context);
        this.viewsChilds = new Array();
        this.name = "ViewGroup";
        this.elemDom.style.overflow='hidden';
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        // Verificamos si tiene hijos
        if(nodeXml.children.length === 0 )
            return;
        //console.log("Nro hijos de "+nodeXml.tagName+" = "+nodeXml.children.length);
        for (var index=0;index<nodeXml.children.length;index++)
            this.parseViewChild(nodeXml.children[index]);
    },
    parseViewChild:function(nodeChild){
        var child = LayoutInflater.parse(this.context,nodeChild);
        child.parentView = this;
        this.viewsChilds.push(child);
        return child;
    },
    findViewById:function(idView){
        if(idView === null&&idView === undefined)
            return null;
        for(var i=0;i<this.viewsChilds.length;i++)
        {
            var view = this.viewsChilds[i];
            if(view.id===idView)
                return view;
            if(view instanceof ViewGroup)
            {
                var viewTemp = view.findViewById(idView);
                if(viewTemp!==null)
                    return viewTemp;
            }
        }
        return null;
    },
    findViewChildById:function(idView){
        if(idView === null&&idView === undefined)
            return null;
        for(var i=0;i<this.viewsChilds.length;i++)
        {
            var view = this.viewsChilds[i];
            if(view.id===idView)
                return view;
        }
        return null;
    },
    addView:function(viewChild){
        if(viewChild === null||viewChild===undefined)
            throw new Exception("El view que desea agregar  es nulo o no esta definido");
        viewChild.parentView = this;
        this.viewsChilds.push(viewChild);
        this.invalidate();
    },
    getViewVisibles:function(){
        // agrupamos los GONE's y los INVISIBLE's
        var vistos = new Array();
        for(var index =0;index<this.viewsChilds.length;index++)
        {
            var view = this.viewsChilds[index];
            if(view.visibility === LayoutInflater.VISIBLE)
                vistos.push(view);
        }
        return vistos;
    },
    getChildCount:function(){
        return this.viewsChilds.length;
    },
    getChildAt:function(i){
        return this.viewsChilds[i];
    }
});
ScrollView = ViewGroup.extend({
    init:function(context){
        this._super(context);
        this.name="ScrollView";
    },
    getTypeElement:function(){
        return "ScrollView";
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_= this;
        var childs = this.getViewVisibles();
        if(childs.length === 0 )
            loadListener();
        var tempListener = function()
        {
            var ancho = this_.getWidth();
            var alto = this_.getHeight();
            var view = childs[0];
            var viewListener = function()
            {
                var boxtop; // left position of moving box
                var starty=0; // starting y coordinate of touch point
                // Agregamos evento de touch al contenedor
                view.elemDom.style.top = this_.padding.top+'px';
                view.elemDom.style.left = this_.padding.left+'px';
                var dom = view.elemDom;
                dom.onmousedown = function(e)
                {
                    boxtop = parseInt(dom.style.top); // get left position of box
                    starty = parseInt(e.clientY); // get x coord of touch point
                    e.preventDefault(); // prevent default click behavior
                    
                    dom.onmousemove = function(e)
                    {
                        if(dom.clientHeight>alto)
                        {
                            var dist = parseInt(e.clientY) - starty;
                            if(boxtop + dist>0)
                                dom.style.top = '0px';
                            else if(boxtop + dist + dom.clientHeight<alto)
                                dom.style.top = (alto-dom.clientHeight) + 'px';
                            else
                                dom.style.top = (boxtop + dist) + 'px';
                        }
                        e.preventDefault();
                    };
                };
                var  mouseOut= function(){
                    dom.onmousemove = null;
                };
                dom.onmouseup = mouseOut;
                //dom.onmouseout = mouseOut;
                dom.onmouseover = mouseOut;
                
                dom.ontouchstart = function(e){
                    var touch = e.touches[0];
                    boxtop = parseInt(dom.style.top);
                    starty = parseInt(touch.clientY);
                    e.preventDefault();
                };
                dom.ontouchmove = function(e){
                    if(dom.clientHeight>alto)
                    {
                        var touch = e.touches[0];
                        var dist = parseInt(touch.clientY) - starty;
                        if(boxtop + dist>0)
                            dom.style.top = '0px';
                        else if(boxtop + dist + dom.clientHeight<alto)
                            dom.style.top = (alto-dom.clientHeight) + 'px';
                        else
                            dom.style.top = (boxtop + dist) + 'px';
                    }
                    e.preventDefault();
                };
                if(typeof loadListener === "function")
                    loadListener();
            };
            view.onMeasure(
                    ancho-this_.padding.left-this_.padding.right,
                    alto-this_.padding.top-this_.padding.bottom,
                    viewListener);
        };
        this._super(maxWidth,maxHeight,tempListener);
    }
});
FrameLayout = ViewGroup.extend({
    init:function(context){
        this._super(context);
        this.name = "FrameLayout";
    },
    getTypeElement:function(){
        return "FrameLayout";
    },
    parseViewChild:function(nodeXml){
        var view = this._super(nodeXml);
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY)!==null)
            view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        else
            view.layoutGravity = null;
        return view;
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_=this;
        var tempListener = function(){
            var ancho = this_.getWidth();
            var alto = this_.getHeight();
            
            var mayHeight = 0;
            var mayWidth = 0;
            if(this_.viewsChilds.length === 0){
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (this_.padding.top+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (this_.padding.left+this_.padding.right)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
                return;
            }
            
            var index = 0;
            var view = this_.viewsChilds[index];
            var loadCompleted = function()
            {
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (mayHeight)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (mayWidth)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };
            var viewListener = function()
            {
                if(view.layoutGravity!==null)
                {
                    var gravitys = view.layoutGravity.split("|");
                    for(var j=0;j<gravitys.length;j++)
                    {
                        var gravity = gravitys[j];
                        // Posicionamos la vista segun el layout
                        if(gravity === LayoutInflater.TOP)
                            view.elemDom.style.top = (this_.padding.top+view.margin.top)+'px';
                        if(gravity === LayoutInflater.RIGHT)
                            view.elemDom.style.left = (ancho-view.getWidth()-view.margin.right-this_.padding.right)+'px';
                        if(gravity === LayoutInflater.LEFT)
                            view.elemDom.style.left = (this_.padding.left+view.margin.left)+'px';
                        if(gravity === LayoutInflater.BOTTOM)
                            view.elemDom.style.top = (alto-view.getHeight()-view.margin.bottom-this_.padding.bottom)+'px';
                        if(gravity === LayoutInflater.CENTER_HORIZONTAL)
                            view.elemDom.style.left = (ancho/2-view.getWidth()/2)+'px';
                        if(gravity === LayoutInflater.CENTER_VERTICAL)
                            view.elemDom.style.top = (alto/2-view.getHeight()/2)+'px';
                        if(gravity === LayoutInflater.CENTER)
                        {
                            view.elemDom.style.left = (ancho/2-view.getWidth()/2)+'px';
                            view.elemDom.style.top = (alto/2-view.getHeight()/2)+'px';
                        }
                    }
                }
                if(view.elemDom.style.top === "")
                    view.elemDom.style.top = (this_.padding.top+view.margin.top)+'px';
                if(view.elemDom.style.left === "")
                    view.elemDom.style.left = (this_.padding.left+view.margin.left)+'px';

                var sum = parseInt(view.elemDom.style.top)+view.getHeight()+this_.padding.bottom+view.margin.bottom;
                if(sum > mayHeight)
                    mayHeight = sum;

                sum = parseInt(view.elemDom.style.left)+view.getWidth()+this_.padding.right+view.margin.right;
                if(sum > mayWidth)
                    mayWidth = sum;
                index++;
                if(index < this_.viewsChilds.length)
                {
                    view = this_.viewsChilds[index];
                    view.onMeasure(
                            ancho-this_.padding.left-this_.padding.right,
                            alto-this_.padding.top-this_.padding.bottom,
                            viewListener);
                }
                else
                    loadCompleted();
            };
            view.onMeasure(
                    ancho-this_.padding.left-this_.padding.right,
                    alto-this_.padding.top-this_.padding.bottom,
                    viewListener);
        };
        this._super(maxWidth,maxHeight,tempListener);
    }
});

GridLayout = ViewGroup.extend({
    colums:2,
    spacing:0,
    init:function(context){
        this._super(context);
        this.name = "GridLayout";
    },
    getTypeElement:function(){
        return "GridLayout";
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        if(nodeXml.children.length === 0)
            return;
        if(nodeXml.getAttribute("colums")!==null)
            this.colums = parseInt(nodeXml.getAttribute("colums"));
        if(nodeXml.getAttribute("spacing")!==null)
            this.spacing = parseInt(nodeXml.getAttribute("spacing"));
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_= this;
        var childs = this.getViewVisibles();
        if(childs.length === 0 )
        {
            loadListener();
            return;
        }
        var tempListener = function()
        {
            var ancho = this_.getWidth();
            var alto = this_.getHeight();
            
            var mayHeight = this_.padding.top+this_.padding.bottom;
            var mayWidth = this_.padding.left+this_.padding.right;
            
            var maxAnchoView = (ancho-this_.padding.left-this_.padding.right)/this_.colums;
            
            var index = 0;
            var view = childs[index];
            var x = this_.padding.top;
            var y = this_.padding.left;
            var col = 0;
            
            var viewListener = function(){
                view.elemDom.style.left = x+'px';
                view.elemDom.style.top = y+'px';

                var sum = parseInt(view.elemDom.style.top)+view.getHeight()+this_.padding.bottom+view.margin.bottom;
                if(sum > mayHeight)
                    mayHeight = sum;
                sum = parseInt(view.elemDom.style.left)+view.getWidth()+this_.padding.right+view.margin.right;
                if(sum > mayWidth)
                    mayWidth = sum;
                index++;
                if(index < childs.length)
                {
                    col++;
                    if(col === this_.colums)
                    {
                        y = mayHeight+ this_.spacing;
                        x = this_.padding.left;
                        col = 0;
                    }
                    else
                        x = x + maxAnchoView;
                    view = childs[index];
                    view.onMeasure(
                            maxAnchoView,
                            alto-this_.padding.top-this_.padding.bottom,
                            viewListener);
                }
                else
                {
                    switch (this_.height)
                    {
                        case LayoutInflater.MATCH_PARENT:break;
                        case LayoutInflater.WRAP_CONTENT:
                            this_.elemDom.style.height = (mayHeight)+'px';
                            this_.invalidate();
                            break;
                        default:break;
                    }
                    switch (this_.width)
                    {
                        case LayoutInflater.MATCH_PARENT:break;
                        case LayoutInflater.WRAP_CONTENT:
                            this_.elemDom.style.width = (mayWidth)+'px';
                            this_.invalidate();
                            break;
                        default:break;
                    }
                    if(loadListener !== undefined)
                        loadListener();
                }
            };
            view.onMeasure(
                    maxAnchoView,
                    alto-this_.padding.top-this_.padding.bottom,
                    viewListener);
        };
        this._super(maxWidth,maxHeight,tempListener);
    }
});
LinearLayout = ViewGroup.extend({
    orientation:LayoutInflater.HORIZONTAL,
    init:function(context){
        this._super(context);
        this.name = "LinearLayout";
    },
    getTypeElement:function(){
        return "LinearLayout";
    },
    parse:function(nodeXml){
        this._super(nodeXml);
        if(nodeXml.getAttribute(LayoutInflater.ATTR_ORIENTATION)===LayoutInflater.VERTICAL)
            this.orientation = LayoutInflater.VERTICAL;
    },
    parseViewChild:function(nodeXml){
        var view = this._super(nodeXml);
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY)!==null)
            view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        else
            view.layoutGravity = null;
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT)!==null)
            view.layoutWeight = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT);
        return view;
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_ = this;
        var tempListener = function(){
            var visibles = this_.getViewVisibles();
            if(visibles.length===0)
            {
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (this_.padding.top+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (this_.padding.left+this_.padding.right)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                //this_.checkMinSize(); 
                if(loadListener !== undefined)
                    loadListener();
                return;
            }
            if (this_.orientation === LayoutInflater.VERTICAL)
            {
                this_.onMeasureVertical(visibles,this_.getWidth()-this_.padding.left-this_.padding.right,this_.getHeight()-this_.padding.top-this_.padding.bottom,loadListener);
            }
            else
                this_.onMeasureHorizontal(visibles,this_.getWidth()-this_.padding.left-this_.padding.right,this_.getHeight()-this_.padding.top-this_.padding.bottom,loadListener);
        };
        this._super(maxWidth,maxHeight,tempListener);
    },
    onMeasureVertical:function(visibles,maxWidth,maxHeight,loadListener){
        var this_=this;
//        var ancho = this_.getWidth();
//        var alto = this_.getHeight();
        var ancho = maxWidth;
        var alto = maxHeight;

        var mayHeight = 0;
        var mayWidth = 0;

        var sumHeigthWrap = 0;
        var arrayWeigh = new Array();

        var index = -1;
        var view = null;
        
        // Se llama cuando termina de iterar todos los elementos
        // Para los que no tienen WEIGHT
        var loadWrapCompleted = function()
        {
            var loadAllCompleted = function()
            {
                var posTop = this_.padding.top;
                for(var index =0;index<visibles.length;index++)
                {
                    var view = visibles[index];
                    var gravitys = null;
                    if (view.layoutGravity === null)
                        gravitys=[LayoutInflater.LEFT];
                    else
                        gravitys = view.layoutGravity.split("|");
                    for(j = 0;j<gravitys.length;j++)
                    {
                        switch (gravitys[j])
                        {
                            case LayoutInflater.LEFT:
                                view.elemDom.style.left = (this_.padding.left+view.margin.left)+'px';
                                break;
                            case LayoutInflater.RIGHT:
                                view.elemDom.style.left = (ancho-view.getWidth()-view.margin.right-this_.padding.right)+'px';
                                break;
                            case LayoutInflater.CENTER_HORIZONTAL:
                                view.elemDom.style.left = (ancho/2-view.getWidth()/2)+'px';
                                break;
                        }
                    }
                    view.elemDom.style.top = (posTop+view.margin.top)+'px';
                    posTop = posTop+view.margin.top+view.getHeight()+view.margin.bottom;

                    var sum = parseInt(view.elemDom.style.top)+view.getHeight()+this_.padding.bottom+view.margin.bottom;
                    if(sum > mayHeight)
                        mayHeight = sum;

                    sum = parseInt(view.elemDom.style.left)+view.getWidth()+this_.padding.right+view.margin.right;
                    if(sum > mayWidth)
                        mayWidth = sum;
                }
                // Ajustando contenido
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if(mayHeight<this_.minHeigth)
                            mayHeight = this_.minHeigth;
                        this_.elemDom.style.height = (mayHeight)+'px';
                        this_.invalidate();
                        break;
                    default:
                        break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if(mayWidth<this_.minWidth)
                            mayWidth = this_.minWidth;
                        this_.elemDom.style.width = (mayWidth)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };

            if(arrayWeigh.length===1)
            {
                view = arrayWeigh[0];
                view.onMeasure(
                    ancho,
                    alto-sumHeigthWrap,loadAllCompleted);
            }
            else if(arrayWeigh.length>0)
            {
                index = 0;
                var altoTotal = alto-sumHeigthWrap;
                var viewWeighListener = function()
                {
                    index++;
                    if(index <arrayWeigh.length)
                    {
                        view = visibles[index];
                        view.onMeasure(
                                ancho,
                                alto,
                                viewWeighListener);
                    }
                    else
                        loadAllCompleted();
                };
                var view = arrayWeigh[index];
                // obtenemos el porsentage que le corresponde
                var num = parseFloat(view.layoutWeight);
                if(isNaN(num))
                    throw new Exception(
                        "El valor del atributo ["+LayoutInflater.ATTR_LAYOUT_WEIGHT+
                        "] del view ["+view.name+"] no es un numero ["+
                        view.layoutWeight+"]");

                if(num>0)
                    throw new Exception(
                        "El valor del atributo ["+LayoutInflater.ATTR_LAYOUT_WEIGHT+
                        "] del view ["+view.name+"] no es un numero valido ["+
                        view.layoutWeight+"]");

                view.onMeasure(
                    ancho,
                    altoTotal*num,
                    viewWeighListener);
            }
            else
                loadAllCompleted();
        };
        var viewWrapListener = function(){
            if (view.layoutWeight)
                arrayWeigh.push(view);
            else
                sumHeigthWrap = sumHeigthWrap + view.margin.top + view.getHeight() + view.margin.bottom;
            index++;
            if(index < visibles.length)
            {
                view = visibles[index];
                if (view.layoutWeight) // No se realiza nada con los que tienen weight
                    viewWrapListener();
                else // Se obtiene el tamaño para el que no tiene weigch
                {
                    view.onMeasure(
                            ancho,
                            alto,
                            viewWrapListener);
                }
            }
            else // Se finaliza la busqueda de los weigch
                loadWrapCompleted();
        };
        index = 0;
        view = visibles[index];
        if (view.layoutWeight)
            viewWrapListener();
        else
        {
            view.onMeasure(
                    ancho,
                    alto,
                    viewWrapListener);
        }
    },
    onMeasureHorizontal:function(visibles,maxWidth,maxHeight,loadListener){
        var this_=this;
        var ancho = maxWidth;
        var alto = maxHeight;

        var mayHeight = 0;
        var mayWidth = 0;

        var sumWidthWrap = 0;
        var arrayWeigh = new Array();

        var index = -1;
        var view = null;
        // Para los que no tienen WEIGHT
        var loadWrapCompleted = function()
        {
            var loadAllCompleted = function()
            {
                var posLeft = this_.padding.left;
                for(var index =0;index<visibles.length;index++)
                {
                    var view = visibles[index];
                    var gravitys = null;
                    if (view.layoutGravity === null)
                        gravitys=[LayoutInflater.TOP];
                    else
                        gravitys = view.layoutGravity.split("|");
                    
                    for(var j = 0;j<gravitys.length;j++)
                    {
                        switch (gravitys[j])
                        {
                            case LayoutInflater.TOP:
                                view.elemDom.style.top = (this_.padding.top+view.margin.top)+'px';
                                break;
                            case LayoutInflater.BOTTOM:
                                view.elemDom.style.top = (alto-view.getHeight()-view.margin.bottom-this_.padding.bottom)+'px';
                                break;
                            case LayoutInflater.CENTER_HORIZONTAL:
                                view.elemDom.style.top = (alto/2-view.getHeight()/2)+'px';
                                break;
                        }
                    }
                    
                    view.elemDom.style.left = (posLeft+view.margin.left)+'px';
                    posLeft = posLeft+view.margin.left+view.getWidth()+view.margin.right;

                    var sum = parseInt(view.elemDom.style.top)+view.getHeight()+this_.padding.bottom+view.margin.bottom;
                    if(sum > mayHeight)
                        mayHeight = sum;

                    sum = parseInt(view.elemDom.style.left)+view.getWidth()+this_.padding.right+view.margin.right;
                    if(sum > mayWidth)
                        mayWidth = sum;
                }

                // Ajustando contenido
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if(mayHeight<this_.minHeigth)
                            mayHeight = this_.minHeigth;
                        this_.elemDom.style.height = (mayHeight)+'px';
                        this_.invalidate();
                        break;
                    default:
                        break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if(mayWidth<this_.minWidth)
                            mayWidth = this_.minWidth;
                        this_.elemDom.style.width = (mayWidth)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };

            if(arrayWeigh.length===1)
            {
                view = arrayWeigh[0];
                view.onMeasure(ancho-sumWidthWrap,alto,loadAllCompleted);
            }
            else if(arrayWeigh.length>0)
            {
                index = 0;
                var anchoTotal = ancho-sumWidthWrap;
                var viewWeighListener = function()
                {
                    index++;
                    if(index <arrayWeigh.length)
                    {
                        view = visibles[index];
                        view.onMeasure(ancho,alto,viewWeighListener);
                    }
                    else
                        loadAllCompleted();
                };
                var view = arrayWeigh[index];
                // obtenemos el porsentage que le corresponde
                var num = parseFloat(view.layoutWeight);
                if(isNaN(num))
                    throw new Exception(
                        "El valor del atributo ["+LayoutInflater.ATTR_LAYOUT_WEIGHT+
                        "] del view ["+view.name+"] no es un numero ["+
                        view.layoutWeight+"]");

                if(num>0)
                    throw new Exception(
                        "El valor del atributo ["+LayoutInflater.ATTR_LAYOUT_WEIGHT+
                        "] del view ["+view.name+"] no es un numero valido ["+
                        view.layoutWeight+"]");

                view.onMeasure(
                    anchoTotal*num,
                    alto,
                    viewWeighListener);
            }
            else
                loadAllCompleted();
        };
        var viewWrapListener = function()
        {
            if (view.layoutWeight)
                arrayWeigh.push(view);
            else
                sumWidthWrap = sumWidthWrap + view.margin.left + view.getWidth() + view.margin.right;
            index++;
            if(index < visibles.length)
            {
                view = visibles[index];
                if (view.layoutWeight) // No se realiza nada con los que tienen weight
                    viewWrapListener();
                else // Se obtiene el tamaño para el que no tiene weigch
                {
                    view.onMeasure(
                            ancho,
                            alto,
                            viewWrapListener);
                }
            }
            else // Se finaliza la busqueda de los weigch
                loadWrapCompleted();
        };
        index = 0;
        view = visibles[index];
        if (view.layoutWeight)
            viewWrapListener();
        else
        {
            view.onMeasure(ancho,alto,viewWrapListener);
        }
    },
    setOrientation:function(orientation){
        this.orientation = orientation;
    }
});

RelativeLayout = ViewGroup.extend({
    init:function(context){
        this._super(context);
        this.name = "RelativeLayout";
    },
    getTypeElement:function(){
        return "RelativeLayout";
    },
    parseViewChild:function(nodeXml){
        var view = this._super(nodeXml);
        view.alignParentTop = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTTOP)=== "true");
        view.alignParentRight = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTRIGHT)=== "true");
        view.alignParentBottom = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTBOTTOM)=== "true");
        view.alignParentLeft = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTLEFT)=== "true");
        
        view.centerHorizontal = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERHORIZONTAL)=== "true");
        view.centerVertical = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERVERTICAL)=== "true");
        view.centerInParent = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERINPARENT)=== "true");
        
        view.above = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ABOVE);
        view.below = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_BELOW);
        view.toRightOf = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TORIGHTOF);
        view.toLeftOf = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TOLEFTOF);
        return view;
    },
    onMeasure:function(maxWidth,maxHeight,loadListener){
        var this_=this;
        var tempListener = function()
        {
            var visibles = this_.getViewVisibles();
            
            if(visibles.length === 0)
            {
                switch (this.height)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (this_.padding.top+this_.padding.bottom)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                switch (this.width)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (this_.padding.left+this_.padding.right)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
                return;
            }
            
            var ancho = this_.getWidth();
            var alto = this_.getHeight();

            var mayHeight = 0;
            var mayWidth = 0;
            
            var index = -1;
            var view = null;
            var loadCompleted = function()
            {
                switch (this_.height)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (mayHeight)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                switch (this_.width)
                {
                    case LayoutInflater.MATCH_PARENT:break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (mayWidth)+'px';
                        this_.invalidate();
                        break;
                    default:break;
                }
                if(loadListener !== undefined)
                    loadListener();
            };
            var viewListener = function()
            {
                // Posicionamos la vista segun el layout
                if(view.alignParentTop === true)
                    view.elemDom.style.top = (this_.padding.top+view.margin.top)+'px';
                if(view.alignParentRight=== true)
                    view.elemDom.style.left = (ancho-view.getWidth()-view.margin.right-this_.padding.right)+'px';
                if(view.alignParentLeft=== true)
                    view.elemDom.style.left = (this_.padding.left+view.margin.left)+'px';
                if(view.alignParentBottom=== true)
                    view.elemDom.style.top = (alto-view.getHeight()-view.margin.bottom-this_.padding.bottom)+'px';
                
                if(view.centerHorizontal=== true)
                    view.elemDom.style.left = (ancho/2-view.getWidth()/2)+'px';
                if(view.centerVertical=== true)
                    view.elemDom.style.top = (alto/2-view.getHeight()/2)+'px';
                if(view.centerInParent=== true)
                {
                    view.elemDom.style.left = (ancho/2-view.getWidth()/2)+'px';
                    view.elemDom.style.top = (alto/2-view.getHeight()/2)+'px';
                }
                
    //            ATTR_LAYOUT_ABOVE:"layout_above",//id
                var idViewAbove = view.above;
                if(idViewAbove!==null&&view.above)
                {
                    var viewAbove = this_.findViewChildById(idViewAbove);
                    if(viewAbove===null)
                    {
                        var msg = "No se encuentra el view hijo con id ["+idViewAbove+"] en el contenedor ["+this_.name+"]";
                        console.log(msg);
                        throw new Exception();
                    }
                    view.elemDom.style.top = (parseInt(viewAbove.elemDom.style.top)-viewAbove.margin.top-view.getHeight()-view.margin.bottom)+'px';
                }
    //            ATTR_LAYOUT_BELOW:"layout_below",//id
                var idViewBelow = view.below;
                if(idViewBelow!==null&&view.below)
                {
                    var viewBelow = this_.findViewChildById(idViewBelow);
                    if(viewBelow===null)
                    {
                        var msg = "No se encuentra el view con id ["+idViewBelow+"] en el contenedor ["+this.elemXml.tagName+"] ()";
                        console.log(msg);
                        throw new Exception(msg);
                    }
                    view.elemDom.style.top = (parseInt(viewBelow.elemDom.style.top)+viewBelow.getHeight()+viewBelow.margin.bottom+view.margin.top)+'px';
                }
    //            ATTR_LAYOUT_TORIGHTOF:"layout_toRightOf",//id
                var idViewToLeft = view.toLeftOf;
                if(idViewToLeft!==null&&view.toLeftOf)
                {
                    var viewToLeft = this_.findViewChildById(idViewToLeft);
                    if(viewToLeft===null)
                        throw new Exception("No se encuentra el view con id ["+idViewToLeft+"] en en el contenedor ["+this_.name+"]");

                    if(view.alignParentLeft===true)
                    {
                        view.onMeasure(
                                parseInt(viewToLeft.elemDom.style.left)-view.margin.left-view.margin.right,
                                alto-this_.padding.top-this_.padding.bottom);
                    }
                    else if(view.toRightOf!== null)
                    {
                        console.log("Entrando por aquiiiiiaaaaaaaaaaaaaaaaaai");
                    }
                    else
                    {
                        view.elemDom.style.left = (parseInt(viewToLeft.elemDom.style.left)-view.getWidth()-view.margin.right)+'px';
                    }
                }
    //            ATTR_LAYOUT_TOLEFTOF:"layout_toLeftOf",//id
                var idViewToRight = view.toRightOf;
                if(idViewToRight!==null&&view.toRightOf)
                {
                    var viewToRight = this_.findViewById(idViewToRight);
                    if(viewToRight===null)
                        throw new Exception("No se encuentra el view con id ["+idViewToRight+"] en en el contenedor ["+this_.name+"]");
                    view.elemDom.style.left = (
                            parseInt(viewToRight.elemDom.style.left)
                            +viewToRight.margin.left 
                            +viewToRight.getWidth()
                            +viewToRight.margin.right
                            +view.margin.left)+'px';
                }
                // verificando si tiene position top
                if(view.elemDom.style.top === "")
                    view.elemDom.style.top = (this_.padding.top+view.margin.top)+'px';
                if(view.elemDom.style.left === "")
                    view.elemDom.style.left = (this_.padding.left+view.margin.left)+'px';

                var sum = parseInt(view.elemDom.style.top)+view.getHeight()+this_.padding.bottom+view.margin.bottom;
                if(sum > mayHeight)
                    mayHeight = sum;
                sum = parseInt(view.elemDom.style.left)+view.getWidth()+this_.padding.right+view.margin.right;
                if(sum > mayWidth)
                    mayWidth = sum;
                index++;
                if(index < visibles.length)
                {
                    view = visibles[index];
                    view.onMeasure(
                            ancho-this_.padding.left-this_.padding.right,
                            alto-this_.padding.top-this_.padding.bottom,
                            viewListener);
                }
                else
                    loadCompleted();
            };
            index = 0;
            view = visibles[index];
            view.onMeasure(
                    ancho-this_.padding.left-this_.padding.right,
                    alto-this_.padding.top-this_.padding.bottom,
                    viewListener);
        };
        this._super(maxWidth,maxHeight,tempListener);        
    }
});
Context = Class.extend({
    getLayoutInflater:function(){
        return LayoutInflater;
    },
    getResource: function(){
        return {
            loadJs: loadScript
        };
    }
});
Intent = function(context,pageName){
    this.extras = {};
    this.pageName = pageName;
    this.action = null;
    if(pageName === undefined)
        this.action = context;
    else
        this.context = context;
    this.backPage = null,
    this.putExtra = function(name,value){
        this.extras[name] = value;
    };
    this.getExtra=function(name){
        return this.extras[name];
    };
};
Page = Context.extend({
    viewRoot:null,
    viewListener:null,
    urlView:null,
    history:true,
    fullScreem:false,
    previusPage:null,
    REQUEST_OK:121,
    REQUEST_CANCELED:123,
    resultCode:this.REQUEST_CANCELED,
    resultData:null,
    requestCode:-1,
    loaded:false,
    
    findViewById:function(idView){
        if(this.viewRoot !== null)
            if(this.viewRoot.id === idView)
                return this.viewRoot;
        if(this.viewRoot instanceof ViewGroup){
            return this.viewRoot.findViewById(idView);
        }
        else
            throw new Exception("El contenidor principal para la pagina no es heredado de ViewGroup");
    },
    setContentView:function(objView){
        if(objView instanceof View)
            this.viewRoot = objView;
        else
            this.urlView = objView;
    },
    onCreate:function(){},
    onStart:function(){},
    onDestroy:function(){},
    onPause:function(){},
    onResume:function(){},
    
    setNoHistory:function(history){
        this.history = !history;
    },
    startPage:function(intent){
        if(intent === undefined||intent === null)
            throw new Exception("El intent es nulo o no esta definido");
        PageManager.startPage(intent);
    },
    setTitle:function(title){
        document.title = title;
    },
    finish:function(){
        PageManager.finishPage(this);
        if(this.previusPage !== null)
        {
            if(this.requestCode>0)
                this.previusPage.onPageResult(this.requestCode,this.resultCode,this.resultData);
        }
    },
    startPageForResult:function(intent,requestCode){
        this.requestCode = requestCode;
        this.startPage(intent);
    },
    onPageResult:function(requestCode,resultCode,intent){}
});

Dialog = Page.extend({
    elemBackground:null,
    context:null,
    bgVisble:true,
    bgProgressVisble:true,
    showBackground:function(show){
        this.bgVisble = show;
    },
    showBackgroundProgress:function(show){
        this.bgProgressVisble = show;
    },
    init:function(context){
        if(context === undefined||context === null)
            throw new Exception("El contexto no esta en los parametros o es nulo ["+context+"]");
        this.context = context;
    },
    show:function(){
        // Creamos un fondo opaco para el dialogo
        if(this.bgVisble===true)
        {
            this.elemBackground = document.createElement('div');
            // Margenes por defector
            this.elemBackground.style.marginTop = '0px';
            this.elemBackground.style.marginLeft = '0px';
            this.elemBackground.style.marginBottom = '0px';
            this.elemBackground.style.marginRight = '0px';
            // Padding por defecto
            this.elemBackground.style.paddingTop = '0px';
            this.elemBackground.style.paddingLeft = '0px';
            this.elemBackground.style.paddingBottom = '0px';
            this.elemBackground.style.paddingRight = '0px';
            this.elemBackground.style.position = "absolute";
            this.elemBackground.style.width = "100%";
            this.elemBackground.style.height = "100%";

            this.elemBackground.style.backgroundColor = "rgba(226, 242, 249, 0.5)";
            document.body.appendChild(this.elemBackground);
        }
        var this_ = this;
        PageManager.loadPage(null,this,this,
        {
            left:(PageManager.getWindowsDimension().width/2-100/2),
            top:(PageManager.getWindowsDimension().height/2-100/2),
            width:150,height:150,showBackground:this_.bgProgressVisble
        }).then(page=>{
            // Centramos el dialogo
            var navigator = PageManager.getWindowsDimension();
            page.viewRoot.elemDom.style.left = (navigator.width/2-page.viewRoot.elemDom.clientWidth/2)+'px';
            page.viewRoot.elemDom.style.top = (navigator.height/2-page.viewRoot.elemDom.clientHeight/2)+'px';
        });
    },
    cancel:function(){
        PageManager.removeContext(this);
        if(this.bgVisble===true)
            this.elemBackground.parentNode.removeChild(this.elemBackground);
    },
    getContext:function(){
        return this.context;
    }
});
PopupWindow = Page.extend({
    gravity:"none",
    view:null,
    context:null,
    margin:{left:0,top:0,right:0,bottom:0},
    init:function(context){
        if(context===null||context===undefined)
            throw new Exception("Falta el parametro context en e constructor del PopupWindows");
        this.context = context;
    },
    setPositionOnView:function(gravity){
        this.gravity = gravity;
    },
    setAlign:function(){
        
    },
    setMarginLeft:function(marginLeft){
        this.margin={left:marginLeft,top:this.margin.top,right:this.margin.right,bottom:this.margin.bottom};
    },
    setView:function(view){
        this.view = view;
    },
    show:function(){
        var this_ = this;
        var rect = this.view.elemDom.getBoundingClientRect();
        return PageManager.loadPage(null,this,this,
        {
            left:rect.left,
            top:rect.top,
            width:this_.view.getWidth(),
            height:this_.view.getHeight(),
            showBackground:false
        }).then(page=>{
            // Capturando ubicacion del view
            // Centramos el dialogo
            page.viewRoot.elemDom.style.left = (rect.left+page.margin.left)+'px';
            page.viewRoot.elemDom.style.top = (rect.top -page.viewRoot.elemDom.clientHeight)+'px';
        });
    },
    cancel:function(){
        PageManager.removeContext(this);
    }
});

PageManager = {
    mainPage:null,
    getInstance:function(){
        return this;
    },
    setMainPage:function(mainPageName){
        this.mainPage = mainPageName;
    },
    startAplication:function(){
        // Verificar si funciona
        initEventDevice();
        
        // Eliminamos margenes y padding del contenedor principal (body,html)
        document.body.style.paddingBottom='0px';
        document.body.style.paddingTop='0px';
        document.body.style.paddingLeft='0px';
        document.body.style.paddingRight='0px';
        document.body.style.margin='0px';
        document.body.style.width='100%';
        document.body.style.height='100%';
        document.body.style.position='absolute';
        
        // Creamos el estilo del boton
        var sheet = document.createElement('style');
        sheet.type = "text/css";
        //padding: 4px 20px;
        //sheet.innerHTML = '.AndButton {background:#ffae00; background: -webkit-linear-gradient(top, #ffae00, #d67600);background: -moz-linear-gradient(top, #ffae00, #d67600);background: -o-linear-gradient(top, #ffae00, #d67600);background: linear-gradient(top, #ffae00, #d67600);border:2px outset #dad9d8; font-family:Andika, Arial, sans-serif;font-size:1.1em;letter-spacing:0.05em;color:#fff;text-shadow: 0px 1px 10px #000;-webkit-border-radius: 15px;-moz-border-radius: 15px;border-radius: 15px;-webkit-box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;-moz-box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;}.AndButton:hover, .AndButton:focus {border:2px solid #dad9d8;}';
        sheet.innerHTML = '.AndButton {background-color: #2D8FC4;color:#fff;border-radius: 10px;}\n\
                           .AndButton:hover, .AndButton:focus {background-color: rgba(255,200,100,0.5);color:black;cursor: pointer;cursor: hand;}\n\
                           .AndButton:active {background-color: rgba(255,220,150,0.7);cursor: move;}';
        
        document.body.appendChild(sheet);
        
        // Convertimos en no seleccinable a todos los elementos
        // no editores
        var sheet = document.createElement('style');
        sheet.type = "text/css";
        //padding: 4px 20px;
        sheet.innerHTML = 'html,body,div,span,img{-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-o-user-select: none;-ms-user-select: none;user-select: none;}';
        document.body.appendChild(sheet);

        var sheet = document.createElement('style');
        sheet.type = "text/css";
        sheet.innerHTML =
                "@keyframes rotate{from {rotate:360deg;} to {rotate:0deg;}}"+
                "@-moz-keyframes rotate-record {0%   {-moz-transform: rotate(360deg);}100% {-moz-transform: rotate(0deg);}}"+
                ".rotate {-webkit-animation:rotate-record .8s infinite linear;-moz-animation:rotate-record .8s infinite linear;}";
        document.body.appendChild(sheet);
        
        // Iniciamos la actividad principal
        var intent = new Intent(null,this.mainPage);
        this.startPage(intent);
    },
    startPage:function(intent){
        // Instanciamos la Pagina
        var page = null;
        try{
            if(intent.action !== null)
                page = eval("new " + intent.action + "()");
            else
                page = eval("new " + intent.pageName + "()");
        }
        catch (o)
        {
            if(intent.action !== null)
                throw new Exception("No existe la pagina ["+intent.action+"]");
            else
                throw new Exception("No existe la pagina ["+intent.pageName+"]");
        }
        page.className = intent.pageName;
        
        return this.loadPage(intent.context,page,intent,
        {
            left:(PageManager.getWindowsDimension().width/2-150/2),
            top:(PageManager.getWindowsDimension().height/2-150/2),
            width:150,height:150,showBackground:true
        }).then(page=>{
            window.location.hash = page.className; 
        });
    },
    // proProgress:{left:?,top:?,width,height,showBackground:true}
    loadPage:function(contextPrevius,page,data,propProgress){
        var this_ = this;
        return new Promise(function(resolve,reject){
            page.previusPage = contextPrevius;
            // LLamamos el on create de la pagina
            page.onCreate(data);

            // Creamos el loader para la pagina
            var elemLoader = null;
            if(propProgress.showBackground === true)
            {
                elemLoader = document.createElement('div');
                elemLoader.style.margin='0px';
                elemLoader.style.width='100%';
                elemLoader.style.height='100%';
                elemLoader.style.position='absolute';
                elemLoader.style.backgroundColor = "rgba(1, 11,20, 0.5)";
            }

            var elemImgLoader = document.createElement('div');
            elemImgLoader.style.width=propProgress.width+'px';
            elemImgLoader.style.height=propProgress.height+'px';
            elemImgLoader.style.position='absolute';
            elemImgLoader.style.background='#05112B';
            elemImgLoader.style.top=propProgress.top+'px';
            elemImgLoader.style.left=propProgress.left+'px';

            var min = Math.min(propProgress.width,propProgress.height);
            propProgress.width = min;
            propProgress.height = min;

            var imgLoader = document.createElement('canvas');
            var radiusBack = propProgress.width/8;

            imgLoader.setAttribute("width",propProgress.width-radiusBack*2);
            imgLoader.setAttribute("height",propProgress.height-radiusBack*2);

            imgLoader.style.position='absolute';
            imgLoader.style.top=radiusBack+'px';
            imgLoader.style.left=radiusBack+'px';
            var ctx = imgLoader.getContext("2d");

            // Pintando spinner
            var lines = 13;
            var radius = imgLoader.width/10;
            var rotation = radius;
            ctx.save();

            elemImgLoader.style.borderRadius=(radiusBack)+'px';

            ctx.translate(imgLoader.width / 2, imgLoader.height / 2);
            ctx.rotate(Math.PI * 2 * rotation);
            for (var i = 0; i < lines; i++){
                ctx.beginPath();
                ctx.rotate(Math.PI * 2 / lines);
                ctx.fillStyle = "rgba(250,254,255," + (1-i / lines) + ")";
                ctx.arc(imgLoader.width/2-radius,0, radius,0, 2 * Math.PI, false);
                ctx.fill();
                radius = radius-radius/(lines-1);
                if(radius < 1)
                    break;
            }
            ctx.restore();

            if(propProgress.showBackground === true)
                document.body.appendChild(elemLoader);
            imgLoader.style.left = (elemImgLoader.clientWidth/2+radiusBack)+"px";
            elemImgLoader.appendChild(imgLoader);
            document.body.appendChild(elemImgLoader);
            imgLoader.className = "rotate";

            // Establecemos el listener para identificar cuando se
            // termino la carga de todas las vistas
            var viewListener = function(){
                if(contextPrevius !== null)
                {
                    if(contextPrevius.history === false)
                        this_.removeContext(contextPrevius);
                    contextPrevius.onDestroy();
                }
                // Ocultamos el progress
                if(propProgress.showBackground === true)
                    elemLoader.parentNode.removeChild(elemLoader);
                    //document.body.removeChild(elemLoader);
                elemImgLoader.parentNode.removeChild(elemImgLoader);
                // Iniciamos la pagina
                page.viewRoot.elemDom.style.opacity = 0;
                page.viewRoot.elemDom.style.visibility = 'visible';

                //page.viewRoot.elemDom.style["-moz-transition"] = "opacity 5s ease-in-out";
                page.viewRoot.elemDom.style.transition = "opacity 5s ease-in-out";
                page.viewRoot.elemDom.style.opacity = 1;
                resolve(page);
                page.loaded = true;
                page.onStart(data);
            };

            // Verificamos si tiene el view root
            if(page.viewRoot!==null)
            {
                page.viewRoot.elemDom.style.visibility = 'hidden';
                document.body.appendChild(page.viewRoot.elemDom);
                var navigator = this_.getWindowsDimension();
                page.viewRoot.onMeasure(
                    navigator.width,
                    navigator.height,
                    viewListener);
            }
            else if(page.urlView !== null)
            {
                LayoutInflater.inflateFromURL(
                        page,
                        page.urlView).then((view)=>{
                            page.viewRoot = view;
                            page.viewRoot.elemDom.style.visibility = 'hidden';
                            document.body.appendChild(page.viewRoot.elemDom);

                            var navigator = this_.getWindowsDimension();
                            page.viewRoot.onMeasure(
                                    navigator.width,
                                    navigator.height,
                                    viewListener);
                        }).catch((error)=>{
                            reject(error);
                        });
            }
            else // Ni un view establecido
            {

            }
        });
    },
    removeContext:function(context){
        var element = context.viewRoot.elemDom;
        element.parentNode.removeChild(element);
        context.onDestroy();
    },
    finishPage:function(context){
        this.removeContext(context);
    },
    getWindowsDimension:function(){
//        return {
//                    width:document.body.clientWidth,
//                    height:document.body.clientHeight
//               };
        var dim = {
                    width: window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0,
                    height: window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0
               };
        return dim;
    }
};

// ********* PARA LAS CONEXION A SERVICIOS WEB ***********
HttpRequest = Class.extend({
    url:null,
    params:null,
    condition:null,
    data:null,
    xmlhttp:null,
    init:function(url){
        this.url = url;
        this.params = new Array();
        if (window.XMLHttpRequest)
            this.xmlhttp = new XMLHttpRequest();
        else
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    },
    setEntity:function(d){
        this.data = d;
    },
    getMethod:function(){
        return null;
    },
    setUrl:function(url){
        this.url = url;
    },
    addParam:function(name,value){
        this.params[name] = value;
    },
    setCondition:function(condition){
        this.condition = condition;
    },
    send:function(){
        let this_=this;
        return new Promise((resolve,reject)=>{
            var url = this.url;
            if(this.condition !== null)
                url = url+'?'+this.condition;
            else{
                if(this.params.length >0)
                {
                    url = url+'?';
                    for(var elem in this.params){
                        url=(url+(elem+'='+this.params[elem])+"&&");
                    }
                    url = url.substring(0,url.length-2);
                }
            }
            console.log("METODO",this.getMethod());
            console.log("URL",url);
            
            this.xmlhttp.open(this.getMethod(),url,true);
            this.xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            this.xmlhttp.setRequestHeader('Content-Type', 'application/json');
            this.xmlhttp.setRequestHeader('Content-Type', 'application/json');
            
            var this_ = this;
            this.xmlhttp.onreadystatechange = function(){
                if (this_.xmlhttp.readyState === XMLHttpRequest.DONE && this_.xmlhttp.status === 200){
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
            this.xmlhttp.send(''+JSON.stringify(this.data));
        });        
    },
    abort:function(){
        this.xmlhttp.abort();
    }
});
var HttpResponse = function(xmlhttp){
    this.xmlhttp = xmlhttp;
    this.showProgress = false;
    this.message = null;
    this.getJson = function(){
        return JSON.parse(xmlhttp.responseText);
        // JSON.stringify(arr);
    };
    this.getRootElementXml = function(){
        return this.xmlhttp.responseXML.documentElement;
    };
    this.getText = function(){
        return this.xmlhttp.responseText;
    };
    this.getImage=function(){
    };
};

HttpGet = HttpRequest.extend({getMethod:function(){return "GET";}});
HttpPost = HttpRequest.extend({getMethod:function(){return "POST";}});
HttpPut = HttpRequest.extend({getMethod:function(){return "PUT";}});
HttpDelete = HttpRequest.extend({getMethod:function(){return "DELETE";}});

var DefaultHttpClient = function(url){
    this.url = url;
    this.execute = function(httpRequest){
        httpRequest.setUrl(this.url);
        return httpRequest.send();
    };
};