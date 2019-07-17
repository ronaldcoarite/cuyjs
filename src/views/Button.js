Button = TextView.extend({
    init: function (context) {
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 4;
        this.padding.left = this.padding.top = this.padding.right = this.padding.bottom = 4;
        this.name = "Button";
    },
    getTypeElement: function () {
        return 'Button';
    },
    createDomElement: function () {
        var elemDom = this._super();
        elemDom.classList.add("AndButton");
        return elemDom;
    }
});