class ImageView extends View{
    // src: null,
    constructor(context){
        super(context);
        this.src = null;
        this.image = null;
        this.scaleType = 'content';
        //this.scaleType = 'scale';
        //this.scaleType = 'original';
    }

    //@Override
    async createHtmlElement () {
        super.createHtmlElement();
        // Icono
        this.elemIcon = this.createHtmlElemFromType('icon');
        this.elemIcon.style.backgroundRepeat = 'no-repeat';
        this.elemIcon.style.backgroundSize = "auto";
        this.elemDom.appendChild(this.elemIcon);
        return this.elemDom;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.src = this.getAttrFromNodeXml(nodeXml,"src");
        this.scaleType = this.getAttrFromNodeXml(nodeXml,'scaleType')||this.scaleType;
        this.image = null;
    }

    setScaleType(scaleType){
        this.scaleType = scaleType;
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        await this.loadIcon();
    }

    async loadIcon(){
        if(this.src){
            if(Resource.isImageResource(this.src)){
                this.image = await Resource.loadImage(this.src);
                this.elemIcon.style.background = `url('${this.image.src}')`;;
            }else{
                this.image = new Image();
                this.image.src = this.src;
                this.elemDom.style.background = this.image.src;
            }
        }else{
            this.elemIcon.style.background = '';
            this.image = null;
        }
    }
    
    // @Override
    async onMeasure(maxWidth, maxHeight) {
        if(this.image){
            // Estableciendo dimensión de componente
            let maxIconW, maxIconH;
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = maxWidth +'px';
                    maxIconW = maxWidth - this.padding.left - this.padding.right;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.width = (this.padding.left + this.image.width + this.padding.right)+'px';
                    maxIconW = this.image.width;
                    break;
                default: // tamaño establecido por el usuario
                    let width = parseInt(this.width);
                    this.elemDom.style.width = width+'px';
                    maxIconW = width - this.padding.left - this.padding.right;
                    break;
            }
    
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.height = maxHeight +'px';
                    maxIconH = maxHeight-this.padding.top - this.padding.bottom;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    maxIconH = this.image.height;
                    this.elemDom.style.height = (this.padding.top + this.image.clientHeight + this.padding.bottom)+'px';
                    break;
                default: // tamaño establecido por el usuario
                    let height = parseInt(this.height);
                    maxIconH = height - this.padding.left - this.padding.bottom;
                    this.elemDom.style.height = height+'px';
                    break;
            }
            
            switch(this.scaleType){
                case 'content':
                    this.elemIcon.style.width = maxIconW+'px';
                    this.elemIcon.style.height = maxIconH+'px';
                    break;
                case 'scale':
                case 'original':
                    let sourceRatio = this.image.width / this.image.height;
                    let targetRatio = maxIconW / maxIconH;
                    if (sourceRatio > targetRatio){
                        maxIconW = maxIconW;
                        maxIconH = maxIconW/sourceRatio;
                    }
                    else{
                        maxIconW = maxIconH*sourceRatio;
                        maxIconH = maxIconH;
                    }
                    this.elemIcon.style.width = maxIconW+'px';
                    this.elemIcon.style.height = maxIconH+'px';
                    break;
            }

            // Centramos la imagen
            this.elemIcon.style.top = (this.elemDom.clientHeight/2-this.elemIcon.clientHeight/2)+'px';
            if(this.offsetTop<this.padding.top)
                this.elemIcon.style.top = this.padding.top + 'px';

            this.elemIcon.style.left = (this.elemDom.clientWidth/2-this.elemIcon.clientWidth/2) + 'px';
            if(this.offsetLeft<this.padding.left)
                this.elemIcon.style.left = this.padding.left+'px';
            this.elemIcon.style.backgroundSize = `${this.elemIcon.clientWidth}px ${this.elemIcon.clientHeight}px`;
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
        await this.loadIcon();
        await this.onReMeasure();
    }

    getDomImageResource(){
        if(this.image)
            return this.image.src;
        return null;
    }
}