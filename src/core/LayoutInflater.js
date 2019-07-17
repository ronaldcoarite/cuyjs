var ADLayoutUtils = {
    onLoadPage: function(callback){
        if (window.attachEvent){
            window.attachEvent('onload', callback);
        }
        else if (window.addEventListener){
            window.addEventListener('load', callback, false);
        }
        else{
            document.addEventListener('load', callback, false);
        }
    }
};

var LayoutInflater = {
    // Atributos generales para los layouts
    ATTR_LAYOUT_WIDTH: "layout_width",
    ATTR_LAYOUT_HEIGHT: "layout_height",
    ATTR_ID: "id",
    ATTR_LAYOUT_GRAVITY: "layout_gravity",

    ATTR_LAYOUT_MARGIN: "layout_margin",
    ATTR_LAYOUT_MARGIN_TOP: "layout_marginTop",
    ATTR_LAYOUT_MARGIN_LEFT: "layout_marginLeft",
    ATTR_LAYOUT_MARGIN_RIGHT: "layout_marginRight",
    ATTR_LAYOUT_MARGIN_BOTTOM: "layout_marginBottom",

    ATTR_PADDING: "padding",
    ATTR_PADDING_TOP: "paddingTop",
    ATTR_PADDING_LEFT: "paddingLeft",
    ATTR_PADDING_RIGHT: "paddingRight",
    ATTR_PADDING_BOTTOM: "paddingBottom",

    ATTR_ON_CLICK: "onClick",
    ATTR_BACKGROUND: "background",
    ATTR_ORIENTATION: "orientation",
    ATTR_LAYOUT_WEIGHT: "layout_weight",

    // Atributos de RelativeLayout
    ATTR_LAYOUT_ALIGNPARENTLEFT: "layout_alignParentLeft",// true,false
    ATTR_LAYOUT_ALIGNPARENTTOP: "layout_alignParentTop",//true,false
    ATTR_LAYOUT_ALIGNPARENTRIGHT: "layout_alignParentRight",//true,false
    ATTR_LAYOUT_ALIGNPARENTBOTTOM: "layout_alignParentBottom",//true,false

    ATTR_LAYOUT_CENTERHORIZONTAL: "layout_centerHorizontal",//true,false
    ATTR_LAYOUT_CENTERVERTICAL: "layout_centerVertical",//true,false
    ATTR_LAYOUT_CENTERINPARENT: "layout_centerInParent",//true,false

    ATTR_LAYOUT_ABOVE: "layout_above",//id
    ATTR_LAYOUT_BELOW: "layout_below",//id

    ATTR_LAYOUT_TORIGHTOF: "layout_toRightOf",//id
    ATTR_LAYOUT_TOLEFTOF: "layout_toLeftOf",//id

    ATTR_MIN_WIDTH: "minWidth",
    ATTR_MIN_HEIGHT: "minHeight",

    // TextView
    ATTR_LAYOUT_TEXT: "text",
    ATTR_DRAWABLE_LEFT: "drawableLeft",
    ATTR_DRAWABLE_TOP: "drawableTop",
    ATTR_DRAWABLE_BOTTOM: "drawableBottom",
    ATTR_DRAWABLE_RIGHT: "drawableRight",

    // ImageVIew
    ATTR_SRC: "src",
    ATTR_SCALE_TYPE: "scaleType",
    FIT_XY: "fitXY",
    FIT_START: "fitStart",
    FIT_CENTER: "fitCenter",
    //CENTER : "center"

    // LinearLayout
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",

    // vista
    ATTR_VISIBILITY: "visibility",

    // Valores que pueden tomar los atributos
    MATCH_PARENT: "match_parent",
    WRAP_CONTENT: "wrap_content",
    LEFT: "left",
    RIGHT: "right",
    BOTTOM: "bottom",
    CENTER_HORIZONTAL: "center_horizontal",
    CENTER_VERTICAL: "center_vertical",
    CENTER: "center",
    TOP: "top",

    VISIBLE: "visible",
    INVISIBLE: "invisible",
    GONE: "gone",

    /**
     * Instancia la vista y realizar el parseo a travez del la raiz del documento XML pasado como parametro
     * @param {*} context  EL contexto de la pagina
     * @param {*} firstElement El primer elemento de tipo XML para crear la vista
     */
    parse: function (context, firstElement) {
        var view = null;
        try {
            var view = eval("new " + firstElement.tagName + "(context)");
        }
        catch (o) {
            console.log(o);
            throw new Exception("No existe la vista [" + firstElement.tagName + "]");
        }
        view.parse(firstElement);
        return view;
    },
    // createView: function (context, domXmlElement) {
    //     return this.parse(context, domXmlElement);
    // },
    inflateFromURL: async function (context, urlXmlLayout,subContextPath) {
        let viewXmlRoot = await loadLayoutSync(urlXmlLayout);
        var view = this.parse(context, xmlhttp.responseXML.documentElement);
        return view;
    }
    // ,inflateFromID: function (idElementRoot) {
    //     // Buscamos el elemento
    //     var element = document.getElementsByTagName(idElementRoot);
    //     if (element.length === 0)
    //         throw new Exception("No exisite la vista con el id [" + idElementRoot + "]");
    //     return this.parse(element);
    // }
};