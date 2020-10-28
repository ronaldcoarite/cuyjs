class Dialog extends Page{
    constructor(context){
        super();
        this.elemBackground = null;
        this.context = context;
        this.bgVisble = true;
        this.bgProgressVisble = true;
        this.resolvePromise = null;

        this.viewRoot = null;
        this.urlView = null;
    }

    setContentView(view) {
        if (view instanceof View)
            this.viewRoot = view;
        else if(typeof view==='string')
            this.urlView = view;
        else{
            throw `El contenido enviado [${view}] no es valido para el [Dialog]. Establesca solo una url con XML para el layout o una intancia de View`;
        }
    }

    findViewById(idView) {
        if (this.viewRoot !== null)
            if (this.viewRoot.id === idView)
                return this.viewRoot;
        if (this.viewRoot instanceof ViewGroup) {
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

    async show(){
        var this_ = this;
        return new Promise((resolve,reject)=>{
            this_.resolvePromise = resolve;
            (async () => {
                // Creamos un fondo opaco para el dialogo
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

                // Cargando la vista
                let pageAnimation = new SpinnerAnimation();
                pageAnimation.show();

                // Verificamos si tiene contenido la pagina
                if(this_.viewRoot || this_.urlView)
                    ; // Contenido definido
                else{
                    reject(new Exception(`El dialogo [${this_.constructor.name}] no tiene contenido definido. Asigne uno con [setContentView]`));
                    return;
                }
                if(this_.viewRoot === null){
                    let rootXml = await Resource.loadLayoutSync( this_.urlView);
                    this_.viewRoot = LayoutInflater.inflate(this_,rootXml);
                }

                document.body.appendChild(this_.viewRoot.createDomElement());
                // page.startLoaded(); // Iniciando carga
        
                let navigator = PageManager.getWindowsDimension();
                await this_.viewRoot.loadResources();
                await this_.viewRoot.onMeasureSync(navigator.width,navigator.height);
                // Centramos el dialogo
                this_.viewRoot.elemDom.style.left = (navigator.width / 2 - this_.viewRoot.elemDom.clientWidth / 2) + 'px';
                this_.viewRoot.elemDom.style.top = (navigator.height / 2 - this_.viewRoot.elemDom.clientHeight / 2) + 'px';
                pageAnimation.hide();
            })();
        });
    }

    async cancel(){
        PageManager.removeContext(this);
        if (this.bgVisble === true)
            this.elemBackground.parentNode.removeChild(this.elemBackground);
        if(this.resolvePromise)
            this.resolvePromise();
    }

    getContext(){
        return this.context;
    }
};