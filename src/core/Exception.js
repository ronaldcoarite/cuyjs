class Exception extends Error{
    // message = null
    constructor(message){
        this.message = message;
    }

    toString(){
        return this.message;
    }
};