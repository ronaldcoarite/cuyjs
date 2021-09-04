class GridLayout extends ViewGroup {
    constructor(context,model) {
        super(context,model);
        this.colums =2;
        this.horizontalSpace = 0;
        this.verticalSpace = 0;
        this.minWidthView = 50;
        this.minHeightView = 20;
    }

    //@Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if (this.width === LayoutInflater.WRAP_CONTENT)
            throw new Exception(`No se permite el ancho dinamico de tipo [${LayoutInflater.WRAP_CONTENT}] para el atributo [width] de la vista [GridLayout]`);

        if (this.getAttrFromNodeXml(nodeXml,"colums"))
            this.colums = parseInt(this.getAttrFromNodeXml(nodeXml,"colums"));
        if (this.getAttrFromNodeXml(nodeXml,"horizontalSpace"))
            this.horizontalSpace = parseInt(this.getAttrFromNodeXml(nodeXml,"horizontalSpace"));
        if (this.getAttrFromNodeXml(nodeXml,"verticalSpace"))
            this.verticalSpace = parseInt(this.getAttrFromNodeXml(nodeXml,"verticalSpace"));
        if (this.getAttrFromNodeXml(nodeXml,"minWidthView"))
            this.minWidthView = parseInt(this.getAttrFromNodeXml(nodeXml,"minWidthView"));
        if (this.getAttrFromNodeXml(nodeXml,"minHeightView"))
            this.minHeightView = parseInt(this.getAttrFromNodeXml(nodeXml,"minHeightView"));
    }

    //@Override
    async parseViewChild(nodeXml) {
        let view = await super.parseViewChild(nodeXml);
        // if (nodeXml,LayoutInflater.ATTR_WIDTH) === LayoutInflater.MATCH_PARENT)
        //     throw `No puede establecer un ancho [${LayoutInflater.ATTR_WIDTH}] de tipo [${LayoutInflater.MATCH_PARENT}] para la vista [${nodeXml.tagName}] en el contenedor [GridLayout]`;
        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_HEIGHT) === LayoutInflater.MATCH_PARENT)
            throw `No puede establecer un alto [${LayoutInflater.ATTR_HEIGHT}] de tipo [${LayoutInflater.MATCH_PARENT}] para la vista [${nodeXml.tagName}] en el contenedor [GridLayout]`;
        return view;
    }

    //@Override
    async onMeasure(maxWidth, maxHeigth){
        let visibles = this.getViewVisibles();
        let maxAnchoView = this.getContentWidth(maxWidth) / this.colums;

        let y = this.padding.top , x;
        let index = 0;
        let mayHeight = 0;

        while(index < visibles.length){
            x = this.padding.left;
            mayHeight = 0;
            for(let j=1; j <=this.colums && index < visibles.length; j++) {
                let view = visibles[index];
                await view.onMeasure(maxAnchoView , maxHeigth);
                view.elemDom.style.top  = `${y+view.margin.top}px`;
                view.elemDom.style.left  = `${x+view.margin.left}px`;
                x+=maxAnchoView;
                if(view.margin.top+view.getHeight()+view.margin.bottom>mayHeight)
                    mayHeight = view.margin.top+view.getHeight()+view.margin.bottom;
                index++;
            }
            y=y+ mayHeight+this.verticalSpace;
        }

        let maxWidthElement, maxHeightElement;
        //y= y + mayHeight + this.padding.bottom;

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeight; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = y; break;
            default: maxHeightElement = parseFloat(this.height);
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            // case LayoutInflater.WRAP_CONTENT: maxWidthElement = mayWidth; break; // Este caso no se presentara
            default: maxWidthElement = parseFloat(this.width);
        }

        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        await this.repaint();
    }
}