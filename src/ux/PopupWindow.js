class PopupWindow extends Context{
    constructor(context) {
        super();
        this.context = context;
        this.position = "left|top";
        this.view = null;
        this.margin = { left: 0, top: 0, right: 0, bottom: 0 };
        this.viewRoot = null;
    }

    setPositionOnView(position) {
        this.position = position;
    }

    setView(view) {
        this.view = view;
    }

    getView(){
        return this.view;
    }

    setContentView(view) {
        if (view instanceof View)
            this.viewRoot = view;
        else if(typeof view==='string')
            this.urlView = view;
        else
            throw `El contenido enviado [${view}] no es valido para el [PopupWindow]. Establesca solo una url con XML para el layout o una intancia de View`;
    }

    async onReMesasure(){
        let windowsDimension = PageManager.getWindowsDimension();
        await this.viewRoot.loadResources();
        await this.viewRoot.onMeasure(
            windowsDimension.width-(windowsDimension.width*this.viewRoot.margin.left/100)-(windowsDimension.width*this.viewRoot.margin.right/100), 
            windowsDimension.height-(windowsDimension.height*this.viewRoot.margin.top/100)-(windowsDimension.height*this.viewRoot.margin.bottom/100));
    }

    async show(){     
        if(this.visible)   
            throw new Exception(`El PopupWindows ya se encuentra visible.`);
        // Verificamos si tiene contenido la pagina
        if(this.viewRoot || this.urlView)
            ; // Contenido definido
        else
            throw new Exception(`El PopupWindow [${this_.constructor.name}] no tiene contenido definido. Asigne uno con [setContentView]`);

        if(this.viewRoot === null)
            this.viewRoot = await LayoutInflater.inflate(this,this.urlView);

        document.body.appendChild(this.viewRoot.elemDom);
        // Dibujamos la vista
        await this.viewRoot.loadResources();
        await this.onReMesasure();

        // Mostrando todos los elementos
        this.viewRoot.showView();
        this.visible = true;

        let rectView = this.view.elemDom.getBoundingClientRect();
        for(let posItem of this.position.split('|')){
            switch(posItem){
                case 'left':
                    this.viewRoot.elemDom.style.left = (rectView.left) + 'px';
                    break;
                case 'right':
                    this.viewRoot.elemDom.style.left = ( rectView.left + this.view.getWidth() - this.viewRoot.getWidth()) + 'px';
                    break;
                case 'top':
                    this.viewRoot.elemDom.style.top = (rectView.top - this.viewRoot.getHeight()) + 'px';
                    break;
                case 'bottom':
                    this.viewRoot.elemDom.style.top = (rectView.top + this.view.getHeight()) + 'px';
                    break;
            }
        }
    }

    async hide(){
        if(this.viewRoot && this.viewRoot.elemDom)
            this.viewRoot.elemDom.remove();
        this.visible = false;
    }
};