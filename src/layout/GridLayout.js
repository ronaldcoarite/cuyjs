GridLayout = ViewGroup.extend({
    colums: 2,
    spacing: 0,
    init: function (context) {
        this._super(context);
        this.name = "GridLayout";
    },
    getTypeElement: function () {
        return "GridLayout";
    },
    parse: function (nodeXml) {
        this._super(nodeXml);
        if (nodeXml.children.length === 0)
            return;
        if (nodeXml.getAttribute("colums") !== null)
            this.colums = parseInt(nodeXml.getAttribute("colums"));
        if (nodeXml.getAttribute("spacing") !== null)
            this.spacing = parseInt(nodeXml.getAttribute("spacing"));
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var childs = this.getViewVisibles();
        if (childs.length === 0) {
            loadListener();
            return;
        }
        var tempListener = function () {
            var ancho = this_.getWidth();
            var alto = this_.getHeight();

            var mayHeight = this_.padding.top + this_.padding.bottom;
            var mayWidth = this_.padding.left + this_.padding.right;

            var maxAnchoView = (ancho - this_.padding.left - this_.padding.right) / this_.colums;

            var index = 0;
            var view = childs[index];
            var x = this_.padding.top;
            var y = this_.padding.left;
            var col = 0;

            var viewListener = function () {
                view.elemDom.style.left = x + 'px';
                view.elemDom.style.top = y + 'px';

                var sum = parseInt(view.elemDom.style.top) + view.getHeight() + this_.padding.bottom + view.margin.bottom;
                if (sum > mayHeight)
                    mayHeight = sum;
                sum = parseInt(view.elemDom.style.left) + view.getWidth() + this_.padding.right + view.margin.right;
                if (sum > mayWidth)
                    mayWidth = sum;
                index++;
                if (index < childs.length) {
                    col++;
                    if (col === this_.colums) {
                        y = mayHeight + this_.spacing;
                        x = this_.padding.left;
                        col = 0;
                    }
                    else
                        x = x + maxAnchoView;
                    view = childs[index];
                    view.onMeasure(
                        maxAnchoView,
                        alto - this_.padding.top - this_.padding.bottom,
                        viewListener);
                }
                else {
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
                }
            };
            view.onMeasure(
                maxAnchoView,
                alto - this_.padding.top - this_.padding.bottom,
                viewListener);
        };
        this._super(maxWidth, maxHeight, tempListener);
    }
});