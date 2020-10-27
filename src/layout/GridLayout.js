class GridLayout extends ViewGroup {
    constructor(context) {
        super(context);
        this.colums =2;
        this.horizontalSpace = 0;
        this.verticalSpace = 0;
        this.minWidthView = 50;
        this.minHeightView = 20;
    }

    //@Override
    parse(nodeXml) {
        super.parse(nodeXml);
        if (this.width === LayoutInflater.WRAP_CONTENT)
            throw new Exception(`No se permite el ancho dinamico de tipo [${LayoutInflater.WRAP_CONTENT}] para el atributo [layout_width] de la vista [GridLayout]`);

        if (nodeXml.getAttribute("colums"))
            this.colums = parseInt(nodeXml.getAttribute("colums"));
        if (nodeXml.getAttribute("horizontalSpace"))
            this.horizontalSpace = parseInt(nodeXml.getAttribute("horizontalSpace"));
        if (nodeXml.getAttribute("verticalSpace"))
            this.verticalSpace = parseInt(nodeXml.getAttribute("verticalSpace"));
        if (nodeXml.getAttribute("minWidthView"))
            this.minWidthView = parseInt(nodeXml.getAttribute("minWidthView"));
        if (nodeXml.getAttribute("minHeightView"))
            this.minHeightView = parseInt(nodeXml.getAttribute("minHeightView"));
    }

    //@Override
    parseViewChild(nodeXml) {
        let view = super.parseViewChild(nodeXml);
        // if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH) === LayoutInflater.MATCH_PARENT)
        //     throw `No puede establecer un ancho [${LayoutInflater.ATTR_LAYOUT_WIDTH}] de tipo [${LayoutInflater.MATCH_PARENT}] para la vista [${nodeXml.tagName}] en el contenedor [GridLayout]`;
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_HEIGHT) === LayoutInflater.MATCH_PARENT)
            throw `No puede establecer un alto [${LayoutInflater.ATTR_LAYOUT_HEIGHT}] de tipo [${LayoutInflater.MATCH_PARENT}] para la vista [${nodeXml.tagName}] en el contenedor [GridLayout]`;
        return view;
    }

    //@Override
    async onMeasureSync(maxWidth, maxHeigth){
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
                await view.onMeasureSync(maxAnchoView , maxHeigth);
                view.elemDom.style.top  = `${y}px`;
                view.elemDom.style.left  = `${x}px`;
                x+=maxAnchoView;
                console.log("view.getHeight()",view.getHeight());
                if(view.getHeight()>mayHeight)
                    mayHeight = view.getHeight();
                index++;
            }
            console.log("MAY HEIGHT",mayHeight);
            y=y+ mayHeight+this.verticalSpace;
        }

        let maxWidthElement, maxHeightElement;
        y= y + mayHeight + this.padding.bottom;

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
        await this.repaintSync();
    }
}