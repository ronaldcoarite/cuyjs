class FlowLayout extends ViewGroup {
    constructor(context,model) {
        super(context,model);
        this.alignment="center";
        this.verticalSpace = 0;
        this.horizontalSpace = 0;
    }

    //Override
    async parse(nodeXml) {
        this.alignment = this.getAttrFromNodeXml(nodeXml,'alignment')||this.alignment;
        if (this.getAttrFromNodeXml(nodeXml,"verticalSpace"))
            this.verticalSpace = parseInt(this.getAttrFromNodeXml(nodeXml,'verticalSpace'));
        if (this.getAttrFromNodeXml(nodeXml,"horizontalSpace"))
            this.horizontalSpace = parseInt(this.getAttrFromNodeXml(nodeXml,'horizontalSpace'));
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
        let mayHeight = this.verticalSpace;
        let mayWidth = this.horizontalSpace;

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            await view.onMeasure(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
            let h = view.margin.top + view.getHeight() + view.margin.bottom + this.verticalSpace;
            let w = view.margin.left + view.getWidth() + view.margin.right + this.horizontalSpace;

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
            if(this.padding.left + acumulate + w +this.horizontalSpace+this.padding.right> wContent){
                let posStart;
                if(this.alignment === 'left')
                    posStart = 0;
                else // center
                    posStart = (wContent/2-acumulate/2);
                
                // Esto es solo para centrar todos los de la fila
                for(let j = rowI;j <i ; j++){
                    let viewRow = visibles[j];
                    viewRow.elemDom.style.left  = `${this.padding.left+viewRow.margin.left+posStart}px`;
                    posStart+=(viewRow.margin.left+viewRow.elemDom.clientWidth + viewRow.margin.right + this.horizontalSpace);
                }
                posY = posY + mayHeight + this.verticalSpace;
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

        let posStart;
        if(this.alignment === 'left')
            posStart = 0;
        else // center
            posStart = (wContent/2-acumulate/2);

        // Esto es solo para centrar todos los de la fila
        for(let j = rowI;j <i ; j++){
            let viewRow = visibles[j];
            viewRow.elemDom.style.left  = `${this.padding.left+viewRow.margin.left+posStart}px`;
            posStart+=(viewRow.margin.left+viewRow.elemDom.clientWidth + viewRow.margin.right + this.horizontalSpace);
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