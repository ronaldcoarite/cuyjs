class SpinnerAnimation {
    constructor(propProgress){
        if(propProgress)
            this.propProgress = propProgress;
        else{
            this.propProgress = {
                left: (PageManager.getWindowsDimension().width / 2 - 150 / 2),
                top: (PageManager.getWindowsDimension().height / 2 - 150 / 2),
                width: 150, 
                height: 150, 
                showBackground: true
            };
        }
        this.elemLoader = null;
        this.elemImgLoader= null;
    }

    show(){
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
        this.elemImgLoader.style.width = propProgress.width + 'px';
        this.elemImgLoader.style.height = propProgress.height + 'px';
        this.elemImgLoader.style.position = 'absolute';
        this.elemImgLoader.style.background = '#05112B';
        this.elemImgLoader.style.top = propProgress.top + 'px';
        this.elemImgLoader.style.left = propProgress.left + 'px';

        var min = Math.min(this.propProgress.width, this.propProgress.height);
        // propProgress.width = min;
        // propProgress.height = min;

        var imgLoader = document.createElement('canvas');
        var radiusBack = propProgress.width / 8;

        imgLoader.setAttribute("width", this.propProgress.width - radiusBack * 2);
        imgLoader.setAttribute("height", this.propProgress.height - radiusBack * 2);

        imgLoader.style.position = 'absolute';
        imgLoader.style.top = radiusBack + 'px';
        imgLoader.style.left = radiusBack + 'px';
        var ctx = imgLoader.getContext("2d");

        // Pintando spinner
        var lines = 13;
        var radius = imgLoader.width / 10;
        var rotation = radius;
        ctx.save();

        this.elemImgLoader.style.borderRadius = (radiusBack) + 'px';

        ctx.translate(imgLoader.width / 2, imgLoader.height / 2);
        ctx.rotate(Math.PI * 2 * rotation);
        for (var i = 0; i < lines; i++) {
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

        if (this.propProgress.showBackground === true)
            document.body.appendChild(this.elemLoader);
        imgLoader.style.left = (elemImgLoader.clientWidth / 2 + radiusBack) + "px";
        this.elemImgLoader.appendChild(imgLoader);
        document.body.appendChild(this.elemImgLoader);
        imgLoader.className = "rotate";
    }

    hide(){
        if (this.propProgress.showBackground === true)
            this.elemLoader.parentNode.removeChild(this.elemLoader);
        //document.body.removeChild(elemLoader);
        this.elemImgLoader.parentNode.removeChild(this.elemImgLoader);
    }
}