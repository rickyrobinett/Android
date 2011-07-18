/**
 * TODO: fix the way errors are displayed
 */
var currEmail, currPass;
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
		$("#postAccount_btn").click(function(){
			currEmail = $("#createEmail").val();
			currPass  = $("#createPassword").val();
			$.mobile.pageLoading();
			Ordrin.u.makeAcct(currEmail, currPass, $("#createFirstName").val(), $("#createLastName").val(), function(data){
				data = eval ("(" + data + ")");
				$.mobile.pageLoading(true);
				if (data._error != undefined && data._error != 0){
					$.mobile.changePage($("#error"), "pop", false, true);
					$("#errorMsg").html(data.msg); // make this corresspond to the error from the server
					$("#errorClose_btn").click(function(){
						$("#error").dialog("close");
					});
				}else{
					$("#createAccount").append("<a href = '#restaurant' id = 'removeMe'></a>");
					$("#removeMe").click().remove();
					Ordrin.u.setCurrAcct(currEmail, currPass);
					getAddresses();
				}
			});
		})
	});
	$("#login").load(function(){
		console.log("login");
	})
});
function getAddresses(){
	Ordrin.u.getAddress("", function(data){
		data = eval ("(" + data + ")");
		if (data == "[]"){ // the user has no addresses so push the craete address dialog
			
		}
	});
}
