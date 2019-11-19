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
        console.log("Esableciendo contenido..");
        this.setContentView("layout/test.xml");
        console.log("Contenido establesido..");
    }

    // @Override
    onStart(){
        console.log("Pagina cargada correctamente");
    }
}