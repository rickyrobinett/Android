/**
 * TODO: fix the way errors are displayed
 * 		 encapsulate the code? Something needs to be done to make it less messy. Maybe just move the handlers into their own functions, possible in seperate files
 * 		 Save user account (use phonegap for local data storage)
 * 		 Save previous address (use phonegap for local data storage)
 * 		 Switch to opening dialogs with new functions
 */
var currEmail, currPass;
$(window).load(function(){
	Ordrin.initialize("shds1d6c4BGDGs8", "http://nn2.deasil.com"); // for now this will be deasil
	$("body").append("<a href = '#login' id = 'removeMe' data-rel = 'dialog' data-transition = 'pop'></a>");
	$("#removeMe").click().remove();
	
	 $("#login_btn").click(function(){
		var email = $("#loginEmail").val();
		var pass  = $("#loginPassword").val();
		$.mobile.pageLoading();
		Ordrin.u.setCurrAcct(email, pass);
		try{
			Ordrin.u.getAcct(function(data){
				data = JSON.parse(data);
				if (data._error != undefined && data._error != 0){
					error(data.msg);
				}else{
					$("#createAccount").append("<a href = '#restaurant' data-rel = 'back' id = 'removeMe'></a>");
					$("#removeMe").click().remove();
					getAddresses();
				}
					
			}, function(status){
				console.log("error");
				if (status == 401){
					error("Username and/or password are incorrect")
				}
			});
		}catch(e){
			console.log("Exception " + e);
		}
	});
	
	$("#postAccount_btn").click(function(){
		currEmail = $("#createEmail").val();
		currPass  = $("#createPassword").val();
		$.mobile.pageLoading();
		Ordrin.u.makeAcct(currEmail, currPass, $("#createFirstName").val(), $("#createLastName").val(), function(data){
			data = JSON.parse(data);
			$.mobile.pageLoading(true);
			if (data._error != undefined && data._error != 0){
				error(data.msg)
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
			openDialog("body", "createAddress", "slidedown");
			$("#createAddress_btn").click(function(){
				var place = new Address($("#createAddressAddress").val(), $("#createAddressAddress2").val(), $("#createAddressCity").val(), $("#createAddressZip").val(), $("#createAddressState").val(), $("#createAddressPhone").val(), $("#createAddressName").val());
				Ordrin.u.updateAddress(place, function(data){
					data = JSON.parse(data);
					if (data._error != undefined && data._error != 0){
						error(data.msg);
					}else{
						$("#createAddress").append("<a href = '#restaurant' id = 'removeMe'></a>");
						$("#removeMe").click().remove();
						getRestaurantList(place, "ASAP");
					}
				});
			});
			return;
		}
		data = JSON.parse(data);
		if (data.length == 1){ // the user only has one address so convert the object and send it straight to the resturant list
			var place = new Address(data[0].addr, data[0].addr2, data[0].city, data[0].zip, data[0].state, data[0].phone, data[0].nick);
			var time = new Date();
			time.setASAP();
			getRestaurantList(place, time);
		}else{ // the user has more than 1 address so open a dialog to let them choose which address to use and the get the restaurant list. Possibly save their choice?
			openDialog("body", "selectAddress", "slidedown");
			$("#selectAddress").bind("pageshow", {"data": data}, function(event){
				var markup = "<li class = 'addressSelector'><a href = '#restaurant' onclick = 'getRestaurantList(new Address(\"${addr}\", \"${addr2}\", \"${city}\", \"${zip}\", \"${state}\", \"${phone}\", \"${nick}\"), \"ASAP\")'>${nick}</a></li>";
				$.template("addrListTemp", markup);
				$("#addressList").empty();
				$.tmpl("addrListTemp", data).appendTo("#addressList");
				$("#addressList").listview("refresh");
			});
		}
	});
}
function openDialog(parent, name, transition){
	$(parent).append("<a href = '#" + name + "' data-rel = 'dialog' id = 'removeMe' data-transition = '" + transition + "'></a>");
	$("#removeMe").click().remove();
}

function getRestaurantList(place, time){
	if (time == "ASAP"){
		time = new Date();
		time.setASAP();
	}
	Ordrin.r.deliveryList(time, place, function(data) {
		data = JSON.parse(data);
		$("#restListTemplate").tmpl(data).appendTo("#restList");
		$("#restList").listview('refresh');
	})
}

function error(msg){
	$.mobile.pageLoading(true);
	$("body").append("<a href = '#error' data-rel = 'dialog' id = 'removeMe'></a>");
	$("#removeMe").click().remove();
	$("#errorMsg").html(msg);
}
