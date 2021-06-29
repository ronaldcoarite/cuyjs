class MenuLayout extends View {
    static MODE_SEPARATED='SEPARATED';
    static MODE_UNITED='UNITED';

    constructor(context) {
        super(context);
        this.linContainer = new LinearLayout(context);
        this.linContainer.setOrientation('horizontal');
        this.btnMenu = new ImageButton(context);
        this.btnMenu.setImageResource('lib/imgs/bg_btn_menu.png');
        this.btnMenu.width='50px';
        this.btnMenu.height='50px';
        this.linContainer.parentView = this;
        this.btnMenu.parentView = this;
        this.mode = MenuLayout.MODE_SEPARATED;
        this.btnMenu.setOnClickListener(this.showOptionDialog);
        this.dialog = null;
    }

    async hidePopup(){
        this.dialog.hide();
        this.dialog = null;
    }

    async showOptionDialog(){
        if(this.dialog){
            this.dialog.hide();
            this.dialog = null;
            return;
        }
        this.linContainer.elemDom.remove();
        // Cambiamos la alineacion de los elementos
        for(let view of this.linContainer.getChilds()){
            view.setLayoutGravity('left');
        }
        this.linContainer.setOrientation('vertical');
        this.linContainer.setOnClickListener(this.hidePopup);
        await this.linContainer.setBackground('lib/imgs/bg_popup_bottom.9.png');
        this.dialog = new PopupWindow(this.getContext());
        this.dialog.setView(this.btnMenu);
        this.dialog.setPositionOnView('right|bottom');
        this.dialog.setContentView(this.linContainer);
        await this.dialog.show();
    }

    async cancelOptionDialog(){
        this.linContainer.setOrientation('horizontal');
        this.linContainer.padding = {left:0,right:0,top:0,bottom:0};
        for(let view of this.linContainer.getChilds()){
            view.setLayoutGravity('top');
        }
        await this.linContainer.setBackground(null);
        this.elemDom.appendChild(this.linContainer.elemDom);
        this.dialog = null;
        this.linContainer.hideView();
    }

    //Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let child = await this.parseViewChild(nodeChild);
            child.parentView = this.linContainer;
            await this.linContainer.addView(child);
        }
    }

    //@Override
    async loadResources(){
        await super.loadResources();
        await this.linContainer.loadResources();
        await this.btnMenu.loadResources();
        if(this.mode===MenuLayout.MODE_SEPARATED){
            this.elemDom.appendChild(this.linContainer.elemDom);
            this.linContainer.showView();
        }
        else{
            this.elemDom.appendChild(this.btnMenu.elemDom);
            this.btnMenu.showView();
        }
        this.showView();
    }


    //Override
    async parseViewChild(nodeXml) {
        let view = await LayoutInflater.inflate(this.context, nodeXml);
        return view;
    }

    //@Override
    async onMeasure(maxWidth, maxHeight){
        if(this.dialog){
            this.dialog.hide();
            await this.cancelOptionDialog();
        }

        let maxWidthElement, maxHeightElement;
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT: maxWidthElement = maxWidth; break;
            case LayoutInflater.WRAP_CONTENT: maxWidthElement = maxWidth; break;
            default: maxWidthElement = parseFloat(this.width);
        }
        switch (this.height) {
            case LayoutInflater.MATCH_PARENT: maxHeightElement = maxHeight; break;
            case LayoutInflater.WRAP_CONTENT: maxHeightElement = maxWidth; break;
            default: maxHeightElement = parseFloat(this.height);
        }

        await this.linContainer.onMeasure(maxWidthElement-this.padding.left-this.padding.right,maxHeightElement-this.padding.top-this.padding.bottom);
        if(this.padding.left+this.linContainer.margin.left+this.linContainer.elemDom.clientWidth+this.linContainer.margin.right+this.padding.right>maxWidth){
            if(this.mode===MenuLayout.MODE_SEPARATED){
                //this.toButtomMode();
                this.elemDom.appendChild(this.btnMenu.elemDom);
                this.linContainer.hideView();
                this.btnMenu.showView();
            }
            this.btnMenu.onMeasure(maxWidthElement-this.padding.left-this.padding.right,maxHeightElement-this.padding.top-this.padding.bottom);
            this.btnMenu.elemDom.style.left=(this.padding.left+this.btnMenu.margin.left)+'px';
            this.btnMenu.elemDom.style.top=(this.padding.top+this.btnMenu.margin.top)+'px';
            this.mode=MenuLayout.MODE_UNITED;
            // Ajustando las dimensiones
            if(this.width === LayoutInflater.WRAP_CONTENT)
                maxWidthElement = this.padding.left+this.btnMenu.margin.left+this.btnMenu.elemDom.clientWidth+this.btnMenu.margin.right+this.padding.right;
            if(this.height === LayoutInflater.WRAP_CONTENT)
                maxHeightElement = this.padding.top+this.btnMenu.margin.top+this.btnMenu.elemDom.clientHeight+this.btnMenu.margin.bottom+this.padding.bottom;
        }else{
            if(this.mode===MenuLayout.MODE_UNITED){
                this.btnMenu.elemDom.remove();
                //this.elemDom.appendChild(this.linContainer.elemDom);
                this.mode=MenuLayout.MODE_SEPARATED;
                this.btnMenu.hideView();
                this.linContainer.showView();
            }
            // Ajustando las dimensiones
            if(this.width === LayoutInflater.WRAP_CONTENT)
                maxWidthElement = this.padding.left+this.linContainer.margin.left+this.linContainer.elemDom.clientWidth+this.linContainer.margin.right+this.padding.right;
            if(this.height === LayoutInflater.WRAP_CONTENT)
                maxHeightElement = this.padding.top+this.linContainer.margin.top+this.linContainer.elemDom.clientHeight+this.linContainer.margin.bottom+this.padding.bottom;

            // Las opciones se puede visualizar en el componente raiz
            this.linContainer.elemDom.style.left=(this.padding.left+this.linContainer.margin.left)+'px';
            this.linContainer.elemDom.style.top=(this.padding.top+this.linContainer.margin.top)+'px';
        }
        this.elemDom.style.width = maxWidthElement+'px';
        this.elemDom.style.height = maxHeightElement+'px';
        await this.repaint();
    }
}