class Thread {
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