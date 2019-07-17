RelativeLayout = ViewGroup.extend({
    init: function (context) {
        this._super(context);
        this.name = "RelativeLayout";
    },
    getTypeElement: function () {
        return "RelativeLayout";
    },
    parseViewChild: function (nodeXml) {
        var view = this._super(nodeXml);
        view.alignParentTop = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTTOP) === "true");
        view.alignParentRight = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTRIGHT) === "true");
        view.alignParentBottom = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTBOTTOM) === "true");
        view.alignParentLeft = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ALIGNPARENTLEFT) === "true");

        view.centerHorizontal = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERHORIZONTAL) === "true");
        view.centerVertical = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERVERTICAL) === "true");
        view.centerInParent = (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_CENTERINPARENT) === "true");

        view.above = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_ABOVE);
        view.below = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_BELOW);
        view.toRightOf = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TORIGHTOF);
        view.toLeftOf = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_TOLEFTOF);
        return view;
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var tempListener = function () {
            var visibles = this_.getViewVisibles();

            if (visibles.length === 0) {
                switch (this.height) {
                    case LayoutInflater.MATCH_PARENT: break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (this_.padding.top + this_.padding.bottom) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                switch (this.width) {
                    case LayoutInflater.MATCH_PARENT: break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (this_.padding.left + this_.padding.right) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                if (loadListener !== undefined)
                    loadListener();
                return;
            }

            var ancho = this_.getWidth();
            var alto = this_.getHeight();

            var mayHeight = 0;
            var mayWidth = 0;

            var index = -1;
            var view = null;
            var loadCompleted = function () {
                switch (this_.height) {
                    case LayoutInflater.MATCH_PARENT: break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (mayHeight) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                switch (this_.width) {
                    case LayoutInflater.MATCH_PARENT: break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.width = (mayWidth) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                if (loadListener !== undefined)
                    loadListener();
            };
            var viewListener = function () {
                // Posicionamos la vista segun el layout
                if (view.alignParentTop === true)
                    view.elemDom.style.top = (this_.padding.top + view.margin.top) + 'px';
                if (view.alignParentRight === true)
                    view.elemDom.style.left = (ancho - view.getWidth() - view.margin.right - this_.padding.right) + 'px';
                if (view.alignParentLeft === true)
                    view.elemDom.style.left = (this_.padding.left + view.margin.left) + 'px';
                if (view.alignParentBottom === true)
                    view.elemDom.style.top = (alto - view.getHeight() - view.margin.bottom - this_.padding.bottom) + 'px';

                if (view.centerHorizontal === true)
                    view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                if (view.centerVertical === true)
                    view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                if (view.centerInParent === true) {
                    view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                    view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                }

                //            ATTR_LAYOUT_ABOVE:"layout_above",//id
                var idViewAbove = view.above;
                if (idViewAbove !== null && view.above) {
                    var viewAbove = this_.findViewChildById(idViewAbove);
                    if (viewAbove === null) {
                        var msg = "No se encuentra el view hijo con id [" + idViewAbove + "] en el contenedor [" + this_.name + "]";
                        console.log(msg);
                        throw new Exception();
                    }
                    view.elemDom.style.top = (parseInt(viewAbove.elemDom.style.top) - viewAbove.margin.top - view.getHeight() - view.margin.bottom) + 'px';
                }
                //            ATTR_LAYOUT_BELOW:"layout_below",//id
                var idViewBelow = view.below;
                if (idViewBelow !== null && view.below) {
                    var viewBelow = this_.findViewChildById(idViewBelow);
                    if (viewBelow === null) {
                        var msg = "No se encuentra el view con id [" + idViewBelow + "] en el contenedor [" + this.elemXml.tagName + "] ()";
                        console.log(msg);
                        throw new Exception(msg);
                    }
                    view.elemDom.style.top = (parseInt(viewBelow.elemDom.style.top) + viewBelow.getHeight() + viewBelow.margin.bottom + view.margin.top) + 'px';
                }
                //            ATTR_LAYOUT_TORIGHTOF:"layout_toRightOf",//id
                var idViewToLeft = view.toLeftOf;
                if (idViewToLeft !== null && view.toLeftOf) {
                    var viewToLeft = this_.findViewChildById(idViewToLeft);
                    if (viewToLeft === null)
                        throw new Exception("No se encuentra el view con id [" + idViewToLeft + "] en en el contenedor [" + this_.name + "]");

                    if (view.alignParentLeft === true) {
                        view.onMeasure(
                            parseInt(viewToLeft.elemDom.style.left) - view.margin.left - view.margin.right,
                            alto - this_.padding.top - this_.padding.bottom);
                    }
                    else if (view.toRightOf !== null) {
                        console.log("Entrando por aquiiiiiaaaaaaaaaaaaaaaaaai");
                    }
                    else {
                        view.elemDom.style.left = (parseInt(viewToLeft.elemDom.style.left) - view.getWidth() - view.margin.right) + 'px';
                    }
                }
                //            ATTR_LAYOUT_TOLEFTOF:"layout_toLeftOf",//id
                var idViewToRight = view.toRightOf;
                if (idViewToRight !== null && view.toRightOf) {
                    var viewToRight = this_.findViewById(idViewToRight);
                    if (viewToRight === null)
                        throw new Exception("No se encuentra el view con id [" + idViewToRight + "] en en el contenedor [" + this_.name + "]");
                    view.elemDom.style.left = (
                        parseInt(viewToRight.elemDom.style.left)
                        + viewToRight.margin.left
                        + viewToRight.getWidth()
                        + viewToRight.margin.right
                        + view.margin.left) + 'px';
                }
                // verificando si tiene position top
                if (view.elemDom.style.top === "")
                    view.elemDom.style.top = (this_.padding.top + view.margin.top) + 'px';
                if (view.elemDom.style.left === "")
                    view.elemDom.style.left = (this_.padding.left + view.margin.left) + 'px';

                var sum = parseInt(view.elemDom.style.top) + view.getHeight() + this_.padding.bottom + view.margin.bottom;
                if (sum > mayHeight)
                    mayHeight = sum;
                sum = parseInt(view.elemDom.style.left) + view.getWidth() + this_.padding.right + view.margin.right;
                if (sum > mayWidth)
                    mayWidth = sum;
                index++;
                if (index < visibles.length) {
                    view = visibles[index];
                    view.onMeasure(
                        ancho - this_.padding.left - this_.padding.right,
                        alto - this_.padding.top - this_.padding.bottom,
                        viewListener);
                }
                else
                    loadCompleted();
            };
            index = 0;
            view = visibles[index];
            view.onMeasure(
                ancho - this_.padding.left - this_.padding.right,
                alto - this_.padding.top - this_.padding.bottom,
                viewListener);
        };
        this._super(maxWidth, maxHeight, tempListener);
    }
});