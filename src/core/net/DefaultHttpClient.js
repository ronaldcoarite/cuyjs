class DefaultHttpClient {
    constructor() {
    }

    async execute(httpRequest){
        return await httpRequest.send();
    }
}