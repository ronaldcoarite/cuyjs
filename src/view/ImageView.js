class ImageView extends View{
    // src: null,
    // scaleType: LayoutInflater.FIT_XY,
    constructor(context){
        super(context);
        this.src = null;
        this.image = null;
        this.scaleType = LayoutInflater.FIT_XY;
    }

    //@Override
    async createHtmlElement () {
        super.createHtmlElement();
        // Icono
        this.elemIcon = this.createHtmlElemFromType('img');
        this.elemDom.appendChild(this.elemIcon);
        return this.elemDom;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.src = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_SRC);
        this.scaleType = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_SCALE_TYPE)||LayoutInflater.FIT_CENTER_INSIDE;
        this.image = null;
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        if(this.src){
            this.image = await Resource.loadImage(this.src);
            this.elemIcon.src = this.image.src;
        }
    }
    
    // @Override
    async onMeasure(maxWidth, maxHeight) {
        if(this.image){
            // Estableciendo dimensión de componente
            this.elemIcon.style.top = this.padding.top + 'px';
            this.elemIcon.style.left = this.padding.left + 'px';

            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = maxWidth +'px';
                    this.elemIcon.style.width = (maxWidth-this.padding.left - this.padding.right)+'px';
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemIcon.style.width = (this.image.clientWidth)+'px';
                    this.elemDom.style.width = (this.padding.left + this.image.clientWidth + this.padding.right)+'px';
                    break;
                default: // tamaño establecido por el usuario
                    let width = parseInt(this.width);
                    this.elemIcon.style.width = (width - this.padding.left - this.padding.right)+'px';
                    this.elemDom.style.width = width+'px';
                    break;
            }
    
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.height = maxHeight +'px';
                    this.elemIcon.style.height = (maxHeight-this.padding.top - this.padding.bottom)+'px';
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemIcon.style.height = (this.image.clientHeight)+'px';
                    this.elemDom.style.height = (this.padding.top + this.image.clientHeight + this.padding.bottom)+'px';
                    break;
                default: // tamaño establecido por el usuario
                    let height = parseInt(this.height);
                    this.elemIcon.style.height = (height - this.padding.top - this.padding.bottom)+'px';
                    this.elemDom.style.height = height+'px';
                    break;
            }
    
            // Ajustando Imagen
            switch (this.scaleType){ //contain
                case LayoutInflater.FIT_CENTER: this.elemIcon.style.objectFit = 'none'; break;
                case LayoutInflater.FIT_START: this.elemIcon.style.objectFit = 'cover'; break;
                case LayoutInflater.FIT_CENTER_CROP: this.elemIcon.style.objectFit = 'scale-down'; break;
                case LayoutInflater.FIT_CENTER_INSIDE: this.elemIcon.style.objectFit = 'contain'; break;
                case LayoutInflater.FIT_END: this.elemIcon.style.objectFit = 'scale-down'; break;
                case LayoutInflater.FIT_XY: this.elemIcon.style.objectFit = 'fill'; break;
            }
        }else{ // El ImageView no tiene imagen
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = maxWidth;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.width = this.padding.left + this.padding.right;
                    break;
                default: // tamaño establecido por el usuario
                    this.elemDom.style.width = parseInt(this.width) + 'px';
                    break;
            }
    
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.height = maxHeight;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.height = this.padding.top + this.padding.bottom;
                    break;
                default: // tamaño establecido por el usuario
                    this.elemDom.style.height = parseInt(this.height) + 'px';
                    break;
            }
        }
        await this.repaint();
    }

    async setImageResource(pathImage) {
        this.src = pathImage;
        if(pathImage){
            if(Resource.isBase64Resource(pathImage)){
                this.image = null;
                this.elemIcon.src = pathImage;
            }
            else{
                this.image = await Resource.loadImage(this.src);
                this.elemIcon.src = this.image.src;
            }
        }
        else{
            this.elemIcon.src = '';
            this.image = null;
        }
    }

    getDomImageResource(){
        return this.elemIcon.src;
    }
}