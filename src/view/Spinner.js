class Spinner extends Button{
    constructor(context,model){
        super(context,model);
        this.text = Resource.getAttrOfTheme(this.constructor.name, 'text');
        this.position = Resource.getAttrOfTheme(this.constructor.name, 'position');
        this.replaceableValue = Resource.getAttrOfTheme(this.constructor.name, 'replaceableValue')=='true'?true:false;

        this.popup = new PopupWindow(context);
        let linViews = new LinearLayout(this.popup);
        linViews.setWidth('200px');
        linViews.setHeight('160px');
        linViews.setOrientation('vertical');
        this.popup.setContentView(linViews);
        this.popup.setView(this);
        this.popup.setPositionOnView(this.position);
        this.onClickItemListener = null;
        this.setOnClickListener(async ()=>{
            if(this.popup.isVisible())
                this.hideOptions();
            else
                await this.showOptions();
        },this);
        this.selectedIndex = -1;
    }

    async setOnClickItemListener(onClickItemListener){
        this.onClickItemListener = onClickItemListener;
    }

    async onClickOptionItem(viewOption){
        this.hideOptions();
        let index = 0;
        for(let option of this.popup.getContentView().getChilds()){
            if(option === viewOption)
                break;
            index++;
        }
        if(index == this.popup.getContentView().getChilds().length){
            // No se encuentra lo seleccionado
            console.log("No se encuentra lo seleccionaod");
        }else{
            if(this.replaceableValue)
                await this.setText(viewOption.getText());
            if(this.onClickItemListener)
                Reflect.apply(this.onClickItemListener, this.getContext(),[viewOption]);
        }
    }

    // async setSelecttion(index){
    //     if(index< 0 || index>= this.popup.getContentView().getChilds().length)
    //         throw new Exception(`El indice para la selección al Spinner debe estar entre [${0}] y [${this.popup.getView().getChilds().length}]`);
    //     if(this.selectedIndex===-1){

    //     }
    //     let option = this.popup.getContentView().getChildAt(index);
    //     this.elemSelected.appendChild(option.cloneDomElem());
    // }
    // 
    // setOnItemSelected(funOnItem){
    //     for(let viewOption of this.popup.getContentView().getChilds()){
    //         viewOption.setOnClickListener(this.onClickOptionItem,this);
    //     }
    //     this.onItemSelected = funOnItem;
    // }

    async onClickToogleSpinner(){
        if(this.popup.isVisible())
            this.hideOptions();
        else
            await this.showOptions();
    }

    async addOptionItem(viewOption){
        if(!(viewOption instanceof OptionItem))
            throw `Solo es permitido agregar Views de tipo [OptionItem]. El view enviado es de tipo [${viewOption.constructor.name}]`;
        await viewOption.setOnClickListener(this.onClickOptionItem,this);
        await this.popup.getContentView().addView(viewOption);
        viewOption.context = this;
    }

    getPopupContext(){
        return this.popup;
    }

    async showOptions(){
        let windowsDimension = PageManager.getWindowsDimension();
        // await this.popup.getViewRoot().onMeasure(windowsDimension.width, windowsDimension.height);
        await this.popup.show();
    }

    hideOptions(){
        this.popup.hide();
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if(this.getAttrFromNodeXml(nodeXml,"position") != null){
            this.position = this.getAttrFromNodeXml(nodeXml,"position");
            this.popup.setPositionOnView(this.position);
        }
        if(this.getAttrFromNodeXml(nodeXml,"text") != null){
            this.text = this.getAttrFromNodeXml(nodeXml,"text");
        }
        if(this.getAttrFromNodeXml(nodeXml,"replaceableValue") != null){
            this.replaceableValue = this.getAttrFromNodeXml(nodeXml,"replaceableValue")=='true'?true:false;
        }

        switch(this.position){
            case 'top':
                this.popup.getContentView().setBackground(Resource.getAttrOfTheme(this.constructor.name, 'backgroundTop'));
                break;
            case 'bottom':
                this.popup.getContentView().setBackground(Resource.getAttrOfTheme(this.constructor.name, 'backgroundBottom'));
                break;
        }

        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = await LayoutInflater.inflate(this.context, nodeChild,this.model);
            child.setOnClickListener(this.onClickOptionItem,this);
            await this.popup.getContentView().addView(child);
        }
    }
};