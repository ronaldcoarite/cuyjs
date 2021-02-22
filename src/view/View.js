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
        this.maxWidth = Resource.getAttrOfTheme(this.constructor.name, 'maxWidth', 0);
        this.maxHeigth = Resource.getAttrOfTheme(this.constructor.name, 'maxHeigth', 0);
        this.width = Resource.getAttrOfTheme(this.constructor.name, 'width', LayoutInflater.WRAP_CONTENT);
        this.height = Resource.getAttrOfTheme(this.constructor.name, 'height', LayoutInflater.WRAP_CONTENT);
        this.id = Resource.getAttrOfTheme(this.constructor.name, 'id');
        this.background = Resource.getAttrOfTheme(this.constructor.name, 'background');
        this.cssClassList = Resource.getAttrOfTheme(this.constructor.name, 'cssClassList',this.constructor.name);
        this.onClick = null;
        this.onClickDefinition = null;
        this.tooltip = Resource.getAttrOfTheme(this.constructor.name, 'tooltip');
        this.layoutGravity = null;
        this.audioClick = Resource.getAttrOfTheme(this.constructor.name, 'audioClick');
        this.audioAdove = Resource.getAttrOfTheme(this.constructor.name, 'audioAdove');
        this.requiredInForm = false;
        this.requiredMessage = null;

        this.createHtmlElement();
        this.elemDom.style.visibility = "hidden";
    }

    getAllAttrs(){
        return Object.keys(this);
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

    createHtmlElemFromType(type) {
        let htmlElement = document.createElement(type);
        // Margenes por defector
        htmlElement.style.marginTop = '0px';
        htmlElement.style.marginLeft = '0px';
        htmlElement.style.marginBottom = '0px';
        htmlElement.style.marginRight = '0px';

        // Padding por defecto
        htmlElement.style.paddingTop = '0px';
        htmlElement.style.paddingLeft = '0px';
        htmlElement.style.paddingBottom = '0px';
        htmlElement.style.paddingRight = '0px';

        htmlElement.style.position = 'absolute';
        return htmlElement;
    }


    createHtmlElement() {
        this.elemDom = this.createHtmlElemFromType(this.getTypeElement());
        return this.elemDom;
    }

    getTypeElement() {
        return this.constructor.name;
    }

    setId(id) {
        this.id = id;
    }

    clone() {
        let copy = Object.assign({}, this);
        copy.elemDom = this.elemDom.cloneNode(true);
    }
    
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

    setLayoutGravity(layoutGravity) {
        this.layoutGravity = layoutGravity;
    }

    setOnClickListener(onCLick,contextParam) {
        this.onClick = null;
        this.onClickDefinition = onCLick;
        this.onClickContext = contextParam || this;
        if (typeof this.onClickDefinition === 'string') {
            // Buscamos el nombre de metodo en el contexto
            let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
            if(propertyNames.find(property=>property===this.onClickDefinition)){
                this.onClick = async function(){
                    Reflect.apply(Reflect.get(this.context,this.onClickDefinition), this.context,[this]);
                }
            }else
                throw new Exception(`No se pudo encontrar la funcion [${this.onClickDefinition}] dentro del contexto [${this.context.constructor.name}]`);
        }
        else if (typeof this.onClickDefinition === 'function') {
            let funName = this.onClickDefinition.name;
            // Verificamos si la funcion se encuentra dentro de la vista
            let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
            if(propertyNames.find(property=>property===funName)){
                this.onClick = async function(){
                    Reflect.apply(this.onClickDefinition, this,[this]);
                }
            }else{
                this.onClick = async function(){
                    Reflect.apply(this.onClickDefinition, this.onClickContext ||this.context,[this]);
                }
            }
        }
        else 
            throw new Exception(`El objeto [${onCLick}] no es valido para establecer el Listener de onClick`);

        // OnClick
        if(this.onClick){
            this.elemDom.onclick=()=>{
                if(this.audioClickMedia)
                    this.audioClickMedia.play();
                this.onClick(this);
            };
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

    async setTheme(themeName){
        let theme = Store.get('theme');
        if(theme[themeName]){
            Object.entries(theme[themeName]).forEach(([key, value]) => {
                this[key] = value;
            });
        }
    }

    async parse(nodeXml) {
        // THEMA PARA LA VISTA
        if (this.getAttrFromNodeXml(nodeXml,"theme"))
            this.setTheme(this.getAttrFromNodeXml(nodeXml,"theme"));

        // VISIBILITY DEL VIEW
        this.visibility = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_VISIBILITY) || this.visibility;

        // MARGEN DEL COMPONENTE
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN)!=null)
            this.margin.top = this.margin.left = this.margin.right = this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_BOTTOM)!=null)
            this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_BOTTOM));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_LEFT)!=null)
            this.margin.left = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_LEFT));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_RIGHT)!=null)
            this.margin.right = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_RIGHT));
        if(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_TOP)!=null)
            this.margin.top = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MARGIN_TOP));
        if(this.getAttrFromNodeXml(nodeXml,"paddingLeft"))
            this.padding.left = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingLeft"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingRight"))
            this.padding.right = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingRight"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingTop"))
            this.padding.top = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingTop"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingBottom"))
            this.padding.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingBottom"));
        let padding = this.getAttrFromNodeXml(nodeXml,"padding");
        if (padding !== null) {
            let pad = parseInt(padding);
            this.padding.top = this.padding.left = this.padding.right = this.padding.bottom = pad;
        }

        // ID DEL VIEW
        this.id = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_ID) || this.id;

        // LAYOUT GRAVITY DEL VIEW
        this.layoutGravity = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_GRAVITY) || this.layoutGravity;

        // WIDTH DEL VIEW
        this.width = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_WIDTH) || this.width;
        // HEIGHT DEL VIEW
        this.height = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_HEIGHT) || this.height;

        this.tooltip = this.getAttrFromNodeXml(nodeXml,'tooltip') || this.tooltip;

        // BACKGROUDN DEL VIEW
        this.background = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_BACKGROUND) || this.background;
        this.onClickDefinition = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_ON_CLICK) || this.onClickDefinition;

        this.minHeigth = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_HEIGHT)) || this.minHeigth;
        this.minWidth = parseInt(this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_MIN_WIDTH)) || this.minWidth;

        if (this.getAttrFromNodeXml(nodeXml,"cssClassList")){
            // this.cssClassList = `${nodeXml,"cssClassList")}`;
            this.cssClassList = `${this.cssClassList},${this.getAttrFromNodeXml(nodeXml,"cssClassList")}`;
        }

        // AUDIO PARA EL CLICK
        this.audioClick = this.getAttrFromNodeXml(nodeXml,"audioClick") || this.audioClick;
        this.audioAdove = this.getAttrFromNodeXml(nodeXml,"audioAdove") || this.audioAdove;
            
        this.requiredInForm = this.getAttrFromNodeXml(nodeXml,"requiredInForm") || false;
        this.requiredMessage = this.getAttrFromNodeXml(nodeXml,"requiredMessage");
    }

    async loadResources() {
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
            else if(Resource.isColorResource(this.background) || this.background.indexOf("rgba(")!==-1)
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
        if(this.onClickDefinition){
            this.setOnClickListener(this.onClickDefinition);
        }

        if(this.audioClick)
            this.audioClickMedia = new Audio(this.audioClick);
        if(this.audioAdove)
            this.audioAdoveMedia = new Audio(this.audioAdove);
        // Sobre el componente
        if(this.audioAdoveMedia){
            this.elemDom.onmouseenter=()=>{
                this.audioAdoveMedia.play();
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
        if(this.backgroundPainter)
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
        if(this.backgroundPainter)
            await this.backgroundPainter.paint();
    }

    async remove(){
        if(!this.parentView)
            return;
        if(this.parentView instanceof Container)
            this.parentView.removeView(this);
    }

    cloneDomElem(){
        let dom = this.elemDom.cloneNode(true);
        return dom;
    }
}