class ColorBackground extends BaseBackground{
    constructor(domElement,color){
        this.color= color;
        this.domElement = domElement;
    }
    async load(){
        this.domElement.style.background = this.color;
    }
    async paint(){}
}