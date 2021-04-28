class LinkButton extends Button{
    constructor(context){
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.padding.left = this.padding.top = this.padding.right = this.padding.bottom = 0;
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.elemDom.style.border = "none";
        return this.elemDom;
    }
};