class PopupWindow extends Dialog{
    constructor(context) {
        super(context)
        this.gravity = "left|top";
        this.view = null;
        this.margin = { left: 0, top: 0, right: 0, bottom: 0 };
        this.showBackground(false);
        this.showBackgroundProgress(false);
    }

    setPositionOnView(gravity) {
        this.gravity = gravity;
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
        this.viewRoot.elemDom.style.left = (rectView.left + this.margin.left) + 'px';
        this.viewRoot.elemDom.style.top = (rectView.top - this.viewRoot.elemDom.clientHeight) + 'px';
    }
};