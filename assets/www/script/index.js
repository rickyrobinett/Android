/**
 * TODO: fix the way errors are displayed
 * 		 encapsulate the code? Something needs to be done to make it less messy. Maybe just move the handlers into their own functions, possible in seperate files
 */
var currEmail, currPass;
$(window).load(function(){
	Ordrin.initialize("shds1d6c4BGDGs8", "http://nn2.deasil.com"); // for now this will be deasil
	 console.log("load");
	$("body").append("<a href = '#login' id = 'removeMe' data-rel = 'dialog' data-transition = 'pop'></a>");
	$("#removeMe").click().remove();
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
				$("#createAccount").append("<a href = '#restaurant' data-rel = 'back' id = 'removeMe'></a>");
				$("#removeMe").click().remove();
				getAddresses();
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
	});
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
	});
});
function getAddresses(){
	Ordrin.u.getAddress("", function(data){
		if (data == "[]"){ // the user has no addresses so push the create address dialog
			console.log("data");
			$("body").append("<a href = '#createAddress' data-rel = 'dialog' id = 'removeMe' data-transition = 'slidedown'></a>");
			$("#removeMe").click().remove();
			$("#createAddress_btn").click(function(){
				var place = new Address($("#createAddressAddress").val(), $("#createAddressAddress2").val(), $("#createAddressCity").val(), $("#createAddressZip").val(), $("#createAddressState").val(), $("#createAddressPhone").val(), $("#createAddressName").val());
				Ordrin.u.updateAddress(place, function(data){
					console.log(data);
				})
			});
		}
		data = eval ("(" + data + ")");
	});
}
