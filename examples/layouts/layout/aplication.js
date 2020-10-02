/* global LayoutInflater, Toast, Dialog, Page, PageManager, ADLayoutUtils, Class */
Resource.waitToLoadAllResources().then(()=>{
    // console.lgg(PageManager);
    try {
        PageManager.startAplicationSync('MainPage');
    } catch (error) {
        console.log(error);
    }
});

class MainPage extends Page{
    // @Override
    onCreate(intent){
        this.setContentView("test.xml");
    }

    // @Override
    onStart(){
        
    }
}