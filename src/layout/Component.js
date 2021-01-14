class Component extends Container {
    constructor(context){
        super(context);
        this.layoutUrl = null;
        this.context = this;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        let layoutUrl = this.getAttrFromNodeXml(nodeXml,'layoutUrl')||this.layoutUrl;
        if(layoutUrl === null || layoutUrl !== undefined)
            await this.setContentView(layoutUrl);
    }

    async setContentView(layoutUrl){
        if(layoutUrl instanceof View){
            this.setFirstChild(layoutUrl);
            await LayoutInflater.showAllViews(layoutUrl);
        }else{
            this.layoutUrl = layoutUrl;
            let rootXmlNode = await Resource.loadLayoutSync(this.layoutUrl);
            let viewInflate =  await LayoutInflater.inflate(this,rootXmlNode);
            this.setFirstChild(viewInflate);
            await LayoutInflater.showAllViews(viewInflate);
        }
        await LayoutInflater.showAllViews(layou);
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