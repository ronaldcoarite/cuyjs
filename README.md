# Cuyjs un framework orientados bajo nomenclatura Android

# ¿Que es cuyjs?

Cuyjs es un framework javascript para la capa de la vista en el lado del cliente.

Cuyjs plantena para los fanaticos de Android y la programación orientada a objectos POO. Tener un conjunto de herramientas que permitan desde realizar clases, ojectos, herencia, sobrecarga de métodos, layouts en archivos xml hasta controladores llamados "Page" para trabajar de forma facil con un modelo vista controlador.

Al ser un framework basado a la programacion POO, cuyjs es extendible en cualquier punto de desarrollo. Desde crear nuevo componentes, extenderlos, etc.

Vea un ejemplo simple de como publicar una aplicación.

```javascript
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
    },
    onClick:function()
    {
        Toast.makeText(this,"Este es un mensaje",Toast.LENGTH_LONG).show();
    }
});
```
A continuación el layout correspondiente para la vista
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LinearLayout
    xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
    xsi:noNamespaceSchemaLocation='src/layout-xml.xsd'
    layout_width="700px"
    layout_height="wrap_content"
    background="res/drawable/general/bg_dialog.9.png"
    padding="10px"
    orientation="vertical"
    id="linPrueba">
    <Button
        text="Agregar Vehiculo"
        singleLine="true"/>
</LinearLayout>
```

# ¿Que se puede realizar con cuyjs?

Cuyjs no tiene límites, se puede realizar desde pequeñas aplicaciones hasta tener sistemas de informacón con una interfaz moderna e interativa con soporte para patanllas tactives, pantallas responsivas utilizando los layouts de acuerdo a los requerimientos con multiples opciones.

En resumen cuyjs soporta lo siguiente:

- Programación orientada a objecto.
- Diseño de interfaces basados en xml con componentes Android
- Soporte de NinePath9 para fondos de componentes con contenido dinámico
- Posee todos los componentes nativos de Android desde instancia por codigo hasta los tag's en el xml.
- Paso de parametros entre diferentes "Pages"
- Creación de nuevos componentes
- Manejo de ajax mediante la interfax definida de HttpClient.
