class Context{
    async onResize(){}

    static LAYOUT_COMPACT="Compact";
    static LAYOUT_MEDIUM="Medium";
    static LAYOUT_EXPANDED="Expanded";
    static LAYOUT_BIG="Big";

    getLayoutByScreenDimension(pathLayout,layoutSuported){
        // layoutSuported = [Context.LAYOUT_COMPACT,Context.LAYOUT_EXPANDED]
        // pathLayout = pages/home/HomeLayoutBig.xml
        let layoutName = null;
        if(pathLayout.includes(Context.LAYOUT_COMPACT))
            layoutName = pathLayout.substring(0, pathLayout.length - Context.LAYOUT_COMPACT.length- '.xml'.length);
        else if(pathLayout.includes(Context.LAYOUT_MEDIUM))
            layoutName = pathLayout.substring(0, pathLayout.length - Context.LAYOUT_MEDIUM.length- '.xml'.length);
        else if(pathLayout.includes(Context.LAYOUT_EXPANDED))
            layoutName = pathLayout.substring(0, pathLayout.length - Context.LAYOUT_EXPANDED.length- '.xml'.length);
        else if(pathLayout.includes(Context.LAYOUT_BIG))
            layoutName = pathLayout.substring(0, pathLayout.length - Context.LAYOUT_BIG.length- '.xml'.length);
        else
            return pathLayout;
        let screenSize = this.getScreenSize();
        let width = screenSize.width;
        if(this.getScreenOrientation() === 'VERTICAL')
            width = screenSize.height;
        if(Array.isArray(layoutSuported)){
            if(width <30 && layoutSuported.find(Context.LAYOUT_COMPACT)){ // COMPACTO (CELULARES)
                return `${layoutName}${Context.LAYOUT_COMPACT}.xml`;
            }else if(width < 40 && layoutSuported.find(Context.LAYOUT_MEDIUM)){ // MEDIANO (TABLETS)
                return `${layoutName}${Context.LAYOUT_MEDIUM}.xml`;
            }else if(width < 60 && layoutSuported.find(Context.LAYOUT_EXPANDED)){ // EXPANDEND (LAPTOPS O PC)
                return `${layoutName}${Context.LAYOUT_EXPANDED}.xml`;
            }else{ // BIG (TELEVISORES O MONITORES GRANDES)
                return `${layoutName}${Context.LAYOUT_BIG}.xml`;
            }
        }else{
            if(width < 30){ // COMPACTO (CELULARES)
                return `${layoutName}${Context.LAYOUT_COMPACT}.xml`;
            }else if(width < 40){ // MEDIANO (TABLETS)
                return `${layoutName}${Context.LAYOUT_MEDIUM}.xml`;
            }else if(width < 60){ // EXPANDEND (LAPTOPS O PC)
                return `${layoutName}${Context.LAYOUT_EXPANDED}.xml`;
            }else{ // BIG (TELEVISORES O MONITORES GRANDES)
                return `${layoutName}${Context.LAYOUT_BIG}.xml`;
            }
        }
    }

    getScreenSize(){
        let dpival = this.getPPI();
        return {
            width: ((window.screen.width * window.devicePixelRatio)/dpival)*2.54,
            height: ((window.screen.height * window.devicePixelRatio)/dpival)*2.54
        };
    }
    
    getScreenOrientation(){
        if(screen.orientation.type && screen.orientation.type.includes('landscape'))
            return 'HORIZONTAL';
        return 'VERTICAL';
    }
    
    getPPI() {
        // <div id='testdiv' style='height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;'></div>
        let div = document.createElement("div");
        div.style.width = '1in';
        div.style.height = '1in';
        div.style.left = '-100%';
        div.style.top = '-100%';
        div.style.position = 'absolute';
        div.style.margin = 0;
        div.style.border = 'none';
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(div);
        let devicePixelRatio = window.devicePixelRatio || 1;
        let ppi = Math.round(div.offsetWidth * devicePixelRatio);
        body.removeChild(div);
        return ppi;
    }

    setOnClickListenerTo(idView,onClickListener){
        if(idView instanceof View)
            idView.setOnClickListener(onClickListener, this);
        else{
            let view = this.viewRoot.findViewById(idView);
            view.setOnClickListener(onClickListener, this);
        }
    }
};