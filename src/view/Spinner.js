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
        this.selectedIndex = -1;
        this.onClickContext = super.context;
    }

    setOnClickListener(onClickListener,onClickContext){
        this.onClickItemDefinition = onClickListener;
        if(onClickContext)
            this.onClickContext = onClickContext;
        else
            this.onClickContext = arguments[1]||this.onClickContext;
        if (typeof this.onClickItemDefinition === 'function') {
            this.onClickListener = this.onClickItemDefinition;
        }
        else{
            if (typeof this.onClickItemDefinition === 'string') {
                // Buscamos el nombre de metodo en el contexto
                let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.context));
                if(propertyNames.find(property=>property===this.onClickItemDefinition)){
                    this.onClickListener = this.context[this.onClickItemDefinition];
                }else
                    throw new Exception(`No se pudo encontrar la funcion [${this.onClickItemDefinition}] dentro del contexto [${this.context.constructor.name}]`);
            }
            else 
                throw new Exception(`El objeto [${onClickItemListener}] no es valido para establecer el Listener de onClickItemListener`);
        }
        if(this.onClickListener){
            this.elemDom.onclick=()=>{
                if(this.audioClickMedia)
                    this.audioClickMedia.play();
                this.onClickToogleSpinner();
            };
        }
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
            console.log("No se encuentra lo seleccionado");
        }else{
            if(this.replaceableValue){
                await this.setText(viewOption.getText());
                // await this.onReMeasure();
                // await this.context.onResize();
            }
            if(this.onClickListener){
                Reflect.apply(this.onClickListener, this.onClickContext, [viewOption]);
            }
        }
    }

    async onClickToogleSpinner(){
        if(this.popup.isVisible())
            this.hideOptions();
        else
            await this.showOptions();
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

    async addOptionItem(optionItem) {
        this.setOnClickListenerTo(optionItem, this.onClickOptionItem);
        await this.popup.getContentView().addView(optionItem);
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
            this.setOnClickListenerTo(child, this.onClickOptionItem);
            await this.popup.getContentView().addView(child);
        }
    }
};