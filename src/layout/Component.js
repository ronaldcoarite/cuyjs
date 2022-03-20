class Component extends Container {
    constructor(context,model){
        super(context,model);
        this.layoutUrl = null;
        this.inflated=false;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        let layoutUrl = this.getAttrFromNodeXml(nodeXml,'layoutUrl')||this.layoutUrl;
        if(layoutUrl === null || layoutUrl !== undefined)
            await this.setContentView(layoutUrl);
    }
    
    async onCreate(){}

    // @Override
    async loadResources(){
        await super.loadResources();
        if(this.inflated){
            return;
        }
        if(this.layoutUrl===null || this.layoutUrl === undefined){
            this.inflated = true;
            await this.onCreate();
            return;
        }
        if(this.layoutUrl instanceof View){
            await this.layoutUrl.loadResources();
            await this.setFirstChild(layoutUrl);
            if(this.elemDom.style.visibility==='visible')
                this.layoutUrl.showView();
        }else{
            let viewInflate =  await LayoutInflater.inflate(this.getContext(),this.layoutUrl,this.model);
            await viewInflate.loadResources();
            await this.setFirstChild(viewInflate);
            if(this.elemDom.style.visibility==='visible')
                viewInflate.showView();
        }
        this.layoutUrl = null;
        this.inflated = true;
        await this.onCreate();
    }

    setContentView(layoutUrl){
        this.layoutUrl = layoutUrl;
    }

    setData(data){
        this.data = data;
    }

    getContextView(){
        return this;
    }
    
    //@Override
    async onMeasure(maxWidth, maxHeigth) {
        if(this.width !== LayoutInflater.MATCH_PARENT && this.width !== LayoutInflater.WRAP_CONTENT)
            maxWidth = parseFloat(this.width);
        if(this.height !== LayoutInflater.MATCH_PARENT && this.height !== LayoutInflater.WRAP_CONTENT)
            maxHeigth = parseFloat(this.height);

        if(!this.getFirstChild()){
            let maxWidthElement, maxHeightElement;
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeigth; break;
                case LayoutInflater.WRAP_CONTENT: maxHeightElement = this.padding.top + this.padding.bottom; break;
                default: maxHeightElement = maxHeigth;
            }
    
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
                case LayoutInflater.WRAP_CONTENT: maxWidthElement = this.padding.left + this.padding.right; break;
                default: maxWidthElement = maxWidth;
            }
    
            this.elemDom.style.height = `${maxHeightElement}px`;
            this.elemDom.style.width = `${maxWidthElement}px`;
            return;
        }

        await this.getFirstChild().onMeasure(
            maxWidth - this.padding.left - this.padding.right,
            maxHeigth - this.padding.top - this.padding.bottom);
 
        let maxWidthElement, maxHeightElement;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeigth; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = this.padding.top + this.getFirstChild().getHeight() + this.padding.bottom; break;
            default: maxHeightElement = maxHeigth;
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = this.padding.left + this.getFirstChild().getWidth() + this.padding.right; break;
            default: maxWidthElement = maxWidth;
        }

        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        
        await this.repaint();
    }
};