class ImageView extends View{
    // src: null,
    // scaleType: LayoutInflater.FIT_XY,
    constructor(context){
        super(context);
        this.src = null;
        this.image = null;
        this.scaleType = LayoutInflater.FIT_XY;
        this.name = "ImageView";
    }
    // @Override
    getTypeElement(){
        return 'img';
    }
    // @Override
    parse(nodeXml) {
        super.parse(nodeXml);
        this.src = nodeXml.getAttribute(LayoutInflater.ATTR_SRC);
        this.scaleType = nodeXml.getAttribute(LayoutInflater.ATTR_SCALE_TYPE)||LayoutInflater.FIT_XY;
        this.image = null;
    }
    // @Override
    async loadResources() {
        await super.loadResources();
        this.image = await Resource.loadImage(this.drawableResource);
        this.elemIcon.src = image.src;
    }
    // @Override
    async onMeasureSync(maxWidth, maxHeight) {
        await super.onMeasureSync(maxWidth,maxHeight);
        // Estableciendo dimensión de componente
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemText.style.width = Math.max(maxWidth-this.padding.left - this.padding.right,this.elemIcon.clientWidth + this.padding.left + this.padding.right);
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemText.style.width = Math.min(maxWidth-this.padding.left - this.padding.right,this.elemIcon.clientWidth + this.padding.left + this.padding.right);
                break;
            default: // tamaño establecido por el usuario
                let width = parseInt(this.width);
                this.elemText.style.width = (width -this.padding.left - this.elemIcon.clientWidth - this.padding.right) + 'px';
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemText.style.height = Math.max(maxHeight-this.padding.top - this.padding.bottom , this.elemIcon.clientHeight + this.padding.top + this.padding.bottom);
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemText.style.height = Math.min(maxHeight-this.padding.top - this.padding.bottom,this.elemIcon.clientHeight + this.padding.top + this.padding.bottom);
                break;
            default: // tamaño establecido por el usuario
                let height = parseInt(this.height);
                this.elemText.style.height = (height -this.padding.top - this.elemIcon.clientHeight - this.padding.bottom) + 'px';
                break;
        }

        // Ajustando Imagen
        switch (scaleType){ //contain
            case LayoutInflater.FIT_CENTER: this.elemIcon.style.objectFit = 'none'; break;
            case LayoutInflater.FIT_START: this.elemIcon.style.objectFit = 'cover'; break;
            case LayoutInflater.FIT_CENTER_CROP: this.elemIcon.style.objectFit = 'scale-down'; break;
            case LayoutInflater.FIT_CENTER_INSIDE: this.elemIcon.style.objectFit = 'cover'; break;
            case LayoutInflater.FIT_END: this.elemIcon.style.objectFit = 'cover'; break;
            case LayoutInflater.FIT_XY: this.elemIcon.style.objectFit = 'fill'; break;
        }
    }
}