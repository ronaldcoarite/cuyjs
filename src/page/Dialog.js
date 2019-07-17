Dialog = Page.extend({
    elemBackground: null,
    context: null,
    bgVisble: true,
    bgProgressVisble: true,
    showBackground: function (show) {
        this.bgVisble = show;
    },
    showBackgroundProgress: function (show) {
        this.bgProgressVisble = show;
    },
    init: function (context) {
        if (context === undefined || context === null)
            throw new Exception("El contexto no esta en los parametros o es nulo [" + context + "]");
        this.context = context;
    },
    show: function () {
        // Creamos un fondo opaco para el dialogo
        if (this.bgVisble === true) {
            this.elemBackground = document.createElement('div');
            // Margenes por defector
            this.elemBackground.style.marginTop = '0px';
            this.elemBackground.style.marginLeft = '0px';
            this.elemBackground.style.marginBottom = '0px';
            this.elemBackground.style.marginRight = '0px';
            // Padding por defecto
            this.elemBackground.style.paddingTop = '0px';
            this.elemBackground.style.paddingLeft = '0px';
            this.elemBackground.style.paddingBottom = '0px';
            this.elemBackground.style.paddingRight = '0px';
            this.elemBackground.style.position = "absolute";
            this.elemBackground.style.width = "100%";
            this.elemBackground.style.height = "100%";

            this.elemBackground.style.backgroundColor = "rgba(226, 242, 249, 0.5)";
            document.body.appendChild(this.elemBackground);
        }
        var this_ = this;
        PageManager.loadPage(null, this, this,
            {
                left: (PageManager.getWindowsDimension().width / 2 - 100 / 2),
                top: (PageManager.getWindowsDimension().height / 2 - 100 / 2),
                width: 150, height: 150, showBackground: this_.bgProgressVisble
            }).then(page => {
                // Centramos el dialogo
                var navigator = PageManager.getWindowsDimension();
                page.viewRoot.elemDom.style.left = (navigator.width / 2 - page.viewRoot.elemDom.clientWidth / 2) + 'px';
                page.viewRoot.elemDom.style.top = (navigator.height / 2 - page.viewRoot.elemDom.clientHeight / 2) + 'px';
            });
    },
    cancel: function () {
        PageManager.removeContext(this);
        if (this.bgVisble === true)
            this.elemBackground.parentNode.removeChild(this.elemBackground);
    },
    getContext: function () {
        return this.context;
    }
});