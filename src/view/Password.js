class Password extends View{
    // ems: 20,
    // lines: 1,
    // maxEms: 80,
    // maxLines: 10,
    // hint: null,
    // maxLength: -1,
    // readonly: false,
    constructor (context) {
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 0;
        this.ems = 20;
        this.text = null;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if (this.getAttrFromNodeXml(nodeXml,"ems") !== null) {
            this.ems = parseInt(this.getAttrFromNodeXml(nodeXml,"ems"));
        }
        if (this.getAttrFromNodeXml(nodeXml,"text") !== null)
            this.text = this.getAttrFromNodeXml(nodeXml,"text");
    }

    // @Override
    getTypeElement(){
        return 'input';
    }
    getText() {
        return this.elemDom.value;
    }
    setText(txt) {
        this.elemDom.value = txt;
    }
    setEnabled(sw) {
        this.elemDom.disabled = !sw;
    }
    setError(msg) {
        this._super(msg);
        this.elemDom.focus();
    }

    // @Override
    async loadResources() {
        await super.loadResources();
        this.elemDom.type = 'password';
        this.elemDom.value = this.text;
        this.elemDom.style.paddingTop = '6px';
        this.elemDom.style.paddingLeft = '6px';
        this.elemDom.style.paddingBottom = '6px';
        this.elemDom.style.paddingRight = '6px';
    }

    getWidth() {
        return super.getWidth()+6*2;
    }

    getHeight() {
        return super.getHeight()+6*2;
    }
}