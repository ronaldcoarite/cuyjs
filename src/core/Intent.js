class Intent{
    // context
    // pageName
    constructor(context, pageName){
        this.extras = {};
        this.context= context;
        this.pageName = pageName;
    }

    putExtra(name, value) {
        this.extras[name] = value;
    }
    getExtra(name) {
        return this.extras[name];
    };
}