class Thread {
    constructor(runnableObject) {
        this.runnableObject = runnableObject;
        this.promise = null;
    }

    start(){
        var this_ = this;
        (async () => {
            this_.promise = this_.runnableObject.run();
            console.log("PROMOO",this_.promise);
        })();
    }

    interrupt(){
        if(this.promise)
            this.promise.reject("Hilo interrumpido");
    }

    /**
     * Instancia la vista y realizar el parseo a travez del la raiz del documento XML pasado como parametro
     * @param {*} context  EL contexto de la pagina
     * @param {*} firstElement El primer elemento de tipo XML para crear la vista
     */
    static async sleep(miliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, miliseconds);
        });
    }
}