class LayoutInflater{
    // Atributos generales para los layouts
    static ATTR_WIDTH = "width";
    static ATTR_HEIGHT= "height";
    static ATTR_GRAVITY= "layoutGravity";

    static ATTR_GRAVITY_LEFT = "left";
    static ATTR_GRAVITY_RIGHT = "right";
    static ATTR_GRAVITY_TOP = "top";
    static ATTR_GRAVITY_BOTTOM = "bottom";
    static ATTR_GRAVITY_CENTER = "center";
    static ATTR_GRAVITY_CENTER_H = "center_horizontal";
    static ATTR_GRAVITY_CENTER_V = "center_vertical";

    static ATTR_MARGIN= "margin";
    static ATTR_MARGIN_TOP= "marginTop";
    static ATTR_MARGIN_LEFT= "marginLeft";
    static ATTR_MARGIN_RIGHT= "marginRight";
    static ATTR_MARGIN_BOTTOM= "marginBottom";

    static ATTR_PADDING= "padding";
    static ATTR_PADDING_TOP= "paddingTop";
    static ATTR_PADDING_LEFT= "paddingLeft";
    static ATTR_PADDING_RIGHT= "paddingRight";
    static ATTR_PADDING_BOTTOM= "paddingBottom";

    static ATTR_ON_CLICK= "onClick";
    static ATTR_BACKGROUND= "background";
    static ATTR_ORIENTATION= "orientation";
    // Utilizado solo en LinearLayout
    static ATTR_WEIGHT= "weight";

    // Atributos de RelativeLayout
    static ATTR_ALIGNPARENTLEFT= "alignParentLeft";// true;false
    static ATTR_ALIGNPARENTTOP= "alignParentTop";//true;false
    static ATTR_ALIGNPARENTRIGHT= "alignParentRight";//true;false
    static ATTR_ALIGNPARENTBOTTOM= "alignParentBottom";//true;false

    static ATTR_CENTERHORIZONTAL= "centerHorizontal";//true;false
    static ATTR_CENTERVERTICAL= "centerVertical";//true;false
    static ATTR_CENTERINPARENT= "centerInParent";//true;false

    static ATTR_ABOVE= "above";//id
    static ATTR_BELOW= "below";//id

    static ATTR_TORIGHTOF= "toRightOf";//id
    static ATTR_TOLEFTOF= "toLeftOf";//id

    static ATTR_MIN_WIDTH= "minWidth";
    static ATTR_MIN_HEIGHT= "minHeight";

    // TextView
    static ATTR_TEXT= "text";
    static ATTR_DRAWABLE_LEFT= "drawableLeft";
    static ATTR_DRAWABLE_TOP= "drawableTop";
    static ATTR_DRAWABLE_BOTTOM= "drawableBottom";
    static ATTR_DRAWABLE_RIGHT= "drawableRight";

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

    static REGEX_VARS = /\{\{([a-z_A-Z][a-zA-z_.\d]*)\}\}+/g;

    /**
     * Instancia la vista y realizar el parseo a travez del la raiz del documento XML pasado como parametro
     * @param {*} context  EL contexto de la pagina
     * @param {*} firstElement El primer elemento de tipo XML para crear la vista
     */
    static async parse(context, firstElement) {
        var view = null;
        try {
            view = eval("new " + firstElement.tagName + "(context)");
        }
        catch (o) {
            throw new Exception("No existe la vista [" + firstElement.tagName + "]");
        }
        await view.parse(firstElement);
        return view;
    }

    static async inflate(context,xmlRoot) {
        let view = await this.parse(context, xmlRoot);
        return view;
    }
}