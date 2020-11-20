class Spinner extends TextView{
    constructor(context){
        super(context);
        this.popup = new PopupWindow(context);
        linViews = new LinearLayout(context);
        this.popup.setView(linViews);
    }

    //@Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        for (let index = 0; index < nodeXml.children.length; index++) {
            let nodeChild = nodeXml.children[index];
            let childView = await this.parseViewChild(nodeChild);
            childView.parentView = this;
            await this.linViews.addView(childView);
        }
    }

    async parseViewChild(nodeXml) {
        let child = await LayoutInflater.inflate(this.context, nodeXml);
        return child;
    }

    //@Override
    async createDomElement () {
        await super.createDomElement();        
        // Conenedor
        this.elemSelected = document.createElement('div');
        this.elemSelected.style.paddingTop = '0px';
        this.elemSelected.style.paddingLeft = '0px';
        this.elemSelected.style.paddingBottom = '0px';
        this.elemSelected.style.paddingRight = '0px';
        this.elemSelected.style.position = 'absolute';
        this.elemSelected.style.margin = "0px 0px 0px 0px";
        this.elemDom.appendChild(this.elemSelected);

        // Boton select
        this.elemImgBtn = document.createElement('img');
        this.elemImgBtn.style.paddingTop = '0px';
        this.elemImgBtn.style.paddingLeft = '0px';
        this.elemImgBtn.style.paddingBottom = '0px';
        this.elemImgBtn.style.paddingRight = '0px';
        this.elemImgBtn.style.position = 'absolute';
        this.elemImgBtn.style.margin = "0px 0px 0px 0px";

        this.elemDom.appendChild(this.elemImgBtn);
        return this.elemDom;
    }

    // @Override
    async onMeasure(maxWidth, maxHeight) {
        
    }

    showItems(){
        this.popup.setView(this);
        this.popup.setContentView(message);
        this.popup.show();
    }
};