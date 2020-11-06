class RelativeLayout extends ViewGroup{
    constructor(context) {
        super(context);
    }

    //@Override
    async parseViewChild(nodeXml) {
        var view = await super.parseViewChild(nodeXml);
        view.alignParentTop = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_ALIGNPARENTTOP) === "true");
        view.alignParentRight = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_ALIGNPARENTRIGHT) === "true");
        view.alignParentBottom = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_ALIGNPARENTBOTTOM) === "true");
        view.alignParentLeft = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_ALIGNPARENTLEFT) === "true");
        
        view.centerHorizontal = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_CENTERHORIZONTAL) === "true");
        view.centerVertical = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_CENTERVERTICAL) === "true");
        view.centerInParent = (this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_CENTERINPARENT) === "true");
        
        view.above = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_ABOVE);
        view.below = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_BELOW);
        view.toRightOf = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_TORIGHTOF);
        view.toLeftOf = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_LAYOUT_TOLEFTOF);
        return view;
    }

    //@Override
    async onMeasure(maxWidth, maxHeight){
        await super.onMeasure(maxWidth, maxHeight);
        let visibles = this.getViewVisibles();
        var mayHeight = 0;
        var mayWidth = 0;
        // Dibujando todos los componentes sin posicionarlos para obtener sus dimensiones candidato
        for(let view of visibles){
            await view.onMeasure(
                maxWidth- this.padding.left - this.padding.right,
                maxHeight-this.padding.top - this.padding.bottom);
            let sumWidth = this.padding.left + view.margin.left + view.elemDom.clientWidth + view.margin.right + this.padding.right;
            if (sumWidth > mayWidth)
                mayWidth = sumWidth;
            let sumHeight = this.padding.top + view.margin.top + view.elemDom.clientHeight + view.margin.bottom + this.padding.bottom;
            if (sumHeight > mayHeight)
                mayHeight = sumHeight;
        }

        // Iteramos nuevamente para posicionar los elementos a partir de su dimesion y respecto a sus referencias
        for(let view of visibles){
            await view.onMeasure(
                maxWidth- this.padding.left - this.padding.right,
                maxHeight-this.padding.top - this.padding.bottom);

            // Posicionamos la vista segun el layout
            if (view.alignParentTop === true)
                view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
            if (view.alignParentRight === true)
                view.elemDom.style.left = (this.elemDom.clientWidth - view.elemDom.clientWidth - view.margin.right - this.padding.right) + 'px';
            if (view.alignParentLeft === true)
                view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
            if (view.alignParentBottom === true)
                view.elemDom.style.top = (this.elemDom.clientHeight - view.elemDom.clientHeight - view.margin.bottom - this.padding.bottom) + 'px';

            if (view.centerHorizontal === true)
                view.elemDom.style.left = (this.elemDom.clientWidth / 2 - view.elemDom.clientWidth / 2) + 'px';
            if (view.centerVertical === true)
                view.elemDom.style.top = (this.elemDom.clientHeight / 2 - view.elemDom.clientHeight / 2) + 'px';
            if (view.centerInParent === true) {
                view.elemDom.style.left = (this.elemDom.clientWidth / 2 - view.elemDom.clientWidth / 2) + 'px';
                view.elemDom.style.top = (this.elemDom.clientHeight / 2 - view.elemDom.clientHeight / 2) + 'px';
            }

            // Ubicación respecto a otros elementos
            // ATTR_LAYOUT_ABOVE:"layout_above",//id
            if (view.above) {
                var viewAbove = this.findViewById(view.above);
                if (!viewAbove)
                    throw new Exception(`No se encuentra el view hijo con id [${view.above}] citado en la vista [${view.name}], para el contenedor [${this.name}]`);
                view.elemDom.style.top = (parseInt(viewAbove.elemDom.style.top) - viewAbove.margin.top - view.elemDom.clientHeight - view.margin.bottom) + 'px';
            }
            // ATTR_LAYOUT_BELOW:"layout_below",//id
            if (view.below) {
                var viewBelow = this.findViewById(view.below);
                if (!viewBelow)
                    throw new Exception(`No se encuentra el view hijo con id [${view.below}] citado en la vista [${view.name}], para el contenedor [${this.name}]`);
                view.elemDom.style.top = (parseInt(viewBelow.elemDom.style.top) + viewBelow.elemDom.clientHeight + viewBelow.margin.bottom + view.margin.top) + 'px';
            }
            // ATTR_LAYOUT_TORIGHTOF:"layout_toRightOf",//id
            if (view.toLeftOf) {
                var viewToLeft = this.findViewById(view.toLeftOf);
                if (!viewToLeft)
                    throw new Exception(`No se encuentra el view hijo con id [${view.toLeftOf}] citado en la vista [${view.name}], para el contenedor [${this.name}]`);
                if (view.alignParentLeft === true) {
                    await view.onMeasure(
                        parseInt(viewToLeft.elemDom.style.left) - view.margin.left - view.margin.right,
                        this.elemDom.clientHeight - this.padding.top - this.padding.bottom);
                        // Posiblemente pintar de nuevo la vista de fondo
                }
                else if (view.toRightOf !== null) {
                    console.log("Entrando por aquiiiiiaaaaaaaaaaaaaaaaaai. Pendiente");
                }
                else {
                    view.elemDom.style.left = (parseInt(viewToLeft.elemDom.style.left) - view.elemDom.clientWidth - view.margin.right) + 'px';
                }
            }
            // ATTR_LAYOUT_TOLEFTOF:"layout_toLeftOf",//id
            if (view.toRightOf) {
                var viewToRight = this.findViewById(view.toRightOf);
                if (viewToRight === null)
                    throw new Exception(`No se encuentra el view hijo con id [${view.toRightOf}] citado en la vista [${view.name}], para el contenedor [${this.name}]`);

                view.elemDom.style.left = (
                    parseInt(viewToRight.elemDom.style.left)
                    + viewToRight.margin.left
                    + viewToRight.elemDom.clientWidth
                    + viewToRight.margin.right
                    + view.margin.left) + 'px';
            }

            // verificando si tiene position top
            if (view.elemDom.style.top === "")
                view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
            if (view.elemDom.style.left === "")
                view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
            var sum = parseInt(view.elemDom.style.top) + view.getHeight() + this.padding.bottom + view.margin.bottom;
            if (sum > mayHeight)
                mayHeight = sum;
            sum = parseInt(view.elemDom.style.left) + view.getWidth() + this.padding.right + view.margin.right;
            if (sum > mayWidth)
                mayWidth = sum;
        }
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = `${mayHeight}px`;
                await this.repaint();
                break;
            default: break;
        }
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = `${mayWidth}px`;
                await this.repaint();
                break;
            default: break;
        }
    }
};