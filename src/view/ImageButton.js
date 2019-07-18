ImageButton = ImageView.extend({
    init: function (context) {
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.name = "ImageButton";
    },
    createDomElement: function () {
        var elemDom = this._super();
        elemDom.classList.add("AndButton");
        return elemDom;
    }
});