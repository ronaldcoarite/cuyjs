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
        this.name = "View";
        this.maxWidth = 0;
        this.maxHeigth = 0;
        this.minHeigth = 0;
        this.minHeigth = 0;
        this.width = LayoutInflater.WRAP_CONTENT;
        this.height = LayoutInflater.WRAP_CONTENT;
        this.id = null;
        this.background = null;
        this.onClick = null;
        this.tooltip = null;
        this.layoutGravity = (LayoutInflater.LEFT + '|' + LayoutInflater.TOP);
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
        return 'div';
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
        var mg = parseInt(margin);
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
            var encontrado = false;
            for (var obj in this.context) {
                // Falta verificar si el objeto es una funcion
                if (typeof this.context[obj] === 'function') {
                    if (obj === onCLick) {
                        this.onClick = this.context[onCLick];
                        encontrado = true;
                        break;
                    }
                }
            }
            if (encontrado === false)
                throw new Exception(`No se pudo encontrar la funcion [${onCLick}] dentro del contexto [${this.context.className}]`);
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
        // VISIBILITY DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY) !== null) 
            this.visibility = nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY);

        // PADDING DEL VIEW
        var padding = nodeXml.getAttribute(LayoutInflater.ATTR_PADDING);
        if (padding !== null) {
            var pad = parseInt(padding);
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
        this.onClick = nodeXml.getAttribute(LayoutInflater.ATTR_ON_CLICK);

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT) !== null)
            this.minHeigth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT))||10;

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH) !== null)
            this.minWidth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH))||10;
    }

    async loadResources() {
        if(!this.elemDom) // Verificamos que el elemento este agregado a la vista y que exista
            return;
        // OnClick
        if(this.onClick)
            this.elemDom.onclick=()=>{
                this.onClick(this);
            };
        if(this.background){
            // Se verifica que tipo de fondo
            if(this.background instanceof BaseBackground)
                this.backgroundPainter = this.background;
            else if(Resource.isImageNinePathResource(this.background)){ // Imagen de fondo de nine path
                // let imageInBase64 = Resource.loa
                this.backgroundPainter = new NinepathBackground(this.elemDom,this.background);
            } 
            else if(Resource.isImageResource(this.background) || Resource.isBase64Resource(this.background))
                this.backgroundPainter = new ImageBackground(this.elemDom,this.background);
            else if(Resource.isColorResource(this.background))
                this.backgroundPainter = new ColorBackground(this.elemDom,this.background);
            else
                throw new Exception(`No se pudo identificar el tipo de fondo [${this.background}]`);
        }else
            this.backgroundPainter = new EmplyBackground(this.elemDom);
            
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