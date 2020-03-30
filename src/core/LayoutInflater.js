class LayoutInflater{
    // Atributos generales para los layouts
    static ATTR_LAYOUT_WIDTH = "layout_width";
    static ATTR_LAYOUT_HEIGHT= "layout_height";
    static ATTR_ID= "id";
    static ATTR_LAYOUT_GRAVITY= "layout_gravity";

    static ATTR_LAYOUT_GRAVITY_LEFT = "left";
    static ATTR_LAYOUT_GRAVITY_RIGHT = "right";
    static ATTR_LAYOUT_GRAVITY_TOP = "top";
    static ATTR_LAYOUT_GRAVITY_BOTTOM = "bottom";
    static ATTR_LAYOUT_GRAVITY_CENTER = "center";
    static ATTR_LAYOUT_GRAVITY_CENTER_H = "center_horizontal";
    static ATTR_LAYOUT_GRAVITY_CENTER_V = "center_vertical";

    static ATTR_LAYOUT_MARGIN= "layout_margin";
    static ATTR_LAYOUT_MARGIN_TOP= "layout_marginTop";
    static ATTR_LAYOUT_MARGIN_LEFT= "layout_marginLeft";
    static ATTR_LAYOUT_MARGIN_RIGHT= "layout_marginRight";
    static ATTR_LAYOUT_MARGIN_BOTTOM= "layout_marginBottom";

    static ATTR_PADDING= "padding";
    static ATTR_PADDING_TOP= "paddingTop";
    static ATTR_PADDING_LEFT= "paddingLeft";
    static ATTR_PADDING_RIGHT= "paddingRight";
    static ATTR_PADDING_BOTTOM= "paddingBottom";

    static ATTR_ON_CLICK= "onClick";
    static ATTR_BACKGROUND= "background";
    static ATTR_ORIENTATION= "orientation";
    // Utilizado solo en LinearLayout
    static ATTR_LAYOUT_WEIGHT= "layout_weight";

    // Atributos de RelativeLayout
    static ATTR_LAYOUT_ALIGNPARENTLEFT= "layout_alignParentLeft";// true;false
    static ATTR_LAYOUT_ALIGNPARENTTOP= "layout_alignParentTop";//true;false
    static ATTR_LAYOUT_ALIGNPARENTRIGHT= "layout_alignParentRight";//true;false
    static ATTR_LAYOUT_ALIGNPARENTBOTTOM= "layout_alignParentBottom";//true;false

    static ATTR_LAYOUT_CENTERHORIZONTAL= "layout_centerHorizontal";//true;false
    static ATTR_LAYOUT_CENTERVERTICAL= "layout_centerVertical";//true;false
    static ATTR_LAYOUT_CENTERINPARENT= "layout_centerInParent";//true;false

    static ATTR_LAYOUT_ABOVE= "layout_above";//id
    static ATTR_LAYOUT_BELOW= "layout_below";//id

    static ATTR_LAYOUT_TORIGHTOF= "layout_toRightOf";//id
    static ATTR_LAYOUT_TOLEFTOF= "layout_toLeftOf";//id

    static ATTR_MIN_WIDTH= "minWidth";
    static ATTR_MIN_HEIGHT= "minHeight";

    // TextView
    static ATTR_LAYOUT_TEXT= "text";
    static ATTR_DRAWABLE_LEFT= "drawableLeft";
    static ATTR_DRAWABLE_TOP= "drawableTop";
    static ATTR_DRAWABLE_BOTTOM= "drawableBottom";
    static ATTR_DRAWABLE_RIGHT= "drawableRight";

    // ImageVIew
    static ATTR_SRC= "src";
    static ATTR_SCALE_TYPE= "scaleType";

    static FIT_XY= "fitXY";
    static FIT_START= "fitStart";
    static FIT_CENTER= "fitCenter";
    static FIT_CENTER_CROP= "fitCenterCrop";
    static FIT_CENTER_INSIDE= "fitCenterInside";
    static FIT_END= "fitEnd";
    //CENTER = "center"

    // LinearLayout
    static LIN_ORIENTATION_HORIZONTAL= "horizontal";
    static LIN_ORIENTATION_VERTICAL= "vertical";

    // vista
    static ATTR_VISIBILITY= "visibility";

    // Valores que pueden tomar los atributos
    static MATCH_PARENT= "match_parent";
    static WRAP_CONTENT= "wrap_content";
    static LEFT= "left";
    static RIGHT= "right";
    static BOTTOM= "bottom";
    static CENTER_HORIZONTAL= "center_horizontal";
    static CENTER_VERTICAL= "center_vertical";
    static CENTER= "center";
    static TOP= "top";

    static VISIBLE= "visible";
    static INVISIBLE= "invisible";
    static GONE= "gone";

    /**
     * Instancia la vista y realizar el parseo a travez del la raiz del documento XML pasado como parametro
     * @param {*} context  EL contexto de la pagina
     * @param {*} firstElement El primer elemento de tipo XML para crear la vista
     */
    static parse(context, firstElement) {
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
    }

    static inflate(context,xmlRoot) {
        var view = this.parse(context, xmlRoot);
        return view;
    }
}