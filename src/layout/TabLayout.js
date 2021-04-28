class TabLayout extends View {
    constructor(context) {
        super(context);
        this.tabSelected=-1;
        this.tabs = new Array();
        this.tabContentBg = null;
        this.colorTabTitle='#D2D3D5';
        this.audioClickTabMedia = null;
        this.audioAdoveTabMedia = null;
        this.audioClickTab = Resource.getAttrOfTheme(this.constructor.name, 'audioClickTab');
        this.audioAdoveTab = Resource.getAttrOfTheme(this.constructor.name, 'audioAdoveTab');
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.textTabs = this.createHtmlElemFromType('TextTabs');
        this.contentTab = this.createHtmlElemFromType('ContentTab');

        this.container = this.createHtmlElemFromType('BodyTab');
        this.container.appendChild(this.textTabs);
        this.container.appendChild(this.contentTab);
        this.elemDom.appendChild(this.container);
        return this.elemDom;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.colorTabTitle = this.getAttrFromNodeXml(nodeXml,'colorTabTitle')||this.colorTabTitle;
        this.audioClickTab = this.getAttrFromNodeXml(nodeXml,"audioClickTab") || this.audioClickTab;
        this.audioAdoveTab = this.getAttrFromNodeXml(nodeXml,"audioAdoveTab") || this.audioAdoveTab;
        for (let index = 0; index < nodeXml.children.length; index++){
            let nodeChild = nodeXml.children[index];
            let view = await this.parseViewChild(nodeChild);
            await this.addTab(view,view.tabName);
        }
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        if(this.audioClickTab)
            this.audioClickTabMedia = new Audio(this.audioClickTab);
        if(this.audioAdoveTab)
            this.audioAdoveTabMedia = new Audio(this.audioAdoveTab);
    }

    async parseViewChild(nodeXml) {
        let view = await LayoutInflater.inflate(this.context, nodeXml);
        view.tabName = this.getAttrFromNodeXml(nodeXml,"tabName")||this.tabName;
        view.parentView = this;
        return view;
    }

    //@Override
    showElemDom(){
        super.showElemDom();
        let view = this.getTabSelected();
        if(view)
            view.showView();
    }

    async onClickTab(viewOnClicked){
        let view = this.getTabSelected();
        if(view){
            view.tabTitle.bgTitleTab = new NinepathBackground(null,view.tabTitle.titleContent,'lib/imgs/bg_titletab_unselected.9.png');
            await view.tabTitle.bgTitleTab.load();
            view.elemDom.remove();
        }

        let indexSelected= this.tabs.findIndex(vv=>vv===viewOnClicked);
        viewOnClicked.tabTitle.bgTitleTab = new NinepathBackground(null,viewOnClicked.tabTitle.titleContent,'lib/imgs/bg_titletab_selected.9.png');
        await viewOnClicked.tabTitle.bgTitleTab.load();
        this.contentTab.appendChild(viewOnClicked.elemDom);
        this.tabSelected = indexSelected;
        await this.onReMeasure();
        viewOnClicked.showView();
    }

    // @Override
    async addTab(view,textTabName) {
        let elemText = this.createHtmlElemFromType('span');
        elemText.style.wordWrap = 'break-word'; // Ajustar texto a contenido
        elemText.style.whiteSpace = "nowrap";
        elemText.innerHTML = textTabName;

        let textConentTab = this.createHtmlElemFromType('TabTitle');
        textConentTab.appendChild(elemText);
        textConentTab.style.color = this.colorTabTitle;
        textConentTab.classList.add("TabTitle");
        textConentTab.onmouseenter=()=>{
            if(this.audioAdoveTabMedia){
                this.audioAdoveTabMedia.play();
            }
            return false;
        };
            // this.elemDom.onmouseout=()=>{
                // this.audioAdove.pause();
                // this.audioAdove.currentTime = 0;
            // };
        
        this.textTabs.appendChild(textConentTab);
        view.tabName = textTabName;
        view.tabTitle = {
            bgTitleTab: null,
            elemTitle: elemText,
            titleContent: textConentTab
        };
        textConentTab.onclick=()=>{
            if(this.audioClickTabMedia)
                this.audioClickTabMedia.play();
            (async () => {
                await this.onClickTab(view);
            })();
            
        };
        await view.loadResources();
        if(this.tabSelected===-1){
            // Agregamos el contenido
            this.contentTab.appendChild(view.elemDom);
            this.tabSelected = 0;
            view.tabTitle.bgTitleTab = new NinepathBackground(null,textConentTab,'lib/imgs/bg_titletab_selected.9.png');
        }else{
            view.tabTitle.bgTitleTab = new NinepathBackground(null,textConentTab,'lib/imgs/bg_titletab_unselected.9.png');
        }
        await view.tabTitle.bgTitleTab.load();
        this.tabs.push(view);

        if(this.elemDom.style.visibility==='visible'){
            await this.onReMeasure();
            view.showView();
        }
    }

    getTabAt(index){
        return this.tabs[index];
    }

    getTabSelected(){
        if(this.tabSelected===-1)
            return null;
        return this.tabs[this.tabSelected];
    }

    //@Override
    async onMeasure(maxWidth, maxHeigth){
        if(this.tabs.length===0){
            await super.onMeasure(maxWidth,maxHeigth);
            return;
        }
        if(this.tabContentBg === null){
            // Cargamos el fondo de pantalla
            this.tabContentBg = new NinepathBackground(null,this.contentTab,'lib/imgs/bg_tabcontent.9.png');
            await this.tabContentBg.load();
        }

        // Pintamos los nombres de las pestañas
        let mayHT = 0;
        let posX= this.tabContentBg.padding.left;
        let space = 10;

        // tabTitle
        for(let view of this.tabs){
            view.tabTitle.titleContent.style.width = (view.tabTitle.bgTitleTab.padding.left+view.tabTitle.elemTitle.clientWidth+view.tabTitle.bgTitleTab.padding.right)+'px';
            view.tabTitle.titleContent.style.height = (view.tabTitle.bgTitleTab.padding.top+view.tabTitle.elemTitle.clientHeight+view.tabTitle.bgTitleTab.padding.bottom)+'px';
            view.tabTitle.elemTitle.style.left= view.tabTitle.bgTitleTab.padding.left+'px';
            view.tabTitle.elemTitle.style.top= view.tabTitle.bgTitleTab.padding.top+'px';
            await view.tabTitle.bgTitleTab.paint();

            view.tabTitle.titleContent.style.left = posX + 'px';
            posX+=(view.tabTitle.titleContent.clientWidth + space);
            if(view.tabTitle.titleContent.clientHeight > mayHT)
                mayHT = view.tabTitle.titleContent.clientHeight;
        }
        mayHT=mayHT-3;

        // Pintamos el contenido de las pestanas
        let view = this.getTabSelected();
        let maxWidthElement, maxHeightElement;
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                maxWidthElement = maxWidth - this.padding.left - this.padding.right;
                break;
            case LayoutInflater.WRAP_CONTENT:
                maxWidthElement = maxWidth - this.padding.left - this.padding.right;
                break;
            default:
                let width = parseInt(this.width);
                maxWidthElement = width - this.padding.left - this.padding.right;
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                maxHeightElement = maxHeigth - this.padding.top - this.padding.bottom - mayHT; break;
                break;
            case LayoutInflater.WRAP_CONTENT:
                maxHeightElement = maxHeigth - this.padding.top - this.padding.bottom - mayHT; break;
                break;
            default:
                let height = parseInt(this.height);
                maxHeightElement = height - this.padding.top - this.padding.bottom - mayHT; break;
                break;
        }

        await view.onMeasure(
            maxWidthElement-this.tabContentBg.padding.left-this.tabContentBg.padding.right , 
            maxHeightElement-this.tabContentBg.padding.top-this.tabContentBg.padding.bottom);

        this.contentTab.style.top=mayHT+'px';
        view.elemDom.style.top = this.tabContentBg.padding.top+'px';
        view.elemDom.style.left = this.tabContentBg.padding.left+'px';
        this.container.style.left = this.padding.left+'px';
        this.container.style.right = this.padding.right+'px';
        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.textTabs.style.height = mayHT+'px';
                this.textTabs.style.width = (maxWidth-this.padding.left-this.padding.right)+'px';
                this.contentTab.style.width = (maxWidth-this.padding.left-this.padding.right)+'px';
                this.container.style.width = (maxWidth-this.padding.left-this.padding.right)+'px';
                this.elemDom.style.width = maxWidth+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.textTabs.style.height = mayHT+'px';
                this.textTabs.style.width = Math.max(posX,view.elemDom.clientWidth +this.tabContentBg.padding.left+this.tabContentBg.padding.right)+'px';
                this.contentTab.style.width = this.textTabs.clientWidth+'px';
                this.container.style.width = this.textTabs.clientWidth+'px';

                this.elemDom.style.width = (this.padding.left+this.container.clientWidth+this.padding.right)+'px';
                break;
            default:
                let width = parseInt(this.width);

                this.textTabs.style.height = mayHT+'px';
                this.textTabs.style.width = (width-this.padding.left-this.padding.right)+'px';
                this.contentTab.style.width = this.textTabs.clientWidth+'px';
                this.container.style.width = this.textTabs.clientWidth+'px';
                this.elemDom.style.width = width+'px';
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.textTabs.style.height = mayHT+'px';
                this.contentTab.style.height = (maxHeigth - mayHT-this.padding.top - this.padding.bottom)+'px';
                this.container.style.height = (maxHeigth - this.padding.top - this.padding.bottom)+'px';
                this.elemDom.style.height = maxHeigth+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.textTabs.style.height = mayHT+'px';
                this.contentTab.style.height = (view.elemDom.clientHeight +this.tabContentBg.padding.top+this.tabContentBg.padding.bottom)+'px';
                this.container.style.height = (mayHT + this.textTabs.clientHeight)+'px';

                this.elemDom.style.height = (this.padding.top +this.textTabs.clientHeight + this.contentTab.clientHeight + this.padding.bottom)+'px';
                break;
            default:
                let height = parseInt(this.height);
                this.textTabs.style.height = mayHT+'px';
                this.contentTab.style.height = (height - mayHT-this.padding.top-this.padding.bottom)+'px';
                this.container.style.height = (height - this.padding.top-this.padding.bottom)+'px';
                this.elemDom.style.height= height+'px';
                break;
        }
        await this.tabContentBg.paint();
        await this.repaint();
    }
}