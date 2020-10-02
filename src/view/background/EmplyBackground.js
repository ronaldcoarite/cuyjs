class EmplyBackground extends BaseBackground{
    constructor(view,domElement){
        super(view,domElement);
    }
    async load(){
        this.domElement.style.background='none';
    }
    async paint(){}
}