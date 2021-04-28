class AjaxFilters{
    static filters = new Array();

    static addFilter(patternUrl,filter){
        AjaxFilters.filters.push({
            patternUrl,
            filter
        });
    }

    static async verifUrl(httpRequest){
        // '/services/**', '/services/puerto/java'
        let itemFilter = AjaxFilters.filters.find(filterItem=>{
            return httpRequest.url.includes(filterItem.patternUrl);
        });
        if(itemFilter){
            await itemFilter.filter.onPreExecute(httpRequest);
            return itemFilter.filter;
        }
        return null;
    }
}