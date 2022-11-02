class Dialog extends Context{
    constructor(context){
        super();
        if(!(context instanceof Page))
            throw new Exception(`El contexto para el Dialogo [${this.constructor.name}] debe ser un [Page] y se envio [${context}]`);
        this.elemBackground = null;
        this.context = context;
        this.bgVisble = true;
        this.bgProgressVisble = true;
        this.resolvePromise = null;

        this.viewRoot = null;
        this.urlView = null;

        this.visible = false;
        this.dimensionListener = true;
    }

    // @Override
    async onResize(){
        if(this.dimensionListener){
            let windowsDimension = PageManager.getWindowsDimension();
            let w = windowsDimension.width-(windowsDimension.width*this.viewRoot.margin.left/100)-(windowsDimension.width*this.viewRoot.margin.right/100);
            let h = windowsDimension.height-(windowsDimension.height*this.viewRoot.margin.top/100)-(windowsDimension.height*this.viewRoot.margin.bottom/100);
            if(this.viewRoot.maxWidth>0 && w > this.viewRoot.maxWidth)
                w = this.viewRoot.maxWidth;
            if(this.viewRoot.maxHeigth>0 && w > this.viewRoot.maxHeigth)
                h = this.viewRoot.maxHeigth;
            await this.viewRoot.onMeasure(w,h)
            this.setPosition(windowsDimension);
        }
    }

    enableDimensionListener(enable){
        this.dimensionListener = enable?true:false;
    }

    setContentView(view,model) {
        this.model = model;
        if (view instanceof View)
            this.viewRoot = view;
        else if(typeof view==='string')
            this.urlView = view;
        else
            throw `El contenido enviado [${view}] no es valido para el [Dialog]. Establesca solo una url con XML para el layout o una intancia de View`;
    }

    findViewById(idView) {
        if (this.viewRoot !== null)
            if (this.viewRoot.id === idView)
                return this.viewRoot;
        if (this.viewRoot instanceof ViewGroup || this.viewRoot instanceof ScrollView) {
            return this.viewRoot.findViewById(idView);
        }
        else
            throw new Exception(`El contenidor principal para el Dialogo [${this.constructor.name}] no es heredado de ViewGroup`);
    }

    showBackground(show){
        this.bgVisble = show;
    }

    showBackgroundProgress(show){
        this.bgProgressVisble = show;
    }

    async onStart(){

    }

    isVisible(){
        return this.visible;
    }

    async show(){
        if(this.visible)
            throw new Exception(`El Dialog [${this.constructor.name}] ya se encuentra visible`);
        this.getContext().viewRoot.elemDom.style.filter = "blur(5px)";
        this.context.modals.push(this);
        var this_ = this;
        return new Promise((resolve,reject)=>{
            this_.resolvePromise = resolve;
            (async () => {
                // Creamos un fondo opaco para el dialogo
                let pageAnimation = null;
                if (this_.bgVisble === true) {
                    this_.elemBackground = document.createElement('div');

                    // Margenes por defector
                    this_.elemBackground.style.marginTop = '0px';
                    this_.elemBackground.style.marginLeft = '0px';
                    this_.elemBackground.style.marginBottom = '0px';
                    this_.elemBackground.style.marginRight = '0px';
                    // Padding por defecto
                    this_.elemBackground.style.paddingTop = '0px';
                    this_.elemBackground.style.paddingLeft = '0px';
                    this_.elemBackground.style.paddingBottom = '0px';
                    this_.elemBackground.style.paddingRight = '0px';
                    this_.elemBackground.style.position = "absolute";
                    this_.elemBackground.style.width = "100%";
                    this_.elemBackground.style.height = "100%";

                    this_.elemBackground.style.backgroundColor = "rgba(30, 30, 30, 0.7)";
                    document.body.appendChild(this_.elemBackground);
                }
                
                if(this_.bgProgressVisble){
                    // Cargando la vista
                    pageAnimation = new SpinnerAnimation();
                    pageAnimation.show();
                }
                

                // Verificamos si tiene contenido la pagina
                if(this_.viewRoot || this_.urlView)
                    ; // Contenido definido
                else{
                    reject(new Exception(`El dialogo [${this_.constructor.name}] no tiene contenido definido. Asigne uno con [setContentView]`));
                    if(pageAnimation)
                        pageAnimation.hide();
                    return;
                }
                if(this_.viewRoot === null){
                    let rootXml = await Resource.loadLayoutSync(this_.urlView);
                    this_.viewRoot = await LayoutInflater.inflate(this_,rootXml,this.model);
                }

                document.body.appendChild(this_.viewRoot.elemDom);
                await this.viewRoot.loadResources();
                await this.onResize();
                if(pageAnimation)
                    pageAnimation.hide();

                // Mostrando todos los elementos
                this_.viewRoot.showView();

                this_.onStart();
                this.visible = true;
            })();
        });
    }

    setPosition(windowsDimension){
        this.viewRoot.elemDom.style.left = (windowsDimension.width / 2 - this.viewRoot.getWidth() / 2) + 'px';
        this.viewRoot.elemDom.style.top = (windowsDimension.height / 2 - this.viewRoot.getHeight() / 2) + 'px';
    }

    async cancel(params){
        this.getContext().viewRoot.elemDom.style.filter = "none";
        let pos = this.context.modals.findIndex(el => el === this);
        if (pos >= 0)
            this.context.modals.splice(pos, 1);
        if(this.viewRoot && this.viewRoot.elemDom)
            this.viewRoot.elemDom.remove();
        if (this.bgVisble === true)
            this.elemBackground.parentNode.removeChild(this.elemBackground);
        if(this.resolvePromise)
            this.resolvePromise(params);
        this.visible = false;
    }

    setOnClickListenerTo(idView,onClickListener){
        if(idView instanceof View)
            idView.setOnClickListener(onClickListener, this);
        else{
            let view = this.viewRoot.findViewById(idView);
            view.setOnClickListener(onClickListener, this);
        }
    }

    getViewRoot(){
        return this.viewRoot;
    }

    getContext(){
        return this.context;
    }
};