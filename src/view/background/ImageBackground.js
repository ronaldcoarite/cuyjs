class ImageBackground extends BaseBackground{
    constructor(domElement,urlOrBase64Image){
        super(domElement,urlOrBase64Image);
        this.domElement = domElement;
        this.urlOrBase64Image = urlOrBase64Image;
    }
    async load(){
        if(Resource.isImageResource(this.urlOrBase64Image))
            this.domElement.style.background = `url('${this.urlOrBase64Image}')`;
        else
            this.domElement.style.background = `data:image/png;base64,${urlOrBase64Image}`;
    }
    async paint(){}
}