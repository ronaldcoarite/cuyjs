class RadioButton extends View{
    constructor (context) {
        super(context);
        this.text = null;
        this.onClick = null;
        this.radioGroup = null;
    }

    // @Override
    async parse(nodeXml) {
        await super.parse(nodeXml);
        this.text = this.getAttrFromNodeXml(nodeXml,"text");
        this.onClick = this.getAttrFromNodeXml(nodeXml,"onClick");
        this.radioGroup = this.getAttrFromNodeXml(nodeXml,"radioGroup");
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

    // @Override
    async loadResources() {
        await super.loadResources();
        this.elemDom.type = 'radio';
        this.elemDom.value = this.text;
        this.elemDom.name = this.radioGroup;

        // this.elemDom.style.height='50px';
        // this.elemDom.style.width='50px';
    }

    getWidth() {
        return super.getWidth();
    }

    getHeight() {
        return super.getHeight();
    }

    isChecked(){
        return this.elemDom.checked;
    }

    setChecked(checket){
        return this.elemDom.checked = checket===true;
    }
}