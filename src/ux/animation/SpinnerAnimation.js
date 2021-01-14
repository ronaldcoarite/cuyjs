class SpinnerAnimation {
    constructor(propProgress){
        if(propProgress)
            this.propProgress = propProgress;
        else{
            this.propProgress = {
                left: (PageManager.getWindowsDimension().width / 2 - 150 / 2),
                top: (PageManager.getWindowsDimension().height / 2 - 150 / 2),
                size: 150,
                showBackground: true,
                backgroundRotation: true,
                parentElement: document.body
            };
        }
        // Creamos el loader para la pagina
        if(this.propProgress.showBackground===true){
            this.elemLoader = document.createElement('div');
            this.elemLoader.style.margin = '0px';
            this.elemLoader.style.width = '100%';
            this.elemLoader.style.height = '100%';
            this.elemLoader.style.position = 'absolute';
            this.elemLoader.style.backgroundColor = "rgba(1, 11,20, 0.5)";
        }

        this.elemImgLoader = document.createElement('div');
        this.elemImgLoader.style.width = this.propProgress.size + 'px';
        this.elemImgLoader.style.height = this.propProgress.size + 'px';
        this.elemImgLoader.style.position = 'absolute';
        this.elemImgLoader.style.top = this.propProgress.top + 'px';
        this.elemImgLoader.style.left = this.propProgress.left + 'px';
        let imgLoader = null;
        if(this.propProgress.backgroundRotation){
            let radiusBack = this.propProgress.size / 8;
            this.elemImgLoader.style.background = '#05112B';
            this.elemImgLoader.style.borderRadius = (radiusBack) + 'px';
            imgLoader = this.createCanvas(this.propProgress.size - radiusBack * 2);
            imgLoader.style.left = (this.elemImgLoader.clientWidth / 2 + radiusBack) + "px";
            imgLoader.style.top = (this.elemImgLoader.clientWidth / 2 + radiusBack) + "px";
        }
        else
            imgLoader = this.createCanvas(this.propProgress.size);
        if (this.propProgress.showBackground === true)
            document.body.appendChild(this.elemLoader);
        imgLoader.className = "rotate";
        this.elemImgLoader.appendChild(imgLoader);
    }

    getRootDomElement(){
        return this.elemImgLoader;
    }

    resize(size){
        this.propProgress.size = size;
        if(this.elemImgLoader.firstChild)
            this.elemImgLoader.removeChild(this.elemImgLoader.firstChild);

        let imgLoader = this.createCanvas(size);
        imgLoader.style.left = "0px";
        imgLoader.style.top = "0px";
        imgLoader.className = "rotate";
        this.elemImgLoader.appendChild(imgLoader);
    }

    createCanvas(size){
        let imgLoader = document.createElement('canvas');
        imgLoader.setAttribute("width", size);
        imgLoader.setAttribute("height", size);

        imgLoader.style.position = 'absolute';
        imgLoader.style.top = '0px';
        imgLoader.style.left = '0px';
        let ctx = imgLoader.getContext("2d");

        // Pintando spinner
        let lines = 13;
        let radius = imgLoader.width / 10;
        let rotation = radius;
        ctx.save();

        ctx.translate(size / 2, size / 2);
        ctx.rotate(Math.PI * 2 * rotation);
        for (let i = 0; i < lines; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI * 2 / lines);
            ctx.fillStyle = "rgba(250,254,255," + (1 - i / lines) + ")";
            ctx.arc(imgLoader.width / 2 - radius, 0, radius, 0, 2 * Math.PI, false);
            ctx.fill();
            radius = radius - radius / (lines - 1);
            if (radius < 1)
                break;
        }
        ctx.restore();
        return imgLoader;
    }

    show(){
        this.propProgress.parentElement.appendChild(this.elemImgLoader);
    }

    hide(){
        if (this.propProgress.showBackground === true)
            this.elemLoader.parentNode.removeChild(this.elemLoader);
        this.elemImgLoader.parentNode.removeChild(this.elemImgLoader);
    }
}