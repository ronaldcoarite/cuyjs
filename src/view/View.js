class View {
    static INVISIBLE = "INVISIBLE";
    static VISIBLE = "VISIBLE";
    static GONE = "GONE";

    constructor(context) {
        if (!context)
            throw new Exception("El contexto no esta en los parametros o es nulo");
        this.context = context;
        this.visibility = View.VISIBLE;
        this.margin = { top: 0, left: 0, right: 0, bottom: 0 };
        this.padding = { top: 0, left: 0, right: 0, bottom: 0 };
        // this.elemDom = this.createDomElement();
        this.parentView = null;
        this.maxWidth = 0;
        this.maxHeigth = 0;
        this.minHeigth = 0;
        this.minHeigth = 0;
        this.width = LayoutInflater.WRAP_CONTENT;
        this.height = LayoutInflater.WRAP_CONTENT;
        this.id = null;
        this.background = null;
        this.cssClassList=this.constructor.name;
        this.onClick = null;
        this.onClickDefinition = null;
        this.tooltip = null;
        this.layoutGravity = (LayoutInflater.LEFT + '|' + LayoutInflater.TOP);
        this.audioClick = null;
        this.audioAdove = null;
    }

    setVisibility(v) {
        this.visibility = v;
    }
    setToolTip(text) {
        this.tooltip = text;
    }
    setMinWidth(w) {
        this.minWidth = w;
    }
    getContext() {
        return this.context;
    }
    setMinHeight(h) {
        this.minHeigth = h;
    }
    createDomElement() {
        var elem = document.createElement(this.getTypeElement());
        // Margenes por defector
        elem.style.marginTop = '0px';
        elem.style.marginLeft = '0px';
        elem.style.marginBottom = '0px';
        elem.style.marginRight = '0px';

        // Padding por defecto
        elem.style.paddingTop = '0px';
        elem.style.paddingLeft = '0px';
        elem.style.paddingBottom = '0px';
        elem.style.paddingRight = '0px';

        elem.style.position = 'absolute';
        this.elemDom = elem;
        if(this.id)
            this.elemDom.id = this.id;
        return elem;
    }

    getTypeElement() {
        return this.constructor.name;
    }

    setId(id) {
        this.id = id;
    }

    clone() {
        var copy = Object.assign({}, this);
        copy.elemDom = this.elemDom.cloneNode(true);
    }
    // checkMinSize: function () {
    //     var sw = false;
    //     if (this.getWidth() <= this.minWidth) {
    //         this.elemDom.style.width = this.minWidth + 'px';
    //         sw = true;
    //     }
    //     if (this.getHeight() <= this.minHeigth) {
    //         this.elemDom.style.height = this.minHeigth + 'px';
    //         sw = true;
    //     }
    //     if (sw === true)
    //         this.invalidate();
    // },
    getWidth() {
        // return this.width;
        return this.elemDom? this.elemDom.clientWidth: 0;
    }

    getHeight() {
        return this.elemDom? this.elemDom.clientHeight: 0;
    }
    
    setMargin(margin) {
        if (!margin) return;
        let mg = parseInt(margin);
        this.margin.top = this.margin.left = this.margin.right = this.margin.bottom = mg;
    }
    setMarginTop(margin) {
        if (!margin) return;
        this.margin.top = parseInt(margin);
    }
    setMarginLeft(margin) {
        if (!margin) return;
        this.margin.left = parseInt(margin);
    }
    setMarginRight(margin) {
        if (!margin) return;
        this.margin.right = parseInt(margin);
    }
    setMarginBottom(margin) {
        if (!margin) return;
        this.margin.bottom = parseInt(margin);
    }
    getBackground() {
        return this.background;
    }
    setBackground(background) {
        this.background = background;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height){
        this.height = height;
    }
    setLayoutGravity(gravity) {
        this.layoutGravity = gravity;
    }
    setOnClickListener(onCLick) {
        if (onCLick === null){
            this.onClick = null;
            return;
        }

        if (typeof onCLick === 'string') {
            // Buscamos el nombre de metodo en el contexto
            var propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
            if(propertyNames.find(property=>property===onCLick)){
                this.onClick = async function(){
                        // Object.getPrototypeOf(this.context)[onCLick];
                    Reflect.apply(Reflect.get(this.context,onCLick), this.context,this);
                }
            }else
                throw new Exception(`No se pudo encontrar la funcion [${onCLick}] dentro del contexto [${this.context.constructor.name}]`);
        }else if (typeof onCLick === 'function') {
            this.onClick = onCLick;
        }
    }
    setMP(dr, ic, txt, tc) {
        var popupError = new PopupWindow(this.getContext());
        var message = new TextView(popupError);
        message.setText(txt);
        if (ic !== null)
            message.setDrawableLeft(ic);
        message.setBackground(dr);
        message.setSingleLine(true);
        message.setTextColor(tc);

        popupError.setView(this);
        popupError.setContentView(message);
        popupError.show(function () {
            setTimeout(function () {
                popupError.cancel();
            }, 3000);
        });
    }
    showAlertMsg(msg) {
        this.setMP("res/drawable/util/bg_alerta.9.png", "res/drawable/util/ic_alert.png", msg, "#653400");
    }
    showConfirmMsg(msg) {
        this.setMP("res/drawable/util/bg_confirm.9.png", "res/drawable/util/ic_confirm.png", msg, "#346700");
    }
    showErrorMsg(msg) {
        this.setMP("res/drawable/util/bg_error.9.png", "res/drawable/util/ic_error.png", msg, "#A90400");
    }
    showInfoMsg(msg) {
        this.setMP("res/drawable/util/bg_info.9.png", "res/drawable/util/ic_info.png", msg, "#4C95E7");
    }
    parse(nodeXml) {
        // CARGANDO ATRIBUTOS DEFINIDOS POR EL TEMA SI LO EXISTE
        Resource.loadThemeAttributes(this,nodeXml);

        // VISIBILITY DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY) !== null) 
            this.visibility = nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY);

        // PADDING DEL VIEW
        var padding = nodeXml.getAttribute(LayoutInflater.ATTR_PADDING);
        if (padding !== null) {
            let pad = parseInt(padding);
            this.padding.top = this.padding.left = this.padding.right = this.padding.bottom = pad;
        }
        // MARGEN DEL COMPONENTE
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN)!=null)
            this.margin.top = this.margin.left = this.margin.right = this.margin.bottom = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN));
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM)!=null)
            this.margin.bottom = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM));
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT)!=null)
            this.margin.left = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT));
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT)!=null)
            this.margin.right = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT));
        if(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_TOP)!=null)
            this.margin.top = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_TOP));
        if(nodeXml.getAttribute("paddingLeft"))
            this.padding.left = parseInt(nodeXml.getAttribute("paddingLeft"));
        if(nodeXml.getAttribute("paddingRight"))
            this.padding.right = parseInt(nodeXml.getAttribute("paddingRight"));

        // ID DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_ID) !== null)
            this.id = nodeXml.getAttribute(LayoutInflater.ATTR_ID);

        // LAYOUT GRAVITY DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY) !== null)
            this.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        // WIDTH DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH) !== null)
            this.width = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH);
        // HEIGHT DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_HEIGHT) !== null)
            this.height = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_HEIGHT);
        this.tooltip = nodeXml.getAttribute('tooltip');

        // BACKGROUDN DEL VIEW
        this.background = nodeXml.getAttribute(LayoutInflater.ATTR_BACKGROUND);
        this.onClickDefinition = nodeXml.getAttribute(LayoutInflater.ATTR_ON_CLICK);

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT) !== null)
            this.minHeigth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT))||10;

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH) !== null)
            this.minWidth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH))||10;
        if (nodeXml.getAttribute("cssClassList") !== null && nodeXml.getAttribute("cssClassList").length>0){
            // this.cssClassList = `${nodeXml.getAttribute("cssClassList")}`;
            this.cssClassList = `${this.cssClassList},${nodeXml.getAttribute("cssClassList")}`;
        }

        // AUDIO PARA EL CLICK
        if (nodeXml.getAttribute("audioClick") !== null)
            this.audioClick = new Audio(nodeXml.getAttribute("audioClick"));

        // AUDIO PARA ENCIMA DE CLICK
        if (nodeXml.getAttribute("audioAdove") !== null){
            this.audioAdove = new Audio(nodeXml.getAttribute("audioAdove"));
        }
    }

    async loadResources() {
        if(!this.elemDom) // Verificamos que el elemento este agregado a la vista y que exista
            return;
        if(this.background){
            // Se verifica que tipo de fondo
            if(this.background instanceof BaseBackground)
                this.backgroundPainter = this.background;
            else if(Resource.isImageNinePathResource(this.background)){ // Imagen de fondo de nine path
                // let imageInBase64 = Resource.loa
                this.backgroundPainter = new NinepathBackground(this,this.elemDom,this.background);
            } 
            else if(Resource.isImageResource(this.background) || Resource.isBase64Resource(this.background))
                this.backgroundPainter = new ImageBackground(this,this.elemDom,this.background);
            else if(Resource.isColorResource(this.background))
                this.backgroundPainter = new ColorBackground(this,this.elemDom,this.background);
            else
                throw new Exception(`No se pudo identificar el tipo de fondo [${this.background}]`);
        }else
            this.backgroundPainter = new EmplyBackground(this,this.elemDom);
            
        await this.backgroundPainter.load();

        // Tooltip de Vista
        if(this.tooltip)
            this.elemDom.setAttribute("title", this.tooltip);
        // Visibilidad
        switch (this.visibility) {
            case View.INVISIBLE:
                this.elemDom.style.visibility = 'hidden';
                break;
            case View.GONE:
                this.elemDom.style.visibility = 'hidden';
                break;
            default:
                this.elemDom.style.visibility = 'block';
                break;
        }

        // Cargando OnClick
        if (typeof this.onClickDefinition === 'string') {
            // Buscamos el nombre de metodo en el contexto
            var propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
            if(propertyNames.find(property=>property===this.onClickDefinition)){
                this.onClick = async function(){
                    // alert("Funcion asyncrona llamada correctamente");
                    Reflect.apply(Reflect.get(this.context,this.onClickDefinition), this.context,this);
                }
            }else
                throw new Exception(`No se pudo encontrar la funcion [${this.this.onClickDefinition}] dentro del contexto [${this.context.constructor.name}]`);
        }

        // OnClick
        if(this.onClick)
            this.elemDom.onclick=()=>{
                if(this.audioClick !== null)
                    this.audioClick.play();
                this.onClick(this);
            };
        // Sobre el componente
        if(this.audioAdove!==null){
            this.elemDom.onmouseenter=()=>{
                this.audioAdove.play();
            };
            // this.elemDom.onmouseout=()=>{
                // this.audioAdove.pause();
                // this.audioAdove.currentTime = 0;
            // };
        }
        // cssClassList
        if(this.cssClassList.length > 0){
            this.cssClassList.split(',').forEach(classNameStyle => this.elemDom.classList.add(classNameStyle));
        }

        // Background
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = 'auto';
                break;
            default:
                this.elemDom.style.width = `${parseInt(this.width)}px`;
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = 'auto';
                break;
            default:
                this.elemDom.style.height = `${parseInt(this.height)}px`;
        }
    }

    addCssClass(cssString){
        let array = this.cssClassList.split(',');
        array.push(cssString);
        this.cssClassList = array.join(',');
        if(this.elemDom)
            this.elemDom.classList.add(cssString);
    }

    removeCssClass(cssString){
        this.cssClassList = this.cssClassList.split(',').filter(classCss => classCss !== cssString).join(',');
        if(this.elemDom)
            this.elemDom.classList.remove(cssString);
    }

    async repaintSync() {
        await this.backgroundPainter.paint();
    }
    
    // this.parentView.elemDom.appendChild(this.elemDom);
    async onMeasureSync(maxWidth, maxHeigth) {
        if(!this.elemDom) return; // No realizada nada si no fué agregado a la vista


        // ************  ANCHO DE PANTALLA  ************
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = (maxWidth - this.margin.left - this.margin.right) + 'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = 'auto';
                break;
            default:
                var width = parseInt(this.width);
                width = Math.max(width,this.maxWidth);
                this.elemDom.style.width = width + 'px';
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = (maxHeigth - this.margin.top - this.margin.bottom) + 'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = 'auto';
                break;
            default:
                var height = parseInt(this.height);
                height = Math.max(height,this.maxHeigth);
                this.elemDom.style.height = height + 'px';
                break;
        }

        await this.backgroundPainter.paint();
    }
}