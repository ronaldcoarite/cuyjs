class WebView extends View{
    constructor (context) {
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 0;
        this.src = null;
    }

    //@Override
    async createHtmlElement () {
        super.createHtmlElement();
        this.elemIframe = this.createHtmlElemFromType('iframe');
        this.elemDom.appendChild(this.elemIframe);
        return this.elemDom;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.src = this.getAttrFromNodeXml(nodeXml,"src") || this.src;
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        if(this.src)
            this.elemIframe.src=this.src;
    }
    
    setUrl(url) {
        this.url = url;
        this.elemIframe.src=this.url;
    }

    async onMeasure(maxWidth, maxHeigth) {
        let maxWidthElement, maxHeightElement;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: 
                maxHeightElement = maxHeigth; 
                this.elemIframe.height = maxHeigth-this.padding.top-this.padding.bottom;
                break;
            case LayoutInflater.WRAP_CONTENT:
                maxHeightElement = this.padding.top + this.elemIframe.clientHeight + this.padding.bottom;
                break;
            default:
                maxHeightElement = parseInt(this.height);
                this.elemIframe.height = maxHeightElement-this.padding.top-this.padding.bottom;
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                maxWidthElement = maxWidth;
                this.elemIframe.width = maxWidth-this.padding.left-this.padding.right;
                break;
            case LayoutInflater.WRAP_CONTENT:
                maxWidthElement = this.padding.left + this.elemIframe.clientWidth + this.padding.right; 
                break;
            default:
                maxWidthElement = parseInt(this.width);
                this.elemIframe.width = maxWidthElement-this.padding.left-this.padding.right;
        }
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        
        await this.repaint();
    }
}