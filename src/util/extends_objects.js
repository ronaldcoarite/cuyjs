/* global CanvasRenderingContext2D, Class, REQUEST_CANCELED, Promise */

// Agregando metodos utiles String
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
String.prototype.equalsIgnoreCase = function (cad) {
    if (cad === null)
        return false;
    return ("" + this).toUpperCase() === (("" + cad).toUpperCase());
};

// *****************  PARA DEIBUJAR ROUND RECT EN EL CANVAS **********************
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r)
        r = w / 2;
    if (h < 2 * r)
        r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

// *********************** CARGADOR DE CODIGO DE JAVASCRIPT EN LINEA **************************
