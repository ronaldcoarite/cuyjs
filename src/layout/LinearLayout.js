class LinearLayout extends ViewGroup {
    constructor(context) {
        super(context);
        // this.orientation = LayoutInflater.LIN_ORIENTATION_HORIZONTAL;
        this.name = "LinearLayout";
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
            if (isNaN(num))
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_LAYOUT_WEIGHT}] del view [${view.name}] no es un número flotante [${weight}]`);

            if (num > 0.0 && num < 1.0)
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_LAYOUT_WEIGHT}] del view [${view.name}] no es un número flotante valido [${weight}]. El valor debe estar entre [0.0 y 1.0]`);
            view.layoutWeight = num;
        }
        return view;
    }

    //@Override
    async onMeasureSync(maxWidth, maxHeight){
        await super.onMeasureSync(maxWidth, maxHeight);
        let visibles = this.getViewVisibles();
        if(visibles.length === 0)
            return;
        if (this.orientation === LayoutInflater.LIN_ORIENTATION_VERTICAL)
            await this.onMeasureVertical(visibles, this.elemDom.clientWidth - this.padding.left - this.padding.right, this.elemDom.clientHeight - this.padding.top - this.padding.bottom);
        else
            await this.onMeasureHorizontal(visibles, this.elemDom.clientWidth - this.padding.left - this.padding.right, this.elemDom.clientHeight - this.padding.top - this.padding.bottom);
    }

    async onMeasureVertical(visibles, maxWidth, maxHeight) {
        var sumHeight = this.padding.top;
        var mayWidth = 0;

        var sumHeigthWrap = 0;
        var arrayWeigh = new Array();

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            if (view.layoutWeight)
                arrayWeigh.push(view);
            else{
                // if(view.height === LayoutInflater.MATCH_PARENT && visibles.length > 0)
                await view.onMeasureSync(maxWidth,maxHeight); // Ajustar contenido a las dimensiones
                sumHeigthWrap += view.elemDom.clientHeight;
                let sumWidth = this.padding.left + view.margin.left + view.elemDom.clientWidth + view.margin.right + this.padding.right;
                if (sumWidth > mayWidth)
                    mayWidth = sumWidth;
                sumHeight+=(view.margin.top + view.elemDom.clientHeight + view.margin.bottom);
            }
        }
        // Estableciendo alto de los componentes que tiene weight
        let altoWeigth = maxHeight - sumHeigthWrap;
        for(let view of arrayWeigh){
            await view.onMeasureSync(maxWidth,altoWeigth*view.layoutWeight);
            let sumWidth = this.padding.left + view.margin.left + view.elemDom.clientWidth + view.margin.right + this.padding.right;
            if (sumWidth > mayWidth)
                mayWidth = sumWidth;
            sumHeight+=(view.margin.top + view.elemDom.clientHeight + view.margin.bottom);
        }
        
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
                        view.elemDom.style.left = (mayWidth - view.elemDom.clientWidth - view.margin.right - this.padding.right) + 'px';
                        break;
                    case LayoutInflater.CENTER_HORIZONTAL:
                        view.elemDom.style.left = (mayWidth / 2 - view.elemDom.clientWidth / 2) + 'px';
                        break;
                    default:
                        throw new Exception(
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.name}] tiene asignado la alineación [${gravitys[j]}]. Utilice unicamente [${LayoutInflater.LEFT},${LayoutInflater.RIGHT},${LayoutInflater.CENTER_HORIZONTAL}]`);
                }
            }
            // Posición vertical
            view.elemDom.style.top = (posTop + view.margin.top) + 'px';
            posTop = posTop + view.margin.top + view.elemDom.clientHeight + view.margin.bottom;
        }
        sumHeight+=this.padding.bottom;

        // Ajustando contenido
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = `${sumHeight}px`;
                await this.repaintSync();
                break;
            default:
                break;
        }
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = `${mayWidth}px`;
                await this.repaintSync();
                break;
            default:
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
            if (view.layoutWeight)
                arrayWeigh.push(view);
            else{
                // if(view.height === LayoutInflater.MATCH_PARENT && visibles.length > 0)
                await view.onMeasureSync(maxWidth,maxHeight); // Ajustar contenido a las dimensiones
                sumWidthWrap += view.elemDom.clientWidth;
                let sumHeight = this.padding.top + view.margin.top + view.elemDom.clientHeight + view.margin.bottom + this.padding.bottom;
                if (sumHeight > mayHeight)
                    mayHeight = sumHeight;
                sumWidth+=(view.margin.left + view.elemDom.clientWidth + view.margin.right);
            }
        }
        // Estableciendo alto de los componentes que tiene weight
        let anchoWeigth = maxWidth - sumWidthWrap;
        for(let view of arrayWeigh){
            await view.onMeasureSync(anchoWeigth*view.layoutWeight,maxHeight);
            let sumHeight = this.padding.top + view.margin.top + view.elemDom.clientHeight + view.margin.bottom + this.padding.bottom;
            if (sumHeight > mayHeight)
                mayHeight = sumHeight;
            sumWidth+=(view.margin.left + view.elemDom.clientWidth + view.margin.right);
        }
        
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
                        view.elemDom.style.top = (mayHeight - view.elemDom.clientHeight - view.margin.top - this.padding.top) + 'px';
                        break;
                    case LayoutInflater.CENTER_VERTICAL:
                        view.elemDom.style.top = (mayHeight / 2 - view.elemDom.clientHeight / 2) + 'px';
                        break;
                    default:
                        throw new Exception(
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.name}] tiene asignado la alineación [${gravitys[j]}]. Utilice unicamente [${LayoutInflater.TOP},${LayoutInflater.BOTTOM},${LayoutInflater.CENTER_VERTICAL}]`);
                }
            }
            // Posición horizontal
            view.elemDom.style.left = (posLeft + view.margin.left) + 'px';
            posLeft = posLeft + view.margin.left + view.elemDom.clientWidth + view.margin.right;
        }
        sumWidth += this.padding.right;

        // Ajustando contenido
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = `${mayHeight}px`;
                await this.repaintSync();
                break;
            default:
                break;
        }
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = `${sumWidth}px`;
                await this.repaintSync();
                break;
            default:
                break;
        }
    }

    setOrientation(orientation) {
        this.orientation = orientation;
    }
}