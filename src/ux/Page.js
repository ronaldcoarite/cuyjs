class Page extends Context{
    // viewRoot: null,
    // viewListener: null,
    // urlView: null,
    // history: true,
    // fullScreem: false,
    // REQUEST_OK: 121,
    // REQUEST_CANCELED: 123,
    // resultCode: this.REQUEST_CANCELED,
    // resultData: null,
    // requestCode: -1,
    // loaded: false,

    constructor(){
        super();
    }

    async onResizeHandler(width,height){
        await this.viewRoot.onMeasure(width,height);
        await this.onResize();
    }

    async onResize(){}

    findViewById(idView) {
        if (this.viewRoot !== null)
            if (this.viewRoot.id === idView)
                return this.viewRoot;
        if (this.viewRoot instanceof ViewGroup || this.viewRoot instanceof ScrollView)
            return this.viewRoot.findViewById(idView);
        else
            throw new Exception(`El contenidor principal para la pagina [${this.constructor.name}] no es heredado de ViewGroup`);
    }

    getViewRoot(){
        return this.viewRoot;
    }

    getContext(){
        return this.context;
    }

    setContentView(objView) {
        if (objView instanceof View)
            this.viewRoot = objView;
        else if(typeof objView==='string')
            this.urlView = objView;
        else{
            throw "La vista debe ser una instancia de View o una url de un archivo XML"
        }
    }

    startLoaded(){
        this.viewRoot.elemDom.style.visibility = 'hidden';
        this.viewRoot.elemDom.style.opacity = 0;
    }

    loadedFinized(){
        this.viewRoot.elemDom.style.transition = "opacity 5s ease-in-out";
        this.viewRoot.elemDom.style.opacity = 1;
        this.viewRoot.elemDom.style.visibility = 'visible';
    }

    async onCreate() { }
    async onStart() { }
    async onDestroy() { }
    async onPause() { }
    async onResume() { }

    setNoHistory(history) {
        this.history = !history;
    }

    async startPage(intent) {
        if (intent === undefined || intent === null)
            throw new Exception("El Intent es nulo o no esta definido");
        if(!intent.context)
            throw new Exception("No se el contexto (Page) actual para iniciar la pagina ["+intent.pageName+"]");
        if(!(intent.context instanceof Page))
            throw new Exception("El contexto enviado en el [Intent] no es una instancia de una pagina ["+intent.context+"]");

        // Iniciamos la actividad principal
        intent.context.viewRoot.elemDom.style.display = "none";
        await PageManager.startPageFromIntent(intent);
    }

    setTitle(title) {
        document.title = title;
    }

    async finish() {
        let previusPage = this.context;

        await PageManager.finishPage(this);

        if(previusPage){
            console.log("Volviendo a cargar la pagina anterior");
            previusPage.viewRoot.elemDom.style.display = "block";
            await previusPage.onResume();
        }else{
            //console.log("NO hay pagina anterior registrada");
        }
    }

    async startPageForResult(intent, requestCode) {
        this.requestCode = requestCode;
        await this.startPage(intent);
    }

    async onPageResult(requestCode, resultCode, intent) { }
}