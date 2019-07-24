class EmplyBackground extends BaseBackground{
    constructor(domElement){
        super(domElement);
        this.domElement = domElement;
    }
    async load(){
        this.domElement.style.background='none';
    }
    async paint(){}
}