class ViewGroup extends View{
    constructor(context){
        super(context);
        this.viewsChilds = new Array();
        //this.elemDom.style.overflow = 'hidden';
    }
    
    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = await this.parseViewChild(nodeChild);
            child.parentView = this;
            this.viewsChilds.push(child);
        }
    }

    async parseViewChild(nodeXml) {
        let child = await LayoutInflater.inflate(this.context, nodeXml);
        return child;
    }

    // @Override
    findViewById(idView) {
        let view = super.findViewById(idView);
        if (view)
            return view;
        for (let i = 0; i < this.viewsChilds.length; i++) {
            view = this.viewsChilds[i];
            let tempView = view.findViewById(idView);
            if(tempView)
                return tempView;
        }
        return null;
    }

    async removeView(viewChild){
        let index = this.viewsChilds.indexOf(viewChild);
        if (index === -1)
            throw new Exception(`No se encontro el view en la vista [${this.constructor.name}]`);
        this.viewsChilds.splice(index, 1);
        viewChild.elemDom.remove();
        await this.onReMeasure();
    }

    async addView(viewChild) {
        if (viewChild === null || viewChild === undefined)
            throw new Exception("El view que desea agregar es nulo o no esta definido");
        if(!viewChild instanceof View)
            throw new Exception(`El objeto [${viewChild}] a agregar no es una instancia de View`);
        this.viewsChilds.push(viewChild);
        viewChild.parentView = this;
        this.elemDom.appendChild(await viewChild.createDomElement());
        await viewChild.loadResources();
        await this.onReMeasure();
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

    getChilds(){
        return this.viewsChilds;
    }
    
    //@Override
    async createDomElement() {
        await super.createDomElement();
        for(let view of this.viewsChilds)
            this.elemDom.appendChild(await view.createDomElement());
        return this.elemDom;
    }
    
    //@Override
    async loadResources(){
        await super.loadResources();
        for(let view of this.viewsChilds)
            await view.loadResources();
    }
    
    //@Override
    async onMeasure(maxWidth, maxHeight){
        await super.onMeasure(maxWidth, maxHeight);
        for(let view of this.viewsChilds)
            await view.onMeasure(maxWidth, maxHeight);
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