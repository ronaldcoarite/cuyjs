class ImageButton extends ImageView{
    constructor(context,model){
        super(context,model);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
    }
};