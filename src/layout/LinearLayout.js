class LinearLayout extends ViewGroup {
    constructor(context,model) {
        super(context,model);
    }

    //Override
    async parse(nodeXml) {
        if (this.getAttrFromNodeXml(nodeXml,'orientation') === 'vertical')
            this.orientation = 'vertical';
        else if (this.getAttrFromNodeXml(nodeXml,'orientation') === 'horizontal')
            this.orientation = 'horizontal';
        else
            throw new Exception(
                `La orientación para LinearLayout debe ser unicamente [horizontal o vertical]. Establesca el atributo [orientation] para definir la orientación de la vista`);
        await super.parse(nodeXml);
    }

    //Override
    async parseViewChild(nodeXml) {
        let view = await super.parseViewChild(nodeXml);
        view.layoutGravity = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_GRAVITY);

        if (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_WEIGHT) !== null){
            let weight = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_WEIGHT);
            var num = parseFloat(weight);
            if (isNaN(num) === true)
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_WEIGHT}] del view [${this.constructor.name}] no es un número flotante [${weight}]`);

            if (!(num > 0.0 && num <= 1.0))
                throw new Exception(
                    `El valor del atributo [${LayoutInflater.ATTR_WEIGHT}] es [${weight}] del view [${this.constructor.name}] no esta del rango válido entre [0.0 y 1.0]`);
            view.weight = num;
        }
        return view;
    }

    //@Override
    async onMeasure(maxWidth, maxHeight){
        let visibles = this.getViewVisibles();
        if (this.orientation === 'vertical')
            await this.onMeasureVertical(visibles,maxWidth,maxHeight);
        else{ // horizontal
            await this.onMeasureHorizontal(visibles,maxWidth,maxHeight);
        }
        await this.repaint();
    }

    async onMeasureVertical(visibles, maxWidth, maxHeight) {
        let sumHeight = this.padding.top;
        let mayWidth = this.padding.left + this.padding.right;

        let sumHeigthWrap = 0;
        let arrayWeigh = new Array();

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            if (view.weight !== undefined && view.weight !== null && view.weight > 0)
                arrayWeigh.push(view);
            else{
                await view.onMeasure(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
                sumHeigthWrap += (view.margin.top + view.getHeight() + view.margin.bottom);
                if((this.padding.left + view.margin.left + view.getWidth() + view.margin.right + this.padding.right) > mayWidth)
                    mayWidth = (this.padding.left + view.margin.left + view.getWidth() + view.margin.right + this.padding.right);
                sumHeight+=(view.margin.top + view.getHeight() + view.margin.bottom);
            }
        }

        // Estableciendo alto de los componentes que tiene weight
        if(this.height === LayoutInflater.WRAP_CONTENT && arrayWeigh.length >0)
            throw new Exception(`Se especifico el atributo [weight] en uno de los hijos del [LinearLayout] con orientación [${this.orientation}] pero el ALTO se definio como [${LayoutInflater.WRAP_CONTENT}]. Especifique un tamaño fijo o ajustado al padre con [${LayoutInflater.MATCH_PARENT}]`);
        let altoWeigth = this.getContentHeight(maxHeight) - sumHeigthWrap;
        for(let view of arrayWeigh){
            await view.onMeasure(this.getContentWidth(maxWidth,view) , altoWeigth*view.weight - view.margin.top - view.margin.bottom);
            if((this.padding.left + view.margin.left + view.getWidth() + view.margin.right + this.padding.right)>mayWidth)
                mayWidth = (this.padding.left + view.margin.left + view.getWidth() + view.margin.right + this.padding.right);
            sumHeight+=(view.margin.top + view.getHeight() + view.margin.bottom);
        }

        // Estableciendo dimenciones del componente
        let maxWidthElement, maxHeightElement;
        sumHeight = sumHeight + this.padding.bottom;

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeight; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = sumHeight; break;
            default: maxHeightElement = parseFloat(this.height);
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = mayWidth; break;
            default: maxWidthElement = parseFloat(this.width);
        }
        
        // Dibujando las vistas
        let posTop = this.padding.top;
        for(let view of visibles){
            // Posición horizontal
            view.layoutGravity = view.layoutGravity || LayoutInflater.LEFT;
            let gravitys = view.layoutGravity.split("|");
            for(let layoutGravity of gravitys){
                switch (layoutGravity) {
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
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.constructor.name}] tiene asignado la alineación [${layoutGravity}]. Utilice unicamente [${LayoutInflater.LEFT},${LayoutInflater.RIGHT},${LayoutInflater.CENTER_HORIZONTAL}]`);
                }
            }

            // Posición vertical
            view.elemDom.style.top = (posTop + view.margin.top) + 'px';
            posTop = posTop + view.margin.top + view.getHeight() + view.margin.bottom;
        }
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
    }

    async onMeasureHorizontal(visibles, maxWidth, maxHeight) {
        let mayHeight = this.padding.top + this.padding.bottom;

        let sumWidthWrap = 0;
        let arrayWeigh = new Array();

        // Establenciendo dimensión de los componentes que no tienen weight
        for(let view of visibles){
            if (view.weight !== undefined && view.weight !== null && view.weight > 0){
                arrayWeigh.push(view);
            }
            else{
                await view.onMeasure(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
                sumWidthWrap += (view.margin.left + view.getWidth() + view.margin.right);
                if ((this.padding.top + view.margin.top + view.getHeight() + view.margin.bottom + this.padding.bottom) > mayHeight)
                    mayHeight = (this.padding.top + view.margin.top + view.getHeight() + view.margin.bottom + this.padding.bottom);
            }
        }

        let sumWidth = this.padding.left + sumWidthWrap;

        // Estableciendo alto de los componentes que tiene weight
        if(this.width === LayoutInflater.WRAP_CONTENT && arrayWeigh.length >0)
            throw new Exception(`Se especifico el atributo [weight] en uno de los hijos del [LinearLayout] con orientación [${this.orientation}] pero el ALTO se definio como [${LayoutInflater.WRAP_CONTENT}]. Especifique un tamaño fijo o ajustado al padre con [${LayoutInflater.MATCH_PARENT}]`);
        let anchoWeigth = this.getContentWidth(maxWidth) - sumWidthWrap;
        for(let view of arrayWeigh){
            await view.onMeasure(anchoWeigth*view.weight - view.margin.left - view.margin.right, this.getContentHeight(maxHeight,view));
            if ( (this.padding.top + view.margin.top + view.getHeight() + view.margin.bottom + this.padding.bottom) > mayHeight)
                mayHeight = (this.padding.top + view.margin.top + view.getHeight() + view.margin.bottom + this.padding.bottom);
            sumWidth+=(view.margin.left + view.getWidth() + view.margin.right);
        }

        // Verificando tamano de 
        let maxWidthElement, maxHeightElement;
        sumWidth = sumWidth + this.padding.right;

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeight; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = mayHeight; break;
            default: maxHeightElement = parseFloat(this.height);
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: 
                maxWidthElement = sumWidth; break;
            default: maxWidthElement = parseFloat(this.width);
        }
        
        // Dibujando las vistas
        let posLeft = this.padding.left;
        for(let view of visibles){
            // Posición vertical
            view.layoutGravity = view.layoutGravity || LayoutInflater.TOP;
            let gravitys = view.layoutGravity.split("|");
            for(let layoutGravity of gravitys){
                switch (layoutGravity) {
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
                            `La orientación para el LinearLayout es [${this.orientation}] y la vista [${view.constructor.name}] tiene asignado la alineación [${layoutGravity}]. Utilice unicamente [${LayoutInflater.TOP},${LayoutInflater.BOTTOM},${LayoutInflater.CENTER_VERTICAL}]`);
                }
            }
            // Posición horizontal
            view.elemDom.style.left = (posLeft + view.margin.left) + 'px';
            posLeft = posLeft + view.margin.left + view.getWidth() + view.margin.right;
        }
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
    }

    setOrientation(orientation) {
        this.orientation = orientation;
    }
}