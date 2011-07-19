/**
 * TODO: fix the way errors are displayed
 * 		 encapsulate the code? Something needs to be done to make it less messy. Maybe just move the handlers into their own functions, possible in seperate files
 * 		 Save user account (use phonegap for local data storage)
 * 		 Save previous address (use phonegap for local data storage)
 */
var currEmail, currPass, delList;
$(window).load(function(){
	Ordrin.initialize("shds1d6c4BGDGs8", "http://nn2.deasil.com"); // for now this will be deasil
	$("body").append("<a href = '#login' id = 'removeMe' data-rel = 'dialog' data-transition = 'pop'></a>");
	$("#removeMe").click().remove();
	
	 $("#login_btn").click(function(){
		var email = $("#loginEmail").val();
		var pass  = $("#loginPassword").val();
		$.mobile.pageLoading();
		Ordrin.u.setCurrAcct(email, pass);
		Ordrin.u.getAcct(function(data){
			data = JSON.parse(data);
			if (data._error != undefined && data._error != 0){
				$.mobile.changePage($("#error"), "pop", false, true);
				$("#errorMsg").html(data.msg);
			}else{
				$("#createAccount").append("<a href = '#restaurant' data-rel = 'back' id = 'removeMe'></a>");
				$("#removeMe").click().remove();
				getAddresses();
			}
				
		});
	});
	
	/*var time = new Date();
	time.setASAP();
	var place = new Address("1 Main Street", "", "Weston", "32501")
	Ordrin.r.deliveryList(time, place, function(data){
		var markup = "<li><b>${na}</b></li>";
		$.template("restListTemp", markup);
		data = JSON.parse(data);
		$.tmpl("restListTemp", data).appendTo("#restList");
		$("#restList").listview("refresh");
	});*/
	
	$("#postAccount_btn").click(function(){
		currEmail = $("#createEmail").val();
		currPass  = $("#createPassword").val();
		$.mobile.pageLoading();
		Ordrin.u.makeAcct(currEmail, currPass, $("#createFirstName").val(), $("#createLastName").val(), function(data){
			data = JSON.parse(data);
			$.mobile.pageLoading(true);
			if (data._error != undefined && data._error != 0){
				$.mobile.changePage($("#error"), "pop", false, true);
				$("#errorMsg").html(data.msg); // make this corresspond to the error from the server
			}else{
				$("#createAccount").append("<a href = '#restaurant' id = 'removeMe'></a>");
				$("#removeMe").click().remove();
				Ordrin.u.setCurrAcct(currEmail, currPass);
				getAddresses();
			}
		});
	});
	
	// set the button in the error dialog to always close it (we should be able to override this on an as needed basis)
	$("#errorClose_btn").click(function(){
		$("#error").dialog("close");
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
					data = JSON.parse(data);
					if (data._error != undefined && data._error != 0){
						$("body").append("<a href = '#error' data-rel = 'dialog' id = 'removeMe'></a>");
						$("#removeMe").click().remove();
						$("#errorMsg").html(data.msg);
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
			
		}
	});
}

function getRestaurantList(place, time){
	Ordrin.r.deliveryList(time, place, function(data) {
		data = JSON.parse(data);
		for(var i = 0; i< data.length; i++) {
			data[i].index = i;
		}
		delList = data;
		$("#restListTemplate").tmpl(data).appendTo("#restList");
		$("#restList").listview('refresh');
	})
}

function getRestDetails(index){
	$.mobile.pageLoading();
	var currRest = delList[index];
	Ordrin.r.details(currRest.id, function(data){
		data = JSON.parse(data);
		$("#restName").html(data.name);
		$("#rAddress").html(data.addr + " " + data.city + ", " + data.state + " " +data.postal_code);
		$("#minimumDelivery").html("$" + currRest.mino);
		$("#estimatedDelivery").html(currRest.del ? currRest.del : "0" + " minutes");
		$.mobile.changePage("#restDetails");
	});
}
