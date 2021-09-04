class FormLayout extends Container {
    constructor(context,model){
        super(context,model);
    }

    // @Override
    findViewById(idView) {
        let view = super.findViewById(idView);
        if(view)
            return view;
        return this.getFirstChild().findViewById(idView);
    }

    // @Override
    getTypeElement(){
        return 'form';
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if(nodeXml.children.length > 1 || nodeXml.children.length === 0)
            throw new Exception(`El layout [${this.constructor.name}] tiene [${nodeXml.children.length}] vistas y solo es permitido 1 vista.`);

        let nodeChild = nodeXml.children[0];
        let child = await this.parseViewChild(nodeChild);
        if(!(child instanceof Container))
            throw new Exception(`La vista [${child.constructor.name}] no es una extención [Container].`);
        child.parentView = this;
        this.viewsChilds.push(child);
        this.elemDom.appendChild(child.elemDom);
    }

    async parseViewChild(nodeXml) {
        let child = await LayoutInflater.inflate(this.context, nodeXml,this.model);
        return child;
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

    validate(){

    }
};