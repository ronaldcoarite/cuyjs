class HttpResponse {
    constructor(response) {
        this.response = response;
    }

    async getJson() {
        return await this.response.json()
    }

    async getRootElementXml() {
        let text = await this.response.text();
        return (new window.DOMParser()).parseFromString(text, "text/xml");
    }

    async getText() {
        return await this.response.text();
    }
}