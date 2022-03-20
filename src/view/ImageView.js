class ImageView extends View{
    // src: null,
    constructor(context,model){
        super(context,model);
        this.src = null;
        this.image = null;
        this.scaleType = 'content';
        //this.scaleType = 'scale';
        //this.scaleType = 'original';
        this.isSvg = false;
    }

    //@Override
    async createHtmlElement () {
        super.createHtmlElement();
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

    createDivIcon(tagName){
        // Icono
        this.elemIcon = this.createHtmlElemFromType(tagName||'icon');
        this.elemIcon.style.backgroundRepeat = 'no-repeat';
        this.elemIcon.style.backgroundOrigin="content-box";
        
        switch(this.scaleType){
            case 'content': this.elemIcon.style.backgroundSize = "contain"; break;
            case 'scale': this.elemIcon.style.backgroundSize="cover"; break;
            case 'original':  this.elemIcon.style.backgroundSize="auto"; break;
        }
        
        this.elemDom.appendChild(this.elemIcon);
        this.isSvg = false;
    }

    async loadIcon(){
        if(this.elemIcon){
            this.elemIcon.remove();
            this.image = null;
        }
        if(this.src){
            if(Resource.isImageResource(this.src)){
                if(this.src.lastIndexOf(".svg")===-1){
                    this.createDivIcon();
                    this.image = await Resource.loadImage(this.src);
                    this.elemIcon.style.background = `url('${this.image.src}')`;
                }else{
                    this.isSvg = true;
                    let svgResource = await Resource.loadLayoutSync(this.src);
                    this.elemIcon = this.elemDom.appendChild(svgResource);
                }
            }else if(Resource.isBase64Resource(this.src)){
                if(this.src.includes('data:image/svg;')){
                    this.isSvg = true;
                    let svgStr = window.atob(this.src.replace('data:image/svg;base64,',''));
                    this.elemDom.innerHTML=svgStr;
                    this.elemIcon = this.elemDom.firstElementChild;
                }else{
                    this.createDivIcon();
                    this.image = await Resource.loadImage(this.src);
                    this.elemIcon.style.background = `url('${this.image.src}')`;
                }
            }else
                throw new Exception(`El recurso [${this.src}] no es valido como imagen.`);
        }else{
            this.createDivIcon();
            this.elemIcon.style.background = '';
            this.image = null;
        }
    }

    getElemIcon(){
        return this.elemIcon;
    }
    
    // @Override
    async onMeasure(maxWidth, maxHeight) {
        if(this.image||this.isSvg){
            // Estableciendo dimensión de componente
            let maxIconW, maxIconH;
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    this.elemDom.style.width = maxWidth +'px';
                    maxIconW = maxWidth - this.padding.left - this.padding.right;
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    maxIconW = (this.isSvg?this.elemIcon.getBBox().width:this.image.width);
                    this.elemDom.style.width = (this.padding.left + maxIconW + this.padding.right)+'px';
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
                    maxIconH = (this.isSvg?this.elemIcon.getBBox().height:this.image.height);
                    this.elemDom.style.height = (this.padding.top + maxIconH + this.padding.bottom)+'px';
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
                    let wD,hD;
                    if(this.isSvg){
                        let rectSvg = this.elemIcon.getBBox();
                        wD = rectSvg.width;
                        hD = rectSvg.height;
                    }else{
                        wD = this.image.width;
                        hD = this.image.height;
                    }
                    let sourceRatio = wD / hD;
                    let targetRatio = maxIconW / maxIconH;
                    if (sourceRatio > targetRatio){
                        //maxIconW = maxIconW;
                        maxIconH = maxIconW/sourceRatio;
                    }
                    else{
                        maxIconW = maxIconH*sourceRatio;
                        //maxIconH = maxIconH;
                    }
                    this.elemIcon.style.backgroundSize=`${maxIconW}px ${maxIconH}px`;
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

    getImageResource(){
        return this.src;
    }
}