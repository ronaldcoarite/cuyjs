/* global Dialog, LayoutInflater, Class */

Toast={
    LENGTH_SHORT:1000,
    LENGTH_LONG:3400,
    makeText:function(context,message,length){
        return new DialogToast(context,message,length);
    }
};
DialogToast = Dialog.extend({
    txtMessage:null,
    length:null,
    init:function(context,message,length){
        this._super(context);
        if(length === undefined)
            this.length = Toast.LENGTH_SHORT;
        else
            this.length = length;
        this.showBackground(false);
        this.showBackgroundProgress(false);
        this.txtMessage = new TextView(this);
        this.txtMessage.setSingleLine(true);
        this.txtMessage.setText(message);
    },
    onCreate:function(){
        var fraCont = new FrameLayout(this);
        fraCont.addView(this.txtMessage);
        fraCont.setBackground("res/drawable/util/bg_toast.9.png");
        this.setContentView(fraCont);
    },
    show:function(){
        this._super();
        var this_ = this;
        function cancel()
        {
            this_.cancel();
        }
        setTimeout(cancel,this.length);
    }
});
AlertDialog = Dialog.extend({
    init:function(context,urlIcon,title,view,btnPositive,btnNegative,message){
        this._super(context);
        var relContenedor = new LinearLayout(this);
        relContenedor.setMinWidth(200);
        relContenedor.setMinHeight(170);
        relContenedor.setBackground("res/drawable/general/bg_dialog.9.png");
        //relContenedor.setBackground("#AAFFCC");
        relContenedor.setOrientation(LayoutInflater.VERTICAL);
        var txtTitle = null;
        var imgIcon = null;
        if(title!==null)
        {
            txtTitle = new TextView(this);
            txtTitle.setText(title);
            txtTitle.setSingleLine(true);
            txtTitle.setId("txtTitle");
            relContenedor.addView(txtTitle);
        }
        var linElem = new LinearLayout(this);
        linElem.setOrientation(LayoutInflater.VERTICAL);
        if(urlIcon!==null)
        {
            imgIcon = new ImageView(this);
            imgIcon.setImageFromURL(urlIcon);
            linElem.addView(imgIcon);
        }
        if(view===null)
        {
            view = new TextView(this);
            if(message!==null)
                txtTitle.setText(message);
        }
        linElem.addView(view);
        relContenedor.addView(linElem);
        // Para los botones
        var linContr = new LinearLayout(this);
        //linContr.setLayoutGravity(LayoutInflater.RIGHT);
        if(btnPositive !== null)
        {
            var btnSi = new Button(this);
            btnSi.setText(btnPositive.txt);
            btnSi.setOnClickListener(btnPositive.click);
            linContr.addView(btnSi);
        }
        if(btnNegative !== null)
        {
            var btnNo = new Button(this);
            btnNo.setText(btnNegative.txt);
            btnNo.setOnClickListener(btnNegative.click);
            linContr.addView(btnNo);
        }
        relContenedor.addView(linContr);
        this.setContentView(relContenedor);
    }
});
BuilderDialog =  Class.extend({
    urlIcon : null,
    title : null,
    view : null,
    si : null,
    no : null,
    context:null,
    message:null,
    init:function(context){
        this.urlIcon=null;
        this.title=null;
        this.view=null;
        this.si=null;
        this.no=null;
        this.context=context;
        this.message = null;
    },
    create:function(){
        return new AlertDialog(this.context,this.urlIcon,this.title,this.view,this.si,this.no,this.message);
    },
    show:function(){
        var dialog = this.create();
        dialog.show();
        return dialog;
    },
    setIcon:function(urlIcon){
        this.urlIcon = urlIcon;
    },
    setTitle:function(title){
        this.title = title;
    },
    setMessage:function(msg){
        this.message = msg;
    },
    setView:function(view){
        this.view = view;
    },
    setPositiveButton : function(text,onClick){
        this.si = {txt:text,click:onClick};
    },
    setNegativeButton : function(text,onClick){
        this.no = {txt:text,click:onClick};
    }
});
//window.onbeforeunload = function()
//{
//    return "Para su seguridad cierre session?";
//};