ViewGroup = View.extend({
    viewsChilds: null,
    init: function (context) {
        this._super(context);
        this.viewsChilds = new Array();
        this.name = "ViewGroup";
        this.elemDom.style.overflow = 'hidden';
    },
    parse: function (nodeXml) {
        this._super(nodeXml);
        // Verificamos si tiene hijos
        if (nodeXml.children.length === 0)
            return;
        //console.log("Nro hijos de "+nodeXml.tagName+" = "+nodeXml.children.length);
        for (var index = 0; index < nodeXml.children.length; index++)
            this.parseViewChild(nodeXml.children[index]);
    },
    parseViewChild: function (nodeChild) {
        var child = LayoutInflater.parse(this.context, nodeChild);
        child.parentView = this;
        this.viewsChilds.push(child);
        return child;
    },
    findViewById: function (idView) {
        if (idView === null && idView === undefined)
            return null;
        for (var i = 0; i < this.viewsChilds.length; i++) {
            var view = this.viewsChilds[i];
            if (view.id === idView)
                return view;
            if (view instanceof ViewGroup) {
                var viewTemp = view.findViewById(idView);
                if (viewTemp !== null)
                    return viewTemp;
            }
        }
        return null;
    },
    findViewChildById: function (idView) {
        if (idView === null && idView === undefined)
            return null;
        for (var i = 0; i < this.viewsChilds.length; i++) {
            var view = this.viewsChilds[i];
            if (view.id === idView)
                return view;
        }
        return null;
    },
    addView: function (viewChild) {
        if (viewChild === null || viewChild === undefined)
            throw new Exception("El view que desea agregar  es nulo o no esta definido");
        viewChild.parentView = this;
        this.viewsChilds.push(viewChild);
        this.invalidate();
    },
    getViewVisibles: function () {
        // agrupamos los GONE's y los INVISIBLE's
        var vistos = new Array();
        for (var index = 0; index < this.viewsChilds.length; index++) {
            var view = this.viewsChilds[index];
            if (view.visibility === LayoutInflater.VISIBLE)
                vistos.push(view);
        }
        return vistos;
    },
    getChildCount: function () {
        return this.viewsChilds.length;
    },
    getChildAt: function (i) {
        return this.viewsChilds[i];
    }
});