class WaitingView extends View{
    constructor (context,model) {
        super(context,model);
    }

    // @Override
    createHtmlElement(){
        this.width='30px';
        this.height='30px';
        super.createHtmlElement();
        this.animation = new SpinnerAnimation({
            left: 0,
            top: 0,
            size: 30, 
            showBackground: false,
            backgroundRotation: false,
            parentElement: this.elemDom
        });
        this.animation.show();
    }

    async onMeasure(maxWidth, maxHeigth) {
        let maxWidthElement, maxHeightElement;
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeigth; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = this.padding.top + 30 + this.padding.bottom; break;
            default: maxHeightElement = parseInt(this.height);
        }

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = this.padding.left + 30 + this.padding.right; break;
            default: maxWidthElement = parseInt(this.width);
        }

        this.animation.resize(Math.min(maxWidthElement,maxWidthElement));
        this.elemDom.style.height = `${maxHeightElement}px`;
        this.elemDom.style.width = `${maxWidthElement}px`;
        
        await this.repaint();
    }
}