
class ImageButton extends ImageView{
    constructor(context){
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
    }
    
    // @Override
    createDomElement(){
        let elemDom = super.createDomElement();
        return elemDom;
    }
};