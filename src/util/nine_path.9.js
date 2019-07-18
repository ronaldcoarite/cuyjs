// *********************** COMENSANDO NINE PATH ************************

// Verifica si se tiene una image con nine path.
function NinePatchGetStyle(element, style) {
    if (window.getComputedStyle) {
        var computedStyle = window.getComputedStyle(element, "");
        if (computedStyle === null)
            return "";
        return computedStyle.getPropertyValue(style);
    }
    else if (element.currentStyle) {
        return element.currentStyle[style];
    }
    else {
        return "";
    }
}

// Stores the HTMLDivElement that's using the 9patch image
NinePatch.prototype.div = null;
// Padding
NinePatch.prototype.padding = null;
// Get padding
NinePatch.prototype.callback = null;
// Stores the original background css color to use later
NinePatch.prototype.originalBG = null;
// Stores the pieces used to generate the horizontal layout
NinePatch.prototype.horizontalPieces = null;
// Stores the pieces used to generate the vertical layout
NinePatch.prototype.verticalPieces = null;
// Stores the 9patch image
NinePatch.prototype.bgImage = null;

/**
 * 9patch constructer. Sets up cached data and runs initial draw.
 * @param {Dom Element} div El Elemento dom en donde se pinta el ninepath.
 * @param {function} callback La funcion que se llamara cuando se termina.
 * la carga de la imagen y el pintado del elemento div.
 * @returns {NinePatch} Un objeto nine path
 */
function NinePatch(div, callback) {
    this.div = div;
    this.callback = callback;
    this.padding = { top: 0, left: 0, right: 0, bottom: 0 };
    // Load 9patch from background-image
    this.bgImage = new Image();
    this.bgImage.src = NinePatchGetStyle(this.div, 'background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
    var este = this;

    this.bgImage.onload = function () {
        este.originalBgColor = NinePatchGetStyle(este.div, 'background-color');
        este.div.style.background = 'none';

        // Create a temporary canvas to get the 9Patch index data.
        var tempCtx, tempCanvas;
        tempCanvas = document.createElement('canvas');
        tempCanvas.width = este.bgImage.width;
        tempCanvas.height = este.bgImage.height;
        tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(este.bgImage, 0, 0);

        // Obteniendo el padding lateral derecho
        var dataPad = tempCtx.getImageData(este.bgImage.width - 1, 0, 1, este.bgImage.height).data;
        var padRight = este.getPadBorder(dataPad, este.bgImage.width, este.bgImage.height);
        este.padding.top = padRight.top;
        este.padding.bottom = padRight.bottom;
        dataPad = tempCtx.getImageData(0, este.bgImage.height - 1, este.bgImage.width, 1).data;
        var padBottom = este.getPadBorder(dataPad, este.bgImage.width, este.bgImage.height);

        este.padding.left = padBottom.top;
        este.padding.right = padBottom.bottom;

        // Loop over each  horizontal pixel and get piece
        var data = tempCtx.getImageData(0, 0, este.bgImage.width, 1).data;

        // Use the upper-left corner to get staticColor, use the upper-right corner
        // to get the repeatColor.
        var tempLength = data.length - 4;
        var staticColor = data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3];
        var repeatColor = data[tempLength] + ',' + data[tempLength + 1] + ',' +
            data[tempLength + 2] + ',' + data[tempLength + 3];

        este.horizontalPieces = este.getPieces(data, staticColor, repeatColor);

        // Loop over each  horizontal pixel and get piece
        data = tempCtx.getImageData(0, 0, 1, este.bgImage.height).data;
        este.verticalPieces = este.getPieces(data, staticColor, repeatColor);

        // use this.horizontalPieces and this.verticalPieces to generate image
        este.draw();
        //        este.div.onresize = function()
        //        {
        //            console.log("Pintandoooooooooooooooooo");
        //            este.draw();
        //        };
        if (callback !== undefined) {
            if (typeof (callback) === "function")
                callback();
        }
    };
}