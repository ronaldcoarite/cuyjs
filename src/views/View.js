class View {
    // parentView: null,
    // margin: null,
    // padding: null,
    // context: null,
    // visibility: LayoutInflater.VISIBLE,
    // width: LayoutInflater.WRAP_CONTENT,
    // height: LayoutInflater.WRAP_CONTENT,
    // id: null,
    // layoutGravity: (LayoutInflater.LEFT + '|' + LayoutInflater.TOP),
    // background: null,
    // onClick: null,
    // addedInParent: false,
    // maxWidth: 0,
    // maxHeigth: 0,
    // name: null,
    // tooltip: null,
    // minWidth: 0,
    // minHeigth: 0,

    // GONE: "GONE",
    static INVISIBLE = "INVISIBLE";
    static VISIBLE = "VISIBLE";

    // elemDom: null,

    constructor(context) {
        if (!context)
            throw new Exception("El contexto no esta en los parametros o es nulo");
        this.context = context;
        this.margin = { top: 0, left: 0, right: 0, bottom: 0 };
        this.padding = { top: 0, left: 0, right: 0, bottom: 0 };
        this.elemDom = this.createDomElement();
        this.parentView = null;
        this.name = "View";
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
        return this.width;
        //elemDom.clientWidth;
    }
    getHeight() {
        return this.height;
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
            var this_ = this;
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
        if (nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY) !== null) {
            this.visibility = nodeXml.getAttribute(LayoutInflater.ATTR_VISIBILITY);
            this.setVisibility(this.visibility);
        }

        // PADDING DEL VIEW
        var padding = nodeXml.getAttribute(LayoutInflater.ATTR_PADDING);
        if (padding !== null) {
            var pad = parseInt(padding);
            this.padding.top = this.padding.left = this.padding.right = this.padding.bottom = pad;
        }
        // MARGEN DEL COMPONENTE
        this.setMargin(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN));
        this.setMarginBottom(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_BOTTOM));
        this.setMarginLeft(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_LEFT));
        this.setMarginRight(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_RIGHT));
        this.setMarginTop(nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_MARGIN_TOP));

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
        if (nodeXml.getAttribute('tooltip') !== null)
            this.setToolTip(nodeXml.getAttribute('tooltip'));

        // BACKGROUDN DEL VIEW
        if (nodeXml.getAttribute(LayoutInflater.ATTR_BACKGROUND) !== null)
            this.background = nodeXml.getAttribute(LayoutInflater.ATTR_BACKGROUND);
        // SET ON CLICK DEL VIEW
        this.onClick = nodeXml.getAttribute(LayoutInflater.ATTR_ON_CLICK);
        this.setOnClickListener(this.onClick);

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT) !== null)
            this.minHeigth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_HEIGHT));

        if (nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH) !== null)
            this.minWidth = parseInt(nodeXml.getAttribute(LayoutInflater.ATTR_MIN_WIDTH));
    }
    invalidate(onInvalidate) {
        // OnClick
        this.elemDom.onclick = function () {
            onCLick(this_);
        };
        // Fondo de pantalla
        if (background.match(/\.9\.(png|gif)/i)) // Es nine path?
        {
            this.elemDom.style.backgroundRepeat = "no-repeat";
            this.elemDom.style.backgroundPosition = "-1000px -1000px";
            this.elemDom.style.backgroundImage = "url('" + background + "')";
            var this_ = this;
            this.ninePatch = new NinePatch(this.elemDom, function () {
                this_.padding.left = this_.ninePatch.padding.left;
                this_.padding.top = this_.ninePatch.padding.top;
                this_.padding.right = this_.ninePatch.padding.right;
                this_.padding.bottom = this_.ninePatch.padding.bottom;
            });
        }
        else if (background.match(/.(png|gif|jpg)/i)) { // Es una imagen de fondo
            this.ninePatch = null;
            this.elemDom.style.backgroundRepeat = "no-repeat";
            this.elemDom.style.backgroundPosition = "0px 0px";
            var img = new Image();
            var this_ = this;
            img.onload = function () {
                this_.elemDom.style.backgroundImage = "url('" + this.src + "')";
                if (loadListener !== undefined)
                    loadListener();
            };
            img.src = background;
        }
        else // es un fondo de un color
        {
            this.ninePatch = null;
            this.elemDom.style.background = background;
            loadListener();
        }
        // ToolTip
        if (this.elemDom)
            this.elemDom.setAttribute("title", text);
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

        // Nine Path
        if (this.ninePatch !== null) {
            this.ninePatch.draw();
        }
        if (this.context.loaded === true) {
            this.context.loaded = false;
            var this_ = this;
            var temp = function () {
                this_.context.loaded = true;
                if (onInvalidate !== undefined)
                    onInvalidate();
            };
            this.context.viewRoot.onMeasure(
                PageManager.getWindowsDimension().width,
                PageManager.getWindowsDimension().height, temp);
        }
    },
    onMeasure: function (maxWidth, maxHeigth, loadListener) {
        this.maxHeigth = maxHeigth;
        this.maxWidth = maxWidth;
        if (this.addedInParent === false) {
            if (this.parentView !== null)
                this.parentView.elemDom.appendChild(this.elemDom);
            this.addedInParent = true;
        }

        // ************  ANCHO DE PANTALLA  ************
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = (maxWidth - this.margin.left - this.margin.right) + 'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                //this.elemDom.style.width = 'auto';
                break;
            default:
                var width = parseInt(this.width);
                this.elemDom.style.width = width + 'px';
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = (maxHeigth - this.margin.top - this.margin.bottom) + 'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                //this.elemDom.style.height = 'auto';
                break;
            default:
                var height = parseInt(this.height);
                this.elemDom.style.height = height + 'px';
                break;
        }
        //this.checkMinSize();
        // Estableciendo fondo de componente
        this.setBackground(this.background, loadListener);
    },
});