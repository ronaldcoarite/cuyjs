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
        this.textSize = '13px';
        this.textChangeListener = null;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        if (this.getAttrFromNodeXml(nodeXml,"ems") !== null) {
            this.ems = parseInt(this.getAttrFromNodeXml(nodeXml,"ems"));
        }
        if (this.getAttrFromNodeXml(nodeXml,"lines") !== null) {
            this.lines = parseInt(this.getAttrFromNodeXml(nodeXml,"lines"));
        }
        if (this.getAttrFromNodeXml(nodeXml,"maxEms") !== null)
            this.maxEms = parseInt(this.getAttrFromNodeXml(nodeXml,"maxEms"));
        if (this.getAttrFromNodeXml(nodeXml,"maxLines") !== null)
            this.maxLines = parseInt(this.getAttrFromNodeXml(nodeXml,"maxLines"));
        this.hint = this.getAttrFromNodeXml(nodeXml,"hint");
        if (this.getAttrFromNodeXml(nodeXml,"maxlength") !== null)
            this.maxLength = parseInt(this.getAttrFromNodeXml(nodeXml,"maxlength"));
        if (this.getAttrFromNodeXml(nodeXml,"text") !== null)
            this.text = this.getAttrFromNodeXml(nodeXml,"text");
        if (this.getAttrFromNodeXml(nodeXml,"singleLine") === "true")
            this.lines = 1;
        if (this.getAttrFromNodeXml(nodeXml,"enabled") === "false")
            this.enabled = false;
        this.textSize = this.getAttrFromNodeXml(nodeXml,"textSize")||this.textSize;
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
        this.elemDom.style.fontSize = this.textSize;
    }

    getWidth() {
        return super.getWidth()+6*2;
    }

    //@Override
    getHeight() {
        return super.getHeight()+6*2;
    }

    setTextChangeListener(textChangeListener){
        this.textChangeListener = textChangeListener;
        this.elemDom.addEventListener('input', (e) => {
            this.textChangeListener.onChange(this.getText());
        });
    }
}