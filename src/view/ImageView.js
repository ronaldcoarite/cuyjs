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
        switch (scaleType){
            case LayoutInflater.FIT_CENTER: // Escalar la imagen 
                if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT){
                    this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
                    this.imgElem.setAttribute("height","auto");
                }
                else{
                    this.imgElem.setAttribute("width","auto");
                    this.imgElem.setAttribute("height","auto"); 
                }
                break;
            case LayoutInflater.FIT_XY:
                console.log("Ajustando a este tipo");
                if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT){
                    this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
                    this.imgElem.setAttribute("height","auto");
                }
                else
                {
                    this.imgElem.setAttribute("width","auto");
                    this.imgElem.setAttribute("height","auto");
                }
                break;
        }
    }
    
    // setImageFromBase64(txtImageBase64) {
    //     this.elemDom.setAttribute(LayoutInflater.ATTR_SRC, 'data:image/png;base64,' + txtImageBase64);
    // }
    async setSyncImageFromURL(urlImage, onLoaded) {
        this.src = urlImage;
        if (this.src !== null) {
            this.elemDom.setAttribute(LayoutInflater.ATTR_SRC, this.src);

            if (onLoaded)
                onLoaded();
            //            this.elemDom.onload = function ()
            //            {               
            //                    switch (scaleType)
            //                    {
            //                        case LayoutInflater.FIT_CENTER:
            //                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
            //                            {
            //                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            else
            //                            {
            //                                this.imgElem.setAttribute("width","auto");
            //                                this.imgElem.setAttribute("height","auto");                            
            //                            }
            //                            break;
            //                        case LayoutInflater.FIT_XY:
            //                            console.log("Ajustando a este tipo");
            //                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
            //                            {
            //                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            else
            //                            {
            //                                this.imgElem.setAttribute("width","auto");
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            break;
            //                    }
            //                    this.imgElem.style.top = this.padding.top+'px';
            //                    this.imgElem.style.left = this.padding.left+'px';
            //                    this.setWidth(this.padding.left+this.imgElem.clientWidth+this.padding.right);
            //                    this.setHeight(this.padding.top+this.imgElem.clientHeight+this.padding.bottom);
            //
            //                if(onLoaded !== undefined)
            //                    onLoaded();
            //            };
        }
        else {
            if (onLoaded)
                onLoaded();
        }
    }
}