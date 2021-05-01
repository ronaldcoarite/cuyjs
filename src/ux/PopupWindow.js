class PopupWindow extends Dialog{
    constructor(context) {
        super(context)
        this.position = "left|top";
        this.view = null;
        this.margin = { left: 0, top: 0, right: 0, bottom: 0 };
        this.showBackground(false);
        this.showBackgroundProgress(false);
    }

    setPositionOnView(position) {
        this.position = position;
    }

    setView(view) {
        this.view = view;
    }

    getView(){
        return this.view;
    }

    // @Override
    setPosition(windowsDimension){
        // super.setPosition(windowsDimension);
        let rectView = this.view.elemDom.getBoundingClientRect();
        for(let posItem of this.position.split('|')){
            switch(posItem){
                case 'left':
                    this.viewRoot.elemDom.style.left = (rectView.left) + 'px';
                    break;
                case 'right':
                    this.viewRoot.elemDom.style.left = ( rectView.left + this.view.getWidth() - this.viewRoot.getWidth()) + 'px';
                    break;
                case 'top':
                    this.viewRoot.elemDom.style.top = (rectView.top - this.viewRoot.getHeight()) + 'px';
                    break;
                case 'bottom':
                    this.viewRoot.elemDom.style.top = (rectView.top + this.view.getHeight()) + 'px';
                    break;
            }
        }
    }
};