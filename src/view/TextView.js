class TextView extends View {
    constructor(context){
        super(context);
        this.text= null;
        this.textColor= null;
        this.textCssStyle = null;
        this.textSize = 12;
        this.drawableResource= null;
        this.gravityIcon= "left";
        this.singleLine= false;
        this.ellipsize= "none";
        this.imageResource = null;

        this.shadowColor = null;
        this.shadowDx = 0;
        this.shadowDy = 0;
        this.shadowRadius = 3;

    }

    //@Override
    async parse(nodeXml){
        await super.parse(nodeXml);
        
        this.text = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_TEXT);
        this.textColor = this.getAttrFromNodeXml(nodeXml,"textColor");
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_LEFT) !== null) {
            this.gravityIcon = LayoutInflater.LEFT;
            this.drawableResource = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_LEFT);
        }
        else if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_RIGHT) !== null) {
            this.gravityIcon = LayoutInflater.RIGHT;
            this.drawableResource = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_RIGHT);
        }
        else if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_TOP) !== null) {
            this.gravityIcon = LayoutInflater.TOP;
            this.drawableResource =  this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_TOP);
        }
        else if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_BOTTOM) !== null) {
            this.gravityIcon = LayoutInflater.BOTTOM;
            this.drawableResource = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_DRAWABLE_BOTTOM);
        }
        else{
            this.gravityIcon = LayoutInflater.LEFT;
            this.drawableResource = null;
        }
        this.singleLine = this.getAttrFromNodeXml(nodeXml,"singleLine")==="true"?true:false;
        this.textStyle = this.getAttrFromNodeXml(nodeXml,"textStyle");

        this.shadowColor = this.getAttrFromNodeXml(nodeXml,"shadowColor");
        this.shadowDx = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowDx"))||this.shadowDx;
        this.shadowDy = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowDy"))||this.shadowDy;
        this.shadowRadius = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowRadius"))||this.shadowRadius;

        this.textSize = this.getAttrFromNodeXml(nodeXml,"textSize")||this.textSize;
    }

    setSingleLine(single) {
        this.singleLine = single;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    async setText(text){
        this.text = text;
        if(this.elemDom)
            this.elemText.innerHTML = this.text;
        this.onReMeasure();
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.elemText = this.createHtmlElemFromType('span');
        this.elemText.style.wordWrap = 'break-word'; // Ajustar texto a contenido
        this.elemIcon = this.createHtmlElemFromType('img');

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
        if(this.shadowColor)
            this.elemText.style.textShadow=`${this.shadowDx}px ${this.shadowDy}px ${this.shadowRadius}px ${this.shadowColor}`;
        
        // Cargando la imagen o icono te texto
        this.imageResource = null;
        if(this.drawableResource){
            this.imageResource = await Resource.loadImage(this.drawableResource);
            this.elemIcon.src = this.imageResource.src;
        }
    }

    async onMeasure(maxWidth, maxHeight) {
        const marginDrawable = this.elemIcon.clientWidth===0?0:4; // 4px
        // Redimensionando el tamaño del icono al mismo tamaño del texto
        if(this.drawableResource){
            this.elemIcon.style.width = `${this.elemText.clientHeight}px`;
            this.elemIcon.style.height = `${this.elemText.clientHeight}px`;
        }
        switch(this.gravityIcon){
            case "left":
                this.elemIcon.style.left = (this.padding.left) + 'px';
                this.elemIcon.style.top = (this.padding.top) + 'px';

                switch (this.width) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.width = (
                            maxWidth -
                            this.elemIcon.clientWidth - 
                            marginDrawable -
                            this.padding.left - this.margin.right) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let width = parseInt(this.width);
                        this.elemText.style.width = (
                            width -
                            this.padding.left -
                            this.elemIcon.clientWidth -
                            marginDrawable -
                            this.padding.right) + 'px';
                        break;
                }
                switch (this.height) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.height = (
                            maxHeight -
                            this.elemIcon.clientHeight - 
                            marginDrawable -
                            this.padding.top - this.padding.bottom) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let height = parseInt(this.height);
                        this.elemText.style.height = (
                            height -
                            this.padding.top -
                            this.elemIcon.clientHeight -
                            marginDrawable -
                            this.padding.bottom) + 'px';
                        break;
                }

                this.elemText.style.left = (this.padding.left + this.elemIcon.clientWidth + marginDrawable) + 'px';
                this.elemText.style.top = (this.padding.top + Math.max(this.elemIcon.clientHeight,this.elemText.clientHeight)-this.elemText.clientHeight) + 'px';

                this.elemDom.style.width = (this.padding.left + (this.elemIcon.clientWidth>0?this.elemIcon.clientWidth+marginDrawable : 0) + this.elemText.clientWidth+this.padding.right) + 'px';
                this.elemDom.style.height = (this.padding.top + Math.max(this.elemIcon.clientHeight,this.elemText.clientHeight) +marginDrawable + this.padding.bottom) + 'px';
                break;
            case "right":
                this.elemText.style.left = (this.padding.left) + 'px';
                this.elemText.style.top = (this.padding.top + (this.elemIcon.clientHeight-this.elemText.clientHeight)) + 'px';

                switch (this.width) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.width = (
                            maxWidth -
                            this.elemIcon.clientWidth - 
                            marginDrawable -
                            this.padding.left - this.margin.right) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let width = parseInt(this.width);
                        this.elemText.style.width = (
                            width -
                            this.padding.left -
                            this.elemIcon.clientWidth -
                            marginDrawable -
                            this.padding.right) + 'px';
                        break;
                }
                switch (this.height) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.height = (
                            maxHeight -
                            this.elemIcon.clientHeight - 
                            marginDrawable -
                            this.padding.top - this.padding.bottom) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let height = parseInt(this.height);
                        this.elemText.style.height = (
                            height -
                            this.padding.top -
                            this.elemIcon.clientHeight -
                            marginDrawable -
                            this.padding.bottom) + 'px';
                        break;
                }
                this.elemIcon.style.left = (this.padding.left+this.elemText.clientWidth+marginDrawable) + 'px';
                this.elemText.style.top = (this.padding.top + Math.max(this.elemIcon.clientHeight,this.elemText.clientHeight)-this.elemText.clientHeight) + 'px';

                // establecemos las dimensiones
                this.elemDom.style.width = (this.padding.left + (this.elemIcon.clientWidth>0?this.elemIcon.clientWidth+marginDrawable : 0) + this.elemText.clientWidth + this.padding.right) + 'px';
                this.elemDom.style.height = (this.padding.top + Math.max(this.elemText.clientHeight, this.elemIcon.clientHeight) + this.padding.bottom) + 'px';
                break;
            case "bottom":
                switch (this.width) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.width = (
                            maxWidth -
                            this.elemIcon.clientWidth - 
                            marginDrawable -
                            this.padding.left - this.margin.right) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let width = parseInt(this.width);
                        this.elemText.style.width = (
                            width -
                            this.padding.left -
                            this.elemIcon.clientWidth -
                            marginDrawable -
                            this.padding.right) + 'px';
                        break;
                }
                switch (this.height) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.height = (
                            maxHeight -
                            this.elemIcon.clientHeight - 
                            marginDrawable -
                            this.padding.top - this.padding.bottom) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let height = parseInt(this.height);
                        this.elemText.style.height = (
                            height -
                            this.padding.top -
                            this.elemIcon.clientHeight -
                            marginDrawable -
                            this.padding.bottom) + 'px';
                        break;
                }

                let maximoAncho = Math.max(this.elemText.clientWidth,this.elemIcon.clientWidth);

                this.elemText.style.left = (this.padding.left+maximoAncho/2 -this.elemText.clientWidth/2) + 'px';
                this.elemText.style.top = (this.padding.top) + 'px';

                this.elemIcon.style.left = (this.padding.left+maximoAncho/2 -this.elemIcon.clientWidth/2) + 'px';
                this.elemIcon.style.top = (this.padding.top+marginDrawable+this.elemText.clientHeight) + 'px';
                // establecemos las dimensiones
                this.elemDom.style.width = (this.padding.left + maximoAncho + this.padding.right) + 'px';
                this.elemDom.style.height = (this.padding.top + this.elemText.clientHeight + marginDrawable + this.elemIcon.clientHeight + this.padding.bottom) + 'px';
                break;
            case "top":
                switch (this.width) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.width = (
                            maxWidth -
                            this.elemIcon.clientWidth - 
                            marginDrawable -
                            this.padding.left - this.margin.right) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let width = parseInt(this.width);
                        this.elemText.style.width = (
                            width -
                            this.padding.left -
                            this.elemIcon.clientWidth -
                            marginDrawable -
                            this.padding.right) + 'px';
                        break;
                }
                switch (this.height) {
                    case LayoutInflater.MATCH_PARENT:
                        this.elemText.style.height = (
                            maxHeight -
                            this.elemIcon.clientHeight - 
                            marginDrawable -
                            this.padding.top - this.padding.bottom) + 'px';
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        break;
                    default: // tamaño establecido por el usuario
                        let height = parseInt(this.height);
                        this.elemText.style.height = (
                            height -
                            this.padding.top -
                            this.elemIcon.clientHeight -
                            marginDrawable -
                            this.padding.bottom) + 'px';
                        break;
                }

                let maximoAnchoTop = Math.max(this.elemText.clientWidth,this.elemIcon.clientWidth);
                
                this.elemIcon.style.left = (this.padding.left+maximoAnchoTop/2 -this.elemIcon.clientWidth/2) + 'px';
                this.elemIcon.style.top = (this.padding.top) + 'px';

                this.elemText.style.left = (this.padding.left+maximoAnchoTop/2 -this.elemText.clientWidth/2) + 'px';
                this.elemText.style.top = (this.padding.top+marginDrawable+this.elemIcon.clientHeight) + 'px';
                // establecemos las dimensiones
                this.elemDom.style.width = (this.padding.left + maximoAnchoTop + this.padding.right) + 'px';
                this.elemDom.style.height = (this.padding.top + this.elemText.clientHeight + marginDrawable + this.elemIcon.clientHeight + this.padding.bottom) + 'px';
                break;
            default:
                throw new Exception(`Tipo de alineación [${this.gravityIcon}] no soportada`);
        }
        await this.repaint();
    }

    async setDrawableIcon(drawable,position){
        this.gravityIcon = position;
        this.drawableResource = drawable;
        if(this.elemDom){
            let image = await Resource.loadImage(drawable);
            this.elemIcon.src = image.src;
        }
    }

    async setDrawableLeft(drawable) {
        await this.setDrawableIcon(drawable,LayoutInflater.LEFT);
    }


    async setDrawableTop(drawable) {
        await this.setDrawableIcon(drawable,LayoutInflater.TOP);
    }

    async setDrawableRight(drawable) {
        await this.setDrawableIcon(drawable,LayoutInflater.RIGHT);
    }

    getText() {
        return this.text;
    }
}