class FrameLayout extends ViewGroup {
    constructor(context) {
        super(context);
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
            view.layoutGravity = 'left|top';
        return view;
    }
    //@Override
    async onMeasureSync(maxWidth, maxHeight){        
        let visibles = this.getViewVisibles();
        //  Dibujamos todos los componentes
        let mayHeight = this.padding.top + this.padding.bottom;
        let mayWidth = this.padding.left + this.padding.right;
        for(let view of visibles){
            await view.onMeasureSync(this.getContentWidth(maxWidth,view),this.getContentHeight(maxHeight,view));
            if((view.getWidth()+this.padding.left+this.padding.right) > mayWidth)
                mayWidth = (view.getWidth()+this.padding.left+this.padding.right);
            if((view.getHeight()+this.padding.top+this.padding.bottom) > mayHeight)
                mayHeight = (view.getHeight()+this.padding.top+this.padding.bottom);
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
            for (let j = 0; j < gravitys.length; j++) {
                let gravity = gravitys[j];
                if (gravity === LayoutInflater.TOP)
                    view.elemDom.style.top = (this.padding.top + view.margin.top) + 'px';
                if (gravity === LayoutInflater.RIGHT){
                    leftAligned = true;
                    view.elemDom.style.left = (maxWidthElement - view.getWidth() - view.margin.right - this.padding.right) + 'px';
                }
                if (gravity === LayoutInflater.LEFT){
                    leftAligned = true;
                    view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
                }
                if (gravity === LayoutInflater.BOTTOM)
                    view.elemDom.style.top = (maxHeightElement - view.getHeight() - view.margin.bottom - this.padding.bottom) + 'px';
                if (gravity === LayoutInflater.CENTER_HORIZONTAL){
                    leftAligned = true;
                    view.elemDom.style.left = (maxWidthElement / 2 - view.getWidth() / 2) + 'px';
                }
                if (gravity === LayoutInflater.CENTER_VERTICAL)
                    view.elemDom.style.top = (maxHeightElement / 2 - view.getHeight() / 2) + 'px';
                if (gravity === LayoutInflater.CENTER){
                    leftAligned = true;
                    view.elemDom.style.left = (maxWidthElement / 2 - view.getWidth() / 2) + 'px';
                    view.elemDom.style.top = (maxHeightElement / 2 - view.getHeight() / 2) + 'px';
                }
            }
            if(!leftAligned)
                view.elemDom.style.left = (this.padding.left + view.margin.left) + 'px';
        }
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        await this.repaintSync();
    }
}