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
        this.ems = Resource.getAttrOfTheme(this.constructor.name, 'ems',20);
        this.lines = Resource.getAttrOfTheme(this.constructor.name, 'lines',3);
        this.hint = null;
        this.maxLength = -1;
        this.text = Resource.getAttrOfTheme(this.constructor.name, 'text');
        this.enabled = true;
        this.textSize = Resource.getAttrOfTheme(this.constructor.name, 'textSize','13px');
        this.textChangeListener = null;
        this.singleLine = Resource.getAttrOfTheme(this.constructor.name, 'singleLine',false);
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.ems = this.getAttrFromNodeXml(nodeXml,"ems")?parseInt(this.getAttrFromNodeXml(nodeXml,"ems")): this.ems;
        this.lines = this.getAttrFromNodeXml(nodeXml,"lines")?parseInt(this.getAttrFromNodeXml(nodeXml,"lines")): this.lines;
        this.hint = this.getAttrFromNodeXml(nodeXml,"hint") || this.hint;
        this.maxlength = this.getAttrFromNodeXml(nodeXml,"maxlength")?parseInt(this.getAttrFromNodeXml(nodeXml,"maxlength")): this.maxlength;
        this.text = this.getAttrFromNodeXml(nodeXml,"text") || this.text;
        this.singleLine = this.getAttrFromNodeXml(nodeXml,"singleLine")? (this.getAttrFromNodeXml(nodeXml,"singleLine")==="true") : this.singleLine;
        if(this.singleLine === true)
            this.lines = 1;
        this.enabled = this.getAttrFromNodeXml(nodeXml,"enabled")?(this.getAttrFromNodeXml(nodeXml,"enabled")==="true") : this.enabled;
        this.textSize = this.getAttrFromNodeXml(nodeXml,"textSize")||this.textSize;
    }

    // @Override
    getTypeElement(){
        return 'TextArea';
    }

    async setLines(lines){
        this.lines = lines;
    }
    
    getText() {
        return this.elemDom.value;
    }
    async setText(txt) {
        this.text = txt;
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

    setSingleLine(sw){
        this.singleLine = sw;
        if(sw)
            this.lines = 1;
    }

    getWidth() {
        return super.getWidth()+6*2;
    }

    //@Override
    getHeight() {
        return super.getHeight()+6*2;
    }

    async setEms(ems){
        this.ems = ems;
    }

    setTextChangeListener(textChangeListener){
        this.textChangeListener = textChangeListener;
        this.elemDom.addEventListener('input', (e) => {
            this.textChangeListener.onChange(this.getText());
        });
    }
}