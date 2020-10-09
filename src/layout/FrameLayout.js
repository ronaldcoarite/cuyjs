class FrameLayout extends ViewGroup {
    constructor(context) {
        super(context);
        this.name = "FrameLayout";
    }
    //Override
    getTypeElement() {
        return "FrameLayout";
    }
    //Override
    parseViewChild(nodeXml) {
        let view = super.parseViewChild(nodeXml);
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY) !== null)
            view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        else
            view.layoutGravity = null;
        return view;
    }
    //@Override
    async onMeasureSync(maxWidth, maxHeight){
        await super.onMeasureSync(maxWidth, maxHeight);
        var ancho = this.getWidth();
        var alto = this.getHeight();
        var mayHeight = 0;
        var mayWidth = 0;
        if (this.viewsChilds.length === 0) {
            switch (this.height) {
                case LayoutInflater.MATCH_PARENT: break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.height = (this.padding.top + this.padding.bottom) + 'px';
                    await this.repaintSync();
                    break;
                default: break;
            }
            switch (this.width) {
                case LayoutInflater.MATCH_PARENT: break;
                case LayoutInflater.WRAP_CONTENT:
                    this.elemDom.style.width = (this.padding.left + this.padding.right) + 'px';
                    await this.repaintSync();
                    break;
                    default: break;
                }
                return;
        }

        let visibles = this.getViewVisibles();

        for(let view of visibles){
            let horizonalGrav = false;
            let verticalGrav = false;
            if (view.layoutGravity !== null) {
                let gravitys = view.layoutGravity.split("|");
                for (var j = 0; j < gravitys.length; j++) {
                    let gravity = gravitys[j];
                    // Posicionamos la vista segun el layout
                    if (gravity === LayoutInflater.TOP){
                        view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
                        verticalGrav = true;
                    }
                    if (gravity === LayoutInflater.RIGHT){
                        view.elemDom.style.left = (ancho - view.getWidth() - view.margin.right - this.padding.right) + 'px';
                        horizonalGrav = true;
                    }
                    if (gravity === LayoutInflater.LEFT){
                        horizonalGrav = true;
                        view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
                    }
                    if (gravity === LayoutInflater.BOTTOM){
                        verticalGrav = true;
                        view.elemDom.style.top = (alto - view.getHeight() - view.margin.bottom - this.padding.bottom) + 'px';
                    }
                    if (gravity === LayoutInflater.CENTER_HORIZONTAL){
                        horizonalGrav = true;
                        view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                    }
                    if (gravity === LayoutInflater.CENTER_VERTICAL){
                        verticalGrav = true;
                        view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                    }
                    if (gravity === LayoutInflater.CENTER) {
                        verticalGrav = true;
                        horizonalGrav = true;
                        view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                        view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                    }
                }
            }
            if(!verticalGrav)
                view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
            if(!horizonalGrav)
                view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';

            await view.onMeasureSync(maxWidth,maxHeight);

            var sum = parseInt(view.elemDom.style.top) + view.getHeight() + this.padding.bottom + view.margin.bottom;
            if (sum > mayHeight)
                mayHeight = sum;

            sum = parseInt(view.elemDom.style.left) + view.getWidth() + this.padding.right + view.margin.right;
            if (sum > mayWidth)
                mayWidth = sum;
        }
            
        // FIN
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = (mayHeight) + 'px';
                await this.repaintSync();
                break;
            default: break;
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = (mayWidth) + 'px';
                await this.repaintSync();
                break;
            default: break;
        }
    }
}