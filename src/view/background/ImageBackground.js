class ImageBackground extends BaseBackground{
    constructor(view,domElement,urlOrBase64Image){
        super(view,domElement);
        this.urlOrBase64Image = urlOrBase64Image;
    }
    async load(){
        if(Resource.isImageResource(this.urlOrBase64Image))
            this.domElement.style.background = `url('${this.urlOrBase64Image}')`;
        else
            this.domElement.style.background = `data:image/png;base64,${urlOrBase64Image}`;
        this.domElement.style.backgroundSize = 'contain';
    }
    async paint(){

    }
}