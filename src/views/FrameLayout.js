FrameLayout = ViewGroup.extend({
    init: function (context) {
        this._super(context);
        this.name = "FrameLayout";
    },
    getTypeElement: function () {
        return "FrameLayout";
    },
    parseViewChild: function (nodeXml) {
        var view = this._super(nodeXml);
        if (nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY) !== null)
            view.layoutGravity = nodeXml.getAttribute(LayoutInflater.ATTR_LAYOUT_GRAVITY);
        else
            view.layoutGravity = null;
        return view;
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var tempListener = function () {
            var ancho = this_.getWidth();
            var alto = this_.getHeight();

            var mayHeight = 0;
            var mayWidth = 0;
            if (this_.viewsChilds.length === 0) {
                switch (this_.height) {
                    case LayoutInflater.MATCH_PARENT: break;
                    case LayoutInflater.WRAP_CONTENT:
                        this_.elemDom.style.height = (this_.padding.top + this_.padding.bottom) + 'px';
                        this_.invalidate();
                        break;
                    default: break;
                }
                switch (this_.width) {
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

            var index = 0;
            var view = this_.viewsChilds[index];
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
                if (view.layoutGravity !== null) {
                    var gravitys = view.layoutGravity.split("|");
                    for (var j = 0; j < gravitys.length; j++) {
                        var gravity = gravitys[j];
                        // Posicionamos la vista segun el layout
                        if (gravity === LayoutInflater.TOP)
                            view.elemDom.style.top = (this_.padding.top + view.margin.top) + 'px';
                        if (gravity === LayoutInflater.RIGHT)
                            view.elemDom.style.left = (ancho - view.getWidth() - view.margin.right - this_.padding.right) + 'px';
                        if (gravity === LayoutInflater.LEFT)
                            view.elemDom.style.left = (this_.padding.left + view.margin.left) + 'px';
                        if (gravity === LayoutInflater.BOTTOM)
                            view.elemDom.style.top = (alto - view.getHeight() - view.margin.bottom - this_.padding.bottom) + 'px';
                        if (gravity === LayoutInflater.CENTER_HORIZONTAL)
                            view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                        if (gravity === LayoutInflater.CENTER_VERTICAL)
                            view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                        if (gravity === LayoutInflater.CENTER) {
                            view.elemDom.style.left = (ancho / 2 - view.getWidth() / 2) + 'px';
                            view.elemDom.style.top = (alto / 2 - view.getHeight() / 2) + 'px';
                        }
                    }
                }
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
                if (index < this_.viewsChilds.length) {
                    view = this_.viewsChilds[index];
                    view.onMeasure(
                        ancho - this_.padding.left - this_.padding.right,
                        alto - this_.padding.top - this_.padding.bottom,
                        viewListener);
                }
                else
                    loadCompleted();
            };
            view.onMeasure(
                ancho - this_.padding.left - this_.padding.right,
                alto - this_.padding.top - this_.padding.bottom,
                viewListener);
        };
        this._super(maxWidth, maxHeight, tempListener);
    }
});