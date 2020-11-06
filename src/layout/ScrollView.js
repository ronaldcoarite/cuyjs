class ScrollView extends View{
    constructor (context) {
        this._super(context);
    }

    async onMeasure(maxWidth, maxHeight) {
        var this_ = this;
        var childs = this.getViewVisibles();
        if (childs.length === 0)
            loadListener();
        var tempListener = function () {
            var ancho = this_.getWidth();
            var alto = this_.getHeight();
            var view = childs[0];
            var viewListener = function () {
                var boxtop; // left position of moving box
                var starty = 0; // starting y coordinate of touch point
                // Agregamos evento de touch al contenedor
                view.elemDom.style.top = this_.padding.top + 'px';
                view.elemDom.style.left = this_.padding.left + 'px';
                var dom = view.elemDom;
                dom.onmousedown = function (e) {
                    boxtop = parseInt(dom.style.top); // get left position of box
                    starty = parseInt(e.clientY); // get x coord of touch point
                    e.preventDefault(); // prevent default click behavior

                    dom.onmousemove = function (e) {
                        if (dom.clientHeight > alto) {
                            var dist = parseInt(e.clientY) - starty;
                            if (boxtop + dist > 0)
                                dom.style.top = '0px';
                            else if (boxtop + dist + dom.clientHeight < alto)
                                dom.style.top = (alto - dom.clientHeight) + 'px';
                            else
                                dom.style.top = (boxtop + dist) + 'px';
                        }
                        e.preventDefault();
                    };
                };
                var mouseOut = function () {
                    dom.onmousemove = null;
                };
                dom.onmouseup = mouseOut;
                //dom.onmouseout = mouseOut;
                dom.onmouseover = mouseOut;

                dom.ontouchstart = function (e) {
                    var touch = e.touches[0];
                    boxtop = parseInt(dom.style.top);
                    starty = parseInt(touch.clientY);
                    e.preventDefault();
                };
                dom.ontouchmove = function (e) {
                    if (dom.clientHeight > alto) {
                        var touch = e.touches[0];
                        var dist = parseInt(touch.clientY) - starty;
                        if (boxtop + dist > 0)
                            dom.style.top = '0px';
                        else if (boxtop + dist + dom.clientHeight < alto)
                            dom.style.top = (alto - dom.clientHeight) + 'px';
                        else
                            dom.style.top = (boxtop + dist) + 'px';
                    }
                    e.preventDefault();
                };
                if (typeof loadListener === "function")
                    loadListener();
            };
            view.onMeasure(
                ancho - this_.padding.left - this_.padding.right,
                alto - this_.padding.top - this_.padding.bottom,
                viewListener);
        };
        this._super(maxWidth, maxHeight, tempListener);
    }
};