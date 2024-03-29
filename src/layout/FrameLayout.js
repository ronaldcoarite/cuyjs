class FrameLayout extends ViewGroup {
    constructor(context,model) {
        super(context,model);
    }

    //@Override
    async parseViewChild(nodeXml) {
        let view = await super.parseViewChild(nodeXml);
        view.layoutGravity = this.getAttrFromNodeXml(nodeXml,LayoutInflater.ATTR_GRAVITY)||'left|top';
        return view;
    }

    // @Override
    async addView(viewChild) {
        viewChild.layoutGravity = viewChild.layoutGravity || 'left|top';
        await super.addView(viewChild);
    }

    //@Override
    async onMeasure(maxWidth, maxHeight){
        let visibles = this.getViewVisibles();
        //  Dibujamos todos los componentes
        let mayHeight = this.padding.top + this.padding.bottom;
        let mayWidth = this.padding.left + this.padding.right;
        for(let view of visibles){
            await view.onMeasure(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
            if((view.margin.left+this.padding.left+view.getWidth()+this.padding.right+view.margin.right) > mayWidth)
                mayWidth = (view.margin.left+this.padding.left+view.getWidth()+this.padding.right+view.margin.right);
            if((view.margin.top+this.padding.top+view.getHeight()+this.padding.bottom+view.margin.bottom) > mayHeight)
                mayHeight = (view.margin.top+this.padding.top+view.getHeight()+this.padding.bottom+view.margin.bottom);
        }
        let maxWidthElement,maxHeightElement;

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

        for(let view of visibles){
            let gravitys = view.layoutGravity.split("|");
            let leftAligned =false;
            let topAligned =false;
            for (let j = 0; j < gravitys.length; j++) {
                let layoutGravity = gravitys[j];
                if (layoutGravity === LayoutInflater.TOP){
                    view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
                    topAligned=true;
                }
                if (layoutGravity === LayoutInflater.RIGHT){
                    leftAligned = true;
                    view.elemDom.style.left = (maxWidthElement - view.getWidth() - view.margin.right - this.padding.right) + 'px';
                }
                if (layoutGravity === LayoutInflater.LEFT){
                    leftAligned = true;
                    view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
                }
                if (layoutGravity === LayoutInflater.BOTTOM){
                    view.elemDom.style.top = (maxHeightElement - view.getHeight() - view.margin.bottom - this.padding.bottom) + 'px';
                    topAligned=true;
                }
                if (layoutGravity === LayoutInflater.CENTER_HORIZONTAL){
                    leftAligned = true;
                    view.elemDom.style.left = (maxWidthElement / 2 - view.getWidth() / 2) + 'px';
                }
                if (layoutGravity === LayoutInflater.CENTER_VERTICAL){
                    view.elemDom.style.top = (maxHeightElement / 2 - view.getHeight() / 2) + 'px';
                    topAligned=true;
                }
                if (layoutGravity === LayoutInflater.CENTER){
                    leftAligned = true;
                    topAligned=true;
                    view.elemDom.style.left = (maxWidthElement / 2 - view.getWidth() / 2) + 'px';
                    view.elemDom.style.top = (maxHeightElement / 2 - view.getHeight() / 2) + 'px';
                }
            }
            if(!leftAligned)
                view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
            if(!topAligned)
                view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
        }
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        await this.repaint();
    }
}