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
    }

    findViewById(idView) {
        if (this.viewRoot !== null)
            if (this.viewRoot.id === idView)
                return this.viewRoot;
        if (this.viewRoot instanceof ViewGroup) {
            return this.viewRoot.findViewById(idView);
        }
        else
            throw new Exception(`El contenidor principal para la pagina [${this.constructor.name}] no es heredado de ViewGroup`);
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
            throw new Exception("El intent es nulo o no esta definido");
        // Obtenemos el nodo de la pagina actual
        let resultNode = PageManager.getTreeNodeFromUrl();
        // Cargando la pagina
        let newPage = await PageManager.startPageFromIntent(intent);
        // Agregamos a la URL la nueva pagina
        resultNode.navigationList.push(intent.pageName);

        PageManager.setUrlBrouser(resultNode.navigationList);
        // Agregamos al arbol la pagina
        resultNode.currentPageNode.navigation[intent.pageName]= {
            extras: intent.getExtras(),
            navigation: {},
            pageName: intent.pageName
        };

        // Guardamos el arbol
        Store.set('TREE',resultNode.tree);
    }

    setTitle(title) {
        document.title = title;
    }

    async finish() {
        await PageManager.finishPage(this);
        let resultNode = PageManager.getTreeNodeFromUrl();
        // Removemos del historial la pagina actual
        delete resultNode.parentNode.navigation[resultNode.pageName];
        // Guardamos el arbol
        Store.set('TREE',resultNode.tree);
        // Actualizamos la URL del navegador
        resultNode.navigationList.pop();
        PageManager.setUrlBrouser(resultNode.navigationList, resultNode.parentNode.query);
    }

    startPageForResult(intent, requestCode) {
        this.requestCode = requestCode;
        this.startPage(intent);
    }

    async onPageResult(requestCode, resultCode, intent) { }
}