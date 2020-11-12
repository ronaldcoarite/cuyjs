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
        this.layoutGravity = null;
        this.audioClick = null;
        this.audioAdove = null;
        this.theme = this.constructor.name;
        this.requiredInForm = false;
        this.requiredMessage = null;
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

    findViewById(idView) {
        if (idView === null && idView === undefined)
            return null;
        if(this.id === idView)
            return this;
        return null;
    }

    async createDomElement() {
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
    
    getWidth() {
        // return this.width;
        return this.elemDom? this.elemDom.clientWidth: 0;
    }

    getTheme(){
        return this.theme;
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
                    Reflect.apply(Reflect.get(this.context,onCLick), this.context,[this]);
                }
            }else
                throw new Exception(`No se pudo encontrar la funcion [${onCLick}] dentro del contexto [${this.context.constructor.name}]`);
        }else if (typeof onCLick === 'function') {
            this.onClick = onCLick;
        }
    }

    async setMP(dr, ic, txt, tc) {
        var popup = new PopupWindow(this.getContext());
        let message = new TextView(popup);
        message.setText(txt);
        if (ic !== null)
            await message.setDrawableLeft(ic);
        message.setBackground(dr);
        message.setSingleLine(true);
        message.setTextColor(tc);

        popup.setView(this);
        popup.setContentView(message);
        popup.show();
        setTimeout(function(){
            popup.cancel();
        },3000);
        return popup;
    }

    async showAlertMsg(msg) {
        await this.setMP("lib/imgs/bg_msg_alerta.9.png", "lib/imgs/ic_msg_alert.png", msg, "#653400");
    }

    async showConfirmMsg(msg) {
        await this.setMP("lib/imgs/bg_msg_confirm.9.png", "lib/imgs/ic_msg_confirm.png", msg, "#346700");
    }

    async showErrorMsg(msg) {
        await this.setMP("lib/imgs/bg_msg_error.9.png", "lib/imgs/ic_msg_error.png", msg, "#A90400");
    }

    async showInfoMsg(msg) {
        await this.setMP("lib/imgs/bg_msg_info.9.png", "lib/imgs/ic_msg_info.png", msg, "#4C95E7");
    }

    getAttrFromNodeXml(nodeXml, attrName){
        let attrValue  = nodeXml.getAttribute(attrName);
        if(attrValue){
            attrValue = attrValue.replace(LayoutInflater.REGEX_VARS,(cmp,paramName)=>{
                if(paramName.indexOf('context.')!==-1)
                    return eval(`this.${paramName}`);
                else
                    return eval(paramName);
            });
        }
        return attrValue;
    }

    async parse(nodeXml) {
        // THEMA PARA LA VISTA
        if (this.getAttrFromNodeXml(nodeXml,"theme") !== null)
            this.theme = this.getAttrFromNodeXml(nodeXml,"theme");

        // CARGANDO ATRIBUTOS DEFINIDOS POR EL TEMA SI LO EXISTE
        Resource.loadThemeAttributes(this,nodeXml);

        // VISIBILITY DEL VIEW
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_VISIBILITY) !== null) 
            this.visibility = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_VISIBILITY);

        // PADDING DEL VIEW
        var padding = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_PADDING);
        if (padding !== null) {
            let pad = parseInt(padding);
            this.padding.top = this.padding.left = this.padding.right = this.padding.bottom = pad;
        }
        // MARGEN DEL COMPONENTE
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN)!=null)
            this.margin.top = this.margin.left = this.margin.right = this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM)!=null)
            this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT)!=null)
            this.margin.left = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT)!=null)
            this.margin.right = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_TOP)!=null)
            this.margin.top = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_MARGIN_TOP));
        if(this.getAttrFromNodeXml(nodeXml,"paddingLeft"))
            this.padding.left = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingLeft"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingRight"))
            this.padding.right = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingRight"));

        // ID DEL VIEW
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_ID) !== null)
            this.id = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_ID);

        // LAYOUT GRAVITY DEL VIEW
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_GRAVITY) !== null)
            this.layoutGravity = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_GRAVITY);
        // WIDTH DEL VIEW
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_WIDTH) !== null)
            this.width = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_WIDTH);
        // HEIGHT DEL VIEW
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_HEIGHT) !== null)
            this.height = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_HEIGHT);
        this.tooltip = this.getAttrFromNodeXml(nodeXml,'tooltip');

        // BACKGROUDN DEL VIEW
        this.background = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_BACKGROUND);
        this.onClickDefinition = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_ON_CLICK);

        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_HEIGHT) !== null)
            this.minHeigth = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_HEIGHT))||10;

        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_WIDTH) !== null)
            this.minWidth = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_WIDTH))||10;
        if (this.getAttrFromNodeXml(nodeXml,"cssClassList") !== null && this.getAttrFromNodeXml(nodeXml,"cssClassList").length>0){
            // this.cssClassList = `${nodeXml,"cssClassList")}`;
            this.cssClassList = `${this.cssClassList},${this.getAttrFromNodeXml(nodeXml,"cssClassList")}`;
        }

        // AUDIO PARA EL CLICK
        if (this.getAttrFromNodeXml(nodeXml,"audioClick") !== null)
            this.audioClick = new Audio(this.getAttrFromNodeXml(nodeXml,"audioClick"));

        // AUDIO PARA ENCIMA DE CLICK
        if (this.getAttrFromNodeXml(nodeXml,"audioAdove") !== null)
            this.audioAdove = new Audio(this.getAttrFromNodeXml(nodeXml,"audioAdove"));
            
        this.requiredInForm = this.getAttrFromNodeXml(nodeXml,"requiredInForm") || false;
        this.requiredMessage = this.getAttrFromNodeXml(nodeXml,"requiredMessage");
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
            let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
            if(propertyNames.find(property=>property===this.onClickDefinition)){
                this.onClick = async function(){
                    // alert("Funcion asyncrona llamada correctamente");
                    Reflect.apply(Reflect.get(this.context,this.onClickDefinition), this.context,[this]);
                }
            }else
                throw new Exception(`No se pudo encontrar la funcion [${this.onClickDefinition}] dentro del contexto [${this.context.constructor.name}]`);
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

    async repaint() {
        await this.backgroundPainter.paint();
    }

    isSizeStatic(){
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT: break;
            default: return true;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT: break;
            default: return true;
        }
        return false;
    }

    async onReMeasure(){
        let viewRootStatic = this;
        while(viewRootStatic !== null){
            if(viewRootStatic.isSizeStatic())
                break;
            if(viewRootStatic.parentView === null)
                break;
            viewRootStatic = viewRootStatic.parentView;
        }
        await viewRootStatic.onMeasure(viewRootStatic.getWidth(),viewRootStatic.getHeight());
    }
    
    // this.parentView.elemDom.appendChild(this.elemDom);
    async onMeasure(maxWidth, maxHeigth) {
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