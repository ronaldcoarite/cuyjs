class EditText extends View{
    // ems: 20,
    // lines: 1,
    // maxEms: 80,
    // maxLines: 10,
    // hint: null,
    // maxLength: -1,
    // readonly: false,
    constructor (context) {
        super(context);
        this.margin.left = this.margin.top = this.margin.right = this.bottom = 4;
        this.ems = 20;
        this.lines = 3,
        this.maxEms = 80;
        this.maxLines = 10;
        this.hint = null;
        this.maxLength = -1;
        this.readonly = false;
        this.text = null;
        this.enabled = true;
    }
    // @Override
    parse(nodeXml) {
        super.parse(nodeXml);
        if (nodeXml.getAttribute("ems") !== null) {
            this.ems = parseInt(nodeXml.getAttribute("ems"));
        }
        if (nodeXml.getAttribute("lines") !== null) {
            this.lines = parseInt(nodeXml.getAttribute("lines"));
        }
        if (nodeXml.getAttribute("maxEms") !== null)
            this.maxEms = parseInt(nodeXml.getAttribute("maxEms"));
        if (nodeXml.getAttribute("maxLines") !== null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        if (nodeXml.getAttribute("maxLines") !== null)
            this.maxLines = parseInt(nodeXml.getAttribute("maxLines"));
        this.hint = nodeXml.getAttribute("hint");
        if (nodeXml.getAttribute("maxlength") !== null)
            this.maxLength = parseInt(nodeXml.getAttribute("maxlength"));
        if (nodeXml.getAttribute("text") !== null)
            this.text = nodeXml.getAttribute("text");
        if (nodeXml.getAttribute("singleLine") === "true")
            this.lines = 1;
        if (nodeXml.getAttribute("enabled") === "false")
            this.enabled = false;
    }
    // @Override
    getTypeElement(){
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

    // @Override
    async loadResources() {
        await super.loadResources();
        //cols="5" rows="1"
        this.elemDom.cols = this.ems;
        this.elemDom.rows = this.lines;
        // this.elemDom.style.height = (this.elemDom.rows * 22) + 'px';
        if(this.lines === 1){
            this.elemDom.style.whiteSpace = "nowrap";
            this.elemDom.style.overflowX = "hidden";
        }
        this.elemDom.onkeydown = (e)=>{
            if (this.lines===1&& e.keyCode == 13 && !e.shiftKey){
                e.preventDefault();
                return false;
            }
            else
                return true;
        };
        if (this.hint !== null)
            this.elemDom.placeholder = this.hint;
        if (this.maxLength > 0)
            this.elemDom.setAttribute("maxlength", this.maxLength);
        this.elemDom.style.resize = 'none';
        this.elemDom.value = this.text;
        this.elemDom.disabled = !this.enabled;
        this.elemDom.style.paddingTop = '6px';
        this.elemDom.style.paddingLeft = '6px';
        this.elemDom.style.paddingBottom = '6px';
        this.elemDom.style.paddingRight = '6px';
    }
}