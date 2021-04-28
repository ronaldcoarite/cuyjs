class Toast{
    static LENGTH_SHORT = 1000;
    static LENGTH_LONG = 5000;
 
    static makeText(context, message, length){
        (() => {
            (async () => {
                var dialog = new Dialog(context);
                dialog.showBackground(false);
                dialog.showBackgroundProgress(false);
                let txtMessage = new TextView(context);
                await txtMessage.setBackground("lib/imgs/bg_toast.9.png");
                txtMessage.setText(message);
                txtMessage.setSingleLine(true);
                txtMessage.setTextColor('#EC9D52');
                dialog.setContentView(txtMessage);
                setTimeout(function(){
                    dialog.cancel();
                },length);
                await dialog.show();
            })();
        })(); 
    }
}