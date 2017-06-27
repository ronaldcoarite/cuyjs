/* global LayoutInflater, Toast, Dialog, Page, PageManager, ADLayoutUtils, Class */

ADLayoutUtils.onLoadPage(function()
{
    PageManager.setMainPage("PruebaPage");
    PageManager.startAplication();
});
PruebaPage = Page.extend
({
    onCreate:function(intent)
    {
        this.setContentView("layout/test.xml");
    }
});