$(window).load(function(){
	Ordrin.initialize("shds1d6c4BGDGs8", "http://nn2.deasil.com"); // for now this will be deasil
	 console.log("load");
	//$("body").append("<a href = '#login' id = 'removeMe' data-rel = 'dialog' data-transition = 'pop'></a>");
	//$("#removeMe").click().remove();
	 $("#login_btn").click(function(){
		var email = $("#loginEmail").val();
		var pass  = $("#loginPassword").val();
		$.mobile.pageLoading();
		Ordrin.u.setCurrAcct(email, pass);
		Ordrin.u.getAcct(function(data){
			data = eval ("(" + data + ")");
			if (data._error != undefined && data._error != 0){
				$.mobile.changePage($("#error"), "pop", false, true);
				$("#errorMsg").html(data.msg);
				$("#errorClose_btn").click(function(){
					$("#error").dialog("close");
				});
			}else{
				Ordrin.u.getAddress("", function(data){
					$.mobile.pageLoading(true); 
					console.log(data);
				});	
			}
				
		});
	});
	var time = new Date();
	time.setASAP();
	var place = new Address("1 Main Street", "", "Weston", "32501")
	Ordrin.r.deliveryList(time, place, function(data){
		var markup = "<li><b>${na}</b></li>";
		$.template("restListTemp", markup);
		data = JSON.parse(data);
		$.tmpl("restListTemp", data).appendTo("#restList");
		$("#restList").listview("refresh");
	})
	$("#createAccount_btn").click(function(){
		//$.mobile.changePage($("#createAccount"), "slidedown", false, true);
		$("#postAccount_btn").click(function(){
			Ordrin.u.makeAcct($("#createEmail").val(), $("#createPassword").val(), $("#createFirstName").val(), $("#createLastName").val(), function(data){
				data = eval ("(" + data + ")");
				if (data._error != undefined && data._error != 0){
					$.mobile.changePage($("#error"), "pop", false, true);
					$("#errorMsg").html(data.msg); // make this corresspond to the error from the server
					$("#errorClose_btn").click(function(){
						$("#error").dialog("close");
					});
				}else{
					$("#createAccount").dialog('close');
				}
			});
		})
	});
});