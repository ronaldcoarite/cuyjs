DomView = View.extend({
    init: function (context) {
        this._super(context);
        this.name = "DomView";
    },
    createDomElement: function () {
        //<input type="text" size="2" placeholder="asas">
        var elemDom = document.createElement(this.getDomType());
        elemDom.style.margin = '0px';
        // Padding por defecto
        elemDom.style.paddingTop = '0px';
        elemDom.style.paddingLeft = '0px';
        elemDom.style.paddingBottom = '0px';
        elemDom.style.paddingRight = '0px';
        elemDom.style.position = 'absolute';
        return elemDom;
    },
    getDomType: function () {
        throw new Exception("No implementado");
    },
    onPreProccessAttributes: function (onLoaded) {
        this.padding.top = parseInt(this.elemDom.style.paddingTop);
        this.padding.left = parseInt(this.elemDom.style.paddingLeft);
        this.padding.right = parseInt(this.elemDom.style.paddingRight);
        this.padding.bottom = parseInt(this.elemDom.style.paddingBottom);
        onLoaded();
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
        var this_ = this;
        var tempListener = function () {
            // Obteniendo paddings de EditText
            var onLoaded = function () {
                switch (this_.width) {
                    case LayoutInflater.WRAP_CONTENT:
                        //setWidth(this_.elemDom.clientWidth);
                        break;
                    case LayoutInflater.MATCH_PARENT:
                        this_.elemDom.style.width = (maxWidth - this_.margin.left - this_.margin.right - this_.padding.left - this_.padding.right) + 'px';
                        this_.invalidate();
                        break;
                    default:
                        var width = parseInt(this_.width);
                        this_.elemDom.style.width = (width) + 'px';
                        this_.invalidate();
                        break;
                }
                switch (this_.height) {
                    case LayoutInflater.WRAP_CONTENT:
                        //this_.setHeight(this_.elemDom.clientHeight);
                        break;
                    case LayoutInflater.MATCH_PARENT:
                        this_.elemDom.style.height = (maxHeight - this_.margin.top - this_.margin.bottom - this_.padding.top - this_.padding.bottom) + 'px';
                        break;
                    default:
                        var height = parseInt(this_.height);
                        this_.elemDom.style.height = (height) + 'px';
                        break;
                }
                if (loadListener !== undefined)
                    loadListener();
            };
            this_.onPreProccessAttributes(onLoaded);
        };
        this._super(maxWidth, maxHeight, tempListener);
    },
    getWidth: function () {
        return this.padding.left + this.elemDom.clientWidth + this.padding.right;
    },
    getHeight: function () {
        return this.padding.top + this.elemDom.clientHeight + this.padding.bottom;
    }
});