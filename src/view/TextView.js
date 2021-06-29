class TextView extends View {
    constructor(context){
        super(context);
        this.text = Resource.getAttrOfTheme(this.constructor.name, 'text');
        this.textColor = Resource.getAttrOfTheme(this.constructor.name, 'textColor');
        this.textCssStyle = Resource.getAttrOfTheme(this.constructor.name, 'textCssStyle');
        this.textSize = Resource.getAttrOfTheme(this.constructor.name, 'textSize','12px');
        let iconSize = Resource.getAttrOfTheme(this.constructor.name, 'iconSize');
        this.drawableResource= null;
        this.gravityIcon = Resource.getAttrOfTheme(this.constructor.name, 'gravityIcon','left');
        this.singleLine = Resource.getAttrOfTheme(this.constructor.name, 'singleLine',false);
        this.ellipsize= "none";
        this.image = null;
        this.iconWidth=iconSize;
        this.iconHeight=iconSize;
        this.textGravity = 'left|top';

        this.shadowColor = Resource.getAttrOfTheme(this.constructor.name, 'shadowColor');
        this.shadowDx = Resource.getAttrOfTheme(this.constructor.name, 'shadowDx',0);
        this.shadowDy = Resource.getAttrOfTheme(this.constructor.name, 'shadowDy',0);
        this.shadowRadius = Resource.getAttrOfTheme(this.constructor.name, 'shadowRadius',3);
    }

    //@Override
    async parse(nodeXml){
        await super.parse(nodeXml);
        
        this.text = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_TEXT) || this.text;
        this.textColor = this.getAttrFromNodeXml(nodeXml,"textColor") || this.textColor;
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
        this.singleLine = this.getAttrFromNodeXml(nodeXml,"singleLine")? (this.getAttrFromNodeXml(nodeXml,"singleLine")==="true") : this.singleLine;
        this.textStyle = this.getAttrFromNodeXml(nodeXml,"textStyle") || this.textStyle;

        this.shadowColor = this.getAttrFromNodeXml(nodeXml,"shadowColor") || this.shadowColor;
        this.shadowDx = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowDx")) || this.shadowDx;
        this.shadowDy = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowDy")) || this.shadowDy;
        this.shadowRadius = parseInt(this.getAttrFromNodeXml(nodeXml,"shadowRadius"))||this.shadowRadius;
        
        this.iconWidth = parseInt(this.getAttrFromNodeXml(nodeXml,"iconWidth")) || this.iconWidth;
        this.iconHeight = parseInt(this.getAttrFromNodeXml(nodeXml,"iconHeight")) || this.iconHeight;

        this.textSize = this.getAttrFromNodeXml(nodeXml,"textSize")||this.textSize;
        if(this.getAttrFromNodeXml(nodeXml,"iconSize")){
            let iconSize = parseInt(this.getAttrFromNodeXml(nodeXml,"iconSize"));
            this.iconWidth = iconSize;
            this.iconHeight = iconSize;
        }
        this.textGravity = this.getAttrFromNodeXml(nodeXml,"textGravity")||this.textGravity;
    }

    // Override
    getAllAttrs(){
        return Object.keys(this);
    }

    setSingleLine(single) {
        this.singleLine = single;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    setIconWidth(w){
        this.iconWidth = parseInt(w)
    }

    setIconHeight(h){
        this.iconHeight = parseInt(h)
    }

    async setText(text){
        this.text = text;
        if(this.elemDom)
            this.elemText.innerHTML = this.text;
        this.onReMeasure();
    }

    async setTextSize(textSize){
        this.textSize = textSize;
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.container = this.createHtmlElemFromType('div'); 

        this.elemText = this.createHtmlElemFromType('span');
        this.elemText.style.wordWrap = 'break-word'; // Ajustar texto a contenido
        //this.elemIcon = this.createHtmlElemFromType('img');

        this.container.appendChild(this.elemText);
        //this.container.appendChild(this.elemIcon);
        this.elemDom.appendChild(this.container);
        return this.elemDom;
    }

    createDivIcon(tagName){
        // Icono
        this.elemIcon = this.createHtmlElemFromType(tagName||'icon');
        this.elemIcon.style.backgroundRepeat = 'no-repeat';
        this.elemIcon.style.backgroundOrigin="content-box";
        this.elemIcon.style.backgroundSize = "contain";
        this.container.appendChild(this.elemIcon);
        this.isSvg = false;
    }

    getIconWidth(){
        if(this.image && this.elemIcon)
            return (this.isSvg?this.elemIcon.getBBox().width:this.image.width);
        return 0;
    }


    getIconHeight(){
        if(this.image && this.elemIcon)
            return (this.isSvg?this.elemIcon.getBBox().height:this.image.height);
        return 0;
    }

    async loadIcon(){
        if(this.elemIcon){
            this.elemIcon.remove();
            this.image = null;
        }
        if(this.drawableResource){
            if(Resource.isImageResource(this.drawableResource)){
                if(this.drawableResource.lastIndexOf(".svg")===-1){
                    this.createDivIcon();
                    this.image = await Resource.loadImage(this.drawableResource);
                    this.elemIcon.style.background = `url('${this.image.src}')`;
                }else{
                    this.isSvg = true;
                    let svgResource = await Resource.loadLayoutSync(this.drawableResource);
                    this.elemIcon = this.elemDom.appendChild(svgResource);
                }
            }else if(Resource.isBase64Resource(this.drawableResource)){
                if(this.drawableResource.includes('data:image/svg;')){
                    this.isSvg = true;
                    let svgStr = window.atob(this.drawableResource.replace('data:image/svg;base64,',''));
                    this.elemDom.innerHTML=svgStr;
                    this.elemIcon = this.elemDom.firstElementChild;
                }else{
                    this.createDivIcon();
                    this.image = await Resource.loadImage(this.drawableResource);
                    this.elemIcon.style.background = `url('${this.image.src}')`;
                }
            }else
                throw new Exception(`El recurso [${this.drawableResource}] no es valido como imagen.`);
        }else{
            this.createDivIcon();
            this.elemIcon.style.background = '';
            this.image = null;
        }
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        await this.loadIcon();

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
        // this.imageResource = null;
        // if(this.drawableResource){
        //     this.imageResource = await Resource.loadImage(this.drawableResource);
        //     this.elemIcon.src = this.imageResource.src;
        //     this.elemIcon.width = this.iconWidth||parseInt(this.textSize);
        //     this.elemIcon.height = this.iconHeight||parseInt(this.textSize);
        // }
    }

    async onMeasure(maxWidth, maxHeight) {
        const marginDrawable = this.getIconWidth()===0?0:8; // 4px
        // Redimensionando el tamaño del icono al mismo tamaño del texto
        if(this.gravityIcon === 'left'||this.gravityIcon === 'right'){
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemText.style.width = (
                        maxWidth -
                        this.padding.left -
                        this.getIconWidth() - 
                        marginDrawable -
                        this.padding.right) + 'px';
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    break;
                default: // tamaño establecido por el usuario
                    let width = parseInt(this.width);
                    this.elemText.style.width = (
                        width -
                        this.padding.left -
                        this.getIconWidth() -
                        marginDrawable -
                        this.padding.right) + 'px';
                    break;
            }
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemText.style.height = (
                        maxHeight -
                        this.padding.top -
                         this.padding.bottom) + 'px';
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    break;
                default: // tamaño establecido por el usuario
                    let height = parseInt(this.height);
                    this.elemText.style.height = (
                        height -
                        this.padding.top -
                        this.padding.bottom) + 'px';
                    break;
            }
        }
        else if(this.gravityIcon === 'top'||this.gravityIcon === 'bottom'){
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemText.style.width = (
                        maxWidth -
                        this.getIconWidth() - 
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
                        this.getIconWidth() -
                        marginDrawable -
                        this.padding.right) + 'px';
                    break;
            }
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemText.style.height = (
                        maxHeight -
                        this.padding.top -
                        this.getIconHeight() - 
                        marginDrawable -
                         this.padding.bottom) + 'px';
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    break;
                default: // tamaño establecido por el usuario
                    let height = parseInt(this.height);
                    this.elemText.style.height = (
                        height -
                        this.padding.top -
                        this.getIconHeight() -
                        marginDrawable -
                        this.padding.bottom) + 'px';
                    break;
            }
        }

        switch(this.gravityIcon){
            case "left":
                this.elemIcon.style.left = '0px';
                this.elemText.style.left = (this.getIconWidth() + marginDrawable) + 'px';
                this.elemText.style.top = (Math.max(this.getIconHeight(),this.elemText.clientHeight)/2-this.elemText.clientHeight/2) + 'px';
                this.elemIcon.style.top = (Math.max(this.getIconHeight(),this.elemText.clientHeight)/2-this.getIconHeight()/2) + 'px';

                this.container.style.width = (this.getIconWidth() + marginDrawable + this.elemText.clientWidth) + 'px';
                this.container.style.height = Math.max(this.getIconHeight(),this.elemText.clientHeight) + 'px';
                break;
            case "right":
                this.elemText.style.left = '0px';
                this.elemIcon.style.left = (this.elemText.clientWidth+marginDrawable) + 'px';
                this.elemText.style.top = (Math.max(this.getIconHeight(),this.elemText.clientHeight)/2-this.elemText.clientHeight/2) + 'px';
                this.elemIcon.style.top = (Math.max(this.getIconHeight(),this.elemText.clientHeight)/2-this.getIconHeight()/2) + 'px';

                // establecemos las dimensiones
                this.container.style.width = (this.getIconWidth()+marginDrawable + this.elemText.clientWidth) + 'px';
                this.container.style.height = Math.max(this.elemText.clientHeight, this.getIconHeight()) + 'px';
                break;
            case "bottom":
                let maximoAncho = Math.max(this.elemText.clientWidth,this.getIconWidth());

                this.elemText.style.left = (maximoAncho/2 -this.elemText.clientWidth/2) + 'px';
                this.elemText.style.top = '0px';

                this.elemIcon.style.left = (maximoAncho/2 -this.getIconWidth()/2) + 'px';
                this.elemIcon.style.top = (this.elemText.clientHeight+marginDrawable) + 'px';

                // establecemos las dimensiones
                this.container.style.width = maximoAncho + 'px';
                this.container.style.height = (this.elemText.clientHeight + marginDrawable + this.getIconHeight()) + 'px';
                break;
            case "top":
                let maximoAnchoTop = Math.max(this.elemText.clientWidth,this.getIconWidth());
                
                this.elemIcon.style.left = (maximoAnchoTop/2 -this.getIconWidth()/2) + 'px';
                this.elemIcon.style.top = '0px';

                this.elemText.style.left = (maximoAnchoTop/2 -this.elemText.clientWidth/2) + 'px';
                this.elemText.style.top = (marginDrawable +this.getIconHeight()) + 'px';

                // establecemos las dimensiones
                this.container.style.width = maximoAnchoTop + 'px';
                this.container.style.height = (this.elemText.clientHeight + marginDrawable + this.getIconHeight()) + 'px';
                break;
            default:
                throw new Exception(`Tipo de alineación [${this.gravityIcon}] no soportada`);
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: this.elemDom.style.height = maxHeight + 'px'; break;
            case LayoutInflater.WRAP_CONTENT: this.elemDom.style.height = (this.padding.top +this.container.clientHeight+this.padding.bottom)+'px'; break;
            default: this.elemDom.style.height = parseInt(this.height) + 'px'; break;
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: this.elemDom.style.width = maxWidth + 'px'; break;
            case LayoutInflater.WRAP_CONTENT: this.elemDom.style.width = (this.padding.left +this.container.clientWidth+this.padding.right)+'px'; break;
            default: this.elemDom.style.width = parseInt(this.width) + 'px'; break;
        }

        // Posicionamos el texto de acuerdo a alineacion
        let alignement = this.textGravity.split("|");
        let leftAligned =false;
        let topAligned =false;
        for (let j = 0; j < alignement.length; j++) {
            let alin = alignement[j];
            if (alin === LayoutInflater.TOP){
                topAligned = true;
                this.container.style.top = this.padding.top + 'px';
            }
            if (alin === LayoutInflater.RIGHT){
                leftAligned = true;
                this.container.style.left = (this.getWidth() - this.padding.right - this.container.clientWidth) + 'px';
            }
            if (alin === LayoutInflater.LEFT){
                leftAligned = true;
                this.container.style.left = this.padding.left + 'px';
            }
            if (alin === LayoutInflater.BOTTOM){
                topAligned = true;
                this.container.style.top = (this.getHeight() - this.padding.bottom) + 'px';
            }
            if (alin === LayoutInflater.CENTER_HORIZONTAL){
                leftAligned = true;
                this.container.style.left = (this.getWidth()/2 - this.container.clientWidth/2) + 'px';
            }
            if (alin === LayoutInflater.CENTER_VERTICAL){
                topAligned = true;
                this.container.style.top = (this.getHeight() - this.container.clientHeight/2) + 'px';
            }
            if (alin === LayoutInflater.CENTER){
                leftAligned = true;
                topAligned = true;
                this.container.style.left = (this.getWidth() - this.container.clientWidth/2) + 'px';
                this.container.style.top = (this.getHeight() - this.container.clientHeight/2) + 'px';
            }
        }
        if(!leftAligned)
            this.container.style.left = this.padding.left + 'px';
        if(!topAligned)
            this.container.style.top = this.padding.top + 'px';

        await this.repaint();
    }

    async setDrawableIcon(drawable,position){
        this.gravityIcon = position;
        this.drawableResource = drawable;
        if(this.elemDom){
            await this.loadIcon();
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