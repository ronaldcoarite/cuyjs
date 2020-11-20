class RadioGroup extends LinearLayout{
    constructor(context) {
        super(context);
        this.groupName = Math.random().toString(36).slice(-5);
    }

    //@Override
    async parseViewChild(nodeXml) {
        let view = await super.parseViewChild(nodeXml);
        if(!(view instanceof RadioButton))
            throw new Exception(`El [${view.constructor.name}] no es valido para el [${this.constructor.name}]. Utilice únicamente [RadioBUtton]`);
        return view;
    }
}