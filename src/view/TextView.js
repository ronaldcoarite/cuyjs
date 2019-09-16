class TextView extends View{
    constructor(context){
        super(context);
        this.text= null;
        this.textColor= null;
        this.textStyle = null;
        this.textSize = 12;

        this.elemText= null;
        this.elemIcon= null;
        this.drawableResource= null;
        this.gravityIcon= "none";
        this.singleLine= false;
        this.ellipsize= "none";
        this.name = "TextView";
        this.imageResource = null;
    }
    //@Override
    getTypeElement(){
        return 'TextView';
    }
    //@Override
    parse(nodeXml) {
        super.parse(nodeXml);
        
        this.text = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TEXT);
        this.textColor = nodeXml.getAttribute("textColor");
        if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT) !== null) {
            this.gravityIcon = LayoutInflater.LEFT;
            this.drawableResource = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT) !== null) {
            this.gravityIcon = LayoutInflater.RIGHT;
            this.drawableResource =  nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP) !== null) {
            this.gravityIcon = LayoutInflater.TOP;
            this.drawableResource =  nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM) !== null) {
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableResource = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM);
        }
        else{
            this.gravityIcon = "none";
            this.drawableResource = null;
        }
        this.singleLine = nodeXml.getAttribute("singleLine")||true;
        this.textStyle = nodeXml.getAttribute("textStyle");
        this.textSize = nodeXml.getAttribute("textSize")||this.textSize;
    }
    setSingleLine(single) {
        this.singleLine = single;
    }
    setTextColor(color) {
        this.textColor = color;
    }
    //@Override
    createDomElement () {
        super.createDomElement();

        // Texto
        this.elemText = document.createElement('span');
        this.elemText.style.margin = '0px';
        this.elemText.style.paddingTop = '0px';
        this.elemText.style.paddingLeft = '0px';
        this.elemText.style.paddingBottom = '0px';
        this.elemText.style.paddingRight = '0px';
        this.elemText.style.wordWrap = 'break-word'; // Ajustar texto a contenido
        this.elemText.style.position = 'absolute';

        // Icono
        this.elemIcon = document.createElement('img');
        this.elemIcon.style.margin = '0px';
        this.elemIcon.style.paddingTop = '0px';
        this.elemIcon.style.paddingLeft = '0px';
        this.elemIcon.style.paddingBottom = '0px';
        this.elemIcon.style.paddingRight = '0px';
        this.elemIcon.style.position = 'absolute';

        this.elemDom.appendChild(this.elemText);
        this.elemDom.appendChild(this.elemIcon);
        return elemDom;
    }
    // @Override
    async loadResources() {
        await super.loadResources();
        // Estableciendo valores de los atributos
        this.elemText.innerHTML = this.text;
        this.elemText.style.color = nodeXml.getAttribute("textColor")||'#000000';
        if (this.singleLine === true)
            this.elemText.style.whiteSpace = "nowrap";
        this.elemText.style.textOverflow = "ellipsis";
        switch (this.textStyle) {
            case "bold": this.elemText.style.fontWeight = 'bold'; break;
            case "italic": this.elemText.style.fontWeight = 'italic'; break;
            default: this.elemText.style.fontWeight = 'normal'; break;
        }
        if(this.textSize)
            this.elemText.style.fontSize = this.textSize;
        // Cargando la imagen o icono te texto
        this.imageResource = null;
        if(this.drawableResource)
            this.imageResource = await Resource.loadImage(this.drawableResource);
        
    }
    async onMeasureSync(maxWidth, maxHeight) {
        await super.onMeasureSync(maxWidth,maxHeight);
        if(this.imageResource){
            let marginDrawable = 4; // 4px
            switch(this.gravityIcon){
                case LayoutInflater.ATTR_DRAWABLE_LEFT: 
                    this.elemIcon.style.top = this.padding.top + 'px';
                    this.elemIcon.style.left = this.padding.left + 'px';

                    this.elemText.style.top = this.padding.top + 'px';
                    this.elemText.style.left = (this.padding.left + this.elemIcon.clientWidth + marginDrawable) + 'px';

                    switch (this.width) {
                        case LayoutInflater.MATCH_PARENT:
                            this.elemText.style.width = (
                                maxWidth -
                                this.margin.left - this.padding.left -
                                this.elemIcon.clientWidth -
                                marginDrawable -
                                this.padding.right - this.margin.right) + 'px';
                            break;
                        case LayoutInflater.WRAP_CONTENT:
                            break;
                        default: // tamaño establecido por el usuario
                            var width = parseInt(this.width);
                            this.elemText.style.width = (
                                width -
                                this.padding.left -
                                this.elemIcon.clientWidth -
                                marginDrawable -
                                this.padding.right) + 'px';
                            break;
                    }

                    // establecemos las dimensiones
                    this.elemDom.style.width = (this.padding.left + this.elemIcon.clientWidth + marginDrawable + this.elemText.clientWidth + this.padding.right) + 'px';
                    this.elemDom.style.height = (this.padding.top + Math.max(this.elemText.clientHeight, this.elemIcon.clientHeight) + this.padding.bottom) + 'px';
                    break;
                case LayoutInflater.ATTR_DRAWABLE_RIGHT: break;
                case LayoutInflater.ATTR_DRAWABLE_BOTTOM: break;
                case LayoutInflater.ATTR_DRAWABLE_TOP: break;
            }
        }
    }
    onMeasure(maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var tempListener = function () {
            var onDrawableLoaded = function () {
                // Pintar el drawable
                var marginDrawable = 4; // 4px
                switch (this_.gravityIcon) {
                    case LayoutInflater.LEFT:
                        // posicionamos
                        this_.elemIcon.style.top = this_.padding.top + 'px';
                        this_.elemIcon.style.left = this_.padding.left + 'px';

                        this_.elemText.style.top = this_.padding.top + 'px';
                        this_.elemText.style.left = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable) + 'px';

                        switch (this_.width) {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                    maxWidth -
                                    this_.margin.left - this_.padding.left -
                                    this_.elemIcon.clientWidth -
                                    marginDrawable -
                                    this_.padding.right - this_.margin.right) + 'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                    width -
                                    this_.padding.left -
                                    this_.elemIcon.clientWidth -
                                    marginDrawable -
                                    this_.padding.right) + 'px';
                                break;
                        }

                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable + this_.elemText.clientWidth + this_.padding.right) + 'px';
                        this_.elemDom.style.height = (this_.padding.top + Math.max(this_.elemText.clientHeight, this_.elemIcon.clientHeight) + this_.padding.bottom) + 'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.RIGHT:
                        // posicionamos
                        this_.elemIcon.style.top = this_.padding.top + 'px';
                        this_.elemIcon.style.left = this_.padding.left + 'px';

                        this_.elemText.style.top = this_.padding.top + 'px';
                        this_.elemText.style.left = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable) + 'px';

                        switch (this_.width) {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                    maxWidth -
                                    this_.margin.left - this_.padding.left -
                                    this_.elemIcon.clientWidth -
                                    marginDrawable -
                                    this_.padding.right - this_.margin.right) + 'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                    width -
                                    this_.padding.left -
                                    this_.elemIcon.clientWidth -
                                    marginDrawable -
                                    this_.padding.right) + 'px';
                                break;
                        }

                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left + this_.elemIcon.clientWidth + marginDrawable + this_.elemText.clientWidth + this_.padding.right) + 'px';
                        this_.elemDom.style.height = (this_.padding.top + Math.max(this_.elemText.clientHeight, this_.elemIcon.clientHeight) + this_.padding.bottom) + 'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.TOP:
                        switch (this_.width) {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                    maxWidth -
                                    this_.margin.left - this_.padding.left -
                                    this_.padding.right - this_.margin.right) + 'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                    width -
                                    this_.padding.left -
                                    this_.padding.right) + 'px';
                                break;
                        }
                        var width_elem = Math.max(this_.elemText.clientWidth, this_.elemIcon.clientWidth);
                        this_.elemIcon.style.top = this_.padding.top + 'px';
                        this_.elemIcon.style.left = (this_.padding.left + width_elem / 2 - this_.elemIcon.clientWidth / 2) + 'px';

                        this_.elemText.style.top = (this_.padding.top + this_.elemIcon.clientHeight + marginDrawable) + 'px';
                        this_.elemText.style.left = (this_.padding.left + width_elem / 2 - this_.elemText.clientWidth / 2) + 'px';

                        // establecemos las dimensiones
                        this_.elemDom.style.width = (this_.padding.left + width_elem + this_.padding.right) + 'px';
                        this_.elemDom.style.height = (this_.padding.top + this_.elemIcon.clientHeight + marginDrawable + this_.elemText.clientHeight + this_.padding.bottom) + 'px';
                        this_.invalidate();
                        break;
                    case LayoutInflater.RIGHT:
                        break;
                    case LayoutInflater.BOTTOM:
                        break;
                    default: // none (No tiene drawableIcon)
                        this_.elemText.style.top = this_.padding.top + 'px';
                        this_.elemText.style.left = this_.padding.left + 'px';
                        switch (this_.width) {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.width = (
                                    maxWidth -
                                    this_.margin.left - this_.padding.left -
                                    this_.padding.right - this_.margin.right) + 'px';
                                this_.elemDom.style.width = (this_.padding.left + this_.elemText.clientWidth + this_.padding.right) + 'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                this_.elemDom.style.width = (this_.padding.left + this_.elemText.clientWidth + this_.padding.right) + 'px';
                                break;
                            default:
                                var width = parseInt(this_.width);
                                this_.elemText.style.width = (
                                    width -
                                    this_.padding.left -
                                    this_.padding.right) + 'px';
                                break;
                        }
                        switch (this_.height) {
                            case LayoutInflater.MATCH_PARENT:
                                this_.elemText.style.height = (
                                    maxHeight -
                                    this_.margin.top - this_.padding.bottom -
                                    this_.padding.top - this_.margin.bottom) + 'px';
                                this_.elemDom.style.height = (this_.padding.top + this_.elemText.clientHeight + this_.padding.bottom) + 'px';
                                break;
                            case LayoutInflater.WRAP_CONTENT:
                                this_.elemDom.style.height = (this_.padding.top + this_.elemText.clientHeight + this_.padding.bottom) + 'px';
                                break;
                            default:
                                var height = parseInt(this_.height);
                                this_.elemText.style.height = (
                                    height -
                                    this_.padding.top -
                                    this_.padding.bottom) + 'px';
                                break;
                        }
                        this_.invalidate();
                        break;
                }
                if (loadListener !== undefined)
                    loadListener();
            };
            if (this_.drawableLeft !== null)
                this_.setDrawableLeft(this_.drawableLeft, onDrawableLoaded);
            else if (this_.drawableTop !== null)
                this_.setDrawableTop(this_.drawableTop, onDrawableLoaded);
            else
                onDrawableLoaded();
        };
        this._super(maxWidth, maxHeight, tempListener);
    }
    cdf(dr, of) {
        var img = new Image();
        var this_ = this;
        if (typeof of === "function") {
            img.onload = function () {
                this_.elemIcon.src = this.src;
                if (of !== undefined)
                    of();
            };
        }
        img.src = dr;
    },
    setDrawableLeft: function (drawable, onLoadedDrawable) {
        this.gravityIcon = LayoutInflater.LEFT;
        this.drawableLeft = drawable;
        this.cdf(drawable, onLoadedDrawable);
    },
    setDrawableTop: function (drawable, onLoadedDrawable) {
        this.gravityIcon = LayoutInflater.TOP;
        this.drawableTop = drawable;
        this.cdf(drawable, onLoadedDrawable);
    },
    setDrawableRight: function (drawable, onLoadedDrawable) {
        this.gravityIcon = LayoutInflater.RIGHT;
        this.drawableTop = drawable;
        this.cdf(drawable, onLoadedDrawable);
    },
    setText: function (text, onChange) {
        this.text = text;
        this.elemText.innerHTML = text;
        this.invalidate(onChange);
    },
    getText: function () {
        return this.text;
    }
}