class ViewGroup extends View{
    constructor(context){
        super(context);
        this.viewsChilds = new Array();
        this.name = "ViewGroup";
        //this.elemDom.style.overflow = 'hidden';
    }
    // @Override
    parse(nodeXml) {
        super.parse(nodeXml);
        //console.log("Nro hijos de "+nodeXml.tagName+" = "+nodeXml.children.length);
        for (var index = 0; index < nodeXml.children.length; index++){
            var child = LayoutInflater.inflate(this.context, nodeChild);
            child.parentView = this;
            this.viewsChilds.push(child);
        }
    }
    findViewById(idView) {
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
    }
    findViewChildById(idView) {
        if (idView === null && idView === undefined)
            return null;
        for (var i = 0; i < this.viewsChilds.length; i++) {
            var view = this.viewsChilds[i];
            if (view.id === idView)
                return view;
        }
        return null;
    }
    addView(viewChild) {
        if (viewChild === null || viewChild === undefined)
            throw new Exception("El view que desea agregar es nulo o no esta definido");
        if(!viewChild instanceof View)
            throw new Exception("El objeto a agregar no es una instancia de View");
        viewChild.parentView = this;
        this.viewsChilds.push(viewChild);
        this.invalidate();
    }
    getViewVisibles() {
        // agrupamos los GONE's y los INVISIBLE's
        var vistos = new Array();
        for (var index = 0; index < this.viewsChilds.length; index++) {
            var view = this.viewsChilds[index];
            if (view.visibility === View.VISIBLE)
                vistos.push(view);
        }
        return vistos;
    }
    getChildCount() {
        return this.viewsChilds.length;
    }
    getChildAt(i) {
        return this.viewsChilds[i];
    }
}