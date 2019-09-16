class GridLayout extends ViewGroup{
    constructor(context) {
        super(context);
        this.colums=2,
        this.spacing= 0,
        this.name = "GridLayout";
    }
    //@Override
    getTypeElement() {
        return "GridLayout";
    }
    //@Override
    parse(nodeXml) {
        super.parse(nodeXml);
        if (nodeXml.children.length === 0)
            return;
        if (nodeXml.getAttribute("colums") !== null)
            this.colums = parseInt(nodeXml.getAttribute("colums"));
        if (nodeXml.getAttribute("spacing") !== null)
            this.spacing = parseInt(nodeXml.getAttribute("spacing"));
    }
    async onMeasureSync(maxWidth, maxHeigth){
        await super.onMeasureSync(maxWidth, maxHeigth);
        var childs = this.getViewVisibles();
        if (childs.length === 0) return;
        
        var maxAnchoView = (this.elemDom.clientWidth - this.padding.left - this.padding.right) / this.colums;

        var x = this.padding.left;
        var y = this.padding.top;
        var col = 0;
        var sumViewMaxHeight = 0;
        var sumHeight = 0;
        for(let view of childs){
            view.elemDom.style.left = x + 'px';
            view.elemDom.style.top = y + 'px';

            await view.onMeasureSync(maxAnchoView,maxHeigth);
            if (col === this.colums) {
                sumHeight+=sumViewMaxHeight;
                y = y+ sumViewMaxHeight;
                x = this.padding.left;
                sumViewMaxHeight = view.elemDom.clientHeight + view.margin.bottom + view.margin.top + this.spacing;
            }
            else{
                let sumH = view.elemDom.clientHeight + view.margin.bottom + view.margin.top + this.spacing;
                if(sumH>sumViewMaxHeight)
                    sumViewMaxHeight = sumH;
            }
            view.elemDom.style.top  = x + 'px';
            view.elemDom.style.left = y + 'px';
            x = x+ maxAnchoView;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = (sumHeight+this.padding.bottom) + 'px';
                // this_.invalidate();
                break;
            default: break;
        }
    }
}