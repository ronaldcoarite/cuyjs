class FlowLayout extends ViewGroup {
    constructor(context) {
        super(context);
        // this.orientation = LayoutInflater.LIN_ORIENTATION_HORIZONTAL;
    }

    //Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
    }

    //Override
    async parseViewChild(nodeXml) {
        let view = await super.parseViewChild(nodeXml);
        return view;
    }

    //@Override
    async onMeasure(maxWidth, maxHeight){
        let visibles = this.getViewVisibles();
        let mayHeight = 0;
        let mayWidth = 0;

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            await view.onMeasure(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
            let h = view.margin.top + view.getHeight() + view.margin.bottom;
            let w = view.margin.left + view.getWidth() + view.margin.right;

            if (h > mayHeight)
                mayHeight = h;
            if (w > mayWidth)
                mayWidth = w;
        }

        let maxWidthElement, maxHeightElement;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeight; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = mayHeight; break;
            default: maxHeightElement = parseFloat(this.height);
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = mayWidth; break;
            default: maxWidthElement = parseFloat(this.width);
        }
        this.elemDom.style.width = `${maxWidthElement}px`;

        let posY = this.padding.top;
        let posX = this.padding.left;
        mayHeight = 0;
        let count=0;
        let i = 0
        let rowI=0;
        let wContent = maxWidthElement - this.padding.left - this.padding.right;

        while(i < visibles.length){
            let view = visibles[i];
            let w = view.margin.left + view.getWidth() + view.margin.right;
            let h = view.margin.top + view.getHeight() + view.margin.bottom;
            if(posX + w +this.padding.right> wContent){
                let posXX = ((wContent)-posX)/2;
                for(let j = rowI;j <i ; j++)
                    visibles[j].elemDom.style.left  = `${visibles[j].elemDom.offsetLeft +posXX}px`;
                posY = posY + mayHeight;
                posX = this.padding.left;
                mayHeight = 0;
                view.elemDom.style.top  = `${view.margin.top + posY}px`;
                view.elemDom.style.left  = `${view.margin.left + posX}px`;
                if (h > mayHeight)
                    mayHeight = h;
                count = 0;
                rowI = i;
            }else{
                count++;
                view.elemDom.style.top  = `${view.margin.top + posY}px`;
                view.elemDom.style.left  = `${view.margin.left + posX}px`;
                if (h > mayHeight)
                    mayHeight = h;
            }
            posX = posX + w;
            i++
        }
        let posXX = ((wContent)-posX)/2;
        for(let j = rowI;j < visibles.length; j++)
            visibles[j].elemDom.style.left  = `${visibles[j].elemDom.offsetLeft +posXX}px`;
        
        if(this.height === LayoutInflater.WRAP_CONTENT)
            this.elemDom.style.height = `${posY+mayHeight+this.padding.bottom}px`;
        await this.repaint();
    }
}