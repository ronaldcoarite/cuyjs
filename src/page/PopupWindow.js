PopupWindow = Page.extend({
    gravity: "none",
    view: null,
    context: null,
    margin: { left: 0, top: 0, right: 0, bottom: 0 },
    init: function (context) {
        if (context === null || context === undefined)
            throw new Exception("Falta el parametro context en e constructor del PopupWindows");
        this.context = context;
    },
    setPositionOnView: function (gravity) {
        this.gravity = gravity;
    },
    setAlign: function () {

    },
    setMarginLeft: function (marginLeft) {
        this.margin = { left: marginLeft, top: this.margin.top, right: this.margin.right, bottom: this.margin.bottom };
    },
    setView: function (view) {
        this.view = view;
    },
    show: function () {
        var this_ = this;
        var rect = this.view.elemDom.getBoundingClientRect();
        return PageManager.loadPage(null, this, this,
            {
                left: rect.left,
                top: rect.top,
                width: this_.view.getWidth(),
                height: this_.view.getHeight(),
                showBackground: false
            }).then(page => {
                // Capturando ubicacion del view
                // Centramos el dialogo
                page.viewRoot.elemDom.style.left = (rect.left + page.margin.left) + 'px';
                page.viewRoot.elemDom.style.top = (rect.top - page.viewRoot.elemDom.clientHeight) + 'px';
            });
    },
    cancel: function () {
        PageManager.removeContext(this);
    }
});