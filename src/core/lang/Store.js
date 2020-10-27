class Store {
    static get(keyName,defaultValue){
        if(!Store.containsKey(keyName))
            Store.set(keyName,defaultValue);
        Store.checkIfExists(keyName);
        let data = JSON.parse(sessionStorage.getItem(keyName));
        if(data.type)
            return data.value;
        return data;
    }

    static set(key,value){
        sessionStorage.setItem(key,JSON.stringify({
            type: typeof value,
            value
        }));
    }

    static checkIfExists(keyName){
        if(!Store.containsKey(keyName))
            throw new Exception(`No existe el atributo [${keyName}]`);
    }

    static containsKey(keyName){
        return (sessionStorage.getItem(keyName))?true:false;
    }
}