class Page extends Context{
    // viewRoot: null,
    // viewListener: null,
    // urlView: null,
    // history: true,
    // fullScreem: false,
    // previusPage: null,
    // REQUEST_OK: 121,
    // REQUEST_CANCELED: 123,
    // resultCode: this.REQUEST_CANCELED,
    // resultData: null,
    // requestCode: -1,
    // loaded: false,

    constructor(){
        super();
        this.className = null;
    }

    findViewById(idView) {
        if (this.viewRoot !== null)
            if (this.viewRoot.id === idView)
                return this.viewRoot;
        if (this.viewRoot instanceof ViewGroup) {
            return this.viewRoot.findViewById(idView);
        }
        else
            throw new Exception("El contenidor principal para la pagina no es heredado de ViewGroup");
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
    }
    loadedFinized(){
        this.viewRoot.elemDom.style.transition = "opacity 5s ease-in-out";
        this.viewRoot.elemDom.style.opacity = 1;
        this.viewRoot.elemDom.style.opacity = 0;
        this.viewRoot.elemDom.style.visibility = 'visible';
    }
    onCreate() { }
    onStart() { }
    onDestroy() { }
    onPause() { }
    onResume() { }

    setNoHistory(history) {
        this.history = !history;
    }
    startPage(intent) {
        if (intent === undefined || intent === null)
            throw new Exception("El intent es nulo o no esta definido");
        PageManager.startPage(intent);
    }
    setTitle(title) {
        document.title = title;
    }
    finish() {
        PageManager.finishPage(this);
        if (this.previusPage !== null) {
            if (this.requestCode > 0)
                this.previusPage.onPageResult(this.requestCode, this.resultCode, this.resultData);
        }
    }
    startPageForResult(intent, requestCode) {
        this.requestCode = requestCode;
        this.startPage(intent);
    }
    onPageResult(requestCode, resultCode, intent) { }
}