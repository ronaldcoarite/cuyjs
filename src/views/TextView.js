TextView = View.extend({
    text: null,
    elemText: null,
    elemIcon: null,
    drawableLeft: null,
    drawableTop: null,
    drawableRight: null,
    drawableBottom: null,
    gravityIcon: "none",
    singleLine: false,
    ellipsize: "none",
    getTypeElement: function () {
        return 'TextView';
    },
    init: function (context) {
        this._super(context);
        this.name = "TextView";
    },
    parse: function (nodeXml) {
        this._super(nodeXml);
        this.text = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TEXT);
        this.elemText.innerHTML = this.text;

        if (nodeXml.getAttribute("textColor") !== null)
            this.elemText.style.color = nodeXml.getAttribute("textColor");
        if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT) !== null) {
            this.gravityIcon = LayoutInflater.LEFT;
            this.drawableLeft = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_LEFT);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT) !== null) {
            this.gravityIcon = LayoutInflater.RIGHT;
            this.drawableRight = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_RIGHT);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP) !== null) {
            this.gravityIcon = LayoutInflater.TOP;
            this.drawableTop = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_TOP);
        }
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM) !== null) {
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableBottom = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM);
        }
        else
            this.gravityIcon = "none";

        if (nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM) !== null) {
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableBottom = nodeXml.getAttribute(LayoutInflater.ATTR_DRAWABLE_BOTTOM);
        }
        this.singleLine = (nodeXml.getAttribute("singleLine") === "true");
        if (this.singleLine === true)
            this.elemText.style.whiteSpace = "nowrap";
        if (nodeXml.getAttribute("textStyle") !== null) {
            switch (nodeXml.getAttribute("textStyle")) {
                case "bold": this.elemText.style.fontWeight = 'bold'; break;
                case "italic": this.elemText.style.fontWeight = 'italic'; break;
            }
        }
        this.elemText.style.textOverflow = "ellipsis";
        if (nodeXml.getAttribute("textSize") !== null)
            this.elemText.style.fontSize = nodeXml.getAttribute("textSize");
    },
    setSingleLine: function (single) {
        this.singleLine = single;
        if (this.singleLine === true)
            this.elemText.style.whiteSpace = "nowrap";
    },
    setTextColor: function (color) {
        this.elemText.style.color = color;
    },
    createDomElement: function () {
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

        var elemDom = this._super();
        elemDom.appendChild(this.elemText);
        elemDom.appendChild(this.elemIcon);
        return elemDom;
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
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
    },
    cdf: function (dr, of) {
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
});