class LinearLayout extends ViewGroup {
    constructor(context) {
        super(context);
        this.orientation = LayoutInflater.HORIZONTAL;
        this.name = "LinearLayout";
    }
    //Override
    getTypeElement() {
        return "LinearLayout";
    }
    //Override
    parse(nodeXml) {
        super.parse(nodeXml);
        if (nodeXml.getAttribute(LayoutInflater.ATTR_ORIENTATION) === LayoutInflater.VERTICAL)
            this.orientation = LayoutInflater.VERTICAL;
    }
    //Override
    parseViewChild(nodeXml) {
        let view = super.parseViewChild(nodeXml);
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY) !== null)
            view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        else
            view.layoutGravity = null;
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT) !== null){
            let weight = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WEIGHT);
            var num = parseFloat(weight);
            if (isNaN(num))
                throw new Exception(
                    "El valor del atributo [" + LayoutInflater.ATTR_LAYOUT_WEIGHT +"] del view [" + view.name + "] no es un numero [" +weight + "]");

            if (num > 0)
                throw new Exception(
                    "El valor del atributo [" + LayoutInflater.ATTR_LAYOUT_WEIGHT + "] del view [" + view.name + "] no es un numero valido [" +weight + "]");
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
        if (this.orientation === LayoutInflater.VERTICAL)
            await this.onMeasureVertical(visibles, this.elemDom.clientWidth - this.padding.left - this.padding.right, this.elemDom.clientHeight - this.padding.top - this.padding.bottom);
        else
            await this.onMeasureHorizontal(visibles, this.elemDom.clientWidth - this.padding.left - this.padding.right, this.elemDom.clientHeight - this.padding.top - this.padding.bottom);
    }
    async onMeasureVertical(visibles, maxWidth, maxHeight) {
        var mayHeight = 0;
        var mayWidth = 0;

        var sumHeigthWrap = 0;
        var arrayWeigh = new Array();

        //Establenciendo dimensión de los componentes
        for(let view of visibles){
            if (view.layoutWeight)
            arrayWeigh.push(view);
            else{
                await view.onMeasureSync(maxWidth,maxHeight);
                sumHeigthWrap = sumHeigthWrap + view.margin.top + this.elemDom.clientHeight + view.margin.bottom;
            }
        }
        let altoWeigth = maxHeight - sumHeigthWrap;
        for(let view of arrayWeigh){
            await view.onMeasureSync(maxWidth,altoWeigth*view.layoutWeight);
        }

        // Dibujando las vistas
        var posTop = this.padding.top;
        for(let view of visibles){
            // Posición horizontal
            var gravitys = null;
            if (view.layoutGravity === null)
                gravitys = [LayoutInflater.LEFT];
            else
                gravitys = view.layoutGravity.split("|");
            for (let j = 0; j < gravitys.length; j++) {
                switch (gravitys[j]) {
                    case LayoutInflater.LEFT:
                        view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
                        break;
                    case LayoutInflater.RIGHT:
                        view.elemDom.style.left = (ancho - view.elemDom.clientWidth - view.margin.right - this.padding.right) + 'px';
                        break;
                    case LayoutInflater.CENTER_HORIZONTAL:
                        view.elemDom.style.left = (ancho / 2 - view.elemDom.clientWidth / 2) + 'px';
                        break;
                }
            }
            // Posición vertical
            view.elemDom.style.top = (posTop + view.margin.top) + 'px';
            posTop = posTop + view.margin.top + view.elemDom.clientHeight + view.margin.bottom;

            let sum = parseInt(view.elemDom.style.top) + view.elemDom.clientHeight + this.padding.bottom + view.margin.bottom;
            if (sum > mayHeight)
                mayHeight = sum;

            sum = parseInt(view.elemDom.style.left) + view.elemDom.clientWidth + this.padding.right + view.margin.right;
            if (sum > mayWidth)
                mayWidth = sum;
            // Ajustando contenido
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT:
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    if (mayHeight < this.minHeigth)
                        mayHeight = this.minHeigth;
                    this.elemDom.style.height = (mayHeight) + 'px';
                    await this.repaintSync();
                    break;
                default:
                    break;
            }
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT:
                    break;
                case LayoutInflater.WRAP_CONTENT:
                    if (mayWidth < this.minWidth)
                        mayWidth = this.minWidth;
                    this.elemDom.style.width = (mayWidth) + 'px';
                    await this.repaintSync();
                    break;
                default: break;
            }
        }
    }

    onMeasureHorizontal(visibles, maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var ancho = maxWidth;
        var alto = maxHeight;

        var mayHeight = 0;
        var mayWidth = 0;

        var sumWidthWrap = 0;
        var arrayWeigh = new Array();

        var index = -1;
        var view = null;
        // Para los que no tienen WEIGHT
        var loadWrapCompleted = function () {
            var loadAllCompleted = function () {
                var posLeft = this_.padding.left;
                for (var index = 0; index < visibles.length; index++) {
                    var view = visibles[index];
                    var gravitys = null;
                    if (view.layoutGravity === null)
                        gravitys = [LayoutInflater.TOP];
                    else
                        gravitys = view.layoutGravity.split("|");

                    for (var j = 0; j < gravitys.length; j++) {
                        switch (gravitys[j]) {
                            case LayoutInflater.TOP:
                                view.elemDom.style.top = (this_.padding.top + view.margin.top) + 'px';
                                break;
                            case LayoutInflater.BOTTOM:
                                view.elemDom.style.top = (alto - view.getHeight() - view.margin.bottom - this_.padding.bottom) + 'px';
                                break;
                            case LayoutInflater.CENTER_HORIZONTAL:
                                view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                                break;
                        }
                    }

                    view.elemDom.style.left = (posLeft + view.margin.left) + 'px';
                    posLeft = posLeft + view.margin.left + view.getWidth() + view.margin.right;

                    var sum = parseInt(view.elemDom.style.top) + view.getHeight() + this_.padding.bottom + view.margin.bottom;
                    if (sum > mayHeight)
                        mayHeight = sum;

                    sum = parseInt(view.elemDom.style.left) + view.getWidth() + this_.padding.right + view.margin.right;
                    if (sum > mayWidth)
                        mayWidth = sum;
                }

                // Ajustando contenido
                switch (this_.height) {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if (mayHeight < this_.minHeigth)
                            mayHeight = this_.minHeigth;
                        this_.elemDom.style.height = (mayHeight) + 'px';
                        this_.invalidate();
                        break;
                    default:
                        break;
                }
                switch (this_.width) {
                    case LayoutInflater.MATCH_PARENT:
                        break;
                    case LayoutInflater.WRAP_CONTENT:
                        if (mayWidth < this_.minWidth)
                            mayWidth = this_.minWidth;
                        this_.elemDom.style.width = (mayWidth) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                if (loadListener !== undefined)
                    loadListener();
            };

            if (arrayWeigh.length === 1) {
                view = arrayWeigh[0];
                view.onMeasure(ancho - sumWidthWrap, alto, loadAllCompleted);
            }
            else if (arrayWeigh.length > 0) {
                index = 0;
                var anchoTotal = ancho - sumWidthWrap;
                var viewWeighListener = function () {
                    index++;
                    if (index < arrayWeigh.length) {
                        view = visibles[index];
                        view.onMeasure(ancho, alto, viewWeighListener);
                    }
                    else
                        loadAllCompleted();
                };
                var view = arrayWeigh[index];
                // obtenemos el porsentage que le corresponde
                var num = parseFloat(view.layoutWeight);
                if (isNaN(num))
                    throw new Exception(
                        "El valor del atributo [" + LayoutInflater.ATTR_LAYOUT_WEIGHT +
                        "] del view [" + view.name + "] no es un numero [" +
                        view.layoutWeight + "]");

                if (num > 0)
                    throw new Exception(
                        "El valor del atributo [" + LayoutInflater.ATTR_LAYOUT_WEIGHT +
                        "] del view [" + view.name + "] no es un numero valido [" +
                        view.layoutWeight + "]");

                view.onMeasure(
                    anchoTotal * num,
                    alto,
                    viewWeighListener);
            }
            else
                loadAllCompleted();
        };
        var viewWrapListener = function () {
            if (view.layoutWeight)
                arrayWeigh.push(view);
            else
                sumWidthWrap = sumWidthWrap + view.margin.left + view.getWidth() + view.margin.right;
            index++;
            if (index < visibles.length) {
                view = visibles[index];
                if (view.layoutWeight) // No se realiza nada con los que tienen weight
                    viewWrapListener();
                else { // Se obtiene el tamaño para el que no tiene weigch
                    view.onMeasure(
                        ancho,
                        alto,
                        viewWrapListener);
                }
            }
            else // Se finaliza la busqueda de los weigch
                loadWrapCompleted();
        };
        index = 0;
        view = visibles[index];
        if (view.layoutWeight)
            viewWrapListener();
        else {
            view.onMeasure(ancho, alto, viewWrapListener);
        }
    }
    setOrientation(orientation) {
        this.orientation = orientation;
    }
}