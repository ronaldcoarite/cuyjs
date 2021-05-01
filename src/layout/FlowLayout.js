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

        let posY = this.padding.top;
        mayHeight = 0;
        let i = 0
        let rowI=0;
        let wContent = maxWidthElement - this.padding.left - this.padding.right;
        let acumulate = 0;
        let mayAcumulate = 0;

        while(i < visibles.length){
            let view = visibles[i];
            let w = view.margin.left + view.getWidth() + view.margin.right;
            let h = view.margin.top + view.getHeight() + view.margin.bottom;
            if(this.padding.left + acumulate + w +this.padding.right> wContent){
                let posStart = (wContent/2-acumulate/2);
                // Esto es solo para centrar todos los de la fila
                for(let j = rowI;j <i ; j++){
                    let viewRow = visibles[j];
                    viewRow.elemDom.style.left  = `${this.padding.left+viewRow.margin.left+posStart}px`;
                    posStart+=(viewRow.margin.left+viewRow.elemDom.clientWidth + viewRow.margin.right);
                }
                posY = posY + mayHeight;
                mayHeight = 0;
                if(acumulate>mayAcumulate)
                    mayAcumulate = acumulate;
                acumulate = 0;
                rowI = i;
            }
            view.elemDom.style.top  = `${view.margin.top + posY}px`;
            if (h > mayHeight)
                mayHeight = h;
            acumulate+=w;
            i++
        }

        let posStart = (wContent/2-acumulate/2);
        // Esto es solo para centrar todos los de la fila
        for(let j = rowI;j <i ; j++){
            let viewRow = visibles[j];
            viewRow.elemDom.style.left  = `${this.padding.left+viewRow.margin.left+posStart}px`;
            posStart+=(viewRow.margin.left+viewRow.elemDom.clientWidth + viewRow.margin.right);
        }
        if(acumulate > mayAcumulate)
            mayAcumulate = acumulate;

        if(this.height === LayoutInflater.WRAP_CONTENT)
            maxHeightElement = posY + mayHeight + this.padding.bottom;
        if(this.width === LayoutInflater.WRAP_CONTENT)
            maxWidthElement = (this.padding.left + mayAcumulate + this.padding.right)+'px';
        this.elemDom.style.width = maxWidthElement+'px';
        this.elemDom.style.height = maxHeightElement+'px';
        await this.repaint();
    }
}