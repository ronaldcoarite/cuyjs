class EditText extends DomView{
    // ems: 20,
    // lines: 1,
    // maxEms: 80,
    // maxLines: 10,
    // hint: null,
    // maxLength: -1,
    // readonly: false,
    constructor (context) {
        this._super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.name = "EditText";

        //cols="5" rows="1"
        this.elemDom.cols = this.ems;
        this.elemDom.rows = this.lines;
        if (this.hint !== null)
            this.elemDom.placeholder = this.hint;
        if (this.maxLength > 0)
            this.elemDom.setAttribute("maxlength", this.maxLength);
        this.elemDom.style.resize = 'none';
        if (this.lines === 1)
            this.elemDom.style.height = '22px';
    }
    // @Override
    parse(nodeXml) {
        this._super(nodeXml);
        if (nodeXml.getAttribute("ems") !== null) {
            this.ems = parseInt(nodeXml.getAttribute("ems"));
            this.elemDom.cols = this.ems;
        }
        if (nodeXml.getAttribute("lines") !== null) {
            this.lines = parseInt(nodeXml.getAttribute("lines"));
            this.elemDom.rows = this.lines;
            this.elemDom.style.height = (this.elemDom.rows * 22) + 'px';
        }
        if (nodeXml.getAttribute("maxEms") !== null)
            this.maxEms = parseInt(nodeXml.getAttribute("maxEms"));
        if (nodeXml.getAttribute("maxLines") !== null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        if (nodeXml.getAttribute("maxLines") !== null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        this.hint = nodeXml.getAttribute("hint");
        if (this.hint !== null)
            this.elemDom.placeholder = this.hint;
        if (nodeXml.getAttribute("maxlength") !== null)
            this.maxLength = parseInt(nodeXml.getAttribute("maxlength"));
        if (nodeXml.getAttribute("text") !== null)
            this.elemDom.value = nodeXml.getAttribute("text");
        if (nodeXml.getAttribute("singleLine") === "true")
            this.elemDom.rows = 1;
        if (nodeXml.getAttribute("enabled") === "false")
            this.elemDom.disabled = true;
    }
    // @Override
    getDomType() {
        return 'TextArea';
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
}