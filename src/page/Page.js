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
        let tree = Store.get('TREE');
        let navigationList = await PageManager.getArrayNavegation();
        console.log("TREE",tree);
        console.log("Pagina",this.constructor.name);
        console.log("PageNavigation",navigationList);

        window.location.href = `${window.location.href}/${intent.pageName}`;
        if(navigationList.pageNames.length === 0 ){
            alert("Error pagina no registrada");
            return;
        }
        if(this.constructor.name !== navigationList.pageNames[0]){
            alert("La pagina raiz no es la misma que la pagina actual");
            return;
        }
        
        // Cargando la pagina
        let newPage = await PageManager.startPageFromIntent(intent);
        
        // Guardando en el historial la navegación de la nueva pagina

        let currentPageConfig = tree.ROOT;
        let index = 0;
        // let pageName = navigationList.listPages[index];
        console.log("Navigation list ",navigationList);
        while(index < navigationList.pageNames.length){
            console.log("Compare",currentPageConfig.pageName,navigationList.pageNames[index]);
            if(currentPageConfig.pageName === navigationList.pageNames[index]){
                if(index + 1 < navigationList.pageNames.length ){
                    // Obtenemos el nombre de la pagina siguiente
                    let pageNameNext = navigationList.pageNames[index+1];
                    // Verificamos si la siguiente pagina existe en arbol de navegacion
                    if(currentPageConfig.navigation[pageNameNext]){ // Existe la pagina en el arbol?
                        currentPageConfig = currentPageConfig.navigation[pageNameNext];
                        index++;
                        continue;
                    }
                    else{
                        alert("No se pudo encontrar la pagina: "+pageNameNext);
                        return;
                    }
                }
                else // Se encontro la ultima raiz del arbol que corresponde a la pagina actual
                    break;
            }
            else{
                alert("Errorrrrrrrrrrrrrr: "+this.constructor.name+" INDEX = "+index);
                return;
            }
        }
        currentPageConfig.navigation[intent.pageName]= {
            extras: {},
            navigation: {},
            pageName: intent.pageName
        };
        Store.set('TREE',tree);
        console.log("NUEVO ARBOL",tree);
        console.log("NUEVO ARBOL GUARDADO",Store.get('TREE'));
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

    async onPageResult(requestCode, resultCode, intent) { }
}