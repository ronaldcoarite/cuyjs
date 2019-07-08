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

// Gets the horizontal|vertical pieces based on image data
NinePatch.prototype.getPieces = function (data, staticColor, repeatColor) {
    var tempDS, tempPosition, tempWidth, tempColor, tempType;
    var tempArray = new Array();

    tempColor = data[4] + ',' + data[5] + ',' + data[6] + ',' + data[7];
    tempDS = (tempColor === staticColor ? 's' : (tempColor === repeatColor ? 'r' : 'd'));
    tempPosition = 1;

    for (var i = 4, n = data.length - 4; i < n; i += 4) {
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
};

NinePatch.prototype.getPadBorder = function (dataPad, width, height) {
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
};

// Function to draw the background for the given element size.
NinePatch.prototype.draw = function () {
    var dCtx, dCanvas, dWidth, dHeight;

    if (this.horizontalPieces === null)
        return;

    dWidth = this.div.clientWidth;
    dHeight = this.div.clientHeight;

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
    tempIMG.onload = function (event) {
        _this.div.style.background = _this.originalBgColor + " url(" + url + ") no-repeat";
    };
    tempIMG.src = url;
};
// *********************** FINALIZANDO NINE PATH ************************

// Cross browser function to find valid property
function NinePatchGetSupportedProp(propArray) {
    var root = document.documentElement; //reference root element of document
    for (var i = 0; i < propArray.length; i++) {
        // loop through possible properties
        if (typeof root.style[propArray[i]] === "string") {
            //if the property value is a string (versus undefined)
            return propArray[i]; // return that string
        }
    }
    return false;
}

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