class NinepathBackground extends BaseBackground{
    constructor(domElement,imageNinePathBase64){
        // Stores the HTMLDivElement that's using the 9patch image
        this.domElement = domElement;
        // Padding
        this.padding = null;
        // Stores the pieces used to generate the horizontal layout
        this.horizontalPieces = null;
        // Stores the pieces used to generate the vertical layout
        this.verticalPieces = null;
        this.imageNinePathBase64 = imageNinePathBase64;
        // Stores the 9patch image
        this.bgImage = null;
    }

    getPieces(data, staticColor, repeatColor){
        let tempDS, tempPosition, tempWidth, tempColor, tempType;
        let tempArray = new Array();

        tempColor = data[4] + ',' + data[5] + ',' + data[6] + ',' + data[7];
        tempDS = (tempColor === staticColor ? 's' : (tempColor === repeatColor ? 'r' : 'd'));
        tempPosition = 1;

        for (let i = 4, n = data.length - 4; i < n; i += 4) {
            tempColor = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
            tempType = (tempColor === staticColor ? 's' : (tempColor === repeatColor ? 'r' : 'd'));
            if (tempDS !== tempType) {
                // box changed colors
                tempWidth = (i / 4) - tempPosition;
                tempArray.push(new Array(tempDS, tempPosition, tempWidth));

                tempDS = tempType;
                tempPosition = i / 4;
                tempWidth = 1;
            }
        }

        // push end
        tempWidth = (i / 4) - tempPosition;
        tempArray.push(new Array(tempDS, tempPosition, tempWidth));
        return tempArray;
    }

    getPadBorder(dataPad, width, height){
        var staticRight = dataPad[0] + ',' + dataPad[1] + ',' + dataPad[2] + ',' + dataPad[3];
        var pad = { top: 0, bottom: 0 };
    
        // Padding para la parte superior
        for (var i = 0; i < dataPad.length; i += 4) {
            var tempColor = dataPad[i] + ',' + dataPad[i + 1] + ',' + dataPad[i + 2] + ',' + dataPad[i + 3];
            if (tempColor !== staticRight)
                break;
            pad.top++;
        }
        // padding inferior
        for (var i = dataPad.length - 4; i >= 0; i -= 4) {
            var tempColor = dataPad[i] + ',' + dataPad[i + 1] + ',' + dataPad[i + 2] + ',' + dataPad[i + 3];
            if (tempColor !== staticRight)
                break;
            pad.bottom++;
        }
        return pad;
    }

    draw(){
        var dCtx, dCanvas, dWidth, dHeight;

        if (this.horizontalPieces === null)
            return;
    
        dWidth = this.domElement.clientWidth;
        dHeight = this.domElement.clientHeight;
    
        if (dWidth === 0 || dHeight === 0)
            return;
    
        dCanvas = document.createElement('canvas');
        dCtx = dCanvas.getContext('2d');
    
        dCanvas.width = dWidth;
        dCanvas.height = dHeight;
    
        var fillWidth, fillHeight;
        // Determine the width for the static and dynamic pieces
        var tempStaticWidth = 0;
        var tempDynamicCount = 0;
    
        for (var i = 0, n = this.horizontalPieces.length; i < n; i++) {
            if (this.horizontalPieces[i][0] === 's')
                tempStaticWidth += this.horizontalPieces[i][2];
            else
                tempDynamicCount++;
        }
    
        fillWidth = (dWidth - tempStaticWidth) / tempDynamicCount;
    
        // Determine the height for the static and dynamic pieces
        var tempStaticHeight = 0;
        tempDynamicCount = 0;
        for (var i = 0, n = this.verticalPieces.length; i < n; i++) {
            if (this.verticalPieces[i][0] === 's')
                tempStaticHeight += this.verticalPieces[i][2];
            else
                tempDynamicCount++;
        }
    
        fillHeight = (dHeight - tempStaticHeight) / tempDynamicCount;
    
        // Loop through each of the vertical/horizontal pieces and draw on
        // the canvas
        for (var i = 0, m = this.verticalPieces.length; i < m; i++) {
            for (var j = 0, n = this.horizontalPieces.length; j < n; j++) {
                var tempFillWidth, tempFillHeight;
    
                tempFillWidth = (this.horizontalPieces[j][0] === 'd') ?
                    fillWidth : this.horizontalPieces[j][2];
                tempFillHeight = (this.verticalPieces[i][0] === 'd') ?
                    fillHeight : this.verticalPieces[i][2];
    
                // Stretching :
                if (this.verticalPieces[i][0] !== 'r') {
                    // Stretching is the same function for the static squares
                    // the only difference is the widths/heights are the same.
                    if (tempFillWidth >= 0 && tempFillHeight >= 0) {
                        dCtx.drawImage(
                            this.bgImage,
                            this.horizontalPieces[j][1], this.verticalPieces[i][1],
                            this.horizontalPieces[j][2], this.verticalPieces[i][2],
                            0, 0,
                            tempFillWidth, tempFillHeight);
                    }
                    else
                        break;
                }
                else {
                    var tempCanvas = document.createElement('canvas');
                    tempCanvas.width = this.horizontalPieces[j][2];
                    tempCanvas.height = this.verticalPieces[i][2];
    
                    var tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(
                        this.bgImage,
                        this.horizontalPieces[j][1], this.verticalPieces[i][1],
                        this.horizontalPieces[j][2], this.verticalPieces[i][2],
                        0, 0,
                        this.horizontalPieces[j][2], this.verticalPieces[i][2]);
    
                    var tempPattern = dCtx.createPattern(tempCanvas, 'repeat');
                    dCtx.fillStyle = tempPattern;
                    dCtx.fillRect(
                        0, 0,
                        tempFillWidth, tempFillHeight);
                }
    
                // Shift to next x position
                dCtx.translate(tempFillWidth, 0);
            }
    
            // shift back to 0 x and down to the next line
            dCtx.translate(-dWidth, (this.verticalPieces[i][0] === 's' ? this.verticalPieces[i][2] : fillHeight));
        }
    
        // store the canvas as the div's background
        var url = dCanvas.toDataURL("image/png");
        var tempIMG = new Image();
    
        var _this = this;
        tempIMG.onload = ()=>{
            this.domElement.style.background = `url(${url}) no-repeat`;
        };
        tempIMG.src = url;
    }

