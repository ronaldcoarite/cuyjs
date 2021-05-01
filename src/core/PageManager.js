class PageManager {
    static getUrlBrouser(){
        let urlBrouser = window.location.href;
        return urlBrouser;
    }

    static getQueryParams(){
        let urlParams = new URLSearchParams(location.search);
        let params = {};
        for (let [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    static setUrlBrouser(pageNames){
        window.location.href = `#/${pageNames.join('/')}`;
    }

    // pageNames
    static getArrayNavegation(){
        let urlBrouser = PageManager.getUrlBrouser();

        if(urlBrouser.lastIndexOf('#/') !== -1) {
            let listPages = urlBrouser.substring(urlBrouser.lastIndexOf('#/')+2);
            let posQuery = listPages.indexOf('?');
            if(posQuery != -1)
                listPages = listPages.substring(0,posQuery);
            return listPages.split('/');
        }
        return new Array();
    }

    static async startApp(manifestConfig){
        window.onload=(async ()=>{
            // Cargando tema
            await Resource.loadTheme(manifestConfig.theme);

            // Establecemos los valores correspondientes para los componentes HTML, BODY
            await PageManager.configApp();

            // Guardamos en sesion la configuración del objeto Manifesto
            Store.set('MANIFEST',manifestConfig);

            let navigationList = PageManager.getArrayNavegation();
            
            if(navigationList.length > 0){
                let mainPageName = navigationList[0];
                // Iniciamos la actividad principal
                let intent = new Intent(null, mainPageName);

                await PageManager.startPageFromIntent(intent);
                return;
            }
            
            // Validando manifest
            let mainPageName = PageManager.findRootPageName(manifestConfig);

            // Iniciamos la actividad principal
            let intent = new Intent(null, mainPageName);
            await PageManager.startPageFromIntent(intent);
        });
        /*
        async function loadFonts() {
            const font = new FontFace('myfont', 'url(myfont.woff)');
            // wait for font to be loaded
            await font.load();
            // add font to document
            document.fonts.add(font);
            // enable font with CSS class
            document.body.classList.add('fonts-loaded');
        }*/
    }

    static findRootPageName(manifestConfig){
        let pageConfig = manifestConfig.pages.find((pageConfig)=>pageConfig.category==='ROOT');
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
                                                }
                                                `;
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
        page.context = intent.context;
        await PageManager.loadPage(page, intent);
        return page;
    }

    // proProgress:{left:?,top:?,width,height,showBackground:true}
    static async loadPage(page, intent) {
        // LLamamos el on create de la pagina
        await page.onCreate(intent);
        let pageAnimation = new SpinnerAnimation();
        pageAnimation.show();
        // Verificamos si tiene contenido la pagina
        if(!page.viewRoot && !page.urlView)
            throw new Exception(`La pagina [${page.constructor.name}] no tiene contenido definido. Asigne un contenido con page.setContentView`);
        if(page.urlView){ // La pagina cargara los elementos a partir de una URL
            let rootXml = await Resource.loadLayoutSync(page.urlView);
            page.viewRoot = await LayoutInflater.inflate(page,rootXml);
        }

        document.body.appendChild(page.viewRoot.elemDom);
        // page.startLoaded(); // Iniciando carga

        let navigator = this.getWindowsDimension();
        await page.viewRoot.loadResources();
        await page.viewRoot.onMeasure(navigator.width,navigator.height);
        page.loadedFinized(); // Carga finalizada
        pageAnimation.hide();

        // Guardamos la pagina actual en la URL
        document.title = page.constructor.name;

        // history.pushState({}, null, newUrlIS);
        // Mostrando todos los elementos
        page.viewRoot.showView();

        // Agregamos el evento redimensionamiento
        window.addEventListener('resize', async () => {
            let dim = PageManager.getWindowsDimension();
            await page.onResizeHandler(dim.width,dim.height);
        });

        await page.onStart();
    }

    static async finishPage(context) {
        // Eliminamos el componente
        let element = context.viewRoot.elemDom;
        element.parentNode.removeChild(element);

        // Removemos el listener
        console.log("Removiendo listener");
        window.removeEventListener('resize', async () => {
            console.log("Listener removido");
        });

        // Eliminamos del historial
        await context.onDestroy();
    }

    static getWindowsDimension() {
        //        return {
        //                    width:document.body.clientWidth,
        //                    height:document.body.clientHeight
        //               };
        let dim = {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        };
        return dim;
    }
}