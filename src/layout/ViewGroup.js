class ViewGroup extends View{
    constructor(context){
        super(context);
        this.viewsChilds = new Array();
        //this.elemDom.style.overflow = 'hidden';
    }
    // @Override
    parse(nodeXml) {
        super.parse(nodeXml);
        //console.log("Nro hijos de "+nodeXml.tagName+" = "+nodeXml.children.length);
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = this.parseViewChild(nodeChild);
            child.parentView = this;
            this.viewsChilds.push(child);
        }
    }

    parseViewChild(nodeXml) {
        let child = LayoutInflater.inflate(this.context, nodeXml);
        return child;
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

    async addViewSync(viewChild) {
        if (viewChild === null || viewChild === undefined)
            throw new Exception("El view que desea agregar es nulo o no esta definido");
        if(!viewChild instanceof View)
            throw new Exception("El objeto a agregar no es una instancia de View");
        viewChild.parentView = this;
        this.elemDom.appendChild(viewChild.createDomElement());
        this.viewsChilds.push(viewChild);
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
    async loadResources(){
        await super.loadResources();
        for(let view of this.viewsChilds)
            await view.loadResources();
    }
    
    //@Override
    async onMeasureSync(maxWidth, maxHeight){
        await super.onMeasureSync(maxWidth, maxHeight);
        for(let view of this.viewsChilds)
            await view.onMeasureSync(maxWidth, maxHeight);
    }
    
    getContentWidth(maxWidth,viewChild){
        if(maxWidth <= 0)
            return 0;
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                return maxWidth - this.padding.left - this.padding.right - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
            case LayoutInflater.WRAP_CONTENT:
                return this.elemDom.clientWidth - this.padding.left - this.padding.right  - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
            default: // Tamanio especifico 
                let lenght = parseInt(this.width);
                return lenght - this.padding.left - this.padding.right - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
        }
    }

    getContentHeight(maxHeight,viewChild){
        if(maxHeight <= 0)
            return 0;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                return maxHeight - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
            case LayoutInflater.WRAP_CONTENT:
                return this.elemDom.clientWidth - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
            default: // Tamanio especifico 
                let lenght = parseInt(this.height);
                return lenght - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
        }
    }
}