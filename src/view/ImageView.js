class ImageView extends View{
    // src: null,
    // scaleType: LayoutInflater.FIT_XY,
    constructor(context){
        super(context);
        this.src = null;
        this.image = null;
        this.scaleType = LayoutInflater.FIT_XY;
    }

    // @Override
    getTypeElement(){
        return 'img';
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
            this.elemDom.src = this.image.src;
        }
    }
    
    // @Override
    async onMeasureSync(maxWidth, maxHeight) {
        if(this.image){
            // Estableciendo dimensión de componente
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = Math.max(maxWidth-this.padding.left - this.padding.right,this.image.clientWidth + this.padding.left + this.padding.right);
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.width = Math.min(maxWidth-this.padding.left - this.padding.right,this.image.clientWidth + this.padding.left + this.padding.right);
                    break;
                default: // tamaño establecido por el usuario
                    let width = parseInt(this.width);
                    this.elemDom.style.width = (width -this.padding.left - this.image.clientWidth - this.padding.right) + 'px';
                    break;
            }
    
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.height = Math.max(maxHeight-this.padding.top - this.padding.bottom , this.image.clientHeight + this.padding.top + this.padding.bottom);
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.height = Math.min(maxHeight-this.padding.top - this.padding.bottom,this.image.clientHeight + this.padding.top + this.padding.bottom);
                    break;
                default: // tamaño establecido por el usuario
                    let height = parseInt(this.height);
                    this.elemDom.style.height = (height -this.padding.top - this.image.clientHeight - this.padding.bottom) + 'px';
                    break;
            }
    
            // Ajustando Imagen
            switch (this.scaleType){ //contain
                case LayoutInflater.FIT_CENTER: this.elemDom.style.objectFit = 'none'; break;
                case LayoutInflater.FIT_START: this.elemDom.style.objectFit = 'cover'; break;
                case LayoutInflater.FIT_CENTER_CROP: this.elemDom.style.objectFit = 'scale-down'; break;
                case LayoutInflater.FIT_CENTER_INSIDE: this.elemDom.style.objectFit = 'contain'; break;
                case LayoutInflater.FIT_END: this.elemDom.style.objectFit = 'scale-down'; break;
                case LayoutInflater.FIT_XY: this.elemDom.style.objectFit = 'fill'; break;
            }

        }else{ // El ImageView no tiene imagen
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = maxWidth-this.padding.left - this.padding.right;
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
                    this.elemDom.style.height = maxHeight-this.padding.top - this.padding.bottom;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.height = this.padding.top + this.padding.bottom;
                    break;
                default: // tamaño establecido por el usuario
                    this.elemDom.style.height = parseInt(this.height) + 'px';
                    break;
            }
        }
    }

    async setImageResource(pathImage) {
        this.src = pathImage;
        if(pathImage){
            if(Resource.isBase64Resource(pathImage)){
                this.image = null;
                this.elemDom.src = pathImage;
            }
            else{
                this.image = await Resource.loadImage(this.src);
                this.elemDom.src = this.image.src;
            }
        }
        else{
            this.elemDom.src = '';
            this.image = null;
        }
    }

    getDomImageResource(){
        return this.elemDom.src;
    }
}