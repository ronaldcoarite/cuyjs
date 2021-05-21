class ViewGroup extends Container{
    constructor(context){
        super(context);
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