class TextView extends View {
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
        return this.elemDom;
    }
    // @Override
    async loadResources() {
        await super.loadResources();
        // Estableciendo valores de los atributos
        this.elemText.innerHTML = this.text;
        this.elemText.style.color = this.textColor;
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
                case LayoutInflater.ATTR_DRAWABLE_RIGHT:
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
                        default:
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
                case LayoutInflater.ATTR_DRAWABLE_BOTTOM: break;

                case LayoutInflater.ATTR_DRAWABLE_TOP:
                    switch (this.width) {
                        case LayoutInflater.MATCH_PARENT:
                            this.elemText.style.width = (
                                maxWidth -
                                this.margin.left - this.padding.left -
                                this.padding.right - this.margin.right) + 'px';
                            break;
                        case LayoutInflater.WRAP_CONTENT:
                            break;
                        default:
                            var width = parseInt(this.width);
                            this.elemText.style.width = (
                                width -
                                this.padding.left -
                                this.padding.right) + 'px';
                            break;
                    }
                    var width_elem = Math.max(this.elemText.clientWidth, this.elemIcon.clientWidth);
                    this.elemIcon.style.top = this.padding.top + 'px';
                    this.elemIcon.style.left = (this.padding.left + width_elem / 2 - this.elemIcon.clientWidth / 2) + 'px';

                    this.elemText.style.top = (this.padding.top + this.elemIcon.clientHeight + marginDrawable) + 'px';
                    this.elemText.style.left = (this.padding.left + width_elem / 2 - this.elemText.clientWidth / 2) + 'px';

                    // establecemos las dimensiones
                    this.elemDom.style.width = (this.padding.left + width_elem + this.padding.right) + 'px';
                    this.elemDom.style.height = (this.padding.top + this.elemIcon.clientHeight + marginDrawable + this.elemText.clientHeight + this.padding.bottom) + 'px';
                    break;
                default:
                    this.elemText.style.top = this.padding.top + 'px';
                    this.elemText.style.left = this.padding.left + 'px';
                    switch (this.width) {
                        case LayoutInflater.MATCH_PARENT:
                            this.elemText.style.width = (
                                maxWidth -
                                this.margin.left - this.padding.left -
                                this.padding.right - this.margin.right) + 'px';
                            this.elemDom.style.width = (this.padding.left + this.elemText.clientWidth + this.padding.right) + 'px';
                            break;
                        case LayoutInflater.WRAP_CONTENT:
                            this.elemDom.style.width = (this.padding.left + this.elemText.clientWidth + this.padding.right) + 'px';
                            break;
                        default:
                            var width = parseInt(this.width);
                            this.elemText.style.width = (
                                width -
                                this.padding.left -
                                this.padding.right) + 'px';
                            break;
                    }
                    switch (this_.height) {
                        case LayoutInflater.MATCH_PARENT:
                            this.elemText.style.height = (
                                maxHeight -
                                this.margin.top - this.padding.bottom -
                                this.padding.top - this.margin.bottom) + 'px';
                            this.elemDom.style.height = (this.padding.top + this.elemText.clientHeight + this.padding.bottom) + 'px';
                            break;
                        case LayoutInflater.WRAP_CONTENT:
                            this.elemDom.style.height = (this.padding.top + this.elemText.clientHeight + this.padding.bottom) + 'px';
                            break;
                        default:
                            var height = parseInt(this.height);
                            this.elemText.style.height = (
                                height -
                                this.padding.top -
                                this.padding.bottom) + 'px';
                            break;
                    }
                    break;
            }
        }
    }
    async setDrawableLeftSync(drawable) {
        this.gravityIcon = LayoutInflater.LEFT;
        this.drawableLeft = drawable;
        let image = await Resource.loadImage(drawable);
        this.elemIcon.src = `data:image/png;base64,${image.toDataURL()}`;
    }
    async setDrawableTopSync(drawable) {
        this.gravityIcon = LayoutInflater.TOP;
        this.drawableTop = drawable;
        let image = await Resource.loadImage(drawable);
        this.elemIcon.src = `data:image/png;base64,${image.toDataURL()}`;
    }
    async setDrawableRightSync(drawable, onLoadedDrawable) {
        this.gravityIcon = LayoutInflater.RIGHT;
        this.drawableTop = drawable;
        let image = await Resource.loadImage(drawable);
        this.elemIcon.src = `data:image/png;base64,${image.toDataURL()}`;
    }
    async setTextSync(text) {
        this.text = text;
        this.loadResources();
    }
    getText() {
        return this.text;
    }
}