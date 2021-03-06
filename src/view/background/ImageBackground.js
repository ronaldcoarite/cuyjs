class ImageBackground extends BaseBackground{
    constructor(view,domElement,urlOrBase64Image){
        super(view,domElement);
        this.urlOrBase64Image = urlOrBase64Image;
    }

    async load(){
        if(Resource.isImageResource(this.urlOrBase64Image)){
            this.domElement.style.background = `url('${this.urlOrBase64Image}')`;
            var this_ = this;
            await new Promise(function(resolve, reject){
                var img = new Image();
                try {
                    img.addEventListener('load', function() {
                        resolve();
                    }, false);
                    img.addEventListener('error', function() {
                        reject(`Error al obtener la imagen [${this.urlOrBase64Image}]`);
                    }, false);
                }
                catch(error) {
                    resolve(error);
                }
                img.src = this_.urlOrBase64Image;
            });
            this.domElement.style.backgroundSize = `${this.domElement.clientWidth}px ${this.domElement.clientHeight}px`;
        }
        else
            this.domElement.style.background = `data:image/png;base64,${urlOrBase64Image}`;
        // auto|length|cover|contain|intial|inherit
        this.domElement.style.backgroundRepeat = 'no-repeat';
        this.domElement.style.backgroundOrigin = "content-box";
    }

    async paint(){
        this.domElement.style.backgroundSize = `${this.domElement.clientWidth}px ${this.domElement.clientHeight}px`;
    }
}