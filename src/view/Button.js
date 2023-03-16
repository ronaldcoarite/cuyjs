class Button extends TextView{
    constructor(context,model){
        super(context,model);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.type = 'success';
    }

    //@Override
    getTypeElement() {
        return 'CButton';
    }

    //@Override
    async parse(nodeXml){
        await super.parse(nodeXml);
        this.type = this.getAttrFromNodeXml(nodeXml,'type') || this.type;
        switch(this.type){
            case 'success': 
                this.background = Resource.getAttrOfTheme(this.constructor.name, 'backgroundSuccess');
                this.textColor = Resource.getAttrOfTheme(this.constructor.name, 'textColorSuccess');
                break;
            case 'warn': 
                this.background = Resource.getAttrOfTheme(this.constructor.name, 'backgroundWarn');
                this.textColor = Resource.getAttrOfTheme(this.constructor.name, 'textColorWarn');
                break;
            case 'danger':
                this.background = Resource.getAttrOfTheme(this.constructor.name, 'backgroundDanger');
                this.textColor = Resource.getAttrOfTheme(this.constructor.name, 'textColorDanger');
                break;
        }
    }
};