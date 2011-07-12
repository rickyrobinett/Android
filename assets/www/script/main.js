Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
    	var form, userCreds;
    	Ordrin.initialize("shds1d6c4BGDGs8", "http://nn2.deasil.com");
    	
    	 var formBase = {
            scroll: 'vertical',
            url   : '',
            standardSubmit : false,
            items: [{
                    xtype: 'fieldset',
                    title: 'Login',
                    instructions: 'Please login using your Ordrin account.',
                    defaults: {
                        required: false,
                        labelAlign: 'left',
                        labelWidth: '40%'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        name : 'email',
                        label: 'Email',
                        useClearIcon: false,
                        autoCapitalize : false
                    }, {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: 'Password',
                        useClearIcon: false
                    },
                    {
                            text: 'Go',
                            xtype: 'button',
                            ui: 'confirm',
                            handler: function() {
                            	userCreds = form.getValues();
                            	Ordrin.u.setCurrAcct(userCreds.email, userCreds.password);	
                            	Ordrin.u.getAcct(function(){
                            		console.log("got account")
                            	}); 
                            	console.log("send request");
                            }
                        }]
             }],
             listeners: {
             	submit: function(form, result){
             		console.log("success", form);
             	}
             }
        }
        formBase.fullscreen = true;
        form = new Ext.form.FormPanel(formBase);
        form.show();
    },
    gotAccount: function(){
    	console.log("got account");
    }
});