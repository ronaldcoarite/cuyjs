PageManager = {
    startAplicationSync: async function (mainPageName) {
        // Eliminamos margenes y padding del contenedor principal (body,html)
        document.body.style.paddingBottom = '0px';
        document.body.style.paddingTop = '0px';
        document.body.style.paddingLeft = '0px';
        document.body.style.paddingRight = '0px';
        document.body.style.margin = '0px';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.position = 'absolute';

        // Creamos el estilo del boton
        var sheet = document.createElement('style');
        sheet.type = "text/css";
        //padding: 4px 20px;
        //sheet.innerHTML = '.AndButton {background:#ffae00; background: -webkit-linear-gradient(top, #ffae00, #d67600);background: -moz-linear-gradient(top, #ffae00, #d67600);background: -o-linear-gradient(top, #ffae00, #d67600);background: linear-gradient(top, #ffae00, #d67600);border:2px outset #dad9d8; font-family:Andika, Arial, sans-serif;font-size:1.1em;letter-spacing:0.05em;color:#fff;text-shadow: 0px 1px 10px #000;-webkit-border-radius: 15px;-moz-border-radius: 15px;border-radius: 15px;-webkit-box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;-moz-box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;box-shadow: rgba(0, 0, 0, .55) 0 1px 6px;}.AndButton:hover, .AndButton:focus {border:2px solid #dad9d8;}';
        sheet.innerHTML = `.AndButton {background-color: #2D8FC4;color:#fff;border-radius: 10px;}\n\
                           .AndButton:hover, .AndButton:focus {background-color: rgba(255,200,100,0.5);color:black;cursor: pointer;cursor: hand;}\n\
                           .AndButton:active {background-color: rgba(255,220,150,0.7);cursor: move;}`;

        document.body.appendChild(sheet);

        // Convertimos en no seleccinable a todos los elementos
        // no editores
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

        var sheet = document.createElement('style');
        sheet.type = "text/css";
        sheet.innerHTML = `@keyframes rotate{from {rotate:360deg;} to {rotate:0deg;}}
                           @-moz-keyframes rotate-record {0%   {-moz-transform: rotate(360deg);}100% {-moz-transform: rotate(0deg);}}
                           .rotate {-webkit-animation:rotate-record .8s infinite linear;-moz-animation:rotate-record .8s infinite linear;}`;

        document.body.appendChild(sheet);

        // Iniciamos la actividad principal
        var intent = new Intent(null, mainPageName);
        await this.startPageSync(intent);
    },
    startPageSync: async function (intent) {
        // Instanciamos la Pagina
        var page = null;
        try {
            page = eval(`new ${intent.pageName}()`);
        }
        catch (o) {
            throw new Exception("No existe la pagina [" + intent.pageName + "]");
        }
        page.className = intent.pageName;

        await this.loadPageSync(intent.context, page, intent);
    },
    // proProgress:{left:?,top:?,width,height,showBackground:true}
    loadPageSync: async function (previusPage, page, intent) {
        page.previusPage = previusPage;
        // LLamamos el on create de la pagina
        page.onCreate(intent);
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
            throw new Exception(`La pagina [${page.className}] no tiene contenido definido. Asigne un contenido con page.setContentView`);
        if(page.urlView) // La pagina cargara los elementos a partir de una URL
            page.viewRoot = await Resource.loadLayoutSync(page.urlView);
        
        document.body.appendChild(page.viewRoot.elemDom);
        page.startLoaded(); // Iniciando carga

        var navigator = this.getWindowsDimension();
        await page.viewRoot.onMeasureSync(navigator.width,navigator.height);
        page.loadedFinized(); // Carga finalizada
        page.onStart(intent);
        pageAnimation.hide();
    },
    removeContext: function (context) {
        var element = context.viewRoot.elemDom;
        element.parentNode.removeChild(element);
        context.onDestroy();
    },
    finishPage: function (context) {
        this.removeContext(context);
    },
    getWindowsDimension: function () {
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
};