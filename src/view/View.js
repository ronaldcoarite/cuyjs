class View {
    static INVISIBLE = "invisible";
    static VISIBLE = "visible";
    static GONE = "gone";

    constructor(context,model) {
        if (!context)
            throw new Exception("El contexto no esta en los parametros o es nulo");
        this.context = context;
        this.model = model||null;
        this.margin = { top: 0, left: 0, right: 0, bottom: 0 };
        this.padding = { top: 0, left: 0, right: 0, bottom: 0 };
        this.parentView = null;
        this.maxWidth = Resource.getAttrOfTheme(this.constructor.name, 'maxWidth', -1);
        this.maxHeigth = Resource.getAttrOfTheme(this.constructor.name, 'maxHeigth', -1);
        this.width = Resource.getAttrOfTheme(this.constructor.name, 'width', LayoutInflater.WRAP_CONTENT);
        this.height = Resource.getAttrOfTheme(this.constructor.name, 'height', LayoutInflater.WRAP_CONTENT);
        this.id = Resource.getAttrOfTheme(this.constructor.name, 'id');
        this.background = Resource.getAttrOfTheme(this.constructor.name, 'background');
        this.cssClassList = Resource.getAttrOfTheme(this.constructor.name, 'cssClassList',this.constructor.name);
        this.cssStyle = Resource.getAttrOfTheme(this.constructor.name, 'cssStyle');
        this.onClickListener = null;
        this.onClickItemDefinition = null;
        this.tooltip = Resource.getAttrOfTheme(this.constructor.name, 'tooltip');
        this.audioClick = Resource.getAttrOfTheme(this.constructor.name, 'audioClick');
        this.audioAdove = Resource.getAttrOfTheme(this.constructor.name, 'audioAdove');
        this.requiredInForm = false;
        this.requiredMessage = null;
        this.opacity=1;
        this.visibility = View.VISIBLE;
        this.createHtmlElement();
        this.elemDom.style.visibility = "hidden";

        this.onClickContext = this.getContext();
    }

    setOnClickListenerTo(idView,onClickListener){
        if(idView instanceof View)
            idView.setOnClickListener(onClickListener, this);
        else{
            let view = this.findViewById(idView);
            view.setOnClickListener(onClickListener, this);
        }
    }

    getElemDom(){
        return this.elemDom;
    }

    getMaxWidth(){
        return this.maxWidth;
    }

    setMaxWidth(maxW){
        this.maxWidth = maxW;
    }

    getMaxHeight(){
        return this.maxHeigth;
    }

    getAllAttrs(){
        return Object.keys(this);
    }

    async setVisibility(v) {
        switch(v){
            case View.VISIBLE:
                this.elemDom.style.display = "block";
                this.elemDom.style.visibility = "visible";
                break;
            case View.INVISIBLE:
                this.elemDom.style.display = "block";
                this.elemDom.style.visibility = "hidden";                
                break;
            case View.GONE:
                this.elemDom.style.display = "none";
                break;
        }
        this.visibility = v;
        if(this.parentView !== null && this.parentView !== undefined){
            //if(v==View.INVISIBLE && this.visibility == View.GONE)
                await this.onReMeasure();
        }
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

    async setBackground(background) {
        this.background = background;
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
            else if(this.background.includes('.js')){
                await Resource.importJs(this.background);
                let backInsName = this.background.substring(this.background.lastIndexOf('/')+1,this.background.length-'.js'.length);
                this.backgroundPainter = eval(`new ${backInsName}(this,this.elemDom)`);
                // this.backgroundPainter = new LateralMenuBackgroud(this,this.elemDom);
            }else
                throw new Exception(`No se pudo identificar el tipo de fondo [${this.background}]`);
        }else{
            this.backgroundPainter = new EmplyBackground(this,this.elemDom);
        }

        await this.backgroundPainter.load();
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

    setOnClickListener(onClickListener,onClickContext){
        this.onClickItemDefinition = onClickListener;
        if(onClickContext)
            this.onClickContext = onClickContext;
        else
            this.onClickContext = arguments[1]||this.onClickContext;
        if (typeof this.onClickItemDefinition === 'function') {
            this.onClickListener = this.onClickItemDefinition;
        }
        else{
            if (typeof this.onClickItemDefinition === 'string') {
                // Buscamos el nombre de metodo en el contexto
                let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
                if(propertyNames.find(property=>property===this.onClickItemDefinition)){
                    this.onClickListener = this.context[this.onClickItemDefinition];
                }else
                    throw new Exception(`No se pudo encontrar la funcion [${this.onClickItemDefinition}] dentro del contexto [${this.context.constructor.name}]`);
            }
            else 
                throw new Exception(`El objeto [${onClickItemListener}] no es valido para establecer el Listener de onClickItemListener`);
        }

        if(this.onClickListener){
            this.elemDom.onclick=()=>{
                if(this.audioClickMedia)
                    this.audioClickMedia.play();
                Reflect.apply(this.onClickListener, this.onClickContext, [this]);
            };
        }
    }

    async setMP(dr, ic, txt, tc) {
        var popup = new PopupWindow(this.getContext());
        let tempCtx = {
            async onResize(){
                // let navigator = PageManager.getWindowsDimension();
                // await this.viewRoot.onMeasure(navigator.width,navigator.height);
            }
        };
        let message = new TextView(tempCtx);
        await message.setText(txt);
        if (ic !== null)
            await message.setDrawableLeft(ic);
        message.setBackground(dr);
        message.setSingleLine(true);
        message.setTextColor(tc);

        popup.setView(this);
        popup.setContentView(message);
        popup.show();
        setTimeout(function(){
            popup.hide();
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

    async tooglefullScream(){        
        let funCheck = ()=>{
            if(!document.fullscreenElement){
                this.getContext().enableDimensionListener(true);
                this.getContext().onResize();
                document.removeEventListener('fullscreenchange', funCheck);
            }
        };

        document.addEventListener('fullscreenchange', funCheck);
        if (!document.fullscreenElement) {
            this.getContext().enableDimensionListener(false);
            await this.getElemDom().requestFullscreen();
            await this.onMeasure(this.getElemDom().clientWidth, this.getElemDom().clientHeight);
        } else {
            this.getContext().enableDimensionListener(true);
            document.exitFullscreen();
        }
    }

    getAttrFromNodeXml(nodeXml, attrName){
        let attrValue  = nodeXml.getAttribute(attrName);
        if(attrValue){
            attrValue = attrValue.replace(LayoutInflater.REGEX_VARS,(cmp,paramName)=>{
                if(paramName.indexOf('.')!==-1 || this.model===null){
                    return eval(paramName);
                }
                else{
                    let model = this.model;
                    return eval(`model.${paramName}`);
                }
            });
        }
        return attrValue;
    }

    async setTheme(themeName){
        let theme = Resource.THEME;
        if(theme[themeName]){
            Object.entries(theme[themeName]).forEach(([key, value]) => {
                this[key] = value;
            });
        }
    }

    showElemDom(){
        this.elemDom.style.visibility = "visible";
    }

    hideElemDom(){
        this.elemDom.style.visibility = "hidden";
    }

    setOpacity(opacity){
        this.elemDom.style.opacity=opacity;
        this.opacity = opacity;
    }
    
    hideView(){
        if(this instanceof Container){
            for( let view of this.viewsChilds){
                view.hideView();
            }
            this.hideElemDom();
        }else if(this instanceof View){
            this.hideElemDom();
        }
    }

    showView(){
        if(this instanceof Container){
            for( let view of this.viewsChilds){
                view.showView();
            }
            this.showElemDom();
        }else if(this instanceof View){
            this.showElemDom();
        }
    }

    async parse(nodeXml) {
        // THEMA PARA LA VISTA
        if (this.getAttrFromNodeXml(nodeXml,"theme"))
            this.setTheme(this.getAttrFromNodeXml(nodeXml,"theme"));

        // VISIBILITY DEL VIEW
        this.visibility = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_VISIBILITY) || this.visibility;

        // MARGEN DEL COMPONENTE
        if(this.getAttrFromNodeXml(nodeXml,"margin")!=null)
            this.margin.top = this.margin.left = this.margin.right = this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,"margin"));
        if(this.getAttrFromNodeXml(nodeXml,"marginBottom")!=null)
            this.margin.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,"marginBottom"));
        if(this.getAttrFromNodeXml(nodeXml,"marginLeft")!=null)
            this.margin.left = parseInt(this.getAttrFromNodeXml(nodeXml,"marginLeft"));
        if(this.getAttrFromNodeXml(nodeXml,"marginRight")!=null)
            this.margin.right = parseInt(this.getAttrFromNodeXml(nodeXml,"marginRight"));
        if(this.getAttrFromNodeXml(nodeXml,"marginTop")!=null)
            this.margin.top = parseInt(this.getAttrFromNodeXml(nodeXml,"marginTop"));
            
        if(this.getAttrFromNodeXml(nodeXml,"paddingLeft"))
            this.padding.left = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingLeft"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingRight"))
            this.padding.right = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingRight"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingTop"))
            this.padding.top = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingTop"));
        if(this.getAttrFromNodeXml(nodeXml,"paddingBottom"))
            this.padding.bottom = parseInt(this.getAttrFromNodeXml(nodeXml,"paddingBottom"));
        if(this.getAttrFromNodeXml(nodeXml,"opacity"))
            this.opacity = parseFloat(this.getAttrFromNodeXml(nodeXml,"opacity"));
        let padding = this.getAttrFromNodeXml(nodeXml,"padding");
        if (padding !== null) {
            let pad = parseInt(padding);
            this.padding.top = this.padding.left = this.padding.right = this.padding.bottom = pad;
        }

        // ID DEL VIEW
        this.id = this.getAttrFromNodeXml(nodeXml,"id") || this.id;

        // LAYOUT GRAVITY DEL VIEW
        this.layoutGravity = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_GRAVITY) || this.layoutGravity;

        // WIDTH DEL VIEW
        this.width = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_WIDTH) || this.width;
        // HEIGHT DEL VIEW
        this.height = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_HEIGHT) || this.height;

        this.tooltip = this.getAttrFromNodeXml(nodeXml,'tooltip') || this.tooltip;

        this.cssStyle = this.getAttrFromNodeXml(nodeXml,'cssStyle') || this.cssStyle;

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

        // LIMITES MAXIMOS
        if(this.getAttrFromNodeXml(nodeXml,"maxWidth")!=null)
            this.maxWidth = parseInt(this.getAttrFromNodeXml(nodeXml,"maxWidth"));
        if(this.getAttrFromNodeXml(nodeXml,"maxHeight")!=null)
            this.maxHeigth = parseInt(this.getAttrFromNodeXml(nodeXml,"maxHeight"));

        if(this.getAttrFromNodeXml(nodeXml,"visibility") != null){
            switch(this.getAttrFromNodeXml(nodeXml,"visibility")){
                case View.VISIBLE:
                    this.visibility = View.VISIBLE;
                    this.elemDom.style.visibility = "hidden";
                    break;
                case View.INVISIBLE:
                    this.visibility = View.INVISIBLE;
                    this.elemDom.style.visibility = "hidden";
                    break;
                case View.GONE:
                    this.visibility = View.GONE;
                    this.elemDom.style.display = "none";
                    break;
            }
        }
    }

    async loadResources() {
        await this.setBackground(this.background);

        // Tooltip de Vista
        if(this.tooltip)
            this.elemDom.setAttribute("title", this.tooltip);
        // // Visibilidad
        // switch (this.visibility) {
        //     case View.INVISIBLE:
        //         this.elemDom.style.visibility = 'hidden';
        //         break;
        //     case View.GONE:
        //         this.elemDom.style.visibility = 'hidden';
        //         break;
        //     default:
        //         this.elemDom.style.visibility = 'block';
        //         break;
        // }

        // Cargando OnClick
        if((this.onClick===null || this.onClick === undefined) && this.onClickDefinition){
            this.setOnClickListener(this.onClickDefinition, this.getContext());
        }

        if(this.audioClick)
            this.audioClickMedia = new Audio(this.audioClick);
        if(this.audioAdove)
            this.audioAdoveMedia = new Audio(this.audioAdove);
        // Sobre el componente
        
        this.elemDom.onmouseenter=(event)=>{
            if(this.audioAdoveMedia)
                this.audioAdoveMedia.play();
            event.preventDefault();
            return false;
        };
        // cssClassList
        if(this.cssClassList.length > 0){
            this.cssClassList.split(',').forEach(classNameStyle => this.elemDom.classList.add(classNameStyle));
        }

        // cssStyle
        if(this.cssStyle && !this.elemDom.style.cssText.includes(this.cssStyle)){
            this.elemDom.style.cssText = this.elemDom.style.cssText+this.cssStyle;
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
        if(this.opacity!==1)
            this.elemDom.style.opacity=this.opacity;
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
        //if(this.parentView === null)
        //    return;
        if(this.backgroundPainter)
            await this.backgroundPainter.paint();
    }

    isSizeStatic(){
        let r = false;
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: r = false;break;
            case LayoutInflater.WRAP_CONTENT: r = false;break;
            default: r = true;
        }
        let a = false;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: a= false; break;
            case LayoutInflater.WRAP_CONTENT: a= false; break;
            default: a = true;
        }
        return r && a;
    }

    async onReMeasure(){
        let viewRootStatic = this;
        while(viewRootStatic !== null){
            if(viewRootStatic.isSizeStatic())
                break;
            if(viewRootStatic.parentView === null || viewRootStatic.parentView === undefined)
                break;
            viewRootStatic = viewRootStatic.parentView;
        }
        if(viewRootStatic.parentView)
            await viewRootStatic.onMeasure(viewRootStatic.getWidth(),viewRootStatic.getHeight());
        else{
            await viewRootStatic.context.onResize();
        }
    }
    
    // this.parentView.elemDom.appendChild(this.elemDom);
    async onMeasure(maxWidth, maxHeigth) {
        if(!this.elemDom) return; // No realizada nada si no fué agregado a la vista
        if(this.maxWidth>0)
            maxWidth = this.maxWidth;
        if(this.maxHeigth>0)
            maxHeigth = this.maxHeigth;

        // ************  ANCHO DE PANTALLA  ************
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = (maxWidth - this.margin.left - this.margin.right) + 'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = 'auto';
                if(this.maxWidth>0 && this.elemDom.clientWidth>maxWidth)
                    this.elemDom.style.width = maxWidth + 'px';
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
                if(this.maxHeigth>0 && this.elemDom.clientHeight>maxHeigth)
                    this.elemDom.style.height = maxHeigth + 'px';
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