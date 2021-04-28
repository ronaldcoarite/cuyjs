class Container extends View{
    constructor(context){
        super(context);
        this.viewsChilds = new Array();
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

    async removeAllViews(){
        for(let view of this.viewsChilds){
            view.elemDom.remove();
        }
        this.viewsChilds = new Array();
        await this.onReMeasure();
    }

    // @Override
    findViewById(idView) {
        let view = super.findViewById(idView);
        if (view)
            return view;
        for (let view of this.viewsChilds) {
            let tempView = view.findViewById(idView);
            if(tempView)
                return tempView;
        }
        return null;
    }

    async removeView(viewChild){
        let index = this.viewsChilds.indexOf(viewChild);
        if (index === -1)
            throw new Exception(`No se encontro el view [${viewChild}] en la vista [${this.constructor.name}]`);
        this.viewsChilds.splice(index, 1);
        viewChild.elemDom.remove();
        await this.onReMeasure();
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

    getChildCount() {
        return this.viewsChilds.length;
    }

    getChildAt(i) {
        return this.viewsChilds[i];
    }

    getChilds(){
        return this.viewsChilds;
    }

    getFirstChild(){
        if(this.viewsChilds.length>0)
            return this.viewsChilds[0];
        return null;
    }

    async addView(viewChild) {
        if (viewChild === null || viewChild === undefined)
            throw new Exception("El View que desea agregar es nulo o no esta definido");
        if(!viewChild instanceof View)
            throw new Exception(`El objeto [${viewChild}] a agregar no es una instancia de View`);
        this.viewsChilds.push(viewChild);
        viewChild.parentView = this;

        await viewChild.loadResources();
        this.elemDom.appendChild(viewChild.elemDom);
        if(this.elemDom.style.visibility==='visible'){
            await this.onReMeasure();
            viewChild.showView();
        }
    }

    async setFirstChild(viewChild){
        await this.removeAllViews();
        await this.addView(viewChild);
    }
}