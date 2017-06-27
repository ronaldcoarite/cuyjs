/* global Page, Toast */

HomePage = Page.extend
({
    socketClient:null,
    REQUEST_FOTO:12,
    onCreate:function(intent)
    {
        this.setContentView("res/layout/test.xml");
        this.socketClient = new SocketClient();
    },
    addDevice:function(objInstanceDevice)
    {
//        {
//            instance: 'WIFI_SWITCH1',
//            name: 'Es una prueba',
//            device_code: 'WIFI_SWITCH',
//            device_name: 'Interruptor inalá
//            device_class: 'com.domolin.domo
//            config_params:
//            { ipAddress: '192.168.1.4',
//               mac: '5C:CF:7F:16:7D:51',
//               name: 'Domo-Home Switch' 
//            }
//        }
        var viewDeivices = this.findViewById("linDevices");
        var viewDevice = null;
        switch(objInstanceDevice.device_code)
        {
            case "WIFI_SWITCH":
                viewDevice = new WidgetWifiSwitch(this,objInstanceDevice);
                viewDevice.createView(viewDeivices);
                break;
        }
    },
    // Se inicia cuando se termino de cargar todos los componentes
    onStart:function(intent)
    {
        var servidor = "123456";
        var this_ = this;
//        this.socketClient.connect(servidor,function()
//        {
//            console.log("Conectado");
//            // Obtenemos la lista de dispositivos
//            this_.socketClient.callMethod(
//                "DEVICES",
//                "getDeviceInstanceInfo",
//                function (result, error)
//                {
//                    console.log("Resuesta lista dispositivos", result,error);
//                    if(result)
//                    {
//                        this_.dispositivos = result;
//                        console.log("Numero de dispositivos",this_.dispositivos.length);
////                        vm.cambiarEstado("INICIADO");
//                        for(var index in this_.dispositivos)
//                            this_.addDevice(this_.dispositivos[index]);
//                    }
//                    else
//                    {
//                        Toast.makeText(this_,"Servidor no disponible",Toast.LENGTH_LONG).show();
//                    }
//                });
//        });
    },
    mostrarDispositivos:function()
    {
        
    },
    onClickBuscarDispositivos:function()
    {
//        document.body.requestFullscreen();
        var diagCodigo = new DialogDispositivos(this,this.socketClient);
        diagCodigo.show();
    },
    onClickVerProgramas:function()
    {
        var intent = new Intent(this,"SystemsPage");
        intent.putExtra("homePage",this);
        this.startPage(intent);
    },
    onClickCambiar:function()
    {
        var txtText = this.findViewById("txtTexto");
        var editEntrada = this.findViewById("editEntrada");
        txtText.setText(editEntrada.getText());
    }
});