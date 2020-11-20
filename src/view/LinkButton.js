class LinkButton extends Button{
    constructor(context){
        super(context);
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.elemDom.style.border = "none";
        return this.elemDom;
    }
};