class BaseBackground{
    constructor(domElement){
        this.domElement = domElement;
        // Stores the HTMLDivElement that's using the 9patch image
        this.prototype.div = null;
        // Padding
        this.prototype.padding = null;
        // Get padding
        this.prototype.callback = null;
        // Stores the original background css color to use later
        this.prototype.originalBG = null;
        // Stores the pieces used to generate the horizontal layout
        this.prototype.horizontalPieces = null;
        // Stores the pieces used to generate the vertical layout
        this.prototype.verticalPieces = null;
        // Stores the 9patch image
        this.prototype.bgImage = null;
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

    async load(){}
    
    async paint(){}
}