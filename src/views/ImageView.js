ImageView = DomView.extend({
    src: null,
    scaleType: LayoutInflater.FIT_XY,
    init: function (context) {
        this._super(context);
        this.name = "ImageView";
    },
    parse: function (nodeXml) {
        this._super(nodeXml);
        this.src = nodeXml.getAttribute(LayoutInflater.ATTR_SRC);
        this.scaleType = nodeXml.getAttribute(LayoutInflater.ATTR_SCALE_TYPE);
    },
    getDomType: function () {
        return 'img';
    },
    setImageFromBase64: function (txtImageBase64) {
        //        console.log("ASSSSSSSSSS",this.elemDom.getAttribute("src"));
        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC, 'data:image/png;base64,' + txtImageBase64);
        //        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,"data:image/png;base64, "+txtImageBase64);
        //        this.elemDom.src=("data:image/png;base64, "+txtImageBase64);
        //        this.elemDom.setAttribute(LayoutInflater.ATTR_SRC,"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEVBMTczNDg3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEVBMTczNDk3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRUExNzM0NjdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRUExNzM0NzdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjjUmssAAAGASURBVHjatJaxTsMwEIbpIzDA6FaMMPYJkDKzVYU+QFeEGPIKfYU8AETkCYI6wANkZQwIKRNDB1hA0Jrf0rk6WXZ8BvWkb4kv99vn89kDrfVexBSYgVNwDA7AN+jAK3gEd+AlGMGIBFDgFvzouK3JV/lihQTOwLtOtw9wIRG5pJn91Tbgqk9kSk7GViADrTD4HCyZ0NQnomi51sb0fUyCMQEbp2WpU67IjfNjwcYyoUDhjJVcZBjYBy40j4wXgaobWoe8Z6Y80CJBwFpunepIzt2AUgFjtXXshNXjVmMh+K+zzp/CMs0CqeuzrxSRpbOKfdCkiMTS1VBQ41uxMyQR2qbrXiiwYN3ACh1FDmsdK2Eu4J6Tlo31dYVtCY88h5ELZIJJ+IRMzBHfyJINrigNkt5VsRiub9nXICdsYyVd2NcVvA3ScE5t2rb5JuEeyZnAhmLt9NK63vX1O5Pe8XaPSuGq1uTrfUgMEp9EJ+CQvr+BJ/AAKvAcCiAR+bf9CjAAluzmdX4AEIIAAAAASUVORK5CYII=");
    },
    setImageFromURL: function (urlImage, onLoaded) {
        this.src = urlImage;
        if (this.src !== null) {
            this.elemDom.setAttribute(LayoutInflater.ATTR_SRC, this.src);

            if (onLoaded)
                onLoaded();
            //            this.elemDom.onload = function ()
            //            {               
            //                    switch (scaleType)
            //                    {
            //                        case LayoutInflater.FIT_CENTER:
            //                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
            //                            {
            //                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            else
            //                            {
            //                                this.imgElem.setAttribute("width","auto");
            //                                this.imgElem.setAttribute("height","auto");                            
            //                            }
            //                            break;
            //                        case LayoutInflater.FIT_XY:
            //                            console.log("Ajustando a este tipo");
            //                            if(this.elemXml.getAttribute(LayoutInflater.ATTR_LAYOUT_WIDTH)===LayoutInflater.MATCH_PARENT)
            //                            {
            //                                this.imgElem.setAttribute("width",maxWidth-this.margin.left-this.margin.right-this.padding.left-this.padding.right);
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            else
            //                            {
            //                                this.imgElem.setAttribute("width","auto");
            //                                this.imgElem.setAttribute("height","auto");
            //                            }
            //                            break;
            //                    }
            //                    this.imgElem.style.top = this.padding.top+'px';
            //                    this.imgElem.style.left = this.padding.left+'px';
            //                    this.setWidth(this.padding.left+this.imgElem.clientWidth+this.padding.right);
            //                    this.setHeight(this.padding.top+this.imgElem.clientHeight+this.padding.bottom);
            //
            //                if(onLoaded !== undefined)
            //                    onLoaded();
            //            };
        }
        else {
            if (onLoaded)
                onLoaded();
        }
    },
    onPreProccessAttributes: function (onLoaded) {
        var this_ = this;
        var tempLoader = function () {
            this_.setImageFromURL(this_.src, onLoaded);
        };
        this._super(tempLoader);
    }
});