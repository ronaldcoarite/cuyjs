class BaseBackground{
    constructor(view,domElement){
        this.view = view;
        this.domElement = domElement;
    }
    async load(){}
    async paint(){}
}