class Toast{
    static LENGTH_SHORT = 1000;
    static LENGTH_LONG = 3400;
 
    static async makeText(context, message, length){
        let dialog = new Dialog(context);
        dialog.showBackground(false);
        dialog.showBackgroundProgress(false);
        let txtMessage = new TextView(context);
        txtMessage.setBackground("lib/imgs/bg_toast.9.png");
        txtMessage.setText(message);
        txtMessage.setSingleLine(true);
        txtMessage.setTextColor('#EC9D52');
        dialog.setContentView(txtMessage);

        dialog.show();
        await Thread.sleep(length);
        dialog.cancel();
    }
}