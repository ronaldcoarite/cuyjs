class Button extends TextView{
    constructor(context){
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.padding.left = this.padding.top = this.padding.right = this.padding.bottom = 4;
        this.name = "Button";
    }
    //@Override
    getTypeElement(){
        return 'Button';
    }

    //@Override
    createDomElement () {
        super.createDomElement();
        this.elemDom.classList.add("Button");
        return this.elemDom;
    }
};