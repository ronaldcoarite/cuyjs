class Button extends TextView{
    constructor(context,model){
        super(context,model);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.padding.left = this.padding.top = this.padding.right = this.padding.bottom = 4;
    }

    getTypeElement() {
        return 'CButton';
    }
};