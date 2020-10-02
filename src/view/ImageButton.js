
class ImageButton extends ImageView{
    constructor(context){
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.name = "ImageButton";
    }
    
    // @Override
    createDomElement(){
        let elemDom = super.createDomElement();
        elemDom.classList.add("AndButton");
        return elemDom;
    }
};