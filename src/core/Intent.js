class Intent{
    // context
    // pageName
    constructor(context, pageName){
        this.extras = {};
        this.context= context;
        this.pageName = pageName;
        this.query = {};
    }

    getQuery(){
        return this.query;
    }

    setQuery(query){
        this.query = query;
    }

    setExtras(extras){
        this.extras = extras;
    }

    putExtra(name, value) {
        this.extras[name] = value;
    }
    getExtra(name) {
        return this.extras[name];
    }

    getExtras(){
        return this.extras;
    }
}