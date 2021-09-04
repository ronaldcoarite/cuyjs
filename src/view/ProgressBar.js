ProgressBar = View.extend({
    imgLoader: null,
    init: function (context,model) {
        this._super(context,model);
        this.elemDom.style.background = '#05112B';
        this.imgLoader = document.createElement('canvas');
        this.elemDom.appendChild(this.imgLoader);
        this.imgLoader.className = "rotate";
    },
    onMeasure: function (maxWidth, maxHeight, loadListener) {
        var width = this.getWidth();
        var height = this.getHeight();
        var min = Math.min(width, height);
        width = height = min;
        var radiusBack = width / 8;
        this.elemDom.style.borderRadius = radiusBack + 'px';

        this.imgLoader.width = width - radiusBack * 2;
        this.imgLoader.height = height - radiusBack * 2;
        this.imgLoader.style.position = 'absolute';
        this.imgLoader.style.top = radiusBack + 'px';
        this.imgLoader.style.left = radiusBack + 'px';
        var ctx = this.imgLoader.getContext("2d");

        // Pintando spinner
        var lines = 13;
        var radius = this.imgLoader.width / 10;
        var rotation = radius;
        ctx.save();
        ctx.translate(this.imgLoader.width / 2, this.imgLoader.height / 2);
        ctx.rotate(Math.PI * 2 * rotation);
        for (var i = 0; i < lines; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI * 2 / lines);
            ctx.fillStyle = "rgba(250,254,255," + (1 - i / lines) + ")";
            ctx.arc(this.imgLoader.width / 2 - radius, 0, radius, 0, 2 * Math.PI, false);
            ctx.fill();
            radius = radius - radius / (lines - 1);
            if (radius < 1)
                break;
        }
        ctx.restore();
        loadListener();
    }
});