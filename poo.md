
# Mirando hacia la programación orientada a objetos
Cuyjs busca implementar las principales características de la POO con las complicacione polimorfismo que javascript trae para las funciones.

## Clases
Toda clase o definición hereda de **Class** de la siguiente forma.
```javascript
NewClassExample = Class.extend
({
   attribute:value,
   attributeN:valueN,
   init:function(/*params for constructor*/)
   {
       // Optional call parent costructor
       this._super(/*params for constructor*/);
   },
   methodExample:function(/*params*/)
   {
       // Optional call parent method
       this._super(/*params*/);
       console.log("Hello Wordl");
   }
});
```
Para realizar una instancia de la clase **NewClassExample** 
```javascript
var objInstanceExample = new NewClassExample(/*params for constructor*/);
objInstanceExample.methodExample(/*params*/); // The result is in console "Hello Word"
```

De la misma forma las clases LinearLayout, Button, ImageView, etc. vinen de una cadena de herencia para su implementación haciendo reutilizable y extendible cada componente.

## Herencia

Cuyjs soporta la herecia simple, haciendo que tanto los parámetros como los atributos de la clase padre pasen a ser utilizados por la clase hijo.

Para heredar de una clase se hace lo siguiente.

```javascript
NewClassExample2 = NewClassExample.extend
({
   attributeM:valueM,
   methodExample2:function(/*params*/)
   {
       // Example call method parent definition
       this.methodExample(/*params*/);
   }
});
```


## Sobrecarga de métodos 

Se pueden sobrecargar métodos cambiando o agregando funcionalidades a la misma. Vea el siguiente ejemplo
```javascript
Person = Class.extend
({
   first_name:null,
   last_name:null,
   age:0,
   getFullName:function(/*params*/)
   {
       return this.first_name+' '+this.last_name+' Age: '+this.age;
   },
   getDetail:function(/*params*/)
   {
       return 'Name: '+this.getFullName()+' Age: '+this.age;
   }
});

CivilServant = Person.extend
({
   position:null,
   getDetail:function(/*params*/)
   {
       return this._super()+' Position: '+this.position;
   }
});
```

Instanciando ambas clase daria lo siguiente

```javascript
var person = new Person();
person.first_name = "Jhon";
person.last_name = "Conor";
person.age = 24;

var personPosition = new CivilServant();
personPosition.first_name = "Jhon";
personPosition.last_name = "Conor";
personPosition.age = 24;
personPosition.position = "Systems engineer";

console.log("Person",person.getDetail);
// The output is: Name: Jhon Conor Age: 24
console.log("Person Position",personPosition.getDetail);
// The output is: Name: Jhon Conor Age: 24 Position: Systems engineer

Person = Class.extend
({
   first_name:null,
   last_name:null,
   age:0,
   getFullName:function(/*params*/)
   {
       return this.first_name+' '+this.last_name+' Age: '+this.age;
   },
   getDetail:function(/*params*/)
   {
       return 'Name: '+this.getFullName()+' Age: '+this.age;
   }
});

CivilServant = Person.extend
({
   position:null,
   getDetail:function(/*params*/)
   {
       return this._super()+' Position: '+this.position;
   }
});
```
