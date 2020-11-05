class LinkButton extends Button{
    constructor(context){
        super(context);
    }

    //@Override
    async createDomElement () {
        await super.createDomElement();
        this.elemDom.classList.add("LinkButton");
        this.elemDom.style.border = "none"
        return this.elemDom;
    }
};