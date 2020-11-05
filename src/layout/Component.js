class Component extends View {
    constructor(context){
        super(context);
        this.layoutUrl = null;
        this.data = null;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.layoutUrl = this.getAttrFromNodeXml(nodeXml,'layoutUrl');
        let data = this.getAttrFromNodeXml(nodeXml,'data');
        if(data){
            
        }
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
        return this.elemDom;
    }

    //@Override
    async loadResources() {
        await super.loadResources();
        let rootXmlNode = await Resource.loadLayoutSync(this.layoutUrl);
        // this.width = this.getAttrFromNodeXml(rootXmlNode,LayoutInflater.ATTR_LAYOUT_WIDTH) || LayoutInflater.WRAP_CONTENT;
        // this.height = this.getAttrFromNodeXml(rootXmlNode,LayoutInflater.ATTR_LAYOUT_HEIGHT) || LayoutInflater.WRAP_CONTENT;
        this.viewRoot = await LayoutInflater.inflate(this,rootXmlNode);
        this.viewRoot.parentView = this;
    }
    
    //@Override
    async onMeasureSync(maxWidth, maxHeigth) {
        if(this.elemDom.childNodes.length === 0)
            this.elemDom.appendChild(await this.viewRoot.createDomElement());

        if(this.width !== LayoutInflater.MATCH_PARENT && this.width !== LayoutInflater.WRAP_CONTENT)
            maxWidth = parseFloat(this.width);
        if(this.height !== LayoutInflater.MATCH_PARENT && this.height !== LayoutInflater.WRAP_CONTENT)
            maxHeigth = parseFloat(this.height);

        await this.viewRoot.onMeasureSync(
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
        
        await this.repaintSync();
    }
};