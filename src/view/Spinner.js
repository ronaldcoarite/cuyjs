class Spinner extends View{
    constructor(context){
        super(context);
        this.popup = new PopupWindow(context);
        let linViews = new LinearLayout(context);
        linViews.setBackground("lib/imgs/bg_popup.9.png");
        linViews.setWidth('250px');
        linViews.setHeight('200px');
        linViews.setOrientation('vertical');
        this.popup.setContentView(linViews);
        this.popup.setView(this);
        this.setOnClickListener(this.onClickToogleSpinner);
    }

    onClickToogleSpinner(){
        if(this.popup.isVisible())
            this.hideOptions();
        else
            this.showOptions();
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();        
        // Conenedor
        this.elemSelected = this.createHtmlElemFromType('div');
        this.elemDom.appendChild(this.elemSelected);

        // Boton select
        this.elemImgBtn = this.createHtmlElemFromType('div');
        this.elemDom.appendChild(this.elemImgBtn);
        return this.elemDom;
    }

    async addOption(viewOption){
        if(!(viewOption instanceof Option))
            throw `Solo es permitido agregar Views de tipo [${Option}]. El view enviado es de tipo [${viewOption.constructor.name}]`
        await this.linViews.addView(viewOption);
    }

    showOptions(){
        this.popup.show();
    }

    hideOptions(){
        this.popup.cancel();
    }
};