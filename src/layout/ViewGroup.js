class ViewGroup extends Container{
    constructor(context){
        super(context);
    }

    getContentWidth(maxWidth,viewChild){
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                return maxWidth - this.padding.left - this.padding.right - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
            case LayoutInflater.WRAP_CONTENT:
                return this.elemDom.clientWidth - this.padding.left - this.padding.right  - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
            default: // Tamanio especifico 
                let lenght = parseInt(this.width);
                return lenght - this.padding.left - this.padding.right - (viewChild?viewChild.margin.left:0) - (viewChild?viewChild.margin.right:0);
        }
    }

    getContentHeight(maxHeight,viewChild){
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                return maxHeight - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
            case LayoutInflater.WRAP_CONTENT:
                return this.elemDom.clientWidth - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
            default: // Tamanio especifico 
                let lenght = parseInt(this.height);
                return lenght - this.padding.top - this.padding.bottom - (viewChild?viewChild.margin.top:0) - (viewChild?viewChild.margin.bottom:0);
        }
    }
    
    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = await this.parseViewChild(nodeChild);
            child.parentView = this;
            this.viewsChilds.push(child);
            this.elemDom.appendChild(child.elemDom);
        }
    }

    async parseViewChild(nodeXml) {
        let child = await LayoutInflater.inflate(this.context, nodeXml);
        return child;
    }
}