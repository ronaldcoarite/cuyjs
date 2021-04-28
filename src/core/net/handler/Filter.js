class Filter{
    async onPreExecute(httpRequest){
        return true;
    }
    
    async onPostExecute(httpResponse){
        return true;
    }
}