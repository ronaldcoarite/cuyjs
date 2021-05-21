class ScrollView extends View{
    constructor (context) {
        super(context);
        this.content = null;
        this.MIN_HEIGHT_THUMB=50; // 50px
        this.MIN_HEIGHT = 300;
        this.MIN_WIDTH = 500;
        this.PADDING_SCROLL=5;
    }

    // @Override
    findViewById(idView) {
        if(this.id && this.id === idView) {
            return this;
        }
        if(!this.content)
            return null;
        return this.content.findViewById(idView);
    }
    
    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if(nodeXml.children.length>1)
            throw new Exception(`El layout [ScrollView] no puede tener de un hijo. El hijo [${nodeXml.children[1].tabName}] debe ser borrado.`);
        if(nodeXml.children.length === 1){
            let view = await LayoutInflater.inflate(this.context, nodeXml.children[0]);
            await this.setContent(view);
        }
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        this.bgBarScroll = new NinepathBackground(null,this.barScroll,'lib/imgs/bg_v_bar_scroll.9.png');
        await this.bgBarScroll.load();
        this.bgScroll = new NinepathBackground(null,this.scroll,'lib/imgs/bg_v_scroll.9.png');
        await this.bgScroll.load();
        this.scroll.style.width=(this.bgScroll.padding.left + this.bgScroll.padding.right+1)+'px';
        await this.addEventScroll();
    }

    //@Override
    createHtmlElement() {
        super.createHtmlElement();
        this.barScroll = this.createHtmlElemFromType('BarScroll');
        this.scroll = this.createHtmlElemFromType('Scroll');
        this.bodyScroll = this.createHtmlElemFromType('BodyScroll');
        this.bodyScroll.style.overflow='hidden';

        this.elemDom.appendChild(this.bodyScroll);
        this.elemDom.appendChild(this.barScroll);
        this.elemDom.appendChild(this.scroll);
        return this.elemDom;
    }

    async setContent(view){
        this.content = view;
        view.parentView = this;
        await view.loadResources();
        this.bodyScroll.appendChild(view.elemDom);
        view.showView();
    }

    moveContent(dist){
        if(!this.moving)
            return;
        let alto = this.bodyScroll.clientHeight;
        if (this.lastTop + dist > 0)
            this.content.elemDom.style.top = '0px';
        else if (this.lastTop + dist + this.content.elemDom.clientHeight < alto)
            this.content.elemDom.style.top = (alto - this.content.elemDom.clientHeight) + 'px';
        else
            this.content.elemDom.style.top = (this.lastTop + dist) + 'px';

        if(this.content.elemDom.offsetTop<0){
            // Posicionamos el scroll
            let heightArea = this.bodyScroll.clientHeight;
            let viewableRatio =  heightArea/this.content.elemDom.clientHeight;

            let surplus =  Math.abs(this.content.elemDom.offsetTop)* viewableRatio;
            this.scroll.style.top=this.padding.top+this.bgBarScroll.padding.top+surplus+'px';
        }
        else
            this.scroll.style.top=(this.padding.top+this.bgBarScroll.padding.top)+'px';
    }

    startMovement(yClick){
        if(this.content.elemDom.clientHeight<this.bodyScroll.clientHeight)
            return;
        this.starty = yClick;
        this.moving = true;
        this.lastTop = this.content.elemDom.offsetTop;
        //this.content.elemDom.style.pointerEvents = "none";
    }

    stopMovement(){
        this.moving = false;
        //this.content.elemDom.style.pointerEvents = "auto";
    }

    async addEventScroll(){
        // MOUSE
        this.bodyScroll.onmouseenter=(event=>{
            this.stopMovement();
            event.preventDefault();
        });
        this.bodyScroll.onmousedown=(event=>{
            this.startMovement(parseInt(event.clientY));
            return true;
        });
        this.bodyScroll.onmouseup=(event=>{
            this.stopMovement();
            event.preventDefault();
        });
        this.bodyScroll.onmousemove=(event=>{
            if(!this.moving)
                return;
            let dist = parseInt(event.clientY) - this.starty;
            this.moveContent(dist);
            event.preventDefault();
            //event.stopPropagation();
            //return false;
        });

        // TOUCHS
        this.bodyScroll.ontouchstart=(evTouch=>{
            let event = evTouch.touches[0];
            this.startMovement(parseInt(event.clientY));
        });
        this.bodyScroll.ontouchmove=(evTouch=>{
            if(!this.moving)
                return;
            let event = evTouch.touches[0];
            let dist = parseInt(event.clientY) - this.starty;
            this.moveContent(dist);
        });
        this.bodyScroll.ontouchend=(evTouch=>{
            this.stopMovement();
        });
        this.bodyScroll.ontouchcancel=(evTouch=>{
            this.stopMovement();
        });
    }

    async onMeasure(maxWidth, maxHeight) {
        this.stopMovement();
        if(!this.content){
            await super.onMeasure(maxWidth,maxHeight);
            alert("Falta completar con Scroll Vacio");
            return;
        }

        this.bodyScroll.style.left=this.padding.left+'px';
        this.bodyScroll.style.top=this.padding.top+'px';

        let witchBarScroll = this.bgBarScroll.padding.left + this.bgScroll.padding.left+this.bgScroll.padding.right+this.bgBarScroll.padding.right;

        switch (this.width) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.width = maxWidth+'px';
                this.bodyScroll.style.width = (maxWidth- this.padding.left - this.padding.right - witchBarScroll)+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.width = this.MIN_WIDTH+'px';
                this.bodyScroll.style.width = (this.MIN_WIDTH - this.padding.left - this.padding.right - witchBarScroll)+'px';
                break;
            default:
                let width = parseFloat(this.width);
                this.elemDom.style.width = width+'px';
                this.bodyScroll.style.width = (width - this.padding.left - this.padding.right - witchBarScroll)+'px';
                break;
        }

        switch (this.height) {
            case LayoutInflater.MATCH_PARENT:
                this.elemDom.style.height = maxHeight+'px';
                this.bodyScroll.style.height = (maxHeight - this.padding.top - this.padding.bottom)+'px';
                break;
            case LayoutInflater.WRAP_CONTENT:
                this.elemDom.style.height = this.MIN_HEIGHT+'px';
                this.bodyScroll.style.height = (this.MIN_HEIGHT - this.padding.top - this.padding.bottom)+'px';
                break;
            default:
                let height = parseFloat(this.height);
                this.elemDom.style.height = height+'px';
                this.bodyScroll.style.height = (height - this.padding.top - this.padding.bottom)+'px';
                break;
        }

        // Operaciones despues de pintar el Scroll
        await this.content.onMeasure(this.bodyScroll.clientWidth,this.bodyScroll.clientHeight);
        this.content.elemDom.style.left = 0+'px';
        this.content.elemDom.style.top = 0+'px';
        await this.backgroundPainter.paint();

        // Verificamos si el contenido es de menor altura que el ScrollView
        if(this.content.elemDom.clientHeight<this.bodyScroll.clientHeight){
            this.barScroll.style.visibility = "hidden";
            this.scroll.style.visibility = "hidden";
            return;
        }else{
            this.barScroll.style.visibility = "visible";
            this.scroll.style.visibility = "visible";
        }

        // Pintamos el BarScroll
        this.barScroll.style.width=witchBarScroll+'px';
        this.barScroll.style.height=this.bodyScroll.clientHeight+'px';
        this.barScroll.style.left = (this.elemDom.clientWidth-this.barScroll.clientWidth-this.padding.right)+'px';
        this.barScroll.style.top = this.padding.top+'px';
        await this.bgBarScroll.paint();

        // Calculamos el tamanio del boton del scroll
        // Fuente: https://stackoverflow.com/questions/16366795/how-to-calculate-the-size-of-scroll-bar-thumb
        let heightArea = this.bodyScroll.clientHeight;
        let viewableRatio =  heightArea/this.content.elemDom.clientHeight;
        let thumbHeight = heightArea * viewableRatio;

        this.scroll.style.height = (thumbHeight-this.bgScroll.padding.top-this.bgScroll.padding.bottom)+'px';
        this.scroll.style.left = (this.elemDom.clientWidth-this.barScroll.clientWidth/2-this.padding.right-this.scroll.clientWidth/2)+'px';
        this.scroll.style.top = (this.padding.top+this.bgBarScroll.padding.top)+'px';
        await this.bgScroll.paint();
    }
};