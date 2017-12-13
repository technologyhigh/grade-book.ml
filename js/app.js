$(document).ready(function(){
	// Check to see if page requires signin. If it does and the user isn't logged in
	// then redirect them to the login page.
	if( $("#securedPage").length ){
		if( sessionStorage.getItem("loggedIn") && entryExists(sessionStorage.getItem("loggedIn")) ){
			$("#uWM").text("Welcome " + getUser( sessionStorage.getItem("loggedIn") ).fName + "!");
			return;
		}
		$(location).attr('href','login.html');
	}

	var json = (function () {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': "courses.json",
	        'dataType': "json",
	        'success': function (data) {
	            json = data;
							console.log(data);
	        }
	    });
	    return json;
	})();
});

$(document).ready(function(){
    $("#registerUser").submit(function(event){
        event.preventDefault();
        storeUser();
    });

    $("#loginUser").submit(
    		function(event){
    			event.preventDefault();
    			var userFName = document.getElementById("fName").value;
    			var userACode = null;
    			var errorCounter = 0;

    			do{
    				switch(errorCounter){
    					case 0:
    						userACode = prompt("Hey " + userFName + "! Please enter your access code to login!", "");
    						break;
    					case 1:
    						userACode = prompt(userFName + ", please ensure you are entering the correct access code given to you when you signed up. Please try again!", "");
    						break;
    					case 2:
    						userACode = prompt(userFName + ", this is your final attempt! Please enter your access code to login!", "");
    						break;
    					default:
    						alert(userFName + ", you seem to have forgotten your access code. Please see your teacher for assistance logging into the system.");
    						return;
    				}

    				errorCounter++;
    			}while( !verifyUser(userACode, userFName) && errorCounter <= 3 );

    			$(location).attr('href','gradebook.html');
    		}
    	);

    $("#userLogout").click(
    	function(event){
    		event.preventDefault();
    		sessionStorage.removeItem("loggedIn");
    	}
    );
});

function storeUser(){
	var fname, lname, formClass, aCode;
	fname = document.getElementById("fName").value;
	lname = document.getElementById("lName").value;
	formClass = document.getElementById("formClass").value;
	aCode = document.getElementById("codeGen").value * 1000;
	while( entryExists(aCode) ){
		aCode = aCode+1;
	}
	localStorage.setItem(aCode, JSON.stringify({
		fName: fname,
		lName: lname,
		fClass: formClass,
		accessCode: aCode
	}) );
	alert("Your Access Code is: " + aCode + ". Please use it to login.");
	$(location).attr('href','login.html');
}

function entryExists(x){
	if (localStorage.getItem(x) == null) {
  		return false;
	}
	return true;
}

function verifyUser(accCode, userFirstName){
	if (localStorage.getItem(accCode) != null) {
		var userInfo = JSON.parse(
    		localStorage.getItem(accCode)
    	);
    	if( userInfo.fName == userFirstName ){
    		sessionStorage.setItem("loggedIn", accCode);
    		return true;
    	}
  		return false;
	}
	return false;
}

function getUser(accCode){
	if (localStorage.getItem(accCode) != null) {
		var userInfo = JSON.parse(
    		localStorage.getItem(accCode)
    	);
    	return userInfo;
	}
	return {
		fName: "John",
		lName: "Doe",
		fClass: "0A",
		accessCode: 0000
	};
}
