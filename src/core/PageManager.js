class PageManager {
    static async startAplicationSync(mainPageName) {
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

        // Iniciamos la actividad principal
        var intent = new Intent(null, mainPageName);
        await PageManager.startPageSync(intent);
    }

    static async startPageSync(intent) {
        // Instanciamos la Pagina
        var page = null;
        try {
            page = eval(`new ${intent.pageName}()`);
        }
        catch (o) {
            throw new Exception("No existe la pagina [" + intent.pageName + "]");
        }

        await PageManager.loadPageSync(intent.context, page, intent);
    }

    // proProgress:{left:?,top:?,width,height,showBackground:true}
    static async loadPageSync(previusPage, page, intent) {
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