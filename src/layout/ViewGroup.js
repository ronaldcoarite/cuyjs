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
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = LayoutInflater.inflate(this.context, nodeChild);
            child.parentView = this;
            this.viewsChilds.push(child);
        }
    }
    findViewById(idView) {
        if (idView === null && idView === undefined)
            return null;
        for (let i = 0; i < this.viewsChilds.length; i++) {
            let view = this.viewsChilds[i];
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
        for (let i = 0; i < this.viewsChilds.length; i++) {
            let view = this.viewsChilds[i];
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
        let vistos = new Array();
        for (let index = 0; index < this.viewsChilds.length; index++) {
            let view = this.viewsChilds[index];
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
    //@Override
    createDomElement() {
        super.createDomElement();
        for(let view of this.viewsChilds)
            this.elemDom.appendChild(view.createDomElement());
        return this.elemDom;
    }
    
    //@Override
    async invalidateSync(){
        await super.invalidateSync();
        for(let view of this.viewsChilds)
            await view.invalidateSync();
    }
    
    //@Override
    async onMeasureSync(maxWidth, maxHeigth){
        await super.onMeasureSync(maxWidth, maxHeigth);
        for(let view of this.viewsChilds)
            await view.onMeasureSync(maxWidth, maxHeigth);
    }
}