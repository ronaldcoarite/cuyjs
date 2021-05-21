class AlertDialog{
    static async showFatalMessage(context,txtContent,txtOk){
        const dialog = new Dialog(context);
        let container = new LinearLayout(context);
        container.setBackground('lib/imgs/bg_alert_fatal.9.png');
        container.setOrientation('vertical');

        let txtMsg = new TextView(context);
        await txtMsg.setText(txtContent);
        txtMsg.setSingleLine(true);
        txtMsg.setLayoutGravity('center_horizontal');
        await container.addView(txtMsg);
        
        let btnOk = new Button(context);
        await btnOk.setText(txtOk);
        btnOk.setSingleLine(true);
        btnOk.setLayoutGravity('center_horizontal');
        btnOk.margin.top = 10;
        btnOk.setOnClickListener((view)=>{
            dialog.cancel();
        });
        await container.addView(btnOk);

        dialog.setContentView(container);

        await dialog.show();
    }
}