    // @Override
    async load(){
        this.padding = { top: 0, left: 0, right: 0, bottom: 0 };
        // Cargamos la imagen 
        this.bgImage = await Resource.loadImage(this.imageNinePathBase64);

        this.domElement.style.background = 'none';
        this.domElement.style.backgroundRepeat = "no-repeat";
        
        // this.elemDom.style.backgroundRepeat = "no-repeat";
        // this.elemDom.style.backgroundPosition = "-1000px -1000px";
        // this.elemDom.style.backgroundImage = "url('" + background + "')";





        // var this_ = this;
        // this.ninePatch = new NinePatch(this.elemDom, function () {
        //     this_.padding.left = this_.ninePatch.padding.left;
        //     this_.padding.top = this_.ninePatch.padding.top;
        //     this_.padding.right = this_.ninePatch.padding.right;
        //     this_.padding.bottom = this_.ninePatch.padding.bottom;
        // });
    }
    
    // @Override
    async paint(){
        // Create a temporary canvas to get the 9Patch index data.
        var tempCtx, tempCanvas;
        tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.bgImage.width;
        tempCanvas.height = this.bgImage.height;
        tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.bgImage, 0, 0);

        // Obteniendo el padding lateral derecho
        var dataPad = tempCtx.getImageData(this.bgImage.width - 1, 0, 1, this.bgImage.height).data;
        var padRight = this.getPadBorder(dataPad, this.bgImage.width, this.bgImage.height);
        this.padding.top = padRight.top;
        this.padding.bottom = padRight.bottom;
        dataPad = tempCtx.getImageData(0, this.bgImage.height - 1, this.bgImage.width, 1).data;
        var padBottom = this.getPadBorder(dataPad, this.bgImage.width, this.bgImage.height);

        this.padding.left = padBottom.top;
        this.padding.right = padBottom.bottom;

        // Loop over each  horizontal pixel and get piece
        var data = tempCtx.getImageData(0, 0, this.bgImage.width, 1).data;

        // Use the upper-left corner to get staticColor, use the upper-right corner
        // to get the repeatColor.
        var tempLength = data.length - 4;
        var staticColor = data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3];
        var repeatColor = data[tempLength] + ',' + data[tempLength + 1] + ',' +
            data[tempLength + 2] + ',' + data[tempLength + 3];

        this.horizontalPieces = this.getPieces(data, staticColor, repeatColor);

        // Loop over each  horizontal pixel and get piece
        data = tempCtx.getImageData(0, 0, 1, this.bgImage.height).data;
        this.verticalPieces = this.getPieces(data, staticColor, repeatColor);

        // use this.horizontalPieces and this.verticalPieces to generate image
        this.draw();
    }
}