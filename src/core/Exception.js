class Exception extends Error{
    // message = null
    constructor(message){
        super(message);
        this.message = message;
    }

    toString(){
        return this.message;
    }
};