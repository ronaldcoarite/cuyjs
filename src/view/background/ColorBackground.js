class ColorBackground extends BaseBackground{
    constructor(view,domElement,color){
        super(view,domElement);
        this.color= color;
    }
    async load(){
        this.domElement.style.background = this.color;
    }
    async paint(){}
}