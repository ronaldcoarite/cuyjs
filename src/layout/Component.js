class Component extends View {
    constructor(context){
        super(context);
        this.layoutUrl = null;
        this.context = this;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        let layoutUrl = this.getAttrFromNodeXml(nodeXml,'layoutUrl')||this.layoutUrl;
        await this.setContentView(layoutUrl);
    }

    async setContentView(layoutUrl){
        this.layoutUrl = layoutUrl;
        let rootXmlNode = await Resource.loadLayoutSync(this.layoutUrl);
        this.viewRoot = await LayoutInflater.inflate(this,rootXmlNode);
        this.viewRoot.parentView = this;
    }

    setData(data){
        this.data = data;
    }

    getContextView(){
        return this;
    }

    findViewById(idView) {
        if (idView === null && idView === undefined)
            return null;
        if(this.viewRoot instanceof ViewGroup)
            return this.viewRoot.findViewById(idView);
        if(this.viewRoot.id === idView)
            return this.viewRoot;
        return null;
    }

    async createDomElement() {
        await super.createDomElement();
        this.elemDom.appendChild(await this.viewRoot.createDomElement());
        return this.elemDom;
    }

    //@Override
    async loadResources() {
        await super.loadResources();
        await this.viewRoot.loadResources();
    }
    
    //@Override
    async onMeasure(maxWidth, maxHeigth) {
        if(this.width !== LayoutInflater.MATCH_PARENT && this.width !== LayoutInflater.WRAP_CONTENT)
            maxWidth = parseFloat(this.width);
        if(this.height !== LayoutInflater.MATCH_PARENT && this.height !== LayoutInflater.WRAP_CONTENT)
            maxHeigth = parseFloat(this.height);

        await this.viewRoot.onMeasure(
            maxWidth - this.padding.left - this.padding.right,
            maxHeigth - this.padding.top - this.padding.bottom);
 
        let maxWidthElement, maxHeightElement;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeigth; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = this.padding.top + this.viewRoot.getHeight() + this.padding.bottom; break;
            default: maxHeightElement = maxHeigth;
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = this.padding.left + this.viewRoot.getWidth() + this.padding.right; break;
            default: maxWidthElement = maxWidth;
        }

        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        
        await this.repaint();
    }
};