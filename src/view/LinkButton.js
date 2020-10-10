class LinkButton extends Button{
    constructor(context){
        super(context);
    }

    //@Override
    createDomElement () {
        super.createDomElement();
        this.elemDom.classList.add("LinkButton");
        this.elemDom.style.border = "none"
        return this.elemDom;
    }
};