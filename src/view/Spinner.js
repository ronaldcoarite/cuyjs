class Spinner extends View{
    constructor(context){
        super(context);
        this.popup = new PopupWindow(context);
        let linViews = new LinearLayout(this.popup);

        linViews.setBackground("lib/imgs/bg_popup.9.png");
        linViews.setWidth('250px');
        linViews.setHeight('200px');
        linViews.setOrientation('vertical');
        this.popup.setContentView(linViews);
        this.popup.setView(this);
        this.popup.setPositionOnView('right|top');
        this.setOnClickListener(this.onClickToogleSpinner);
        this.onItemSelected = null;
        this.selectedIndex = -1;
    }

    async onClickOptionItem(viewOption){
        if(this.elemSelected.firstChild)
            this.elemSelected.removeChild(this.elemSelected.firstChild);
        if(this.onItemSelected){
            Reflect.apply(this.onItemSelected, this.context,[viewOption]);
        }
        this.hideOptions();
        let index = 0;
        for(let option of this.popup.getViewRoot().getChilds()){
            if(option === viewOption)
                break;
        }
        await this.setSelecttion(index);
    }

    async setSelecttion(index){
        if(index< 0 || index>= this.popup.getViewRoot().getChilds().length)
            throw new Exception(`El indice para la selección al Spinner debe estar entre [${0}] y [${this.popup.getViewRoot().getChilds().length}]`);
        if(this.selectedIndex===-1){

        }
        let option = this.popup.getViewRoot().getChildAt(index);
        this.elemSelected.appendChild(option.cloneDomElem());
    }

    setOnItemSelected(funOnItem){
        for(let viewOption of this.popup.getViewRoot().getChilds()){
            viewOption.setOnClickListener(this.onClickOptionItem,this);
        }
        this.onItemSelected = funOnItem;
    }

    async onClickToogleSpinner(){
        if(this.popup.isVisible())
            this.hideOptions();
        else
            await this.showOptions();
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();        
        // Conenedor
        this.elemSelected = this.createHtmlElemFromType('div');
        this.elemDom.appendChild(this.elemSelected);

        // Boton select
        this.elemImgBtn = this.createHtmlElemFromType('img');
        this.elemDom.appendChild(this.elemImgBtn);
        return this.elemDom;
    }

    async addOptionItem(viewOption){
        if(!(viewOption instanceof OptionItem))
            throw `Solo es permitido agregar Views de tipo [OptionItem]. El view enviado es de tipo [${viewOption.constructor.name}]`;
        await viewOption.setOnClickListener(this.onClickOptionItem,this);
        await this.popup.getViewRoot().addView(viewOption);
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
        this.popup.cancel();
    }
};