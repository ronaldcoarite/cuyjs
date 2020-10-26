class LinearLayout extends ViewGroup {
    constructor(context) {
        super(context);
        // this.orientation = LayoutInflater.LIN_ORIENTATION_HORIZONTAL;
    }

    //Override
    getTypeElement() {
        return "LinearLayout";
    }

    //Override
    parse(nodeXml) {
        if (nodeXml.getAttribute(LayoutInflater.ATTR_ORIENTATION) === LayoutInflater.LIN_ORIENTATION_VERTICAL)
            this.orientation = LayoutInflater.LIN_ORIENTATION_VERTICAL;
        else if (nodeXml.getAttribute(LayoutInflater.ATTR_ORIENTATION) === LayoutInflater.LIN_ORIENTATION_HORIZONTAL)
            this.orientation = LayoutInflater.LIN_ORIENTATION_HORIZONTAL;
        else
            throw new Exception(
                `La orientación para LinearLayout debe ser unicamente [horizontal o vertical]. Establesca el atributo [${LayoutInflater.ATTR_ORIENTATION}] para definir la orientación de la vista`);
        super.parse(nodeXml);
    }

    //Override
    parseViewChild(nodeXml) {
        let view = super.parseViewChild(nodeXml);
        view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY)||
            (this.orientation===LayoutInflater.LIN_ORIENTATION_VERTICAL?
                LayoutInflater.ATTR_LAYOUT_GRAVITY_LEFT:
                LayoutInflater.ATTR_LAYOUT_GRAVITY_TOP);
            
        // console.log("LERANRO ORIENTATION GRAVITY: ", this.orientation, " = ",view.layoutGravity,"ATRIBUTE="+nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY));

        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT) !== null){
            let weight = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT);
            var num = parseFloat(weight);
            if (isNaN(num) === true)
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_LAYOUT_WEIGHT}] del view [${this.constructor.name}] no es un número flotante [${weight}]`);

            if (!(num > 0.0 && num <= 1.0))
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_LAYOUT_WEIGHT}] es [${weight}] del view [${this.constructor.name}] no esta del rango válido entre [0.0 y 1.0]`);
            view.layoutWeight = num;
        }
        return view;
    }

    //@Override
    async onMeasureSync(maxWidth, maxHeight){
        // await super.onMeasureSync(maxWidth, maxHeight);
        let visibles = this.getViewVisibles();
        // console.log("MAX HEIGHT",maxHeight,"MAX CONTECT ",this.getContentHeight(maxHeight));
        if(visibles.length === 0)
            return;
        if (this.orientation === LayoutInflater.LIN_ORIENTATION_VERTICAL)
            await this.onMeasureVertical(visibles,maxWidth,maxHeight);
        else
            await this.onMeasureHorizontal(visibles,maxWidth,maxHeight);
        await this.repaintSync();
    }

    async onMeasureVertical(visibles, maxWidth, maxHeight) {
        var sumHeight = this.padding.top;
        var mayWidth = 0;

        var sumHeigthWrap = 0;
        var arrayWeigh = new Array();

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            if (view.layoutWeight !== undefined && view.layoutWeight !== null && view.layoutWeight > 0){
                arrayWeigh.push(view);
            }
            else{
                await view.onMeasureSync(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
                sumHeigthWrap += (view.getHeight() + view.margin.top + view.margin.bottom);
                let sumWidth = this.padding.left + view.margin.left + view.getWidth() + view.margin.right + this.padding.right;
                if (sumWidth > mayWidth)
                    mayWidth = sumWidth;
                sumHeight+=(view.margin.top + view.getHeight() + view.margin.bottom);
            }
        }

        // Estableciendo alto de los componentes que tiene weight
        let altoWeigth = maxHeight - sumHeigthWrap -this.padding.top- this.padding.bottom-this.margin.top-this.margin.bottom;
        for(let view of arrayWeigh){
            await view.onMeasureSync(this.getContentWidth(maxWidth,view) , altoWeigth*view.layoutWeight - view.margin.top - view.margin.bottom);
            let sumWidth =  view.margin.left + view.getWidth() + view.margin.right;
            if (sumWidth > mayWidth)
            mayWidth = sumWidth;
            sumHeight+=(view.margin.top + view.getHeight() + view.margin.bottom);
        }

        // Verificando tamano de 
        let maxWidthElement = this.getContentWidth(maxWidth) - this.margin.left - this.margin.right;
        
        // Dibujando las vistas
        var posTop = this.padding.top;
        for(let view of visibles){
            // Posición horizontal
            var gravitys = null;
            view.layoutGravity = view.layoutGravity || LayoutInflater.LEFT;
            gravitys = view.layoutGravity.split("|");
            for (let j = 0; j < gravitys.length; j++) {
                switch (gravitys[j]) {
                    case LayoutInflater.LEFT:
                        view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
                        break;
                    case LayoutInflater.RIGHT:
                        view.elemDom.style.left = (maxWidthElement - view.getWidth() - view.margin.right - this.padding.right) + 'px';
                        break;
                    case LayoutInflater.CENTER_HORIZONTAL:
                        view.elemDom.style.left = (maxWidthElement / 2 - view.getWidth() / 2) + 'px';
                        break;
                    default:
                        throw new Exception(
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.constructor.name}] tiene asignado la alineación [${gravitys[j]}]. Utilice unicamente [${LayoutInflater.LEFT},${LayoutInflater.RIGHT},${LayoutInflater.CENTER_HORIZONTAL}]`);
                }
            }
            // Posición vertical
            view.elemDom.style.top = (posTop + view.margin.top) + 'px';
            posTop = posTop + view.margin.top + view.getHeight() + view.margin.bottom;
        }
        sumHeight+=this.padding.bottom;

        // Ajustando contenido
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = `${maxHeight}px`;
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = `${sumHeight}px`;
                break;
            default:
                let height = parseInt(this.height);
                height = Math.max(height,this.maxHeigth);
                this.elemDom.style.height = height + 'px';
                break;
        }
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = `${maxWidth}px`;
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = `${mayWidth}px`;
                break;
            default:
                let width = parseInt(this.width);
                width = Math.max(width,this.maxWidth);
                this.elemDom.style.width = width + 'px';
                break;
        }
    }

    async onMeasureHorizontal(visibles, maxWidth, maxHeight) {
        var sumWidth = this.padding.left;
        var mayHeight = 0;

        var sumWidthWrap = 0;
        var arrayWeigh = new Array();

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            if (view.layoutWeight !== undefined && view.layoutWeight !== null && view.layoutWeight > 0)
                arrayWeigh.push(view);
            else{
                await view.onMeasureSync(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
                sumWidthWrap += (view.getWidth() + view.margin.left + view.margin.right);
                let sumHeight = this.padding.top + view.margin.top + view.getHeight() + view.margin.bottom + this.padding.bottom;
                if (sumHeight > mayHeight)
                    mayHeight = sumHeight;
                sumWidth+=(view.margin.left + view.getWidth() + view.margin.right);
            }
        }
        // Estableciendo alto de los componentes que tiene weight
        let anchoWeigth = maxWidth - sumWidthWrap -this.padding.left - this.padding.right -this.margin.left - this.margin.right;
        for(let view of arrayWeigh){
            await view.onMeasureSync(anchoWeigth*view.layoutWeight-view.margin.left-view.margin.right, this.getContentHeight(maxHeight,view));
            let sumHeight =  view.margin.top + view.getHeight() + view.margin.bottom;
            if (sumHeight > mayHeight)
                mayHeight = sumHeight;
            sumWidth+=(view.margin.left + view.getWidth() + view.margin.right);
        }

        // Verificando tamano de 
        let maxHeightElement = this.getContentHeight(maxHeight)-this.margin.top-this.margin.bottom;
        
        // Dibujando las vistas
        var posLeft = this.padding.top;
        for(let view of visibles){
            // Posición vertical
            var gravitys = null;
            view.layoutGravity = view.layoutGravity || LayoutInflater.TOP;
            gravitys = view.layoutGravity.split("|");
            for (let j = 0; j < gravitys.length; j++) {
                switch (gravitys[j]) {
                    case LayoutInflater.TOP:
                        view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
                        break;
                    case LayoutInflater.BOTTOM:
                        view.elemDom.style.top = (maxHeightElement - view.getHeight() - view.margin.top - this.padding.top) + 'px';
                        break;
                    case LayoutInflater.CENTER_VERTICAL:
                        view.elemDom.style.top = (maxHeightElement / 2 - view.getHeight() / 2) + 'px';
                        break;
                    default:
                        throw new Exception(
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.constructor.name}] tiene asignado la alineación [${gravitys[j]}]. Utilice unicamente [${LayoutInflater.TOP},${LayoutInflater.BOTTOM},${LayoutInflater.CENTER_VERTICAL}]`);
                }
            }
            // Posición horizontal
            view.elemDom.style.left = (posLeft + view.margin.left) + 'px';
            posLeft = posLeft + view.margin.left + view.getWidth() + view.margin.right;
        }
        // sumWidth += this.padding.right;

        // Ajustando contenido
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = `${maxHeight}px`;
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = `${mayHeight}px`;
                break;
            default:
                let height = parseInt(this.height);
                height = Math.max(height,this.maxHeigth);
                this.elemDom.style.height = height + 'px';
                break;
        }
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = `${maxWidth}px`;
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = `${sumWidth}px`;
                break;
            default:
                let width = parseInt(this.width);
                width = Math.max(width,this.maxWidth);
                this.elemDom.style.width = width + 'px';
                break;
        }
    }

    setOrientation(orientation) {
        this.orientation = orientation;
    }
}