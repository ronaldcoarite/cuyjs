class PageManager {
    static async getUrlBrouser(){
        let urlBrouser = window.location.href;
        return urlBrouser;
    }

    static async getTreeNavigation(){
        let tree = Store.get('TREE',{
            ROOT: {
                extras:{},
                navigation: {},
                pageName: null
            }
        });
        return tree;
    }

    static async getArrayNavegation(){
        let urlBrouser = await PageManager.getUrlBrouser();

        if(urlBrouser.lastIndexOf('#/') !== -1) {
            let listPages = urlBrouser.substring(urlBrouser.lastIndexOf('#/')+2);
            let posQuery = listPages.indexOf('?');
            if(posQuery != -1)
                listPages = listPages.substring(0,posQuery);
            return {
                pageNames: listPages.split('/'),
                queryParams: {}
            };
        }
        return {
            pageNames: new Array(),
            queryParams: {}
        };
    }

    static async startApp(manifestConfig){
        // Cargando tema
        await Resource.loadTheme(manifestConfig.theme);

        // Establecemos los valores correspondientes para los componentes HTML, BODY
        await PageManager.configApp();

        // Guardamos en sesion la configuración del objeto Manifesto
        Store.set('MANIFEST',manifestConfig);

        let navigationList = await PageManager.getArrayNavegation();

        if(navigationList.pageNames.length > 0){ // Actualizar pagina establecida
            if(navigationList.pageNames.length > 1){ // Existe una navegacion previa con varias paginas
                let tree = await Store.get('TREE');
                console.log("Navigation List: ",navigationList);
                console.log("Tree        : ",tree);
                console.log("Tree Root Page Name       : ",tree.ROOT.pageName);
                let currentPageConfig = tree.ROOT;
                let index = 0;
                // let pageName = navigationList.listPages[index];
                while(index < navigationList.pageNames.length){
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
                                console.log("currentPageConfig",currentPageConfig);
                                alert("No se pudo encontrar la pagina: "+pageNameNext);
                                return;
                            }
                        }
                        else // Se encontro la ultima raiz del arbol que corresponde a la pagina actual
                            break;
                    }
                    else{
                        alert(`La pagina no es igual [${currentPageConfig.pageName}] que [${navigationList.pageNames[index]}], INDEX = [${index}]`);
                        return;
                    }
                }
                console.log("Pagina encontrada",currentPageConfig);
    
                // Iniciamos la pagina con los datos guardados en la session
                let intent = new Intent(currentPageConfig.extras, currentPageConfig.pageName);
                let pageInstance = await PageManager.startPageFromIntent(intent);
                return;
            }else{ // Se desea cargar una pagina configurada en el manifest
                console.log("Solo se quiere cargar una pagina",navigationList.pageNames[0]);
                let mainPageName = navigationList.pageNames[0];
                let pageConfig = PageManager.findPageConfig(manifestConfig,mainPageName);

                // Agregamos como pagina raiz
                let treeNavigation = {
                    ROOT: {
                        extras: {},
                        navigation: {},
                        pageName: mainPageName,
                        query: {}
                    }
                }

                // Guardamos el nodo raiz en el arbol de navegación
                Store.set('TREE',treeNavigation);

                // Iniciamos la actividad principal
                let intent = new Intent(null, mainPageName);
                await PageManager.startPageFromIntent(intent);
                return;
            }
        }
        
        // Validando manifest
        let mainPageName = PageManager.findRootPageName(manifestConfig);

        // Colocando la pagina en la URL
        window.location.href = `#/${mainPageName}`;

        // Agregamos como pagina raiz
        let treeNavigation = {
            ROOT: {
                extras: {},
                navigation: {},
                pageName: mainPageName,
                query: {}
            }
        }

        // Guardamos el nodo raiz en el arbol de navegación
        Store.set('TREE',treeNavigation);

        // Iniciamos la actividad principal
        let intent = new Intent(null, mainPageName);
        await PageManager.startPageFromIntent(intent);
    }

    static findRootPageName(manifestConfig){
        let pageConfig = manifestConfig.pages.find((pageConfig)=>pageConfig.category=='ROOT');
        if(!pageConfig){
            throw new Exception(`No se encontro nin una pagina principal. Categorice la pagina agregando el atributo [category=='ROOT'] en el Manifest`);
        }
        let posBarra = pageConfig.name.lastIndexOf('/');
        let pageName = pageConfig.name.substring(posBarra+1,pageConfig.name.lastIndexOf('.js'));
        return pageName;
    }

    static findPageConfig(manifestConfig,pageName){
        let pageConfig = manifestConfig.pages.find((pageConfig)=>pageConfig.name.lastIndexOf(`/${pageName}.js`) !== -1);
        if(!pageConfig){
            throw new Exception(`No se encontro la página [${pageName}] en la configuración del Manifest`);
        }
        return pageConfig;
    }

    static async configApp() {
        // Eliminamos margenes y padding del contenedor principal (body,html)
        document.body.style.paddingBottom = '0px';
        document.body.style.paddingTop = '0px';
        document.body.style.paddingLeft = '0px';
        document.body.style.paddingRight = '0px';
        document.body.style.margin = '0px';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.position = 'absolute';

        // DESABILITAR ELEMENTOS NO SELECCIONABLES
        var sheet = document.createElement('style');
        sheet.type = "text/css";
        //padding: 4px 20px;
        sheet.innerHTML = `html,body,div,span,img{
                                                    -webkit-user-select: none;
                                                    -khtml-user-select: none;
                                                    -moz-user-select: none;
                                                    -o-user-select: none;
                                                    -ms-user-select: none;
                                                    user-select: none;
                                                }`;
        document.body.appendChild(sheet);
        
        // MULTIDIMENSION
        var sheet = document.createElement('style');
        sheet.type = "text/css";
        sheet.innerHTML = `@keyframes rotate{from {rotate:360deg;} to {rotate:0deg;}}
                           @-moz-keyframes rotate-record {0%   {-moz-transform: rotate(360deg);}100% {-moz-transform: rotate(0deg);}}
                           .rotate {-webkit-animation:rotate-record .8s infinite linear;-moz-animation:rotate-record .8s infinite linear;}`;

        document.body.appendChild(sheet);
    }

    static async startPageFromIntent(intent) {
        // Buscamos y verificamos si la pagina este presente en el Manifest
        let manifestConfig = Store.get('MANIFEST');
        // let pageConfig = manifestConfig.pages.find((pageConfig)=>pageConfig.className === intent.pageName);
        let pageConfig = PageManager.findPageConfig(manifestConfig,intent.pageName);

        // Importamos el script
        await Resource.import(pageConfig.name);

        // Instanciamos la Pagina
        var page = null;
        try {
            page = eval(`new ${intent.pageName}()`);
        }
        catch (o) {
            throw new Exception("No existe la pagina [" + intent.pageName + "]");
        }
        await PageManager.loadPage(intent.context, page, intent);
        return page;
    }

    // proProgress:{left:?,top:?,width,height,showBackground:true}
    static async loadPage(previusPage, page, intent) {
        page.previusPage = previusPage;
        // LLamamos el on create de la pagina
        await page.onCreate(intent);
        let pageAnimation = new SpinnerAnimation();
        pageAnimation.show();

        if (previusPage !== null) {
            // VER QUE SE REALIZARA PARA ESTE CASO
            
            // if (previusPage.history === false)
            //     this.removeContext(previusPage);
            // previusPage.onDestroy();
        }
        // Verificamos si tiene contenido la pagina
        if(!page.viewRoot && !page.urlView)
            throw new Exception(`La pagina [${page.constructor.name}] no tiene contenido definido. Asigne un contenido con page.setContentView`);
        if(page.urlView){ // La pagina cargara los elementos a partir de una URL
            let rootXml = await Resource.loadLayoutSync(page.urlView);
            page.viewRoot = LayoutInflater.inflate(page,rootXml);
        }

        document.body.appendChild(page.viewRoot.createDomElement());
        // page.startLoaded(); // Iniciando carga

        var navigator = this.getWindowsDimension();
        await page.viewRoot.loadResources();
        await page.viewRoot.onMeasureSync(navigator.width,navigator.height);
        page.loadedFinized(); // Carga finalizada
        pageAnimation.hide();

        // Guardamos la pagina actual en la URL
        document.title = page.constructor.name;

        // history.pushState({}, null, newUrlIS);

        await page.onStart(intent);
    }

    static removeContext(context) {
        var element = context.viewRoot.elemDom;
        element.parentNode.removeChild(element);
        context.onDestroy();
    }

    static finishPage(context) {
        this.removeContext(context);
    }

    static getWindowsDimension() {
        //        return {
        //                    width:document.body.clientWidth,
        //                    height:document.body.clientHeight
        //               };
        var dim = {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        };
        return dim;
    }
}