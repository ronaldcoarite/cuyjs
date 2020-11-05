
class Camera extends View{
    constructor(context){
        super(context);
        this.captureAudio=false;
        this.captureVideo=true;
    }

    // @Override
    getTypeElement(){
        return 'video';
    }

    async start(){
        let stream = await navigator.mediaDevices.getUserMedia({
            video: this.captureVideo,
            audio: this.captureAudio
        });
        this.elemDom.srcObject = stream;
        this.elemDom.play();
    }

    async stop(){
        if(this.elemDom.srcObject){
            let tracks = this.elemDom.srcObject.getTracks();
            tracks.forEach(track =>{
                track.stop();
            });
        }
        this.elemDom.srcObject = null;
    }

    takePicture(){
        let canvas = document.createElement('canvas');
        canvas.width = this.getWidth();
        canvas.height = this.getHeight();
        canvas.style.visibility = "hidden";
        document.body.appendChild(canvas);
        
        let context = canvas.getContext('2d');
        context.drawImage(this.elemDom, 0, 0,this.getWidth(),this.getHeight());
        let imgBase64 = canvas.toDataURL('image/png');
        canvas.remove();
        return {
            fileExt: 'png',
            dataInBase64: imgBase64.replace("data:image/png;base64,","")
        }
    }
};